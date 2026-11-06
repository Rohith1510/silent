// Read-only Resend diagnostics. No email is sent; contacts and raw provider messages are never printed.
import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { createRequire } from "node:module";
import { emailFailure } from "../frontend/lib/email-errors.ts";
const env = parseEnv(fs.readFileSync("frontend/.env.local", "utf8"));
const localRequire = createRequire(path.resolve("frontend/package.json"));
const { Resend } = localRequire("resend");
const sender =
  (env.EMAIL_FROM || "").match(/<([^<>]+)>/)?.[1] || env.EMAIL_FROM || "";
const domain = sender.trim().split("@")[1]?.toLowerCase();
console.log(
  "EMAIL_FROM syntax:",
  /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(sender.trim()) ? "valid" : "invalid",
);
console.log(
  "Sender mode:",
  domain === "resend.dev"
    ? "Resend testing domain; only the Resend account email may receive messages"
    : "custom domain; exact sender domain must be verified",
);
console.log(
  "Resend key format:",
  env.RESEND_API_KEY?.startsWith("re_")
    ? "expected prefix present"
    : "check the actual sending API key",
);
if (!process.argv.includes("--live")) process.exit(0);
const client = new Resend(env.RESEND_API_KEY);
try {
  const domains = await client.domains.list({ limit: 100 });
  if (domains.error)
    console.log(
      "Domain inspection:",
      domains.error.name === "restricted_api_key"
        ? "sending-only key cannot inspect domains; use the Resend dashboard"
        : `read denied (${domains.error.statusCode ?? "unknown"}); ${emailFailure(domains.error).reason}`,
    );
  else if (domain === "resend.dev")
    console.log("Domain verification: provider testing rules apply");
  else
    console.log(
      "Exact sender domain status:",
      domains.data?.data?.find((d) => d.name.toLowerCase() === domain)
        ?.status || "not listed in this account",
    );
  const logs = await client.logs.list({ limit: 20 });
  if (logs.error)
    console.log(
      "Log inspection:",
      `unavailable (${logs.error.name}); open Resend Logs and inspect the failed POST /emails response`,
    );
  else {
    let found = false;
    for (const entry of logs.data?.data || []) {
      if (
        entry.method !== "POST" ||
        !/\/emails\/?$/.test(entry.endpoint) ||
        entry.response_status < 400
      )
        continue;
      const detail = await client.logs.get(entry.id);
      if (detail.error || !detail.data) continue;
      const payload = detail.data.request_body;
      const request =
        typeof payload === "string" ? JSON.parse(payload) : payload;
      if (
        !request?.subject?.includes("SilentSovereign") ||
        request.from !== env.EMAIL_FROM
      )
        continue;
      const body = detail.data.response_body;
      const error = typeof body === "string" ? JSON.parse(body) : body;
      const result = emailFailure({
        ...error,
        statusCode: entry.response_status,
      });
      console.log(
        "Latest matching email rejection:",
        JSON.stringify({
          at: entry.created_at,
          status: entry.response_status,
          reason: result.reason,
          action: result.message,
        }),
      );
      found = true;
      break;
    }
    if (!found)
      console.log(
        "No matching failed SilentSovereign send was found in the recent readable logs.",
      );
  }
} catch {
  console.log(
    "Provider read check failed. Inspect Resend Logs directly; no secrets or raw error bodies are printed.",
  );
  process.exitCode = 1;
}
