import { parseUnits } from "viem";

export function parseAssetAmount(value: string, decimals: number): bigint {
  if (!/^\d+(\.\d+)?$/.test(value))
    throw new Error("Enter a positive decimal amount.");
  if ((value.split(".")[1]?.length || 0) > decimals)
    throw new Error(`This asset supports at most ${decimals} decimal places.`);
  const amount = parseUnits(value, decimals);
  if (amount <= 0n) throw new Error("Enter an amount greater than zero.");
  return amount;
}
