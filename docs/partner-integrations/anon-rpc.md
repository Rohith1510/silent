# Ethereum Foundation Anon-RPC — private-by-default inheritance reads

**Prize:** [Ethereum Foundation — Best Use of Anon-RPC](https://ethglobal.com/events/mumbai/prizes/ethereum-foundation)

Inheritance dashboards reveal balances, beneficiary relationships, claimable amounts and liveness state. silent routes supported application reads through the official Anon-RPC browser harness by default, while keeping wallet signing and public broadcasts separate.

## Product flow

1. The read-transport provider starts in anonymous mode when `NEXT_PUBLIC_ANON_RPC_ENABLED` is not `false`.
2. The official browser harness loads the selected hash-verified worker.
3. The app waits for `worker.ready` and a real Sepolia chain response before showing Anonymous.
4. A viem custom transport sends only allowlisted read methods through `worker.fetch`.
5. Vault configuration, balances, events, ENS resolution and beneficiary claim previews consume the shared read client.
6. If the network fails, reads fail visibly. Public RPC requires an explicit confirmation and receives a Public label.
7. Wallet connection, signing and transaction broadcasting remain with the injected wallet provider.

## Exact code map

| Capability | Direct code link | What to review |
| --- | --- | --- |
| Official package | [frontend/package.json](https://github.com/Rohith1510/silent/blob/main/frontend/package.json#L11-L15) | Uses `@anon-rpc/browser-harness`, not a normal RPC endpoint labeled anonymous. |
| Published worker/specifier selection | [privacy.ts — networks](https://github.com/Rohith1510/silent/blob/main/frontend/lib/privacy.ts#L24-L32) | Nox is the Sepolia path; Nym is also exposed with its documented bootstrap boundary. |
| RPC method allowlist | [privacy.ts — allowed reads](https://github.com/Rohith1510/silent/blob/main/frontend/lib/privacy.ts#L34-L50) | Read/simulation methods only; account access, signing and broadcasting are excluded. |
| Official worker lifecycle | [privacy.ts — harness construction](https://github.com/Rohith1510/silent/blob/main/frontend/lib/privacy.ts#L69-L116) | Dynamic official import, worker construction, timeout, readiness and chain verification. |
| viem transport over `worker.fetch` | [privacy.ts — custom transport](https://github.com/Rohith1510/silent/blob/main/frontend/lib/privacy.ts#L117-L174) | Every supported request is encoded as JSON-RPC and delivered through the harness; failures are not silently downgraded. |
| Anonymous-by-default provider | [providers.tsx — transport state](https://github.com/Rohith1510/silent/blob/main/frontend/components/providers.tsx#L39-L92) | Initializes anonymous mode, owns worker cleanup and reports a failed state without public substitution. |
| Explicit public consent | [providers.tsx — mode selection](https://github.com/Rohith1510/silent/blob/main/frontend/components/providers.tsx#L94-L124) | Public mode is a deliberate user action rather than a hidden fallback. |
| Privacy status and real probe | [integration-pages.tsx — UI/probe](https://github.com/Rohith1510/silent/blob/main/frontend/components/integration-pages.tsx#L29-L151) | Shows selected worker, specifier, verified response timestamp, request count and latency. |
| Public-RPC warning modal | [integration-pages.tsx — confirmation](https://github.com/Rohith1510/silent/blob/main/frontend/components/integration-pages.tsx#L278-L290) | Explains the IP/address-query linkage before switching modes. |
| Real vault reads | [protocol-provider.tsx — configuration and balances](https://github.com/Rohith1510/silent/blob/main/frontend/components/protocol-provider.tsx#L47-L185) | Factory provenance, rules, parties, assets, deadlines, approvals, balances and claimable amounts use the selected transport. |
| Wallet-free claim preview | [vault-pages.tsx — beneficiary preview](https://github.com/Rohith1510/silent/blob/main/frontend/components/vault-pages.tsx#L507-L590) | Resolves a beneficiary and reads scheduled/emergency claimable amounts before wallet connection. |
| Event reads | [protocol-provider.tsx — bounded activity query](https://github.com/Rohith1510/silent/blob/main/frontend/components/protocol-provider.tsx#L424-L450) | Actual vault events use the same selected read client. |
| SSR/privacy-state test | [providers.test.ts](https://github.com/Rohith1510/silent/blob/main/frontend/tests/providers.test.ts#L1-L31) | Verifies public transport is not fabricated during server rendering. |

## Traffic boundary

| Traffic | Anon-RPC? | Reason |
| --- | --- | --- |
| App-owned `eth_call`, balances, blocks, receipts and logs | Yes, when anonymous mode is verified | These are the privacy-sensitive reads the harness supports. |
| ENS onchain resolution through the selected viem client | Yes | ENS resolution can reveal which beneficiaries the user is inspecting. |
| Wallet account discovery, signature requests and broadcasts | No | The wallet controls keys and transaction submission; public transactions remain public. |
| ENS avatar/image HTTP requests | No | These are external web resources, not JSON-RPC. |
| Vercel API, Supabase and Resend | No | Notification/auth traffic has a separate consent and metadata model. |
| App HTML, JavaScript, worker download and bootstrap | No complete anonymity claim | Hosting, bootstrap, worker/CDN and entry-network metadata remain explicit trust boundaries. |

## Honest privacy claim

Anon-RPC can reduce direct linkage between the user's network address and supported upstream RPC reads. It does **not** hide public wallet balances, transactions, heartbeat timing, guardian approvals, email identity, the app visit itself or all traffic-correlation metadata. Request counters prove routing through the selected worker, not a mathematical proof of anonymity.

## Verification status

- **Verified in a user-run browser session:** official Nox worker connection, mixnet/tunnel logs and successful Sepolia responses used by the application.
- **Implemented:** default anonymous selection, real probe, shared viem read transport, explicit public consent, failure state and wallet-free claim preview.
- **Still environment-dependent:** mixnet availability and latency. The demo must show the live status at judging time; a build or unit test is not sufficient evidence of a live anonymous request.

## Two-minute judge demo

1. Open **Privacy & integrations** with DevTools visible.
2. Select **Nox — Sphinx mixnet**, wait for the worker/tunnel readiness logs and run the actual RPC request.
3. Show the verified block/time and request counter.
4. Open a vault without connecting a wallet and show real state/balance reads.
5. Preview a beneficiary's claimable amount.
6. Choose Public RPC, show the warning modal and the status changing to Public.
7. Explain which traffic remains public using the table above.

Official references: [Anon-RPC homepage](https://ethereum.github.io/anon-rpc/), [wallet/app integration](https://ethereum.github.io/anon-rpc/wallets/), [network guide](https://ethereum.github.io/anon-rpc/networks/), and [official repository](https://github.com/ethereum/anon-rpc).

