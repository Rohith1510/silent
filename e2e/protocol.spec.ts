import { expect, test } from "@playwright/test";
import fs from "node:fs";
import {
  createPublicClient,
  createWalletClient,
  http,
  zeroAddress,
  type Address,
} from "viem";
import { SilentSovereignFactoryAbi as fa } from "../frontend/lib/generated/SilentSovereignFactory";
import { SilentSovereignVaultAbi as va } from "../frontend/lib/generated/SilentSovereignVault";

const rpc = "http://127.0.0.1:8545";
const client = createPublicClient({ transport: http(rpc), cacheTime: 0 });
function deployment(): { factory: Address; accounts: Address[] } {
  return JSON.parse(fs.readFileSync(".local/test-deployment.json", "utf8"));
}
async function warp(timestamp: bigint) {
  await client.request({
    method: "evm_setTime",
    params: [Number(timestamp) * 1000],
  } as never);
  await client.request({ method: "evm_mine", params: [] } as never);
}
test.beforeEach(async ({ page }) => {
  const { accounts } = deployment();
  // A test-only injected wallet delegates to actual unlocked Ganache accounts.
  // It never fabricates balances, logs, signatures or receipts.
  await page.addInitScript(
    ({ rpc, accounts }) => {
      let current = accounts[0];
      let rejected = false;
      const listeners = new Map<string, Set<(data: unknown) => void>>();
      const provider = {
        isMetaMask: true,
        request: async ({
          method,
          params,
        }: {
          method: string;
          params?: unknown[];
        }) => {
          if (method === "eth_requestAccounts" || method === "eth_accounts")
            return [current];
          if (
            method === "wallet_switchEthereumChain" ||
            method === "wallet_addEthereumChain"
          )
            return null;
          if (method === "wallet_getPermissions")
            return [{ parentCapability: "eth_accounts" }];
          if (method === "wallet_requestPermissions")
            return [{ parentCapability: "eth_accounts" }];
          if (rejected && method === "eth_sendTransaction") {
            rejected = false;
            throw Object.assign(new Error("User rejected request"), {
              code: 4001,
            });
          }
          const response = await fetch(rpc, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method,
              params: params ?? [],
            }),
          });
          const body = await response.json();
          if (body.error)
            throw Object.assign(new Error(body.error.message), {
              code: body.error.code,
            });
          return body.result;
        },
        on: (event: string, callback: (data: unknown) => void) => {
          if (!listeners.has(event)) listeners.set(event, new Set());
          listeners.get(event)!.add(callback);
        },
        removeListener: (event: string, callback: (data: unknown) => void) =>
          listeners.get(event)?.delete(callback),
      };
      Object.assign(window, {
        ethereum: provider,
        __switchTestWallet: (index: number) => {
          current = accounts[index];
          listeners.get("accountsChanged")?.forEach((fn) => fn([current]));
        },
        __rejectNextTestTransaction: () => {
          rejected = true;
        },
      });
    },
    { rpc, accounts },
  );
});
test("landing and workspace are responsive and show honest disconnected states", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your legacy.",
  );
  await page.getByRole("button", { name: /A sign of life/ }).click();
  await expect(page.locator(".anatomy-detail")).toContainText(
    "never proves death",
  );
  await page.screenshot({
    path: ".local/landing-desktop.png",
    fullPage: true,
    caret: "initial",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: ".local/landing-mobile.png",
    fullPage: true,
    caret: "initial",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Your legacy is yours to protect." }),
  ).toBeVisible();
  await expect(page.getByText("Public RPC", { exact: true })).toBeHidden();
  await page.screenshot({
    path: ".local/dashboard-mobile.png",
    fullPage: true,
    caret: "initial",
  });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("link", { name: "Liveness & recovery" }),
  ).toBeVisible();
});
test("real local-chain vault creation, graph save, deposits, cancellation, recovery and claims", async ({
  page,
}) => {
  const { accounts, factory } = deployment();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/dashboard");
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Browser wallet", exact: true })
    .click();
  await page.getByRole("link", { name: "Create vault", exact: true }).click();
  await page
    .getByRole("button", { name: "Add your first beneficiary" })
    .click();
  await page
    .getByLabel("Beneficiary 1 identity", { exact: true })
    .fill(accounts[1]);
  await page
    .getByLabel("Beneficiary 1 allocation (%)", { exact: true })
    .fill("60");
  await page.getByRole("button", { name: "Add person" }).click();
  await page
    .getByLabel("Beneficiary 2 identity", { exact: true })
    .fill(accounts[2]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Liveness interval (seconds)", { exact: true })
    .fill("60");
  await page
    .getByLabel("Owner challenge period (seconds)", { exact: true })
    .fill("60");
  await page.getByRole("button", { name: "Add guardian" }).click();
  await page.getByLabel("Guardian 1", { exact: true }).fill(accounts[3]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Release interval (seconds)", { exact: true })
    .fill("60");
  await page
    .getByLabel("Emergency acceleration delay (seconds)", { exact: true })
    .fill("120");
  await page.getByRole("button", { name: "Review & create vault" }).click();
  await expect(page.getByRole("dialog")).toContainText("60%");
  await page.getByRole("button", { name: "Confirm & open wallet" }).click();
  await expect(page).toHaveURL(/\/vault$/);
  await expect(page.locator(".transaction-toast")).toContainText(/confirmed/i);
  const vault = (
    await client.readContract({
      address: factory,
      abi: fa,
      functionName: "getVaults",
      args: [accounts[0]],
    })
  ).at(-1)!;
  const read = { address: vault, abi: va } as const;
  expect(
    (await client.readContract({ ...read, functionName: "getBeneficiaries" }))
      .length,
  ).toBe(2);

  await page.getByRole("link", { name: "Inheritance builder" }).click();
  await expect(page.locator(".react-flow__node")).toHaveCount(9);
  await page.locator('.react-flow__node[data-id="guardians"]').click();
  await page.keyboard.press("Delete");
  await expect(
    page.getByRole("button", { name: "Review & save plan" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Auto-layout & restore" }).click();
  await page.getByRole("button", { name: "Liveness", exact: true }).click();
  await page
    .getByLabel("Liveness interval (seconds)", { exact: true })
    .fill("120");
  await page.getByRole("button", { name: "Review & save plan" }).click();
  await page.getByRole("button", { name: "Confirm & open wallet" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    (await client.readContract({ ...read, functionName: "rules" }))[0],
  ).toBe(120n);
  await page.screenshot({
    path: ".local/builder-desktop.png",
    fullPage: true,
    caret: "initial",
  });
  await page.getByRole("link", { name: "Beneficiaries", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Beneficiaries", level: 1 }),
  ).toBeVisible();
  const beneficiaryPage = page.locator(".beneficiaries-page");
  // The redesigned page must preserve editing, review and onchain persistence.
  // Restore the original split before the existing recovery/claims scenario.
  for (const [firstShare, secondShare] of [
    [55, 45],
    [60, 40],
  ]) {
    await page
      .getByLabel("Share (%), Beneficiary 1 allocation (%)", { exact: true })
      .fill(String(firstShare));
    await page
      .getByLabel("Share (%), Beneficiary 2 allocation (%)", { exact: true })
      .fill(String(secondShare));
    await expect(
      beneficiaryPage.locator(".beneficiaries-distribution-total"),
    ).toContainText("100%");
    await beneficiaryPage
      .getByRole("button", { name: "Safeguards", exact: true })
      .click();
    await expect(
      beneficiaryPage.getByLabel("Liveness interval (seconds)", {
        exact: true,
      }),
    ).toHaveValue("120");
    await page
      .getByRole("button", { name: "People & shares", exact: true })
      .click();
    await expect(
      beneficiaryPage.getByLabel("Share (%), Beneficiary 1 allocation (%)", {
        exact: true,
      }),
    ).toHaveValue(String(firstShare));
    await page
      .getByRole("button", { name: "Review & save plan", exact: true })
      .click();
    await expect(beneficiaryPage.getByRole("dialog")).toContainText(
      `${firstShare}%`,
    );
    await beneficiaryPage
      .getByRole("button", { name: "Confirm & open wallet" })
      .click();
    await expect(beneficiaryPage.getByRole("dialog")).toHaveCount(0);
    await expect
      .poll(
        async () =>
          (
            await client.readContract({
              ...read,
              functionName: "getBeneficiaries",
            })
          )[0].allocationBps,
      )
      .toBe(firstShare * 100);
  }
  await page.getByRole("link", { name: "My vault", exact: true }).click();
  await page.getByLabel("Amount", { exact: true }).fill("0.01");
  await page.getByRole("button", { name: "Deposit to vault" }).click();
  await expect
    .poll(() => client.getBalance({ address: vault }))
    .toBe(10000000000000000n);
  await expect(page.locator(".transaction-toast")).toContainText(/confirmed/i);
  await page.evaluate(() =>
    (
      window as unknown as { __rejectNextTestTransaction: () => void }
    ).__rejectNextTestTransaction(),
  );
  await page.getByRole("button", { name: "Deposit to vault" }).click();
  await expect(page.locator(".transaction-toast")).toContainText("declined");
  const failureDialog = page.getByRole("alertdialog", {
    name: "Transaction could not be completed",
  });
  await expect(failureDialog).toBeVisible();
  await expect(failureDialog).toContainText("declined");
  await page.keyboard.press("Escape");
  await expect(failureDialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Deposit to vault" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "View details", exact: true }).click();
  await expect(failureDialog).toBeVisible();
  await failureDialog.getByRole("button", { name: "Understood" }).click();
  expect(await client.getBalance({ address: vault })).toBe(10000000000000000n);

  await page
    .getByRole("link", { name: "Liveness & recovery", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Submit check-in", exact: true })
    .click();
  await expect(page.locator(".transaction-toast")).toContainText(/confirmed/i);
  await warp(
    (await client.readContract({ ...read, functionName: "deadline" })) + 1n,
  );
  await page
    .getByRole("button", { name: "Request recovery after deadline" })
    .click();
  await expect
    .poll(() => client.readContract({ ...read, functionName: "state" }))
    .toBe(1);
  await page
    .getByRole("button", { name: "Cancel pending recovery", exact: true })
    .click();
  await expect
    .poll(() => client.readContract({ ...read, functionName: "state" }))
    .toBe(0);
  await warp(
    (await client.readContract({ ...read, functionName: "deadline" })) + 1n,
  );
  await page
    .getByRole("button", { name: "Request recovery after deadline" })
    .click();
  await expect
    .poll(() => client.readContract({ ...read, functionName: "recoveryNonce" }))
    .toBe(2n);
  await page.evaluate(() =>
    (
      window as unknown as { __switchTestWallet: (n: number) => void }
    ).__switchTestWallet(3),
  );
  await page
    .getByRole("button", { name: "Approve recovery as guardian" })
    .click();
  await expect
    .poll(() => client.readContract({ ...read, functionName: "approvalCount" }))
    .toBe(1n);
  await warp(
    (await client.readContract({ ...read, functionName: "pendingAt" })) + 60n,
  );
  await page
    .getByRole("button", { name: "Finalize eligible recovery" })
    .click();
  await expect
    .poll(() => client.readContract({ ...read, functionName: "state" }))
    .toBe(2);
  await page
    .getByRole("button", { name: "Approve emergency acceleration" })
    .click();
  await expect
    .poll(() =>
      client.readContract({ ...read, functionName: "emergencyApprovalCount" }),
    )
    .toBe(1n);
  await page.evaluate(() =>
    (
      window as unknown as { __switchTestWallet: (n: number) => void }
    ).__switchTestWallet(1),
  );
  await page.getByRole("link", { name: "My vault", exact: true }).click();
  await page.getByRole("button", { name: "claim", exact: true }).click();
  await page
    .getByRole("button", { name: "Claim scheduled allowance", exact: true })
    .click();
  await expect
    .poll(() =>
      client.readContract({
        ...read,
        functionName: "claimed",
        args: [accounts[1], zeroAddress],
      }),
    )
    .toBe(600000000000000n);
  await warp(
    (await client.readContract({ ...read, functionName: "authorizedAt" })) +
      120n,
  );
  await page
    .getByRole("button", { name: "Claim emergency remainder", exact: true })
    .click();
  await expect
    .poll(() =>
      client.readContract({
        ...read,
        functionName: "claimed",
        args: [accounts[1], zeroAddress],
      }),
    )
    .toBe(6000000000000000n);
  await page.evaluate(() =>
    (
      window as unknown as { __switchTestWallet: (n: number) => void }
    ).__switchTestWallet(2),
  );
  await page.getByRole("button", { name: "claim", exact: true }).click();
  await page
    .getByRole("button", { name: "Claim emergency remainder", exact: true })
    .click();
  await expect
    .poll(() => client.readContract({ ...read, functionName: "state" }))
    .toBe(4);
  expect(await client.getBalance({ address: vault })).toBe(0n);
  await page.getByRole("link", { name: "Activity", exact: true }).click();
  await expect(page.locator(".activity-list")).toContainText("Claimed");
  await page.screenshot({
    path: ".local/activity-desktop.png",
    fullPage: true,
    caret: "initial",
  });
  expect(errors).toEqual([]);
});
test("read-only vault links need no wallet and notification setup stays honest", async ({
  page,
  request,
}) => {
  const { factory, accounts } = deployment();
  const vaults = await client.readContract({
    address: factory,
    abi: fa,
    functionName: "getVaults",
    args: [accounts[0]],
  });
  let vault = vaults.at(-1);
  if (!vault) {
    const wallet = createWalletClient({
      account: accounts[0],
      transport: http(rpc),
    });
    const hash = await wallet.writeContract({
      address: factory,
      abi: fa,
      functionName: "createVault",
      chain: null,
      gas: 8000000n,
      args: [
        [{ account: accounts[1], allocationBps: 10000 }],
        [accounts[3]],
        {
          heartbeatInterval: 60n,
          challengePeriod: 60n,
          releaseInterval: 60n,
          emergencyDelay: 120n,
          initialBps: 1000,
          trancheBps: 1000,
          guardianThreshold: 1,
        },
      ],
    });
    const receipt = await client.waitForTransactionReceipt({ hash });
    expect(receipt.status).toBe("success");
    vault = (
      await client.readContract({
        address: factory,
        abi: fa,
        functionName: "getVaults",
        args: [accounts[0]],
      })
    ).at(-1);
  }
  expect(vault).toBeTruthy();
  await page.goto(`/dashboard#vault=${vault}`);
  await expect(
    page
      .getByRole("banner")
      .getByRole("button", { name: "Connect wallet", exact: true }),
  ).toBeVisible();
  const state = await client.readContract({
    address: vault!,
    abi: va,
    functionName: "state",
  });
  await expect(
    page
      .getByText(
        [
          "Active",
          "Recovery pending",
          "Recovery authorized",
          "Releasing",
          "Completed",
        ][state],
        { exact: true },
      )
      .first(),
  ).toBeVisible();
  await page.getByRole("link", { name: "Email alerts", exact: true }).click();
  await expect(
    page.getByText("Not verified as deployed.", { exact: false }),
  ).toBeVisible();
  const statusResponse = await request.get("/api/status");
  expect(statusResponse.ok()).toBe(true);
  const status = (await statusResponse.json()) as {
    notificationSetup: string[];
  };
  const missingSetup = page.getByText("Notifications are not configured.", {
    exact: false,
  });
  if (status.notificationSetup.length) await expect(missingSetup).toBeVisible();
  else await expect(missingSetup).toHaveCount(0);
  const unauthorized = await request.get(
    `/api/notifications/preferences?vault=${vault}`,
  );
  expect(unauthorized.status()).toBe(401);
  const forged = await request.post("/api/notifications/dispatch", {
    data: { vault, chainId: 31337 },
  });
  expect([401, 503]).toContain(forged.status());
  await page.screenshot({
    path: ".local/notifications-desktop.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: ".local/notifications-mobile.png",
    fullPage: true,
  });
});
