import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import ganache from 'ganache';
import { createPublicClient, createWalletClient, custom, zeroAddress, encodeAbiParameters, parseAbiParameters, concat, pad } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { compile } from '../../scripts/compile.mjs';

let compiled;
before(() => { compiled = compile(); });
const providers = [];
after(async () => { for (const provider of providers) await provider.disconnect(); });
function artifact(name) {
  for (const items of Object.values(compiled)) if (items[name]) return items[name];
  throw new Error(name);
}
async function fixture({ beneficiaries, guardians, rules = {} } = {}) {
  const provider = ganache.provider({ logging: { quiet: true }, wallet: { totalAccounts: 7 }, chain: { chainId: 31337, hardfork: 'shanghai' }, miner: { timestampIncrement: 0 } });
  providers.push(provider);
  const accounts = Object.values(provider.getInitialAccounts()).map(a => privateKeyToAccount(a.secretKey));
  const client = createPublicClient({ transport: custom(provider), cacheTime: 0, pollingInterval: 5 });
  const wallets = accounts.map(account => createWalletClient({ account, transport: custom(provider) }));
  async function deploy(name, args = [], wallet = wallets[0]) {
    const a = artifact(name);
    const hash = await wallet.deployContract({ abi: a.abi, bytecode: `0x${a.evm.bytecode.object}`, args, gas: 14_000_000n, chain: null });
    const receipt = await client.waitForTransactionReceipt({ hash });
    assert.equal(receipt.status, 'success', `${name} deployment`);
    return receipt.contractAddress;
  }
  async function write(address, name, args = [], who = 0, abi = artifact('SilentSovereignVault').abi, value = 0n) {
    const hash = await wallets[who].writeContract({ address, abi, functionName: name, args, value, gas: 10_000_000n, chain: null });
    const receipt = await client.waitForTransactionReceipt({ hash });
    if (receipt.status !== 'success') throw new Error(`Reverted ${name}`);
    return receipt;
  }
  const config = { heartbeatInterval: 60n, challengePeriod: 60n, releaseInterval: 60n, emergencyDelay: 120n, initialBps: 1000, trancheBps: 1000, guardianThreshold: 1, ...rules };
  const b = beneficiaries ?? [{ account: accounts[1].address, allocationBps: 6000 }, { account: accounts[2].address, allocationBps: 4000 }];
  const g = guardians ?? [accounts[3].address];
  const vault = await deploy('SilentSovereignVault', [accounts[0].address, b, g, config]);
  const read = (name, args = [], address = vault, abi = artifact('SilentSovereignVault').abi) => client.readContract({ address, abi, functionName: name, args });
  const tx = (name, args = [], who = 0, value = 0n) => write(vault, name, args, who, undefined, value);
  async function at(timestamp) { await provider.request({ method: 'evm_setTime', params: [Number(timestamp) * 1000] }); await provider.request({ method: 'evm_mine', params: [] }); }
  async function pending() { await at((await read('deadline')) + 1n); await tx('requestRecovery', [], 6); }
  async function authorize() { await pending(); await tx('approveRecovery', [await read('recoveryNonce'), false], 3); await at((await read('pendingAt')) + config.challengePeriod); await tx('finalizeRecovery', [], 6); }
  return { accounts, wallets, client, deploy, write, read, tx, at, pending, authorize, vault, config, b, g, provider };
}

