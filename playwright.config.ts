import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "e2e",
  timeout: 240000,
  expect: { timeout: 25000 },
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3100",
    channel: "msedge",
    actionTimeout: 30000,
    navigationTimeout: 45000,
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/local-demo.mjs",
    url: "http://127.0.0.1:3100",
    timeout: 120000,
    reuseExistingServer: process.env.SILENT_REUSE_TEST_SERVER === "1",
  },
});
