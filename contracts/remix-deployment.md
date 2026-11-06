# Exact Remix deployment

Do not deploy with real-value funds. The source is unaudited. No deployment has been made on your behalf.

## Compiler and imports

1. Open https://remix.ethereum.org and create a workspace. Upload the `contracts` folder with its subdirectories, or create the same relative paths.
2. Select `contracts/SilentSovereignFactory.sol` in Solidity Compiler.
3. Choose compiler **0.8.24**, enable optimization with **200 runs**, EVM target **Paris**. IR compilation is not required.
4. Compile. Imports use the exact Remix/npm syntax `@openzeppelin/contracts@5.4.0/...`. Remix downloads this release. Do not remove the version or silently upgrade it.
5. Local `npm run compile` resolves those same import strings to the pinned npm dependency; it checks bytecode sizes against EIP-170.

## Deployment order

### 1. Factory

In Deploy & Run, choose **Injected Provider**. Check that the wallet is on **Sepolia (11155111)**, with test ETH for gas. Select `SilentSovereignFactory` and deploy with **no constructor arguments** and **zero value**.

Copy the address from Deployed Contracts. Copy its block number from the actual deployment receipt. Configure:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_VAULT_FACTORY_ADDRESS=YOUR_ACTUAL_FACTORY_ADDRESS
NEXT_PUBLIC_DEPLOYMENT_BLOCK=YOUR_ACTUAL_DECIMAL_BLOCK
NEXT_PUBLIC_ANON_RPC_ENABLED=false
```

Place this in `frontend/.env.local`, then restart/rebuild. Placeholder text is intentionally not a valid address and must be replaced. There is no implementation deployment, proxy or library-linking step; the internal allocation library is inlined.

### 2. Individual vault, preferably through the app

Connect the intended owner wallet and create a plan at `/create`. `createVault` deploys the vault and emits `VaultCreated(owner,vault,index)`. Confirm the receipt, read `getVaults(owner)`, and verify `isVault(vault)` is true. The **sending wallet** is the immutable owner. To configure a different owner, connect that wallet or supported account before creating.

For a manual Remix call, expand `createVault` and enter a tuple array, address array and rules tuple. Replace all placeholders:

```text
beneficiaries: [["BENEFICIARY_ONE_ADDRESS",6000],["BENEFICIARY_TWO_ADDRESS",4000]]
guardians: ["GUARDIAN_ADDRESS"]
rules: [60,60,60,120,1000,1000,1]
```

The ordered rules fields are:

| Index | Field | Demo value |
| --- | --- | --- |
| 0 | heartbeatInterval, seconds | 60 |
| 1 | challengePeriod, seconds | 60 |
| 2 | releaseInterval, seconds | 60 |
| 3 | emergencyDelay after authorization, seconds | 120; 0 disables acceleration |
| 4 | initialBps of each beneficiary share | 1000 = 10% |
| 5 | trancheBps per release interval | 1000 = 10% |
| 6 | guardianThreshold | 1 |

Durations are uint64; basis points uint16; quorum uint8. Each nonzero duration has a 60-second minimum. The frontend additionally caps duration input at ten years. Beneficiary allocations must sum to 10,000. Duplicate/zero addresses are rejected. Guardians cannot be the vault owner. No guardians plus threshold 0 is allowed, but **disables recovery entirely**.

To deploy a standalone vault manually, select `SilentSovereignVault` and pass `(ownerAddress, beneficiaries, guardians, rules)` using the same tuple order. Standalone vaults are not registered by the factory; the frontend and CRE adapter intentionally reject them. The normal deployment path is factory creation.

### 3. Optional CRE receiver

Compile/select `SilentSovereignCREReceiver` using the same compiler settings. Constructor arguments, in order:

```text
factory_: YOUR_DEPLOYED_FACTORY
forwarder_: THE_OFFICIAL_FORWARDER_FOR_YOUR_EXECUTION_MODE
workflowOwner_: THE_ADDRESS_THAT_OWNS_YOUR_CRE_WORKFLOW
```

Look up the **current Sepolia** forwarder in the [official directory](https://docs.chain.link/cre/guides/workflow/using-evm-client/forwarder-directory). Simulation uses a MockForwarder; deployed DON execution uses the real KeystoneForwarder. These are distinct receiver deployments because forwarder and workflow owner are immutable. Never use a zero address or substitute a personal wallet on public testnet.

Put the receiver and factory in `cre/config/recovery.json`. Complete [../cre/README.md](../cre/README.md) before claiming automation works.

## Verify each operation

Use Remix `At Address` with the compiled `SilentSovereignVault` ABI for the emitted address:

1. Read `owner`, `state` (0), `getBeneficiaries`, `getGuardians`, `rules`, `deadline`, `getAssets` and `accounted(0x0000000000000000000000000000000000000000)`.
2. Set Value in **wei** to a small test amount and call payable `depositNative`. Set Value back to 0 after depositing. Verify its receipt, native balance and `Deposited` event.
3. While active, owner `withdraw(nativeAddress,amount)` must work; another wallet must revert. `heartbeat()` must extend `deadline()`.
4. Before or exactly at `deadline`, `requestRecovery()` must revert. After it, anyone can request. Read state 1, nonce and challenge end. Deposits, configuration and withdrawals must be blocked.
5. Owner `cancelRecovery()` or `heartbeat()` returns to state 0. Old guardian approvals must not carry to the next nonce.
6. Start another request. From each guardian wallet call `approveRecovery(currentNonce,false)`. Before quorum or before `pendingAt+challengePeriod`, `finalizeRecovery()` must revert.
7. At/after the challenge end, with quorum, finalize. Read state 2, `authorizedAt`, `snapshot(asset)`, `remaining(asset)`, and `claimable(beneficiary,asset,false)`.
8. From that beneficiary wallet, `claim(asset,false)` pays only the currently vested amount. A duplicate immediate claim must revert. At the next interval more becomes available.
9. For emergency acceleration, guardians separately approve `approveRecovery(currentNonce,true)` after authorization. At/after `authorizedAt+emergencyDelay`, the beneficiary may `claim(asset,true)` for only their unpaid remainder. Repeat for every beneficiary/asset to reach state 4.
10. For ERC-20: owner `addSupportedToken(token)` only after verifying its behavior; depositor calls the token's `approve(vault,amount)`, then `depositToken(token,amount)`. Approval and deposit are separate receipts. Rebasing/taxed/malicious tokens are excluded.

Actual ABI output is generated into `frontend/lib/generated/` and `cre/frontend-abi/` by `npm run compile`. Remix Compilation Details also exports ABI/metadata for source verification. Publish verified source with the exact compiler/settings/import versions if you choose to use an explorer; no explorer API credentials are needed in the frontend.