test('factory creates isolated owner vaults without administrator privileges', async () => {
  const f = await fixture();
  const factory = await f.deploy('SilentSovereignFactory');
  await f.write(factory, 'createVault', [f.b, f.g, f.config], 0, artifact('SilentSovereignFactory').abi);
  const vaults = await f.read('getVaults', [f.accounts[0].address], factory, artifact('SilentSovereignFactory').abi);
  assert.equal(vaults.length, 1);
  assert.equal((await f.read('owner', [], vaults[0])).toLowerCase(), f.accounts[0].address.toLowerCase());
  assert.equal(await f.read('isVault', [vaults[0]], factory, artifact('SilentSovereignFactory').abi), true);
});
test('owner controls configuration, heartbeat, pause and withdrawals', async () => {
  const f = await fixture();
  for (const [name, args] of [['heartbeat', []], ['configure', [f.b, f.g, f.config]], ['setRecoveryPaused', [true]], ['withdraw', [zeroAddress, 1n]]]) await assert.rejects(f.tx(name, args, 2));
  await f.tx('configure', [f.b.slice().reverse(), f.g, f.config]);
});
test('rejects bad allocations, zero/duplicate beneficiaries and bad guardian quorums', async () => {
  const f = await fixture();
  const configs = [
    [[], f.g, f.config],
    [[{ account: f.accounts[1].address, allocationBps: 9999 }], f.g, f.config],
    [[{ account: zeroAddress, allocationBps: 10000 }], f.g, f.config],
    [[{ account: f.accounts[1].address, allocationBps: 5000 }, { account: f.accounts[1].address, allocationBps: 5000 }], f.g, f.config],
    [f.b, [...f.g, ...f.g], f.config],
    [f.b, [f.accounts[0].address], f.config],
    [f.b, f.g, { ...f.config, guardianThreshold: 2 }],
    [f.b, f.g, { ...f.config, guardianThreshold: 0 }],
    [f.b, f.g, { ...f.config, heartbeatInterval: 59n }],
    [f.b, f.g, { ...f.config, trancheBps: 0 }],
  ];
  for (const config of configs) await assert.rejects(f.tx('configure', config));
});
test('optional guardians disable recovery until a nonzero quorum is configured', async () => {
  const f = await fixture({ guardians: [], rules: { guardianThreshold: 0 } });
  await f.at((await f.read('deadline')) + 1000n);
  assert.equal(await f.read('eligibleAction'), 0);
  await assert.rejects(f.tx('requestRecovery'));
});
test('native deposits and active owner withdrawals use exact accounting', async () => {
  const f = await fixture();
  await f.tx('depositNative', [], 2, 1001n);
  await f.tx('withdraw', [zeroAddress, 101n]);
  assert.equal(await f.read('accounted', [zeroAddress]), 900n);
  assert.equal(await f.client.getBalance({ address: f.vault }), 900n);
  await assert.rejects(f.tx('withdraw', [zeroAddress, 901n]));
  await assert.rejects(f.tx('depositNative'));
});
test('standard ERC20 deposits, withdrawals and snapshot claims', async () => {
  const f = await fixture({ rules: { initialBps: 10000 } });
  const token = await f.deploy('TestToken'); const abi = artifact('TestToken').abi;
  await f.tx('addSupportedToken', [token]);
  await f.write(token, 'approve', [f.vault, 1000n], 0, abi);
  await f.tx('depositToken', [token, 1000n]);
  await f.tx('withdraw', [token, 100n]);
  await f.authorize();
  assert.equal(await f.read('snapshot', [token]), 900n);
  await f.tx('claim', [token, false], 1);
  assert.equal(await f.read('balanceOf', [f.accounts[1].address], token, abi), 540n);
});
test('rejects fee-on-transfer tokens and excludes unsolicited token donations', async () => {
  const f = await fixture();
  const tax = await f.deploy('TaxToken');
  await f.tx('addSupportedToken', [tax]);
  await f.write(tax, 'approve', [f.vault, 1000n], 0, artifact('TaxToken').abi);
  await assert.rejects(f.tx('depositToken', [tax, 1000n]));
  assert.equal(await f.read('accounted', [tax]), 0n);
  const token = await f.deploy('TestToken');
  await f.tx('addSupportedToken', [token]);
  await f.write(token, 'transfer', [f.vault, 200n], 0, artifact('TestToken').abi);
  await f.authorize();
  assert.equal(await f.read('snapshot', [token]), 0n);
});
test('rejects unsupported assets and missing token approval', async () => {
  const f = await fixture(); const token = await f.deploy('TestToken');
  await assert.rejects(f.tx('depositToken', [token, 100n]));
  await assert.rejects(f.tx('addSupportedToken', [zeroAddress]));
  await assert.rejects(f.tx('addSupportedToken', [f.accounts[2].address]));
  await f.tx('addSupportedToken', [token]);
  await assert.rejects(f.tx('addSupportedToken', [token]));
  await assert.rejects(f.tx('depositToken', [token, 100n]));
});
test('negative balance changes block authorization rather than changing allocations', async () => {
  const f = await fixture(); const token = await f.deploy('TestToken'); const abi = artifact('TestToken').abi;
  await f.tx('addSupportedToken', [token]);
  await f.write(token, 'approve', [f.vault, 100n], 0, abi);
  await f.tx('depositToken', [token, 100n]);
  await f.write(token, 'burn', [f.vault, 1n], 0, abi);
  await assert.rejects(f.authorize());
  assert.equal(await f.read('state'), 1);
});
test('deadline is not expiry until strictly exceeded; heartbeat renews the deadline', async () => {
  const f = await fixture(); const d = await f.read('deadline');
  await f.at(d); await assert.rejects(f.tx('requestRecovery'));
  await f.at(d + 1n); assert.equal(await f.read('eligibleAction'), 1);
  await f.tx('heartbeat'); assert.equal(await f.read('eligibleAction'), 0);
  assert.equal(await f.read('deadline'), d + 61n);
});
test('missed heartbeat only opens a challenge; no immediate claims or finalization', async () => {
  const f = await fixture(); await f.tx('depositNative', [], 0, 1000n); await f.pending();
  assert.equal(await f.read('state'), 1);
  await assert.rejects(f.tx('finalizeRecovery'));
  await assert.rejects(f.tx('claim', [zeroAddress, true], 1));
  await assert.rejects(f.tx('withdraw', [zeroAddress, 1n]));
  await assert.rejects(f.tx('configure', [f.b, f.g, f.config]));
  await assert.rejects(f.tx('depositNative', [], 0, 10n));
});
test('cancellation and stale approval replay are isolated by request nonce', async () => {
  const f = await fixture(); await f.pending(); await f.tx('approveRecovery', [1n, false], 3);
  await f.tx('cancelRecovery'); assert.equal(await f.read('state'), 0);
  await f.pending(); assert.equal(await f.read('recoveryNonce'), 2n);
  assert.equal(await f.read('approvalCount'), 0n);
  await assert.rejects(f.tx('approveRecovery', [1n, false], 3));
  await assert.rejects(f.tx('cancelRecovery', [], 1));
  await f.tx('heartbeat'); assert.equal(await f.read('state'), 0);
});
test('pause cancels a request and blocks permissionless automation', async () => {
  const f = await fixture(); await f.pending(); await f.tx('setRecoveryPaused', [true]);
  assert.equal(await f.read('state'), 0);
  await f.at((await f.read('deadline')) + 1n);
  assert.equal(await f.read('eligibleAction'), 0);
  await assert.rejects(f.tx('requestRecovery'));
  await f.tx('setRecoveryPaused', [false]); assert.equal(await f.read('eligibleAction'), 1);
});
test('quorum and exact challenge boundary are independently enforced', async () => {
  const f = await fixture(); await f.tx('depositNative', [], 0, 1000n); await f.pending();
  const ends = (await f.read('pendingAt')) + 60n;
  await f.at(ends); await assert.rejects(f.tx('finalizeRecovery'));
  await assert.rejects(f.tx('approveRecovery', [1n, false], 2));
  await f.tx('approveRecovery', [1n, false], 3);
  await assert.rejects(f.tx('approveRecovery', [1n, false], 3));
  await f.at(ends - 1n); await assert.rejects(f.tx('finalizeRecovery'));
  await f.at(ends); await f.tx('finalizeRecovery'); assert.equal(await f.read('state'), 2);
  await assert.rejects(f.tx('cancelRecovery'));
  await assert.rejects(f.tx('setRecoveryPaused', [true]));
});
test('phased claims share a ledger, reject duplicates and progress to completion', async () => {
  const f = await fixture(); await f.tx('depositNative', [], 0, 1000n); await f.authorize();
  assert.equal(await f.read('claimable', [f.accounts[1].address, zeroAddress, false]), 60n);
  await f.tx('claim', [zeroAddress, false], 1); assert.equal(await f.read('state'), 3);
  await assert.rejects(f.tx('claim', [zeroAddress, false], 1));
  await assert.rejects(f.tx('claim', [zeroAddress, false], 6));
  await f.at((await f.read('authorizedAt')) + 60n);
  assert.equal(await f.read('claimable', [f.accounts[1].address, zeroAddress, false]), 60n);
  await f.at((await f.read('authorizedAt')) + 540n);
  await f.tx('claim', [zeroAddress, false], 1); await f.tx('claim', [zeroAddress, false], 2);
  assert.equal(await f.read('state'), 4); assert.equal(await f.client.getBalance({ address: f.vault }), 0n);
  assert.equal(await f.read('claimed', [f.accounts[1].address, zeroAddress]), 600n);
});
test('emergency remainder requires a fresh quorum and delay, cannot double count', async () => {
  const f = await fixture(); await f.tx('depositNative', [], 0, 1000n); await f.authorize();
  await f.tx('claim', [zeroAddress, false], 1);
  await f.at((await f.read('authorizedAt')) + 120n);
  await assert.rejects(f.tx('claim', [zeroAddress, true], 1));
  await f.tx('approveRecovery', [1n, true], 3);
  await assert.rejects(f.tx('approveRecovery', [1n, true], 3));
  await f.at((await f.read('authorizedAt')) + 119n); await assert.rejects(f.tx('claim', [zeroAddress, true], 1));
  await f.at((await f.read('authorizedAt')) + 120n);
  assert.equal(await f.read('claimable', [f.accounts[1].address, zeroAddress, true]), 540n);
  await f.tx('claim', [zeroAddress, true], 1);
  assert.equal(await f.read('claimable', [f.accounts[1].address, zeroAddress, false]), 0n);
  await assert.rejects(f.tx('claim', [zeroAddress, true], 1));
});
test('emergency can be disabled; initial zero and full schedules are valid', async () => {
  const f = await fixture({ rules: { initialBps: 0, emergencyDelay: 0n } });
  await f.tx('depositNative', [], 0, 1000n); await f.authorize();
  assert.equal(await f.read('vestedBps'), 0n);
  await assert.rejects(f.tx('approveRecovery', [1n, true], 3));
  await f.at((await f.read('authorizedAt')) + 600n); assert.equal(await f.read('vestedBps'), 10000n);
});
test('rounding distributes the entire tiny snapshot, leaving no trapped dust', async () => {
  const f = await fixture({ rules: { initialBps: 10000 } });
  await f.tx('depositNative', [], 0, 1n); await f.authorize();
  assert.equal(await f.read('entitlement', [f.accounts[1].address, zeroAddress]), 0n);
  assert.equal(await f.read('entitlement', [f.accounts[2].address, zeroAddress]), 1n);
  await f.tx('claim', [zeroAddress, false], 2); assert.equal(await f.read('state'), 4);
});
test('automation is idempotent and nonce-bound, cannot bypass safeguards', async () => {
  const f = await fixture();
  await f.tx('performUpkeep', [1, 0n], 6); assert.equal(await f.read('state'), 0);
  await f.at((await f.read('deadline')) + 1n);
  await f.tx('performUpkeep', [1, 0n], 6); assert.equal(await f.read('state'), 1);
  await f.tx('performUpkeep', [1, 0n], 6); assert.equal(await f.read('recoveryNonce'), 1n);
  await f.tx('performUpkeep', [2, 1n], 6); assert.equal(await f.read('state'), 1);
  await f.tx('cancelRecovery'); await f.pending();
  await f.tx('performUpkeep', [2, 1n], 6); assert.equal(await f.read('state'), 1);
});
test('native reentrancy cannot claim more than the authorized tranche', async () => {
  const f = await fixture(); const attacker = await f.deploy('ReentrantHeir');
  await f.tx('configure', [[{ account: attacker, allocationBps: 10000 }], f.g, f.config]);
  await f.write(attacker, 'setVault', [f.vault], 0, artifact('ReentrantHeir').abi);
  await f.tx('depositNative', [], 0, 1000n); await f.authorize();
  await f.write(attacker, 'take', [], 0, artifact('ReentrantHeir').abi);
  assert.equal(await f.read('reentered', [], attacker, artifact('ReentrantHeir').abi), false);
  assert.equal(await f.client.getBalance({ address: attacker }), 100n);
  assert.equal(await f.read('remaining', [zeroAddress]), 900n);
});
test('CRE receiver validates forwarder, metadata owner, chain, target and registered vault', async () => {
  const f = await fixture(); const factory = await f.deploy('SilentSovereignFactory'); const fa = artifact('SilentSovereignFactory').abi;
  await f.write(factory, 'createVault', [f.b, f.g, f.config], 0, fa);
  const [vault] = await f.read('getVaults', [f.accounts[0].address], factory, fa);
  const receiver = await f.deploy('SilentSovereignCREReceiver', [factory, f.accounts[5].address, f.accounts[0].address]);
  const metadata = concat([pad('0x', { size: 32 }), pad('0x', { size: 10 }), f.accounts[0].address, '0x0000']);
  const report = (chain = 31337n, target = receiver, v = vault) => encodeAbiParameters(parseAbiParameters('uint256,address,address,uint8,uint256'), [chain, target, v, 1, 0n]);
  const deliver = (payload, who = 5, md = metadata) => f.write(receiver, 'onReport', [md, payload], who, artifact('SilentSovereignCREReceiver').abi);
  await assert.rejects(deliver(report(), 4)); await assert.rejects(deliver(report(), 5, '0x'));
  await assert.rejects(deliver(report(1n))); await assert.rejects(deliver(report(31337n, f.vault)));
  await assert.rejects(deliver(report(31337n, receiver, f.vault)));
  await f.at((await f.read('deadline', [], vault)) + 1n);
  await deliver(report()); await deliver(report());
  assert.equal(await f.read('state', [], vault), 1);
  assert.equal(await f.read('recoveryNonce', [], vault), 1n);
});
