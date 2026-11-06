import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { configSchema, encodeRecoveryReport } from "./recovery/policy";

const factory = "0x0000000000000000000000000000000000000011";
const receiver = "0x0000000000000000000000000000000000000012";
const vault = "0x0000000000000000000000000000000000000013";
const raw = {
  schedule: "0 */1 * * * *",
  factoryAddress: factory,
  receiverAddress: receiver,
  chainId: 11155111,
  chainSelectorName: "ethereum-testnet-sepolia",
};
test("CRE config refuses placeholders, unsupported chains and unbounded batches", () => {
  assert.equal(
    configSchema.safeParse({ ...raw, factoryAddress: "FILL_ME" }).success,
    false,
  );
  assert.equal(configSchema.safeParse({ ...raw, chainId: 1 }).success, false);
  assert.equal(
    configSchema.safeParse({ ...raw, batchSize: 1000 }).success,
    false,
  );
  assert.equal(configSchema.safeParse(raw).success, true);
});
test("signed payload binds chain, receiver, vault, transition and recovery nonce", () => {
  const config = configSchema.parse(raw);
  const encoded = encodeRecoveryReport(config, vault, 2, 7n);
  assert.deepEqual(
    decodeAbiParameters(
      parseAbiParameters("uint256,address,address,uint8,uint256"),
      encoded,
    ),
    [11155111n, receiver, vault, 2, 7n],
  );
  assert.notEqual(encoded, encodeRecoveryReport(config, vault, 2, 8n));
  assert.throws(() => encodeRecoveryReport(config, vault, 3, 7n));
});
test("observe mode needs no receiver, transition mode does, notification endpoints require HTTPS", () => {
  assert.ok(
    configSchema.safeParse({
      ...raw,
      receiverAddress: "",
      executionMode: "observe",
    }).success,
  );
  assert.equal(
    configSchema.safeParse({
      ...raw,
      receiverAddress: "",
      executionMode: "transitions",
    }).success,
    false,
  );
  assert.equal(
    configSchema.safeParse({
      ...raw,
      notifications: { enabled: true, endpoint: "http://localhost/dispatch" },
    }).success,
    false,
  );
});
