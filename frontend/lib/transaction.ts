import type { Hash, TransactionReceipt } from "viem";

export type TransactionState = {
  phase: "idle" | "signing" | "confirming" | "confirmed" | "failed";
  label?: string;
  hash?: Hash;
  error?: string;
  block?: bigint;
};
export function transactionError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/reject|denied|4001/i.test(message))
    return "You declined the request in your wallet. No transaction was confirmed.";
  if (/insufficient funds|exceeds.*balance/i.test(message))
    return "Your wallet has insufficient test ETH for this amount and the network fee. Add test ETH or enter a smaller amount, then try again.";
  if (/chain|network/i.test(message) && /wrong|mismatch|switch/i.test(message))
    return "Switch your wallet to the supported network and try again.";
  if (/timeout|timed out/i.test(message))
    return "Transaction confirmation is taking longer than expected. Check its status in the explorer before submitting another request.";
  if (
    /failed to fetch|fetch failed|network request failed|ENOTFOUND|ECONNREFUSED|could not resolve/i.test(
      message,
    )
  )
    return "We could not connect to the network. Check your internet connection and RPC settings, then try again.";
  return message
    .split("\n")
    .filter(Boolean)
    .slice(0, 2)
    .join(" ")
    .slice(0, 500);
}
export async function confirmTransaction(
  hash: Hash,
  wait: (hash: Hash) => Promise<TransactionReceipt>,
): Promise<TransactionState> {
  const receipt = await wait(hash);
  if (receipt.status !== "success")
    throw new Error(
      "The transaction reverted. No requested changes were applied.",
    );
  return {
    phase: "confirmed",
    hash: receipt.transactionHash,
    block: receipt.blockNumber,
  };
}
