import { Runner } from "@chainlink/cre-sdk";
import type { Config } from "./policy";
import { initWorkflow } from "./workflow";

export async function main() {
  // Use CRE's built-in WASM-safe JSON parser. Calling Zod from a custom
  // subscription-phase parser fails in the current Javy runtime.
  const runner = await Runner.newRunner<Config>();
  await runner.run(initWorkflow);
}
