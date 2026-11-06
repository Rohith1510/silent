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
    return "Your wallet needs more test ETH to cover this amount and network fees.";
  if (/chain|network/i.test(message) && /wrong|mismatch|switch/i.test(message))
    return "Switch your wallet to the supported network and try again.";
  if (/timeout|timed out/i.test(message))
    return "Confirmation timed out. Check the transaction in the explorer before retrying.";
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
