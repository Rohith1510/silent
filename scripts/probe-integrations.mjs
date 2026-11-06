import fs from "node:fs";
import http from "node:http";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { chromium } from "@playwright/test";

fs.mkdirSync(".local/probe", { recursive: true });
if (fs.existsSync("frontend/.env.local"))
  process.loadEnvFile("frontend/.env.local");
const localBun = path.resolve("node_modules/@oven/bun-windows-x64/bin/bun.exe");
const bun =
  process.platform === "win32" && fs.existsSync(localBun) ? localBun : "bun";
const env = {
  "process.env.SILENT_PROBE_ENS_ONLY": JSON.stringify(
    process.argv.includes("--ens-only") ? "true" : "false",
  ),
  "process.env.SILENT_PROBE_NETWORK": JSON.stringify(
    process.argv.includes("--nym") ? "nym" : "nox",
  ),
  "process.env.NEXT_PUBLIC_CHAIN_ID": JSON.stringify("11155111"),
  "process.env.NEXT_PUBLIC_RPC_URL": JSON.stringify(
    process.env.NEXT_PUBLIC_RPC_URL ||
      "https://ethereum-sepolia-rpc.publicnode.com",
  ),
  "process.env.NEXT_PUBLIC_ANON_RPC_ENABLED": JSON.stringify("true"),
  "process.env.NEXT_PUBLIC_ANON_RPC_URL": JSON.stringify(
    process.argv.includes("--public-upstream")
      ? "https://ethereum-sepolia-rpc.publicnode.com"
      : process.env.NEXT_PUBLIC_ANON_RPC_URL ||
          process.env.NEXT_PUBLIC_RPC_URL ||
          "https://ethereum-sepolia-rpc.publicnode.com",
  ),
  "process.env.NEXT_PUBLIC_ANON_BOOTSTRAP_RPC_URL": JSON.stringify(
    "https://ethereum-rpc.publicnode.com",
  ),
  "process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS": JSON.stringify(
    process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS || "",
  ),
  "process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK": JSON.stringify("0"),
  "process.env.NODE_ENV": JSON.stringify("production"),
};
const args = [
  "build",
  "scripts/browser-probe.ts",
  "--target=browser",
  "--outfile=.local/probe/probe.js",
];
for (const [key, value] of Object.entries(env))
  args.push("--define", `${key}=${value}`);
const compiled = spawnSync(bun, args, { stdio: "inherit", windowsHide: true });
if (compiled.status !== 0) process.exit(compiled.status || 1);
const server = http.createServer((req, res) => {
  if (req.url === "/probe.js") {
    res.setHeader("Content-Type", "text/javascript");
    res.end(fs.readFileSync(".local/probe/probe.js"));
  } else {
    res.setHeader("Content-Type", "text/html");
    res.end(
      '<!doctype html><html><body><pre>Running real, read-only sponsor probes…</pre><script type="module" src="/probe.js"></script></body></html>',
    );
  }
});
await new Promise((resolve) => server.listen(3138, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("Browser probe error:", e.message));
  await page.goto("http://127.0.0.1:3138");
  await page.waitForFunction(() => window.probeFinished === true, undefined, {
    timeout: 300000,
  });
  const result = await page.evaluate(() => window.integrationProbe);
  fs.writeFileSync(
    ".local/integration-probe.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
