# Verification record — 2026-10-30

## Current update

### Follow-up environment validation

Email troubleshooting follow-up: the configured sender uses Resend's testing domain. The user confirmed trying a recipient different from their Resend account email, explaining rejection under the provider's testing rules. The sending-only API key cannot inspect provider logs/domains; no message was sent by the agent. Safe provider-error translation and cleanup of definitively rejected verification enrollments were added. Frontend/security/Postgres suite: 24 passing tests after the change, including recipient-rule explanations and private error-detail redaction. Successful real email delivery still needs the user's retry with an eligible recipient or verified sending domain.

After the user supplied environment values, `node scripts/check-setup.mjs --live` confirmed the server RPC serves chain 11155111, the configured factory has deployed bytecode and responds to `vaultCount()`, and all six `silent_*` Supabase tables are readable using the configured server credentials. Encryption-key format and matching frontend/CRE notification tokens passed local checks. These probes revealed no credential values and performed no data mutations or message sends. Table access does not establish full authentication/email delivery acceptance.

The working `cre/config/recovery.json` was missing and has now been created from the example with the verified factory, observe mode and notifications disabled. A duplicate registry YAML entry was removed. `CRE_ETH_PRIVATE_KEY` remains blank. The local setup checker passes; the notification endpoint must still be configured before enabling requests. Real email, provider webhook delivery and official CRE CLI execution are still unverified.

No public-chain transaction, app publication, email send or CRE deployment was performed by the coding agent. The user's existing environment files were preserved. Local state changes used isolated test accounts only.

| Check | Result |
| --- | --- |
| Solidity compile and bytecode tests | PASS, 21 actual-contract tests; runtime sizes unchanged |
| Frontend unit/security/Postgres tests | PASS, 24 tests including actual PGlite PostgreSQL migration, RLS grants, consumed nonces, verification, delivery races, webhook ordering, ciphertext integrity, wallet signatures, ENSv2 calldata and safe email-error handling |
| CRE policy/official SDK tests | PASS, 12 tests, including observe mode, secret-backed HTTP capability and notification failure isolation |
| TypeScript | PASS, frontend and CRE |
| ESLint | PASS |
| Next.js production build | PASS, existing pages plus notification pages and authenticated API routes |
| CRE WASM compilation | PASS, official SDK/Javy pipeline |
| Browser suite | PASS, 3 tests: responsive/disconnected UI, full actual local-chain recovery and claims, independent wallet-free vault link plus notification setup/auth error states |
| Frontend dependency audit | PASS, zero reported vulnerabilities after compatible updates and restoring development tools |
| Supabase MCP | Registered requested project URL; OAuth succeeded; `codex mcp list` reports enabled/OAuth |
| Official Supabase skill | Installed `supabase-postgres-best-practices`; schema/security guidance read |

Real Sepolia reads resolved `bamboo.eth` to the user's registered owner address and returned a real resolver, registry owner and ENSv2 marker/root. No ENS subname registration, record write or permission grant was submitted. Calldata tests do not replace these wallet-controlled acceptance steps.

Both official Nox and Nym worker paths returned Sepolia `eth_chainId` responses through the harness. Subsequent block/balance requests timed out. This is partial transport evidence, **not a verified end-to-end anonymous vault dashboard**. The UI supports explicit retry/transport selection and public-mode consent; public answers are never relabeled anonymous. See ignored `.local/integration-probe.json` for the most recent probe. The probe is read-only.

Newly registered Supabase tools were unavailable in the already-running session (`unknown MCP server`), despite successful CLI OAuth. Start a fresh Codex session to load them, or apply the reviewed migration in the project's SQL Editor. No hosted schema or data was changed. Runtime Supabase credentials, Resend account/sender/API/webhook credentials, HTTPS notification endpoint and a successful official CRE CLI run remain external steps. See [notifications.md](notifications.md).

The independent audit and real testnet/browser-wallet acceptance remain outstanding. Production frontend audit success is not an audit of the separate legacy Ganache/development or CRE dependency trees. Those tools remain test-only/pinned and need their own dependency review before operational use. Normal test output includes Ganache's Node native-extension fallback and a local HTTP listener warning; the tests use the JavaScript fallback and shut down their isolated servers.

## Original verification — 2026-10-27 (historical)

The record below describes the original implementation and is superseded by the update above where features or results differ.

No public-network transaction, contract deployment, workflow registration or app publication was performed. All state-changing verification used isolated, automatically generated local test accounts. No user keys were supplied or stored.

## Implemented and checked locally

| Check | Result / scope |
| --- | --- |
| Solidity compilation | PASS, solc 0.8.24, optimizer 200, Paris; exact pinned OpenZeppelin 5.4.0 imports |
| Contract runtime sizes | Vault 12,709 bytes; factory 17,922 bytes; receiver 1,691 bytes, all below EIP-170 |
| Contract tests | PASS, 21 tests against actual compiled bytecode on in-memory Ganache |
| Frontend unit tests | PASS, 13 tests: graph/config validation and serialization, ENS pin prerequisites, transaction receipt/error behavior, exact token amount parsing |
| TypeScript | PASS for frontend and separate CRE project |
| ESLint | PASS for application source; generated build directories excluded |
| Production Next.js build | PASS; landing plus all nine workspace routes and default not-found output |
| CRE policy / official SDK unit harness | PASS, 8 tests; fixtures are explicitly confined to test code |
| CRE compilation | PASS, official SDK `cre-compile` → Javy 8.1.0 → `.local/recovery.wasm` |
| Browser tests | PASS, 2 Playwright/Edge tests: responsive landing/disconnected workspace and full actual local-chain recovery flow |

