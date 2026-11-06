import "server-only";
import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  type Address,
} from "viem";
import { defineChain } from "viem";
import { sepolia } from "viem/chains";
import { SilentSovereignVaultAbi as vaultAbi } from "../generated/SilentSovereignVault";
import { SilentSovereignFactoryAbi as factoryAbi } from "../generated/SilentSovereignFactory";
import { HttpError, required } from "./config";
export function serverClient() {
  const id = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111);
  if (
    id !== 11155111 &&
    !(id === 31337 && process.env.SILENT_LOCAL_TESTS === "1")
  )
    throw new HttpError(503, "Notifications support Sepolia only.");
  const chain =
    id === 11155111
      ? sepolia
      : defineChain({
          id,
          name: "Isolated tests",
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          rpcUrls: { default: { http: [required("SERVER_RPC_URL")] } },
        });
  return createPublicClient({
    chain,
    transport: http(required("SERVER_RPC_URL"), {
      retryCount: 1,
      timeout: 15000,
    }),
  });
}
export function addressInput(input: unknown): Address {
  if (
    typeof input !== "string" ||
    !isAddress(input) ||
    /^0x0{40}$/i.test(input)
  )
    throw new HttpError(400, "A valid nonzero address is required.");
  return getAddress(input);
}
export async function vaultState(input: unknown) {
  const vault = addressInput(input);
  const client = serverClient();
  if ((await client.getChainId()) !== client.chain.id)
    throw new HttpError(503, "Server RPC network mismatch.");
  const factory = addressInput(required("NEXT_PUBLIC_VAULT_FACTORY_ADDRESS"));
  const block = await client.getBlock();
  const blockNumber = block.number;
  if (
    !(await client.readContract({
      address: factory,
      abi: factoryAbi,
      functionName: "isVault",
      args: [vault],
      blockNumber,
    }))
  )
    throw new HttpError(
      400,
      "Vault is not registered by this application's factory.",
    );
  const read = { address: vault, abi: vaultAbi, blockNumber } as const;
  const [
    owner,
    guardians,
    beneficiaries,
    state,
    deadline,
    nonce,
    approvals,
    rules,
  ] = await Promise.all([
    client.readContract({ ...read, functionName: "owner" }),
    client.readContract({ ...read, functionName: "getGuardians" }),
    client.readContract({ ...read, functionName: "getBeneficiaries" }),
    client.readContract({ ...read, functionName: "state" }),
    client.readContract({ ...read, functionName: "deadline" }),
    client.readContract({ ...read, functionName: "recoveryNonce" }),
    client.readContract({ ...read, functionName: "approvalCount" }),
    client.readContract({ ...read, functionName: "rules" }),
  ]);
  return {
    vault,
    chainId: client.chain.id,
    owner,
    guardians,
    beneficiaries,
    state,
    deadline,
    nonce,
    approvals,
    threshold: rules[6],
    now: block.timestamp,
  };
}
export function vaultRole(
  state: Awaited<ReturnType<typeof vaultState>>,
  wallet: string,
) {
  const same = (a: string) => a.toLowerCase() === wallet.toLowerCase();
  if (same(state.owner)) return "owner" as const;
  if (state.guardians.some(same)) return "guardian" as const;
  if (state.beneficiaries.some((b) => same(b.account)))
    return "beneficiary" as const;
  throw new HttpError(
    403,
    "Only this vault's owner, guardians or beneficiaries can subscribe.",
  );
}
