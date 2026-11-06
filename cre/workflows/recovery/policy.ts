import {
  encodeAbiParameters,
  parseAbiParameters,
  isAddress,
  zeroAddress,
  type Address,
} from "viem";
import { z } from "zod";

const address = z
  .string()
  .refine(
    (a) => isAddress(a) && a.toLowerCase() !== zeroAddress,
    "Provide a deployed nonzero contract address",
  );
export const configSchema = z
  .object({
    schedule: z.string().min(5),
    factoryAddress: address,
    receiverAddress: z.union([address, z.literal("")]).default(""),
    executionMode: z.enum(["observe", "transitions"]).default("transitions"),
    notifications: z
      .object({
        enabled: z.boolean().default(false),
        endpoint: z
          .string()
          .url()
          .refine(
            (s) => new URL(s).protocol === "https:",
            "Use an HTTPS notification endpoint",
          ),
      })
      .optional(),
    chainSelectorName: z.literal("ethereum-testnet-sepolia"),
    chainId: z.literal(11155111),
    startIndex: z.number().int().min(0).default(0),
    batchSize: z.number().int().min(1).max(5).default(3),
    watchVaults: z.array(address).max(5).default([]),
    enableEventTriggers: z.boolean().default(false),
    finality: z.enum(["finalized", "latest"]).default("finalized"),
    gasLimit: z.string().regex(/^\d+$/).default("1500000"),
  })
  .refine(
    (c) =>
      c.executionMode === "observe" ||
      (isAddress(c.receiverAddress) && c.receiverAddress !== zeroAddress),
    "Transition mode needs a deployed receiver address; use observe mode for read-only/email demonstrations.",
  );
export type Config = z.infer<typeof configSchema>;
export function encodeRecoveryReport(
  config: Config,
  vault: Address,
  action: number,
  nonce: bigint,
) {
  if (action !== 1 && action !== 2)
    throw new Error("Only request and finalize transitions are supported");
  return encodeAbiParameters(
    parseAbiParameters("uint256,address,address,uint8,uint256"),
    [
      BigInt(config.chainId),
      config.receiverAddress as Address,
      vault,
      action,
      nonce,
    ],
  );
}
