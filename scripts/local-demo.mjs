// Isolated browser-test environment. No real networks or user keys are used.
import fs from "node:fs";
import { spawn } from "node:child_process";
import ganache from "ganache";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const server = ganache.server({
  logging: { quiet: true },
  wallet: { totalAccounts: 7 },
  chain: { chainId: 31337 },
  miner: { timestampIncrement: 1 },
});
await server.listen(8545, "127.0.0.1");
const initial = server.provider.getInitialAccounts();
const accounts = Object.keys(initial);
const account = privateKeyToAccount(Object.values(initial)[0].secretKey);
const wallet = createWalletClient({
  account,
  transport: http("http://127.0.0.1:8545"),
});
const publicClient = createPublicClient({
  transport: http("http://127.0.0.1:8545"),
  pollingInterval: 20,
});
const factory = JSON.parse(
  fs.readFileSync("artifacts/SilentSovereignFactory.json", "utf8"),
);
const hash = await wallet.deployContract({
  abi: factory.abi,
  bytecode: `0x${factory.evm.bytecode.object}`,
  gas: 14000000n,
  chain: null,
});
const receipt = await publicClient.waitForTransactionReceipt({ hash });
if (receipt.status !== "success")
  throw new Error("Local test deployment failed");
fs.mkdirSync(".local", { recursive: true });
fs.writeFileSync(
  ".local/test-deployment.json",
  JSON.stringify({
    factory: receipt.contractAddress,
    block: receipt.blockNumber.toString(),
    accounts,
  }),
);
console.log("Isolated test factory deployed; starting frontend on port 3100.");
const next = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "--port", "3100"],
  {
    cwd: "frontend",
    env: {
      ...process.env,
      SILENT_E2E: "1",
      NEXT_PUBLIC_CHAIN_ID: "31337",
      NEXT_PUBLIC_RPC_URL: "http://127.0.0.1:8545",
      NEXT_PUBLIC_VAULT_FACTORY_ADDRESS: receipt.contractAddress,
      NEXT_PUBLIC_DEPLOYMENT_BLOCK: receipt.blockNumber.toString(),
      NEXT_PUBLIC_ANON_RPC_ENABLED: "false",
    },
    stdio: "inherit",
    windowsHide: true,
  },
);
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  next.kill();
  await server.close();
  process.exit(0);
}
process.on("SIGTERM", close);
process.on("SIGINT", close);
next.on("exit", (code) => {
  if (!closing) {
    server.close().then(() => process.exit(code || 0));
  }
});
