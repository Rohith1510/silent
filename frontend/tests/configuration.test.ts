import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildGraph,
  defaultConfiguration,
  serializeConfiguration,
  validateConfiguration,
  validateGraph,
  type Configuration,
} from "../lib/configuration";
import { confirmTransaction, transactionError } from "../lib/transaction";
import type { Hash, TransactionReceipt } from "viem";
import { parseAssetAmount } from "../lib/assets";

const owner = "0x0000000000000000000000000000000000000001";
const heir = "0x0000000000000000000000000000000000000002";
const guardian = "0x0000000000000000000000000000000000000003";
function valid(): Configuration {
  return {
    ...defaultConfiguration,
    beneficiaries: [
      { id: "alice", identity: heir, address: heir, allocationBps: 10000 },
    ],
    guardians: [guardian],
    guardianThreshold: 1,
  };
}
test("an empty plan cannot be deployed", () => {
  assert.ok(validateConfiguration(defaultConfiguration).length);
  assert.throws(() => serializeConfiguration(defaultConfiguration));
});
test("valid graphs serialize deterministically into exact contract arguments", () => {
  const config = valid();
  const graph = buildGraph(config, owner);
  assert.equal(validateGraph(config, graph, owner).length, 0);
  const [b, g, rules] = serializeConfiguration(config, graph, owner);
  assert.deepEqual(b, [{ account: heir, allocationBps: 10000 }]);
  assert.deepEqual(g, [guardian]);
  assert.equal(rules.heartbeatInterval, 2592000n);
  assert.deepEqual(
    serializeConfiguration(config),
    serializeConfiguration(structuredClone(config)),
  );
});
test("position changes do not change enforceable configuration", () => {
  const config = valid();
  const graph = buildGraph(config);
  graph.nodes[0].position = { x: -100, y: 900 };
  assert.deepEqual(
    serializeConfiguration(config, graph),
    serializeConfiguration(config),
  );
});
test("removed safeguards, bypass edges, cycles and duplicate edges prevent deployment", () => {
  const config = valid();
  const missing = buildGraph(config);
  missing.nodes = missing.nodes.filter((n) => n.id !== "guardians");
  assert.throws(() => serializeConfiguration(config, missing));
  const bypass = buildGraph(config);
  bypass.edges.push({
    id: "bypass",
    source: "vault",
    target: "beneficiary:alice",
  });
  assert.throws(() => serializeConfiguration(config, bypass));
  const cycle = buildGraph(config);
  cycle.edges.push({ id: "cycle", source: "challenge", target: "vault" });
  assert.throws(() => serializeConfiguration(config, cycle));
  const duplicate = buildGraph(config);
  duplicate.edges.push({ ...duplicate.edges[0], id: "duplicate" });
  assert.throws(() => serializeConfiguration(config, duplicate));
});
test("mismatched beneficiary node data and unsupported nodes cannot be serialized", () => {
  const config = valid();
  const graph = buildGraph(config);
  graph.nodes.at(-1)!.data.beneficiaryId = "unknown";
  assert.throws(() => serializeConfiguration(config, graph));
  const other = buildGraph(config);
  other.nodes.push({
    id: "unverified-oracle",
    type: "protocol",
    position: { x: 0, y: 0 },
    data: {
      kind: "heartbeat",
      label: "External oracle",
      detail: "unsupported",
    },
  });
  assert.throws(() => serializeConfiguration(config, other));
});
test("allocations reject fractions of a basis point, duplicates and non-100% totals", () => {
  for (const allocationBps of [9999, 0, NaN, 10000.1]) {
    const config = valid();
    config.beneficiaries[0].allocationBps = allocationBps;
    assert.ok(validateConfiguration(config).length);
  }
  const duplicate = valid();
  duplicate.beneficiaries = [
    { ...duplicate.beneficiaries[0], allocationBps: 5000 },
    { ...duplicate.beneficiaries[0], id: "bob", allocationBps: 5000 },
  ];
  assert.ok(
    validateConfiguration(duplicate).some((e) =>
      /different address/.test(e.message),
    ),
  );
});
test("ENS identity requires normalization and a reviewed pinned address", () => {
  const config = valid();
  config.beneficiaries[0].identity = "heir.family.eth";
  assert.ok(validateConfiguration(config).length);
  config.beneficiaries[0].resolvedIdentity = "heir.family.eth";
  assert.equal(validateConfiguration(config).length, 0);
  config.beneficiaries[0].identity = "different.eth";
  assert.ok(validateConfiguration(config).length);
});
test("guardian threshold, duplicate guardians, owner overlap and short intervals are invalid", () => {
  const a = valid();
  a.guardians = [owner];
  assert.ok(validateConfiguration(a, owner).length);
  const b = valid();
  b.guardianThreshold = 2;
  assert.ok(validateConfiguration(b).length);
  const c = valid();
  c.guardians.push(guardian);
  assert.ok(validateConfiguration(c).length);
  const d = valid();
  d.challengePeriod = 59;
  assert.ok(validateConfiguration(d).length);
  const e = valid();
  e.guardians = [];
  e.guardianThreshold = 0;
  assert.equal(validateConfiguration(e).length, 0);
});
test("front end duration and tranche limits reject unsafe numbers", () => {
  for (const field of [
    "heartbeatInterval",
    "challengePeriod",
    "releaseInterval",
    "emergencyDelay",
  ] as const) {
    const c = valid();
    c[field] = Number.MAX_SAFE_INTEGER;
    assert.ok(validateConfiguration(c).length);
  }
  const c = valid();
  c.trancheBps = 0;
  assert.ok(validateConfiguration(c).length);
});
test("transaction errors explain rejection, insufficient funds, timeout and network mismatch", () => {
  assert.match(
    transactionError(new Error("User rejected request 4001")),
    /declined/,
  );
  assert.match(transactionError(new Error("insufficient funds")), /test ETH/);
  assert.match(transactionError(new Error("wrong network mismatch")), /Switch/);
  assert.match(transactionError(new Error("timeout")), /explorer/);
});
const hash = `0x${"a".repeat(64)}` as Hash;
test("no successful transaction state is returned before its receipt", async () => {
  let resolve!: (receipt: TransactionReceipt) => void;
  const receipt = new Promise<TransactionReceipt>((r) => {
    resolve = r;
  });
  let done = false;
  const waiting = confirmTransaction(hash, () => receipt).then((s) => {
    done = true;
    return s;
  });
  await Promise.resolve();
  assert.equal(done, false);
  resolve({
    status: "success",
    transactionHash: hash,
    blockNumber: 123n,
  } as TransactionReceipt);
  const result = await waiting;
  assert.equal(result.phase, "confirmed");
  assert.equal(result.block, 123n);
});
test("reverted and failed receipts cannot produce success", async () => {
  await assert.rejects(
    confirmTransaction(
      hash,
      async () => ({ status: "reverted" }) as TransactionReceipt,
    ),
    /reverted/,
  );
  await assert.rejects(
    confirmTransaction(hash, async () => {
      throw new Error("RPC down");
    }),
    /RPC down/,
  );
});
test("asset input preserves exact units and refuses silent rounding", () => {
  assert.equal(parseAssetAmount("0.01", 18), 10000000000000000n);
  assert.equal(parseAssetAmount("1.000001", 6), 1000001n);
  assert.throws(() => parseAssetAmount("1.0000001", 6), /decimal places/);
  assert.throws(() => parseAssetAmount("0", 18), /greater than zero/);
  assert.throws(() => parseAssetAmount("-1", 18), /positive/);
});
