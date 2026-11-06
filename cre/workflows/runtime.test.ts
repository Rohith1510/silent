// Official CRE SDK unit harness only. These are not live DON execution results.
import { strict as assert } from "node:assert";
import {
  addContractMock,
  EvmMock,
  HttpActionsMock,
  newTestRuntime,
  test,
} from "@chainlink/cre-sdk/test";
import { hexToBase64 } from "@chainlink/cre-sdk";
import { SilentSovereignFactoryAbi } from "../frontend-abi/factory";
import { SilentSovereignVaultAbi } from "../frontend-abi/vault";
import { configSchema } from "./recovery/policy";
import {
  initWorkflow,
  inspectVault,
  onCron,
  notifyVault,
} from "./recovery/workflow";

const factory = "0x0000000000000000000000000000000000000011";
const receiver = "0x0000000000000000000000000000000000000012";
const vault = "0x0000000000000000000000000000000000000013";
const config = configSchema.parse({
  schedule: "0 */1 * * * *",
  factoryAddress: factory,
  receiverAddress: receiver,
  chainId: 11155111,
  chainSelectorName: "ethereum-testnet-sepolia",
  watchVaults: [vault],
});
function setup(action: number) {
  const runtime = newTestRuntime(null, undefined, structuredClone(config));
  const evm = EvmMock.testInstance(16015286601757825753n);
  const f = addContractMock(evm, {
    address: factory,
    abi: SilentSovereignFactoryAbi,
  });
  f.isVault = () => true;
  f.vaultCount = () => 1n;
  f.vaultAt = () => vault;
  const v = addContractMock(evm, {
    address: vault,
    abi: SilentSovereignVaultAbi,
  });
  v.eligibleAction = () => action;
  v.recoveryNonce = () => 4n;
  v.deadline = () => 100n;
  v.state = () => (action === 1 ? 0 : 1);
  const r = addContractMock(evm, { address: receiver, abi: [] as const });
  return { runtime, f, v, r };
}
test("ineligible vault never asks the SDK to deliver a report", () => {
  const { runtime, r } = setup(0);
  r.writeReport = () => {
    throw new Error("Must not write");
  };
  assert.equal(inspectVault(runtime, vault), "ineligible");
  assert.ok(runtime.getLogs().some((log) => log.includes("eligibleAction=0")));
});
test("eligible transition signs and delivers through the official SDK capability", () => {
  const { runtime, r } = setup(1);
  let writes = 0;
  r.writeReport = () => {
    ++writes;
    return {
      txStatus: "TX_STATUS_SUCCESS",
      receiverContractExecutionStatus:
        "RECEIVER_CONTRACT_EXECUTION_STATUS_SUCCESS",
      txHash: hexToBase64(`0x${"ab".repeat(32)}`),
    };
  };
  assert.equal(inspectVault(runtime, vault), `0x${"ab".repeat(32)}`);
  assert.equal(writes, 1);
});
test("forwarder success with receiver failure is reported as a failure", () => {
  const { runtime, r } = setup(2);
  r.writeReport = () => ({
    txStatus: "TX_STATUS_SUCCESS",
    receiverContractExecutionStatus:
      "RECEIVER_CONTRACT_EXECUTION_STATUS_REVERTED",
    errorMessage: "reverted",
  });
  assert.throws(() => inspectVault(runtime, vault), /delivery failed/);
});
test("foreign contracts cannot be submitted for automation", () => {
  const { runtime, f } = setup(1);
  f.isVault = () => false;
  assert.throws(
    () => inspectVault(runtime, vault),
    /outside the configured factory/,
  );
});
test("cron enumerates a bounded real-state interface and logs the inspected count", () => {
  const { runtime } = setup(0);
  assert.equal(onCron(runtime), "Inspected 1 real vaults");
  assert.ok(runtime.getLogs().some((log) => log.includes("processing [0, 1)")));
});
test("workflow defaults to the portable cron subscription", () => {
  const handlers = initWorkflow(config);
  assert.equal(handlers.length, 1);
});
test("workflow can opt into factory and configured vault event triggers", () => {
  const handlers = initWorkflow({ ...config, enableEventTriggers: true });
  assert.equal(handlers.length, 3);
});
test("observe mode inspects actual-state interfaces without generating a report", () => {
  const { runtime, r } = setup(1);
  runtime.config.executionMode = "observe";
  r.writeReport = () => {
    throw new Error("Observe mode must not write");
  };
  assert.equal(inspectVault(runtime, vault), "observed");
  assert.ok(runtime.getLogs().some((log) => log.includes("no report")));
});
test("notification errors are observable and do not bypass or block recovery safeguards", () => {
  const { runtime } = setup(0);
  runtime.config.notifications = {
    enabled: true,
    endpoint: "https://example.com/api/notifications/dispatch",
  };
  assert.equal(inspectVault(runtime, vault), "ineligible");
  assert.ok(
    runtime.getLogs().some((log) => log.includes("notificationFailed=")),
  );
});
test("HTTP capability sends only vault identity and authenticates with a CRE secret", () => {
  const runtime = newTestRuntime(
    new Map([
      [
        "main",
        new Map([["NOTIFICATION_DISPATCH_TOKEN", "test-only-credential".repeat(3)]]),
      ],
      [
        "default",
        new Map([["NOTIFICATION_DISPATCH_TOKEN", "test-only-credential".repeat(3)]]),
      ],
    ]),
    undefined,
    {
      ...config,
      executionMode: "observe" as const,
      notifications: {
        enabled: true,
        endpoint: "https://example.com/api/notifications/dispatch",
      },
    },
  );
  let count = 0;
  HttpActionsMock.testInstance().sendRequest = (request) => {
    count++;
    assert.equal(request.method, "POST");
    assert.deepEqual(JSON.parse(Buffer.from(request.body).toString()), {
      vault,
      chainId: 11155111,
    });
    assert.ok(request.headers.Authorization.startsWith("Bearer test-only"));
    assert.equal(request.cacheSettings?.store, true);
    return {
      statusCode: 200,
      body: Buffer.from('{"processed":true}').toString("base64"),
    };
  };
  notifyVault(runtime, vault);
  assert.equal(count, 1);
  assert.ok(
    runtime
      .getLogs()
      .some((log) => log.includes("notificationEndpointHTTP=200")),
  );
});
