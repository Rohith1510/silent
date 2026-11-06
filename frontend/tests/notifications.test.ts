import { test } from "node:test";
import assert from "node:assert/strict";
import { notificationKey, notificationKinds } from "../lib/notification-policy";
import {
  encryptContact,
  decryptContact,
  contactHash,
  equalSecret,
} from "../lib/server/cryptography";
import { privateKeyToAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";
import { verifyMessage } from "viem";

const active = {
  state: 0,
  deadline: 200000n,
  now: 199990n,
  nonce: 0n,
  approvals: 0n,
  threshold: 2,
};
test("reminders use chain time and stop after deadline; no inactivity message implies authorization", () => {
  assert.deepEqual(notificationKinds(active, "owner"), ["deadline_reminder"]);
  assert.deepEqual(
    notificationKinds({ ...active, now: active.deadline }, "owner"),
    [],
  );
  assert.deepEqual(notificationKinds({ ...active, now: 1n }, "owner"), []);
  assert.deepEqual(notificationKinds(active, "beneficiary"), []);
});
test("guardian notices require pending recovery with missing quorum", () => {
  assert.deepEqual(notificationKinds({ ...active, state: 1 }, "guardian"), [
    "guardian_action",
  ]);
  assert.deepEqual(
    notificationKinds({ ...active, state: 1, approvals: 2n }, "guardian"),
    [],
  );
  assert.deepEqual(notificationKinds({ ...active, state: 1 }, "owner"), [
    "recovery_started",
  ]);
});
test("beneficiary notification does not imply a claim amount or bypass vesting", () => {
  assert.deepEqual(notificationKinds({ ...active, state: 2 }, "beneficiary"), [
    "inheritance_available",
  ]);
  assert.deepEqual(notificationKinds({ ...active, state: 3 }, "beneficiary"), [
    "inheritance_available",
  ]);
  assert.deepEqual(
    notificationKinds({ ...active, state: 4 }, "beneficiary"),
    [],
  );
});
test("delivery identity changes with check-in, recovery cycle, chain or subscription", () => {
  const key = notificationKey(
    11155111,
    "0xAb",
    "recipient1",
    "deadline_reminder",
    active,
  );
  assert.equal(
    key,
    notificationKey(
      11155111,
      "0xab",
      "recipient1",
      "deadline_reminder",
      active,
    ),
  );
  for (const s of [
    { ...active, nonce: 1n },
    { ...active, deadline: 200001n },
  ])
    assert.notEqual(
      key,
      notificationKey(11155111, "0xab", "recipient1", "deadline_reminder", s),
    );
  assert.notEqual(
    key,
    notificationKey(1, "0xab", "recipient1", "deadline_reminder", active),
  );
  assert.notEqual(
    key,
    notificationKey(
      11155111,
      "0xab",
      "recipient2",
      "deadline_reminder",
      active,
    ),
  );
});
test("contact ciphertext is randomized, authenticated and rejects the wrong key", () => {
  const secret = "ab".repeat(32);
  const other = "cd".repeat(32);
  const a = encryptContact("owner@example.com", secret);
  const b = encryptContact("owner@example.com", secret);
  assert.notEqual(a, b);
  assert.equal(decryptContact(a, secret), "owner@example.com");
  assert.throws(() => decryptContact(a, other));
  const altered = Buffer.from(a, "base64");
  altered[altered.length - 1] ^= 1;
  assert.throws(() => decryptContact(altered.toString("base64"), secret));
  assert.throws(() => encryptContact("owner@example.com", "bad"));
  assert.notEqual(
    contactHash("owner@example.com", secret),
    contactHash("owner@example.com", other),
  );
  assert.ok(equalSecret(secret, secret));
  assert.ok(!equalSecret(secret, other));
});
test("wallet login signature binds the exact domain, nonce and intended message", async () => {
  const account = privateKeyToAccount(`0x${"11".repeat(32)}`);
  const input = {
    address: account.address,
    chainId: 11155111,
    domain: "localhost:3000",
    uri: "http://localhost:3000",
    version: "1" as const,
    nonce: "abc12345",
    issuedAt: new Date("2026-10-30T00:00:00Z"),
  };
  const message = createSiweMessage(input);
  const signature = await account.signMessage({ message });
  assert.ok(
    await verifyMessage({ address: account.address, message, signature }),
  );
  assert.ok(
    !(await verifyMessage({
      address: account.address,
      message: createSiweMessage({ ...input, domain: "attacker.example" }),
      signature,
    })),
  );
  assert.ok(
    !(await verifyMessage({
      address: account.address,
      message: createSiweMessage({ ...input, nonce: "newnonce123" }),
      signature,
    })),
  );
});
