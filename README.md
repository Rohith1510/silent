# silent

A noncustodial inheritance and emergency recovery MVP for ETHGlobal Mumbai 2026. Built in the existing `frontend/` Next.js application, with isolated Solidity vaults and honest integration status.

**Unaudited. Testnet only. Do not deposit real-value assets.** A working local test suite is not a security audit or proof of a live sponsor deployment.

## Partner prize integrations — judges start here

The [partner integration index](https://github.com/Rohith1510/silent/blob/main/docs/partner-integrations/README.md) maps each sponsor technology to the exact user flow, implementation lines, security boundary and live evidence:

- [ENSv2 — beneficiary identity, subnames, profiles and pinned authorization](https://github.com/Rohith1510/silent/blob/main/docs/partner-integrations/ensv2.md)
- [Ethereum Foundation Anon-RPC — private-by-default application reads](https://github.com/Rohith1510/silent/blob/main/docs/partner-integrations/anon-rpc.md)
- [Chainlink CRE — real vault monitoring and external notification orchestration](https://github.com/Rohith1510/silent/blob/main/docs/partner-integrations/chainlink-cre.md)

[View the captured Chainlink CRE CLI simulation](https://raw.githubusercontent.com/Rohith1510/silent/main/frontend/public/chainlink_workflow.png).

## Start locally

Requirements: Node.js 22+ (tested with 24), npm, an EIP-1193 browser wallet. Bun is required for the official CRE test/compiler toolchain. In PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

```sh
# Run installs only for missing dependencies / fresh checkouts.
npm ci
npm --prefix frontend ci
npm --prefix cre ci
npm run compile
# Copy .env.example to frontend/.env.local; fill in your factory address after Remix deployment.
npm --prefix frontend run dev
```

Open http://localhost:3000. Without a configured factory, the app shows **Contract not configured**. The builder remains usable for drafting; it cannot save until a real factory, owner wallet and correct network are available. No database or backend signing key is needed.

## What is implemented

- Separate factory-created, non-upgradeable vaults. The creating wallet is the immutable owner. No factory administrator, fees, cross-vault powers or developer recovery key.
- Native ETH and explicitly enabled standard ERC-20 deposits, exact token approvals, active-owner withdrawals, balance/accounting reads, pull claims, actual receipts and event history.
- `ACTIVE → RECOVERY_PENDING → RECOVERY_AUTHORIZED → RELEASING → COMPLETED`. A missed heartbeat only permits a request. Guardian quorum **and** challenge expiry are required for authorization. The owner may cancel while pending, including with a heartbeat, or pause requests.
- Up to 16 beneficiaries, 16 guardians and 16 tracked assets including native ETH. Allocations total 10,000 basis points. No guardians means recovery disabled, not unguarded recovery.
- Shared phased release schedule; accelerated remainder requires an additional delay and a fresh guardian quorum. Both modes deduct from the same ledger.
- Frozen accounted-asset snapshot at authorization, deterministic dust allocation, reentrancy protection and OpenZeppelin SafeERC20. Config/deposits/withdrawals freeze while pending.
- React Flow custom nodes, drag/connect/delete, inspector fields, branching beneficiaries, validation, zoom and auto-layout/restore. Unsupported graph edits cannot be saved. Saved plans reconcile from actual contract reads.
- Landing, dashboard, guided vault creation, builder, vault details, beneficiaries/identity explorer, recovery, activity, privacy/integrations and settings.
- Full guided ENSv2 Sepolia journey: parent `.eth` search and live pricing, official test-token funding, exact approval, registrar commit/reveal, deterministic resolver and UserRegistry deployment with factory-provenance checks, existing-name connection, permission-checked beneficiary subnames, address/profile records and drift monitoring. Vaults pin the resolved address. Offchain CCIP gateways are deliberately disabled.
- Official `@anon-rpc/browser-harness` with a Sepolia Nox specifier, sandbox/worker lifecycle, chain probe, isolated read transport and explicit public/anonymous/failed states. Wallet signing stays separate.
- Official Chainlink CRE TypeScript workflow: cron and EVM-log handlers, actual contract calls, DON-report encoding, forwarder delivery adapter, per-request nonce checks, bounded enumeration, execution logs and retry behavior.

## Verification and external dependencies

### 2026-10-30 product update

- Read-only vault links (`/dashboard#vault=0x...`) require no wallet connection. Beneficiaries includes in-app ENSv2 parent acquisition and infrastructure setup, subname onboarding, address/profile writes, scoped resolver grants/revocations, expiry checks and local identity-drift warnings. Writes require wallet approval and confirmed receipts.
- Anonymous reads default on Sepolia. Privacy uses the official Nox/Nym workers, retry diagnostics and explicit public-mode consent. User-run browser evidence shows the Nox tunnel and real Sepolia application reads; availability still depends on the external anonymity network.
- Optional email alerts use wallet-signed login, encrypted Supabase contacts, verified consent, deduplicated Resend sends and signed delivery webhooks. Hosted notification emails were received during user testing; sender-domain configuration still determines deliverability and spam placement.
- CRE has observe/email mode without a receiver and an optional guarded transition mode. An official CLI simulation inspected two real Sepolia vaults and received HTTP 200 twice from the deployed notification API. Continuous DON deployment is not claimed.
- See [notification setup](docs/notifications.md), [classical prize fit](docs/prize-fit.md), and [verification](docs/verification.md). Existing frontend `.env.local` and CRE secrets are not overwritten.

See [docs/verification.md](docs/verification.md) for the exact checked results and remaining limitations. Sponsor code being present does not establish a successful public-network integration.

| Area | Local evidence | External requirement |
| --- | --- | --- |
| Solidity | solc 0.8.24 compilation and 21 contract tests | Deploy and independently verify source in Remix/Sepolia |
| Frontend | TypeScript, lint, production build; configuration/security/Postgres tests | Browser wallet and configured factory |
| Protocol demo | Isolated chain browser suite in `e2e/` | Repeat with actual Sepolia wallets |
| ENSv2 | Complete in-app flow plus user-confirmed Sepolia beneficiary subname and Ethereum-record creation | Capture the signed receipts in the final demo; Sepolia ENSv2 deployments can reset |
| Anon-RPC | Official Nox worker tunnel and real Sepolia application responses observed in the browser | Repeat the live probe during judging; external transport latency/availability is not controlled by the app |
| CRE | Official CLI simulation compiled and inspected two real vaults; two deployed notification calls returned HTTP 200 | Partition the third vault to stay below the simulation read quota; DON deployment remains access-gated |
| Email | Hosted notification emails received during user testing; encryption, consent, leases and webhook handling implemented | Keep the verified sender/domain, API key and webhook configuration active for the demo |

## Test commands

```sh
npm run compile
npm run test:contracts
npm run test:frontend
npm run test:cre
npm --prefix cre run check
npm --prefix frontend run typecheck
npm --prefix frontend run lint
npm --prefix frontend run build
npm run test:e2e
npm run compile:cre
```

`test:contracts` uses in-memory Ganache test accounts and the actual compiled bytecode. `test:e2e` deploys a factory to a loopback-only Ganache server and launches the existing frontend with isolated environment variables and `.next-e2e` build output. No `.env.local` is overwritten. It uses installed Edge by default; change the Playwright `channel` for another installed browser. Ports 8545 and 3100 must be available. Screenshots and deployment metadata go to ignored `.local/`. The test-only injected wallet lives in `e2e/`, never in production app code.

On Windows the root has an optional local Bun executable. On other systems install Bun and ensure it is in PATH. `test:cre` uses the SDK's explicit unit-test harness; its capability fixtures are **not** DON simulation results. `compile:cre` may download the official Javy compiler to its user cache. CRE CLI simulation is a separate, authenticated step.

## Deploy using Remix

1. Upload `contracts/`, preserving directories. Open `SilentSovereignFactory.sol`.
2. Use Solidity **0.8.24**, optimizer **200 runs**, EVM **Paris**. Versioned OpenZeppelin **5.4.0** imports are included.
3. Select **Injected Provider**, verify **Sepolia / 11155111**, deploy `SilentSovereignFactory` with **no constructor arguments**.
4. Put its returned address and deployment block in `frontend/.env.local`. Restart or rebuild Next.js.
5. Connect the owner wallet, create the vault through the UI, then open deposits and recovery. The factory deploys individual vaults automatically; there is no implementation contract.
6. Optional CRE receiver: deploy `SilentSovereignCREReceiver(factory, trustedForwarder, workflowOwner)`, then configure/register the workflow. Consult the official forwarder directory; simulation and DON forwarders differ.

Detailed tuple arguments and function-by-function checks: [Remix deployment](contracts/remix-deployment.md).

## Environment variables

| Public variable | Value |
| --- | --- |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111`; `31337` only for isolated local tests |
| `NEXT_PUBLIC_RPC_URL` | Browser-safe RPC for that chain; defaults to explicitly labeled public Sepolia RPC |
| `NEXT_PUBLIC_VAULT_FACTORY_ADDRESS` | Your deployed factory; blank means no writes and no fabricated state |
| `NEXT_PUBLIC_DEPLOYMENT_BLOCK` | Actual decimal deployment block; history loads recent 10,000-block windows |
| `NEXT_PUBLIC_ANON_RPC_ENABLED` | Default/`true`: anonymous transport; explicit `false`: labeled public RPC |

Public variables are bundled into JavaScript. Never put private keys or unrestricted server API credentials there. No WalletConnect project ID is needed for browser-wallet discovery. Canonical ENS resolver addresses come from viem; v2 registry addresses are discovered from that resolver. CRE secrets belong in `cre/.env` or its secure execution environment only.

Optional notification server variables are in [frontend/.env.example](frontend/.env.example). Supabase MCP OAuth is developer access, not the application's runtime key. The official Supabase Postgres skill was installed. A subsequent read-only check with user-supplied runtime credentials verified access to all six hosted application tables; no hosted schema or data was changed by the agent. Run `node scripts/check-setup.mjs` for local checks or add `--live` for read-only RPC/factory/database probes. Email and webhook delivery require their own acceptance test.

## Complete testnet walkthrough

Follow [docs/demo.md](docs/demo.md). It covers two beneficiaries, guardian configuration through the graph, deposit, check-in, owner cancellation, a separate completed recovery, scheduled and emergency claims, ENS prerequisites, actual receipts/events, Anon-RPC verification and CRE execution prerequisites.

## Repository map

```text
frontend/      Existing Next.js application, components, typed protocol model/ABIs, tests
contracts/     Vault, factory, CRE receiver, interface, allocation library, adversarial tests
cre/           Official CRE SDK workflow, targets, configuration and unit tests
scripts/       Solidity compilation/ABI generation and isolated local verification helpers
e2e/           Actual local-chain browser flow
docs/          Architecture, security, integrations, deployment, demo and verification
```

Architecture and trust boundaries: [architecture](docs/architecture.md), [security](docs/security.md), [integrations](docs/integrations.md), [deployment](docs/deployment.md), [CRE instructions](cre/README.md).
