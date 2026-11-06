import {
  cre,
  EVMClient,
  TxStatus,
  bytesToHex,
  encodeCallMsg,
  getNetwork,
  hexToBase64,
  LAST_FINALIZED_BLOCK_NUMBER,
  LATEST_BLOCK_NUMBER,
  logTriggerConfig,
  HTTPClient,
  consensusIdenticalAggregation,
  ok,
  prepareReportRequest,
  type EVMLog,
  type Runtime,
  type NodeRuntime,
  type Workflow,
} from "@chainlink/cre-sdk";
import {
  decodeEventLog,
  decodeFunctionResult,
  encodeFunctionData,
  toEventSelector,
  zeroAddress,
  type Address,
} from "viem";
import { SilentSovereignFactoryAbi as factoryAbi } from "../../frontend-abi/factory";
import { SilentSovereignVaultAbi as vaultAbi } from "../../frontend-abi/vault";
import { encodeRecoveryReport, type Config } from "./policy";

function evm(config: Config) {
  const network = getNetwork({
    chainFamily: "evm",
    chainSelectorName: config.chainSelectorName,
  });
  if (!network)
    throw new Error("The installed CRE SDK does not support this network");
  return new EVMClient(network.chainSelector.selector);
}
function read(runtime: Runtime<Config>, to: Address, data: `0x${string}`) {
  return bytesToHex(
    evm(runtime.config)
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to, data }),
        blockNumber:
          runtime.config.finality === "finalized"
            ? LAST_FINALIZED_BLOCK_NUMBER
            : LATEST_BLOCK_NUMBER,
      })
      .result().data,
  );
}
export function notifyVault(runtime: Runtime<Config>, vault: Address) {
  if (!runtime.config.notifications?.enabled) return;
  // SDK 1.23 exposes getSecret on the DON Runtime. Pass it only to the node-level HTTP call.
  const credential = runtime
    .getSecret({ id: "NOTIFICATION_DISPATCH_TOKEN" })
    .result().value;
  if (!credential || credential.length < 32)
    throw new Error("Configure the notification credential in CRE secrets.");
  const result = runtime
    .runInNodeMode(
      (node: NodeRuntime<Config>, address: string, secret: string) => {
        const body = Buffer.from(
          JSON.stringify({ vault: address, chainId: node.config.chainId }),
        ).toString("base64");
        const reply = new HTTPClient()
          .sendRequest(node, {
            url: node.config.notifications!.endpoint,
            method: "POST",
            body,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${secret}`,
            },
            // SDK 1.23 protobuf JSON uses store/maxAge; newer docs use a different field spelling.
            cacheSettings: { store: true, maxAge: "10s" },
          })
          .result();
        if (!ok(reply))
          throw new Error(
            `Notification endpoint returned HTTP ${reply.statusCode}`,
          );
        return { statusCode: reply.statusCode };
      },
      consensusIdenticalAggregation<{ statusCode: number }>(),
    )(vault, credential)
    .result();
  runtime.log(
    `notificationEndpointHTTP=${result.statusCode}; email acceptance/delivery is recorded separately by the application`,
  );
}
export function inspectVault(runtime: Runtime<Config>, vault: Address): string {
  const c = runtime.config;
  const registered = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "isVault",
    data: read(
      runtime,
      c.factoryAddress as Address,
      encodeFunctionData({
        abi: factoryAbi,
        functionName: "isVault",
        args: [vault],
      }),
    ),
  });
  if (!registered)
    throw new Error("Ignoring an address outside the configured factory");
  const action = decodeFunctionResult({
    abi: vaultAbi,
    functionName: "eligibleAction",
    data: read(
      runtime,
      vault,
      encodeFunctionData({ abi: vaultAbi, functionName: "eligibleAction" }),
    ),
  });
  const nonce = decodeFunctionResult({
    abi: vaultAbi,
    functionName: "recoveryNonce",
    data: read(
      runtime,
      vault,
      encodeFunctionData({ abi: vaultAbi, functionName: "recoveryNonce" }),
    ),
  });
  const deadline = decodeFunctionResult({
    abi: vaultAbi,
    functionName: "deadline",
    data: read(
      runtime,
      vault,
      encodeFunctionData({ abi: vaultAbi, functionName: "deadline" }),
    ),
  });
  const state = decodeFunctionResult({
    abi: vaultAbi,
    functionName: "state",
    data: read(
      runtime,
      vault,
      encodeFunctionData({ abi: vaultAbi, functionName: "state" }),
    ),
  });
  runtime.log(
    `vault=${vault} state=${state} deadline=${deadline} nonce=${nonce} eligibleAction=${action}`,
  );
  try {
    notifyVault(runtime, vault);
  } catch (error) {
    runtime.log(
      `notificationFailed=${error instanceof Error ? error.message : "HTTP capability error"}; contract safeguards are unchanged`,
    );
  }
  if (c.executionMode === "observe") {
    runtime.log("Observe mode: no report or onchain transaction requested");
    return "observed";
  }
  if (action === 0) return "ineligible";
  const payload = encodeRecoveryReport(c, vault, action, nonce);
  const report = runtime.report(prepareReportRequest(payload)).result();
  const reply = evm(c)
    .writeReport(runtime, {
      receiver: c.receiverAddress,
      report,
      gasConfig: { gasLimit: c.gasLimit },
    })
    .result();
  // A forwarder transaction may succeed even if receiver execution failed.
  if (
    reply.txStatus !== TxStatus.SUCCESS ||
    reply.receiverContractExecutionStatus === 1
  )
    throw new Error(
      `CRE delivery failed: ${reply.errorMessage || `status ${reply.txStatus}`}`,
    );
  if (!reply.txHash?.length)
    throw new Error(
      "CRE returned no transaction reference; delivery is unverified",
    );
  runtime.log(
    `forwarderDelivery=${bytesToHex(reply.txHash)}; inspect AutomationDelivered and vault events to confirm an actual transition`,
  );
  return bytesToHex(reply.txHash);
}
export function onCron(runtime: Runtime<Config>): string {
  const c = runtime.config;
  const count = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "vaultCount",
    data: read(
      runtime,
      c.factoryAddress as Address,
      encodeFunctionData({ abi: factoryAbi, functionName: "vaultCount" }),
    ),
  });
  const end =
    BigInt(c.startIndex + c.batchSize) < count
      ? BigInt(c.startIndex + c.batchSize)
      : count;
  runtime.log(
    `factoryVaultCount=${count}; processing [${c.startIndex}, ${end}); finality=${c.finality}`,
  );
  if (count > BigInt(c.startIndex + c.batchSize))
    runtime.log(
      "Additional factory vaults require separately registered workflow batches; this execution is intentionally bounded",
    );
  let inspected = 0;
  for (let i = BigInt(c.startIndex); i < end; ++i) {
    const vault = decodeFunctionResult({
      abi: factoryAbi,
      functionName: "vaultAt",
      data: read(
        runtime,
        c.factoryAddress as Address,
        encodeFunctionData({
          abi: factoryAbi,
          functionName: "vaultAt",
          args: [i],
        }),
      ),
    });
    try {
      inspectVault(runtime, vault);
      ++inspected;
    } catch (error) {
      runtime.log(
        `inspectionFailed=${vault}: ${error instanceof Error ? error.message : "Capability error"}; next cron run retries`,
      );
    }
  }
  return `Inspected ${inspected} real vaults`;
}
function onFactoryLog(runtime: Runtime<Config>, log: EVMLog): string {
  const event = decodeEventLog({
    abi: factoryAbi,
    data: bytesToHex(log.data),
    topics: log.topics.map((t) => bytesToHex(t)) as [
      `0x${string}`,
      ...`0x${string}`[],
    ],
  });
  if (event.eventName !== "VaultCreated") return "Ignored unsupported event";
  runtime.log(
    `VaultCreated tx=${bytesToHex(log.txHash)} vault=${event.args.vault}`,
  );
  return inspectVault(runtime, event.args.vault);
}
function onVaultLog(runtime: Runtime<Config>, log: EVMLog): string {
  runtime.log(
    `Vault event tx=${bytesToHex(log.txHash)} address=${bytesToHex(log.address)}; reevaluating current contract state`,
  );
  return inspectVault(runtime, bytesToHex(log.address));
}
export function initWorkflow(config: Config) {
  const handlers: Workflow<Config>[number][] = [
    cre.handler(
      new cre.capabilities.CronCapability().trigger({ schedule: config.schedule }),
      onCron,
    ),
  ];
  // Cron is the portable automation path. EVM log subscriptions are optional
  // because some local CRE simulator/runtime combinations cannot subscribe to
  // them and fail before any selected handler executes.
  if (config.enableEventTriggers) {
    const client = evm(config);
    handlers.push(
      cre.handler(
        client.logTrigger(
          logTriggerConfig({
            addresses: [config.factoryAddress as Address],
            topics: [[toEventSelector("VaultCreated(address,address,uint256)")]],
            confidence: "SAFE",
          }),
        ),
        onFactoryLog,
      ),
    );
    if (config.watchVaults.length)
      handlers.push(
        cre.handler(
          client.logTrigger(
            logTriggerConfig({
              addresses: config.watchVaults as Address[],
              topics: [
                [
                  toEventSelector("RecoveryRequested(uint256,uint256)"),
                  toEventSelector("GuardianApproved(uint256,address,bool)"),
                  toEventSelector("StateChanged(uint8,uint8,uint256)"),
                ],
              ],
              confidence: "SAFE",
            }),
          ),
          onVaultLog,
        ),
      );
  }
  return handlers;
}
