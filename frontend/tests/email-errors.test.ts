import { test } from "node:test";
import assert from "node:assert/strict";
import { emailFailure } from "../lib/email-errors";

test("provider testing restrictions explain the actual recipient rule without leaking the account email", () => {
  const result = emailFailure({
    name: "validation_error",
    statusCode: 403,
    message:
      "You can only send testing emails to your own email address (private@example.com).",
  });
  assert.equal(result.reason, "test_recipient_restricted");
  assert.equal(result.status, 422);
  assert.ok(result.definitelyRejected);
  assert.ok(!result.message.includes("private@example.com"));
});
test("unverified sender, invalid key, quota and throttling have separate recovery instructions", () => {
  assert.equal(
    emailFailure({
      statusCode: 403,
      message: "The example.com domain is not verified.",
    }).reason,
    "sender_domain_unverified",
  );
  assert.equal(
    emailFailure({
      name: "validation_error",
      statusCode: 401,
      message: "API key is invalid",
    }).reason,
    "email_credentials",
  );
  assert.equal(
    emailFailure({ name: "monthly_quota_exceeded", statusCode: 429 }).reason,
    "email_quota",
  );
  assert.equal(
    emailFailure({ name: "rate_limit_exceeded", statusCode: 429 }).status,
    429,
  );
  assert.equal(
    emailFailure({ name: "invalid_from_address", statusCode: 422 }).reason,
    "invalid_sender",
  );
});
test("ambiguous network failures and concurrent sends preserve pending verification and redact raw details", () => {
  const result = emailFailure({
    name: "application_error",
    statusCode: null,
    message:
      "Fetch failed https://example.com?key=re_secret recipient=private@example.com",
  });
  assert.equal(result.reason, "email_acceptance_unknown");
  assert.equal(result.definitelyRejected, false);
  assert.ok(!result.message.includes("re_secret"));
  assert.ok(!result.message.includes("private@example.com"));
  assert.equal(
    emailFailure({ name: "concurrent_idempotent_requests", statusCode: 409 })
      .definitelyRejected,
    false,
  );
  assert.equal(emailFailure(null).definitelyRejected, false);
});