Contract coverage includes factory isolation, owner authorization, invalid allocations/addresses/quorums, native/ERC-20 deposits/withdrawals, missing approvals, taxed-token rejection, unsolicited donation exclusion, negative balance changes, strict heartbeat boundary, recovery challenge/cancel/pause, guardian nonces and duplicates, authorization, vesting, shared emergency accounting, disabled emergency mode, tiny-snapshot rounding, duplicate automation, native claim reentrancy, and CRE forwarder/metadata/chain/receiver/provenance checks.

The browser flow creates a real vault with 60/40 allocations, verifies graph edits are persisted onchain, deposits actual local ETH, tests wallet rejection without a balance change, submits a check-in, cancels one pending recovery, starts a second request, approves and authorizes it, claims a scheduled tranche and emergency remainders from separate wallets, and checks COMPLETED and zero vault balance. Events and receipt references come from that chain. Desktop/mobile screenshots are saved under ignored `.local/`; they contain isolated test account addresses only.

Ganache's native µWS extension does not match the host Node 24 ABI; its documented JavaScript fallback ran successfully. Its temporary HTTP test server also emitted a listener-count warning under the browser test workload; it was terminated after verification. On this Windows sandbox, the tsx runner needed permission to read the local user profile, the official Javy compiler needed network/user-cache access, and final Playwright execution needed normal process permissions to clean up its own servers. These were verification environment constraints, not skipped contract tests.

## Actual external read probes

- **ENSv2 deployment:** a real browser RPC call to Sepolia's canonical Universal Resolver returned its v2 marker and root registry `0xB458D6a3a77919449d03e7A6903C26827c1eC43f`. This value was observed from a live read, not used as a hardcoded app deployment.
- **ENS identity:** an actual lookup of `ens.eth` on that testnet returned no Ethereum address record. The identity layer correctly refused to register an unresolved beneficiary. This does not prove that a beneficiary name you own resolves; use your registered Sepolia name and actual record for the full identity demo.
- **Anon-RPC:** the official harness/Nox path was attempted with browser network access. The upstream chain request timed out (`signal timed out`), and status reported failed. **No successful anonymized RPC response was verified.** A public RPC response was never substituted or relabeled as anonymous.

`node scripts/probe-integrations.mjs` reruns the isolated read-only sponsor probes; `--ens-only` skips anonymity-network startup. It uses the same application integration code, writes only public results to ignored `.local/integration-probe.json`, and never connects a signing wallet. A working browser/network path is required. Unit tests cannot prove metadata anonymity.

## External steps still required

| Step | Exact dependency / evidence needed |
| --- | --- |
| Public vault deployment | You approve a real Remix factory deployment on Sepolia; fill factory address and deployment block |
| Complete Sepolia protocol demo | Separate funded owner/guardian/beneficiary wallets; actual receipts and explorer logs |
| ENS name resolution / primary-name demo | Registered Sepolia name with a real Ethereum address record; reverse record if demonstrating primary names |
| ENSv2 subname write | Parent subregistry exists; connected wallet holds its registrar role; authorized resolver setup and gas |
| Anon-RPC successful request | Reachable Nox/KPS/WebRTC network and compatible upstream RPC; a real successful probe with anonymous status |
| CRE CLI simulation | Your CLI login, deployed simulation receiver/correct forwarder, RPC and funded test-only simulation key |
| CRE DON execution | Approved account/registration/activation/funding, correct DON-forwarder receiver, real execution ID/logs and receipt |
| Hosted application | Your explicit approval and configured host; no hosting was published |

## Untested or intentionally limited

- Actual Remix browser compilation/deployment and explorer verification were not performed; the same compiler/versioned import sources compile locally and precise Remix settings are documented.
- No real browser-extension signing, hardware wallet, multisig/smart-account or WalletConnect cross-device run. Local browser tests use an explicitly isolated injected wallet backed by real Ganache execution.
- Browser ERC-20 approval/deposit flow is implemented, with standard/taxed/insolvent-token contract tests; the complete browser scenario uses native ETH.
- No live ENS registration, permission delegation or resolver write was sent. Subregistry creation and resolver deployment/record administration use the official ENS app outside this MVP.
- No successful anonymity-network request or real CLI/DON workflow execution. WASM compilation and SDK harness tests do not establish those results.
- No fuzzing, formal proof, independent audit, production incident exercise or large-scale load/reorg test.
- Schedules are shared across the vault's beneficiaries. Arbitrary graph predicates, NFT custody, external-wallet asset recovery, private offchain liveness, owner rotation and recovery of unsupported donations are not implemented.
- Activity is a bounded recent event viewer. CRE periodically covers only the configured batch. No notifications or legal proof-of-death mechanism is supplied.

Read [security.md](security.md) for consequences and trust assumptions. This record distinguishes implementation and local evidence from public-network acceptance.
