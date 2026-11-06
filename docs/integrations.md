# Sponsor integration record

Official sources were researched on 2026-10-27. Package exports were also checked against locally installed declarations. Live contract deployment, network behavior and account-dependent operations must still be verified separately.

## ENS / ENSv2

Sources: [app developer guide](https://docs.ens.domains/ensv2/tutorial-app-developers/), [library readiness](https://docs.ens.domains/web/ensv2-readiness/), [deployments](https://docs.ens.domains/learn/deployments/), [Permissioned Registry](https://docs.ens.domains/ensv2/permissioned-registry/), [registry traversal](https://docs.ens.domains/ensv2/universal-resolver-v2/), [Enhanced Access Control](https://docs.ens.domains/ensv2/enhanced-access-control/).

The current official documentation describes ENSv2 testing on Sepolia and supports viem >=2.35.0. SilentSovereign uses viem's Sepolia Universal Resolver deployment metadata instead of pinning implementation addresses. `getEnsAddress`, `getEnsName` and `getEnsResolver` perform real onchain reads; no name/address fixtures are shipped in application code. Primary names are forward-checked.

An explicit v2 check reads `isENSv2()` and `ROOT_REGISTRY()` from that resolver. For subregistry traversal the client calls documented `getSubregistry(label)` from root through each label of the parent. Ownership inspection uses `findOwner(label)` where this path exists. Legacy/unmigrated names may resolve but lack the particular v2 ownership entry; the UI reports that field unavailable instead of fabricating it.

Subname registration is limited to a real parent subregistry that exists and gives the connected wallet `hasRootRoles(ROLE_REGISTRAR,address)`, with ROLE_REGISTRAR=1. Registration calls `register(label,owner,registry,resolver,roleBitmap,expiry)` on that discovered contract. It grants the new name owner `ROLE_SET_RESOLVER` and `ROLE_SET_SUBREGISTRY`, without root/admin grants. Parent setup and resolver deployment use official Sepolia ENS Explorer.

Registration alone does not ensure resolution. The integrated onboarding panel now checks the parent's expiry, resolver Ethereum setter rights and supports documented `setAddress(DNSName,60,addressBytes)`, `grantSetterRoles` and `revokeRoles` transactions. See the [Permissioned Resolver](https://docs.ens.domains/ensv2/permissioned-resolver/) interface. A coin-type grant affects every name served by that resolver instance; explicit acknowledgement is required. Name ownership does not automatically grant resolver rights. Registration and record setting have separate receipts. Locally remembered labels are advisory; drift checks compare current resolution with the immutable allocation account until an owner updates configuration. Parent expiry/removal or registry reassignment can interrupt resolution without redirecting saved inheritance.

Existing subnames can also load and edit the standard `avatar`, `description`, `url`, `com.twitter` and `com.github` text records. Reads use `getEnsText`, while `getEnsAvatar` resolves ENSIP-12 avatar forms such as NFT references for display; changed values are DNS-encoded and sent through the Permissioned Resolver's `multicall(setText(...))`, so one confirmed transaction updates the selected public profile fields. Descriptions are limited to 160 characters. Avatar metadata and image retrieval are separate network requests and are not protected by Anon-RPC.

The profile permission panel demonstrates ENSv2 argument-scoped Enhanced Access Control. It encodes the selected `setText` setter and calls `grantSetterRoles`, or revokes `ROLE_SET_TEXT` at `keccak256(bytes(key))`. The UI then independently checks the delegate's selected text-key permission and Ethereum coin-type permission so a profile grant is never presented as address authority. Key grants still cover every name served by the resolver instance; use a dedicated resolver for per-beneficiary isolation. Profile metadata is informational and can change without changing the beneficiary address pinned in the vault.

**Boundary:** CCIP-Read HTTP gateways are disabled in the app's selected read client. Names requiring gateway resolution are unsupported here. This prevents invisible off-transport lookup traffic. ENSv2 live registration, resolver roles and live lookup were not established just by reading docs or building the frontend; use the Privacy probe and Identity Explorer with your actual Sepolia names.

## Ethereum Foundation Anon-RPC

Sources: [official wallet/app integration guide](https://ethereum.github.io/anon-rpc/wallets/), [published anonymizing networks](https://ethereum.github.io/anon-rpc/adopters/), [normative specification](https://ethereum.github.io/anon-rpc/spec/).

Installed official `@anon-rpc/browser-harness` 0.3.3 exports `AnonRpcWorker`, `RpcError`, and WorkerInit types. The implementation uses its actual `new AnonRpcWorker({address,preExisting:{rpcProvider}})`, `ready`, `fetch`, `close` APIs.

The selected Nox specifier is the officially listed **Sepolia** deployment `0x35133267A8F7EC35046a83DCA0f4Ca8A6e1b7A9A`. This is sponsor infrastructure, not an invented project deployment. The bootstrap provider therefore serves Sepolia. The harness reads worker hash/resolvers, verifies fetched worker bytes and owns the null-origin sandboxed iframe/Web Worker and KPS capability bridge. No custom worker bypass is introduced.

Anonymous reads are the default on Sepolia; explicit `NEXT_PUBLIC_ANON_RPC_ENABLED=false` selects public RPC. Initialization waits for worker readiness and a real chain-ID response. Supported contract reads use `worker.fetch` through a viem custom transport. The UI offers retry and explicit public-mode consent, never an automatic downgrade. Nox and the officially listed Nym worker are available: Nym specifier `0x3aCD9742C68F6d993066Ae25533e09b9e1f60eD0` bootstraps on Ethereum mainnet, then reads the selected Sepolia endpoint. Its bootstrap RPC is configurable separately. Passthrough workers are never labeled anonymous. Request counts and latency describe actual transport responses, not a proof of network anonymity.

The client allowlists RPC read/simulation methods and denies signing/broadcast methods. Wallet connection, account discovery, gas estimation done by the wallet, signing and broadcasting stay in the wallet's transport. The integration does not hide the wallet provider's metadata. CSP changes must continue permitting the official harness's sandbox, blob Worker and network bootstrap; locking these down without testing can break it. WebRTC/KPS must be available. A secure browser origin (or localhost) is required for normal browser network capabilities.

### Threat model

| Observer                                              | What may be visible                                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| App hosting provider / analytics / browser extensions | App visit IP, resource loading, wallet connection if instrumented; no analytics are installed by this MVP      |
| Bootstrap RPC                                         | Browser IP and specifier lookup; worker hash authenticity depends on this response                             |
| Worker host / CDN                                     | Worker download timing/IP and requested bundle                                                                 |
| Anonymity network entry peer                          | Browser connection IP, timing and volume                                                                       |
| Network exit / upstream RPC                           | Destination and public query contents depending on network/TLS design; queries can contain account addresses   |
| Wallet / wallet RPC                                   | Connection identity, signing/broadcast metadata, wallet-side requests                                          |
| Blockchain observers                                  | Public addresses, deposits, configuration, guardian votes, heartbeat transactions, claims, timing and balances |

Hash verification prevents execution of unpinned bytes, not malicious code that the trusted specifier itself pins. The worker can observe or censor requests; bootstrap and specifier controllers remain trust assumptions. Mixnet availability, latency and adversarial traffic correlation are outside this app's guarantees. It does not claim zero-trace activity, invisible heartbeats, unlinkable public balances or post-quantum security.

Liveness is an infrequent onchain transaction with a configurable interval. There is no unverified private offchain extension of a contract deadline. A longer interval reduces broadcasts but delays potential recovery. A production design could add independently verifiable liveness commitments/relayers only after a separate protocol and privacy review.

**Live verification:** enable the variable, restart, open Privacy, run the RPC probe, inspect the actual successful response and transport timestamp. A build or SDK unit test cannot establish an anonymized network request. If initialization or a request fails, report the failure; never change the badge to anonymous because a conventional endpoint answered.

## Chainlink CRE

Sources: [overview](https://docs.chain.link/cre/overview), [TypeScript EVM client](https://docs.chain.link/cre/reference/sdk/evm-client-ts), [TypeScript project format](https://docs.chain.link/cre/reference/project-configuration-ts), [EVM log triggers](https://docs.chain.link/cre/guides/workflow/using-triggers/evm-log-trigger-ts), [consumer contracts](https://docs.chain.link/cre/guides/workflow/using-evm-client/onchain-write/building-consumer-contracts).

Uses official `@chainlink/cre-sdk` 1.23.0. This is not a Node cron service: it exports a CRE Runner entrypoint with CronCapability and EVMClient log-trigger handlers, compiles using the official Javy toolchain, uses capability `.result()` calls and `runtime.report`/`writeReport` for delivery.

The receiver implements ERC-165/IReceiver and validates immutable forwarder and workflow-owner metadata. It accepts the documented packed workflow identity (at least 62 bytes; the real forwarder currently includes two additional report-ID bytes). It decodes an ABI report binding actual EVM chain ID, receiver, vault, action and recovery nonce. Factory provenance and the vault state machine remain mandatory.

The workflow enumerates a configured index range (maximum 5 vaults per execution), reads real eligibility/deadline/state/nonce, logs the results, signs a report only for action 1 or 2 and checks transaction plus receiver-execution status. It watches factory creation and optionally configured vault recovery events. Register additional disjoint index batches when the factory grows; no unbounded scan or silent global automation claim is made.

Repeated schedules retry from contract state. Duplicate/stale reports have no new powers. A successful forwarder receipt can still mean the adapter performed a harmless no-op after a concurrent owner cancellation; inspect `AutomationDelivered.changed` and vault transition events before reporting a transition.

See [../cre/README.md](../cre/README.md) for installation, simulation versus DON forwarders, environment variables, funding, registration, quotas, finality and execution logs. SDK tests and WASM compilation are local verification only. Live workflow simulation/registration/execution requires your authenticated CRE environment and your authorization for broadcasts.

### Notification extension — 2026-10-30

Observe mode reads vault state and optionally calls an HTTPS notification endpoint through the SDK HTTP capability. It generates no reports and requires no receiver. Transition mode retains the independently guarded receiver. Notification failure is logged separately from transition processing. Each failing vault is isolated so a later batch entry can still be inspected.

The authenticated endpoint independently reads factory provenance, wallet roles and current vault state. Verified consent, encrypted contacts and durable delivery leases live in Supabase; Resend sends email and signs delivery callbacks. CRE uses a secret token through its SDK secret API and node-level HTTP call. SDK 1.23 cache fields are `store` and `maxAge`, verified against installed protobuf declarations; endpoint idempotency remains essential. See [notifications.md](notifications.md) for all external prerequisites and metadata boundaries.
