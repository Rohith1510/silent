import { createConfig, http, injected } from "wagmi";
import { defineChain, getAddress } from "viem";
import { sepolia } from "viem/chains";
import { validAddress } from "./configuration";

const local = defineChain({
  id: 31337,
  name: "Local test chain",
  nativeCurrency: { name: "Test Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
  testnet: true,
});
export const requestedChainId = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || 11155111,
);
export const chain = requestedChainId === 31337 ? local : sepolia;
export const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL ||
  (requestedChainId === 31337
    ? "http://127.0.0.1:8545"
    : "https://ethereum-sepolia-rpc.publicnode.com");
export const factoryAddress = validAddress(
  process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS || "",
)
  ? getAddress(process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS!)
  : undefined;
export const deploymentBlock = BigInt(
  /^\d+$/.test(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK || "")
    ? process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK!
    : "0",
);
export const environmentIssues = [
  ...(![11155111, 31337].includes(requestedChainId)
    ? ["Only Sepolia (11155111) and local tests (31337) are supported."]
    : []),
  ...(!factoryAddress
    ? [
        "Contract not configured. Deploy SilentSovereignFactory in Remix, then set NEXT_PUBLIC_VAULT_FACTORY_ADDRESS in frontend/.env.local.",
      ]
    : []),
];
export const walletConfig = createConfig({
  chains: [chain],
  connectors: [injected({ shimDisconnect: true })],
  transports: { [sepolia.id]: http(rpcUrl), [local.id]: http(rpcUrl) },
  ssr: true,
});
export const explorer = (hash: string, kind: "tx" | "address" = "tx") =>
  chain.blockExplorers
    ? `${chain.blockExplorers.default.url}/${kind}/${hash}`
    : undefined;
