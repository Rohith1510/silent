import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
const localBun = path.resolve("node_modules/@oven/bun-windows-x64/bin/bun.exe");
const bun =
  process.platform === "win32" && fs.existsSync(localBun) ? localBun : "bun";
const command = process.argv[2] || "test";
const args =
  command === "compile"
    ? [
        "run",
        "node_modules/@chainlink/cre-sdk/bin/cre-compile.ts",
        "workflows/recovery/main.ts",
        "../.local/recovery.wasm",
      ]
    : ["test", "workflows"];
const child = spawn(bun, args, {
  cwd: "cre",
  stdio: "inherit",
  windowsHide: true,
  env: {
    ...process.env,
    PATH: `${path.dirname(bun)}${path.delimiter}${process.env.PATH || ""}`,
  },
});
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code || 0;
});
