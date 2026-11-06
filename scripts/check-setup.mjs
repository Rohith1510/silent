// Read-only local configuration checker. Never prints credential values or sends messages/transactions.
import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { createRequire } from "node:module";

const localRequire = createRequire(path.resolve("frontend/package.json"));
const frontend = fs.existsSync("frontend/.env.local")
  ? parseEnv(fs.readFileSync("frontend/.env.local", "utf8"))
  : {};
const cre = fs.existsSync("cre/.env")
  ? parseEnv(fs.readFileSync("cre/.env", "utf8"))
  : {};
let failures = 0;
function report(name, okay, detail) {
  if (!okay) failures++;
  console.log(
    `${okay ? "PASS" : "NEEDS SETUP"} ${name}${detail ? `: ${detail}` : ""}`,
  );
}
const required = [
  "NEXT_PUBLIC_VAULT_FACTORY_ADDRESS",
  "APP_ORIGIN",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "SERVER_RPC_URL",
  "NOTIFICATION_ENCRYPTION_KEY",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "RESEND_WEBHOOK_SECRET",
  "CRE_NOTIFICATION_TOKEN",
];
for (const name of required) report(name, !!frontend[name]?.trim());
report(
  "Notification encryption format",
  /^[0-9a-f]{64}$/i.test(frontend.NOTIFICATION_ENCRYPTION_KEY || ""),
  "must be 32 random bytes encoded as hex",
);
report(
  "CRE notification token",
  !!frontend.CRE_NOTIFICATION_TOKEN &&
    frontend.CRE_NOTIFICATION_TOKEN.length >= 32 &&
    frontend.CRE_NOTIFICATION_TOKEN === cre.CRE_NOTIFICATION_TOKEN,
  "frontend server and cre/.env must match",
);
report("CRE RPC configured", !!cre.CRE_SEPOLIA_RPC_URL);
let config;
try {
  config = JSON.parse(fs.readFileSync("cre/config/recovery.json", "utf8"));
} catch {
  /* Explicit missing-state report below. */
}
report(
  "CRE working config",
  !!config,
  "cre/config/recovery.json (not just the example)",
);
if (config) {
  report(
    "CRE factory consistency",
    config.factoryAddress?.toLowerCase() ===
      frontend.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS?.toLowerCase(),
  );
  report(
    "CRE observe mode",
    config.executionMode === "observe",
    "use observe for a read-only/email demo",
  );
  if (config.notifications?.enabled) {
    report(
      "CRE HTTPS notification endpoint",
      /^https:\/\//.test(config.notifications.endpoint || "") &&
        !/YOUR_|FILL_/i.test(config.notifications.endpoint || ""),
    );
  } else
    console.log(
      "INFO CRE notifications are disabled; simulation will not request email delivery.",
    );
}
if (!cre.CRE_ETH_PRIVATE_KEY)
  console.log(
    "INFO CRE_ETH_PRIVATE_KEY is blank; no signing key is needed by the workflow's observe path.",
  );
else
  console.log(
    "INFO CRE signing key is present; no transaction will be signed by this checker.",
  );
if (fs.existsSync("cre/workflows/recovery/workflow.yaml")) {
  const source = fs.readFileSync(
    "cre/workflows/recovery/workflow.yaml",
    "utf8",
  );
  report(
    "Workflow registry declaration",
    (source.match(/^\s+deployment-registry:/gm) || []).length === 1,
    "one declaration for the current staging target",
  );
}

if (process.argv.includes("--live")) {
  const { createPublicClient, http, isAddress, parseAbi } =
    localRequire("viem");
  if (frontend.SERVER_RPC_URL) {
    try {
      const client = createPublicClient({
        transport: http(frontend.SERVER_RPC_URL, {
          timeout: 12000,
          retryCount: 0,
        }),
      });
      const chainId = await client.getChainId();
      report(
        "Live server RPC chain",
        chainId === 11155111,
        `chain ID ${chainId}`,
      );
      if (isAddress(frontend.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS || "")) {
        const code = await client.getBytecode({
          address: frontend.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS,
        });
        report("Factory deployed code", !!code && code !== "0x");
        if (code && code !== "0x") {
          await client.readContract({
            address: frontend.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS,
            abi: parseAbi(["function vaultCount() view returns (uint256)"]),
            functionName: "vaultCount",
          });
          report("Factory contract read", true);
        }
      }
    } catch {
      report(
        "Live server RPC/factory",
        false,
        "request failed; credential-bearing URLs are omitted",
      );
    }
  }
  if (frontend.SUPABASE_URL && frontend.SUPABASE_SECRET_KEY) {
    const { createClient } = localRequire("@supabase/supabase-js");
    try {
      const db = createClient(
        frontend.SUPABASE_URL,
        frontend.SUPABASE_SECRET_KEY,
        {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) =>
              fetch(input, { ...init, signal: AbortSignal.timeout(12000) }),
          },
        },
      );
      for (const table of [
        "silent_challenges",
        "silent_sessions",
        "silent_limits",
        "silent_subscriptions",
        "silent_deliveries",
        "silent_webhook_events",
      ]) {
        const { error } = await db
          .from(table)
          .select("*", { head: true })
          .limit(1);
        report(
          `Supabase ${table}`,
          !error,
          error
            ? `read check failed (${String(error.code || "connection error").replace(/[^A-Za-z0-9_-]/g, "")}); verify migration and server key`
            : "read-only access verified",
        );
      }
    } catch {
      report(
        "Live Supabase connection",
        false,
        "check server URL/key and migration; secrets omitted",
      );
    }
  }
}
console.log(
  "INFO Email credential presence is not proof of sending or webhook delivery. This checker sends no email.",
);
process.exitCode = failures ? 1 : 0;
