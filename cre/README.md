# Chainlink CRE recovery workflow

## 2026-10-30: observe mode and external email integration

The example config explicitly uses `executionMode: "observe"` and an empty receiver. It reads real deadlines/state and can call the notification API without producing a report or transaction. No receiver or broadcast is needed for this mode. `executionMode: "transitions"` needs the deployed receiver and retains the original safeguards below.

`notifications.enabled: true` uses the SDK HTTP capability to POST `{vault,chainId}` to your HTTPS endpoint. `cre/secrets.yaml` maps `CRE_NOTIFICATION_TOKEN` to `cre/.env` for simulation; use the documented secret manager for deployed execution. Credentials and email contacts never go in workflow JSON. SDK 1.23 cache fields are `store` and `maxAge`, verified against installed declarations. The endpoint uses atomic Postgres delivery leases and provider idempotency. Notification failure cannot override or block a recovery condition; a failing vault is logged without aborting the rest of the batch.

Set up [Supabase and Resend](../docs/notifications.md) first. Simulation can send real email requests even without `--broadcast`; use verified recipients you have authorized. No email or workflow deployment was performed by the coding agent. Compilation and SDK tests are not live CLI simulation results.

The YAML selects the private registry. Deployment still needs account access/service quotas. Its receiver `workflowOwner` must be the CRE organization address, not necessarily MetaMask. See the [private registry guide](https://docs.chain.link/cre/guides/operations/deploying-to-private-registry-ts). Simulation and DON forwarders differ. A one-shot simulation does not continuously monitor deadlines. The dedicated Mumbai CRE prize accepts successful official CLI simulation; see [prize-fit.md](../docs/prize-fit.md).

This is an actual TypeScript CRE workflow using `@chainlink/cre-sdk` **1.23.0**, its `Runner`, cron/EVM-log triggers, EVM capabilities, signed reports and forwarder delivery. It is not a Node cron process. No live CRE account, workflow registration or DON execution is implied by the source or unit tests.

## Local verification

From root:

```sh
npm --prefix cre ci
npm --prefix cre run check
npm run test:cre
npm run compile:cre
```

The SDK's test harness requires Bun. Windows has an optional project-local official Bun binary; `scripts/cre.mjs` locates it and supplies PATH for compiler subprocesses. On Linux/macOS install Bun normally. `test:cre` executes 12 policy/SDK unit tests. Runtime fixtures in that test directory are explicitly test doubles, not simulated successful blockchain operations in the app.

`compile:cre` uses the official `cre-compile`/Javy pipeline, including runtime compatibility and TypeScript checks, and produces ignored `.local/recovery.wasm`. The compiler may need network access and write its verified Javy download to the normal user cache. A WASM artifact is not a running workflow.

## Account/network prerequisites

Install the official [CRE CLI](https://docs.chain.link/cre/getting-started/cli-installation/windows) and check `cre version`. Use [official releases](https://github.com/smartcontractkit/cre-cli/releases) and verify checksums. Run `cre login` with your own account. Obtain deployment access/credits where required by the current Chainlink account/service policy, and confirm Sepolia EVM read/write/log capabilities in the current supported-network list. These account-dependent steps cannot be replaced by local credentials or an invented workflow ID.

The selected chain selector name is `ethereum-testnet-sepolia`; SDK lookup yields the EVM selector. Report payloads independently bind EVM **chain ID 11155111**, not the selector. Do not interchange the two numbers.

For local CLI simulation keep the following only in `cre/.env` or its process environment:

```env
CRE_SEPOLIA_RPC_URL=YOUR_REAL_SEPOLIA_RPC
CRE_ETH_PRIVATE_KEY=YOUR_FUNDED_TEST_ONLY_SIMULATION_KEY
```

Never commit or expose this key. The CLI's simulation environment may require a funded key even if you do not broadcast. The deployed workflow uses CRE-managed execution/report delivery, not a frontend key or an unrestricted backend custodian. Any real broadcast/deployment must be explicitly approved by you.

## Receiver and configuration

1. Deploy `SilentSovereignFactory` on Sepolia using Remix.
2. Obtain the right trusted forwarder from the [official forwarder directory](https://docs.chain.link/cre/guides/workflow/using-evm-client/forwarder-directory). Deploy `SilentSovereignCREReceiver(factory,forwarder,workflowOwner)`. Simulation and DON forwarders are different. Because receiver fields are immutable, use separate receiver deployments for these two modes.
3. Copy `config/recovery.example.json` to ignored `config/recovery.json`. Replace the invalid placeholder strings with actual deployed addresses. Set `startIndex`, `batchSize` (1–5) and optional `watchVaults`.
4. Verify `workflowOwner` matches the account identity that will appear in forwarder metadata. The receiver verifies sender and metadata owner, registered factory provenance, chain, destination and nonce.
5. `workflows/recovery/workflow.yaml` references the TypeScript entrypoint and this config using the documented target/artifact format. `project.yaml` supplies RPC interpolation from the secure environment.

Example CLI invocation from **cre/**:

```sh
cre workflow simulate ./workflows/recovery --target staging-settings
```

Select the cron trigger when prompted. This is a real CLI/DON-capability simulation; it is distinct from `test:cre`. For an approved transaction-producing simulation, use the documented CLI `--broadcast` option with the simulation receiver/forwarder after reviewing its behavior. Do not add that flag to default scripts. For a log-trigger simulation, provide an actual relevant transaction hash and event index as requested by your installed CLI; no invented event is supplied.

For deployment, review current [deploy access and workflow operations](https://docs.chain.link/cre/guides/operations/deploying-workflows). Once authorized and your account supports it:

```sh
cre workflow deploy ./workflows/recovery --target staging-settings
cre workflow list --target staging-settings
```

Keep the returned real workflow ID. Complete activation and key-linking/registry/funding prerequisites required by your chosen public or private registry and current CLI. The repository does not assert this has happened. Record the actual registration/activation result before calling automation live.

## Runtime behavior

- Cron enumerates a bounded range of factory indices and reads each vault's provenance, eligibility, nonce, deadline and state through EVMClient capabilities. It does not use normal `fetch`, a separate cron daemon or a privileged key to imitate CRE.
- `eligibleAction=0`: logs state and does not deliver a report.
- `1`: report requests recovery only. The vault checks strict deadline expiry, pause state and configured guardian quorum.
- `2`: report attempts authorization only. The vault checks pending state, nonce, elapsed challenge and guardian approvals.
- No report signs guardian votes, withdraws, claims or changes configuration.
- The workflow signs ABI payload `(chainId,receiver,vault,action,expectedNonce)` with `runtime.report(prepareReportRequest(...))`, then uses EVMClient.writeReport. Receiver code validates it and invokes the permissionless guarded transition.
- Write replies must pass transaction and receiver-execution status checks. Logs print the actual reply hash if present, then tell the operator to check adapter and vault events. A delivery can be a safe no-op after competing owner action; no transition is fabricated.
- Factory VaultCreated events trigger inspection. Optional `watchVaults` monitors relevant recovery/approval/state events using the SDK's base64-safe log trigger helper. Add a newly created vault to this list and redeploy the subscription if you need event-driven inspection as well as cron coverage.
- Default finality is `finalized`; this can add substantial latency to a 60-second demonstration. A deliberate `latest` config is available for testnet demos; it increases reorg/race risk, and the vault still checks current state on inclusion.

## Retries, replay and scaling

Every execution is stateless and rereads contract state. The next cron tick retries after capability/network failures. Failed deliveries surface in execution logs; they are not swallowed into success strings. Contract nonce checks, state checks and successful-report deduplication make retries safe. The receiver's deduplication marker is rolled back for ineligible no-ops so later time/quorum changes may be retried.

Only the configured `[startIndex,startIndex+batchSize)` is periodically covered. Register disjoint batches for additional factory indices. This is deliberately bounded to fit service quotas; do not claim every future vault is monitored automatically. Tune schedules, vault counts, read/write/gas limits and event subscriptions against your account's current limits and funding. A failed early vault inspection can abort that execution; partition problematic assets/vaults into separate batches for operational isolation.

## Observe an actual execution

Use `runtime.log` output from simulation or the CRE UI's workflow execution/log view. Capture execution ID, trigger, read values, eligible action, real forwarder receipt and `AutomationDelivered(vault,action,nonce,changed)` plus vault transition events. Do not infer a release from a heartbeat timeout. A beneficiary must still sign their own claim.

Local type checks/unit tests/WASM compilation are complete local evidence; CLI login, real deployments, simulation with your key, workflow registration/activation, funding and DON execution are external steps. See [../docs/verification.md](../docs/verification.md) for current status.
