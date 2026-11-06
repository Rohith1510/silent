import {
  createPublicClient,
  custom,
  http,
  type EIP1193Provider,
  type PublicClient,
  type Transport,
} from "viem";
import { chain, rpcUrl } from "./network";
import { mainnet } from "viem/chains";

export type PrivacyStatus = {
  mode: "public" | "starting" | "anonymous" | "failed";
  detail: string;
  lastVerifiedAt?: string;
  lastMethod?: string;
  latencyMs?: number;
  successfulRequests?: number;
};
export const anonEnabled =
  process.env.NEXT_PUBLIC_ANON_RPC_ENABLED !== "false" && chain.id !== 31337;
// Official Nox Sepolia specifier, verified in ethereum.github.io/anon-rpc/adopters/.
export const noxSpecifier = "0x35133267A8F7EC35046a83DCA0f4Ca8A6e1b7A9A";
export const anonymousNetworks = {
  nox: { name: "Nox", address: noxSpecifier, chainId: 11155111 },
  nym: {
    name: "Nym",
    address: "0x3aCD9742C68F6d993066Ae25533e09b9e1f60eD0",
    chainId: 1,
  },
} as const;
export type AnonymousNetwork = keyof typeof anonymousNetworks;
const anonymousRpcUrl = process.env.NEXT_PUBLIC_ANON_RPC_URL || rpcUrl;
const READ_METHODS = new Set([
  "eth_chainId",
  "eth_call",
  "eth_getBalance",
  "eth_getCode",
  "eth_getLogs",
  "eth_blockNumber",
  "eth_getBlockByNumber",
  "eth_getBlockByHash",
  "eth_getTransactionReceipt",
  "eth_getTransactionByHash",
  "eth_getTransactionCount",
  "eth_estimateGas",
  "eth_gasPrice",
  "eth_maxPriorityFeePerGas",
  "eth_feeHistory",
]);
export type ReadClient = PublicClient<Transport, typeof chain>;
export function publicReadClient(): ReadClient {
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
    cacheTime: 0,
    ccipRead: false,
  });
}

export async function startAnonymousClient(
  onStatus: (s: PrivacyStatus) => void,
  network: AnonymousNetwork = "nox",
) {
  if (chain.id !== 11155111)
    throw new Error(
      "This verified Nox specifier is supported only on Sepolia.",
    );
  const { AnonRpcWorker } = await import("@anon-rpc/browser-harness");
  const selected = anonymousNetworks[network];
  const bootstrap =
    selected.chainId === 1
      ? createPublicClient({
          chain: mainnet,
          transport: http(
            process.env.NEXT_PUBLIC_ANON_BOOTSTRAP_RPC_URL ||
              "https://ethereum-rpc.publicnode.com",
          ),
        })
      : publicReadClient();
  // The official harness owns integrity verification and the null-origin iframe / worker.
  const worker = new AnonRpcWorker({
    address: selected.address,
    preExisting: {
      rpcProvider: {
        request: async ({ method, params }) =>
          bootstrap.request({ method, params } as Parameters<
            typeof bootstrap.request
          >[0]),
      },
    },
  });
  const bounded = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
    let id: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          id = setTimeout(
            () =>
              reject(
                new Error(
                  "Anon-RPC network timed out; public fallback is disabled.",
                ),
              ),
            ms,
          );
        }),
      ]);
    } finally {
      clearTimeout(id);
    }
  };
  try {
    await bounded(worker.ready, 90000);
    let requestId = 0;
    let successfulRequests = 0;
    const provider = {
      request: async ({
        method,
        params,
      }: {
        method: string;
        params?: unknown;
      }) => {
        if (!READ_METHODS.has(method))
          throw new Error(
            "Signing and broadcasting are not permitted on the anonymous read client.",
          );
        try {
          const started = performance.now();
          const response = await bounded(
            worker.fetch(anonymousRpcUrl, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: ++requestId,
                method,
                params: params ?? [],
              }),
              signal: AbortSignal.timeout(60000),
            }),
            65000,
          );
          if (!response.ok)
            throw new Error(`Anon-RPC upstream HTTP ${response.status}`);
          const body = await response.json();
          if (
            !body ||
            typeof body !== "object" ||
            body.jsonrpc !== "2.0" ||
            !("result" in body || "error" in body)
          )
            throw new Error(
              "Invalid JSON-RPC response from anonymizing network",
            );
          if (
            method === "eth_chainId" &&
            body.result &&
            Number(body.result) !== chain.id
          )
            throw new Error("Anon-RPC returned the wrong chain.");
          onStatus({
            mode: "anonymous",
            detail: `${selected.name} · hash-verified worker · no public fallback`,
            lastVerifiedAt: new Date().toISOString(),
            lastMethod: method,
            latencyMs: Math.round(performance.now() - started),
            successfulRequests: ++successfulRequests,
          });
          if (body.error)
            throw Object.assign(
              new Error(body.error.message || "Anon-RPC JSON-RPC error"),
              {
                code:
                  typeof body.error.code === "number"
                    ? body.error.code
                    : -32000,
                data: body.error.data,
                rpcResponseError: true,
              },
            );
          if (!("result" in body))
            throw new Error(
              "Invalid JSON-RPC response from anonymizing network",
            );
          return body.result;
        } catch (error) {
          // Contract reverts are application errors; they do not imply a transport downgrade.
          if (!(
            error &&
            typeof error === "object" &&
            "rpcResponseError" in error &&
            error.rpcResponseError === true
          ))
            onStatus({
              mode: "failed",
              detail: error instanceof Error ? error.message : String(error),
            });
          throw error;
        }
      },
    };
    const client = createPublicClient({
      chain,
      batch: { multicall: { batchSize: 4096, wait: 20 } },
      transport: custom(provider as EIP1193Provider, { retryCount: 0 }),
      cacheTime: 0,
      ccipRead: false,
    });
    if ((await client.getChainId()) !== chain.id)
      throw new Error("Anon-RPC returned the wrong chain.");
    return { client: client as ReadClient, close: () => worker.close() };
  } catch (error) {
    worker.close();
    throw error;
  }
}
