// Translate provider errors without exposing recipient addresses, credentials or raw request bodies.
export type EmailProviderError = {
  name?: string;
  message?: string;
  statusCode?: number | null;
};
export function emailFailure(error?: EmailProviderError | null) {
  const text = error?.message?.toLowerCase() || "";
  const code = error?.name || "";
  const definitelyRejected =
    typeof error?.statusCode === "number" &&
    error.statusCode >= 400 &&
    error.statusCode < 500 &&
    ![408, 409].includes(error.statusCode);
  if (
    /only send testing emails|only.*testing.*own email|testing.*email address associated/.test(
      text,
    )
  )
    return {
      status: 422,
      definitelyRejected,
      reason: "test_recipient_restricted",
      message:
        "Resend's testing sender can email only the address on your Resend account. Use that recipient, or verify your own sending domain to email other people.",
    };
  if (
    /domain.*not verified|domain.*isn't verified|domain.*not been verified/.test(
      text,
    )
  )
    return {
      status: 503,
      definitelyRejected,
      reason: "sender_domain_unverified",
      message:
        "The EMAIL_FROM domain is not verified in this Resend account. Verify that exact domain in Resend, or use onboarding@resend.dev for testing with your own account email.",
    };
  if (
    code === "invalid_from_address" ||
    /invalid.*from.*address|from.*address.*invalid|invalid.*from.*field/.test(
      text,
    )
  )
    return {
      status: 503,
      definitelyRejected,
      reason: "invalid_sender",
      message:
        "EMAIL_FROM is invalid. Use an email address or Display Name <address@verified-domain>, then restart Next.js.",
    };
  if (
    [
      "invalid_api_key",
      "missing_api_key",
      "restricted_api_key",
      "suspended_api_key",
      "invalid_permission",
      "invalid_access",
    ].includes(code) ||
    /api key.*invalid|api key.*not active|api key.*suspend/.test(text)
  )
    return {
      status: 503,
      definitelyRejected,
      reason: "email_credentials",
      message:
        "Resend rejected the email credentials or permissions. Check that RESEND_API_KEY is active, permits sending from EMAIL_FROM, and is loaded by Next.js.",
    };
  if (
    ["daily_quota_exceeded", "monthly_quota_exceeded"].includes(code) ||
    /daily.*quota|monthly.*quota/.test(text)
  )
    return {
      status: 503,
      definitelyRejected,
      reason: "email_quota",
      message:
        "The Resend sending quota has been reached. Check the account's usage limits before trying again.",
    };
  if (code === "rate_limit_exceeded" || error?.statusCode === 429)
    return {
      status: 429,
      definitelyRejected,
      reason: "email_rate_limit",
      message:
        "Resend is rate limiting email requests. Wait before requesting another verification message.",
    };
  if (
    ["invalid_idempotent_request", "concurrent_idempotent_requests"].includes(
      code,
    )
  )
    return {
      status: 409,
      definitelyRejected: false,
      reason: "email_request_in_progress",
      message:
        "An email request is already in progress or conflicts with an earlier request. Wait, check the provider logs and your inbox before retrying.",
    };
  return {
    status: 502,
    definitelyRejected: false,
    reason: "email_acceptance_unknown",
    message:
      "Resend did not confirm email acceptance. Check the failed POST /emails entry in Resend Logs for its response; do not assume the message was sent.",
  };
}
