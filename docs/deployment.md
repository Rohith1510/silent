# Deployment and configuration

The implementation is local, unaudited and testnet-only. No contracts, site or CRE workflow were published on your behalf. Public-network broadcasts, app publishing and paid services require your separate approval.

## Frontend

Continue using `frontend/`; it is the original Next.js project with React Flow retained. New dependencies are limited to wagmi, viem, TanStack Query, Lucide and the official Anon-RPC harness. Wallet discovery uses injected providers and EIP-6963 discovery rather than requiring a WalletConnect account.

1. Install missing dependencies in a fresh checkout with `npm ci`, `npm --prefix frontend ci`, `npm --prefix cre ci`.
2. Compile contracts/ABIs using `npm run compile` from root.
3. Deploy the factory as described in [../contracts/remix-deployment.md](../contracts/remix-deployment.md).
4. Copy root `.env.example` to `frontend/.env.local`. Set your deployed factory, decimal deployment block, Sepolia chain ID and browser-safe RPC.
5. Run `npm --prefix frontend run dev`. For an eventual host, run `npm --prefix frontend run build`, then `npm --prefix frontend start` (or its equivalent Next.js host).
6. Test owner, guardian and heir roles with separate wallets. Verify factory provenance, chain ID, actual balances and real receipts.

`NEXT_PUBLIC_` configuration is embedded in the frontend build, so host configuration must exist **before** building. Updating variables after a build requires a new build. Use HTTPS outside localhost. Do not expose unrestricted server credentials through a browser endpoint. The Settings screen shows only the RPC hostname, but the complete URL is necessarily visible in bundled public configuration.

The default chain is Sepolia. Only Sepolia (11155111) and local tests (31337) are supported. Unsupported IDs block protocol operations; they do not silently switch to a different deployed contract. Chain selection is a deployment configuration, while the wallet menu can request switching to that configured chain.

## External services

ENS: no service key is required for standard onchain reads. Use your actual Sepolia ENS records. To create a subname, the parent owner must attach a v2 subregistry and give the connected wallet its registrar role. Address records in the selected resolver must be configured by their actual authorized account. No `family.eth` ownership is assumed.

Anon-RPC: enable `NEXT_PUBLIC_ANON_RPC_ENABLED=true`, restart/rebuild, then verify a real response through Privacy. It uses the officially listed Nox Sepolia specifier. Public bootstrap lookup and worker bundle downloads remain visible. Do not deploy restrictive CSP/iframe/Worker/WebRTC policies without testing the official harness. Failure never silently uses public RPC.

CRE: configure a separate receiver deployment, correct simulation/DON forwarder, workflow owner, authenticated CLI environment and funded execution. Never expose `CRE_ETH_PRIVATE_KEY` in `frontend/`. See [../cre/README.md](../cre/README.md).

## Local end-to-end environment

`npm run test:e2e` automatically starts a loopback Ganache chain at 8545, deploys the actual compiled factory, and launches this frontend at 3100 with local-only environment variables. It writes no user keys or `.env.local` files. It uses `.next-e2e/` and public deployment metadata in `.local/test-deployment.json`. The injected wallet fixture is test-only and delegates to genuine unlocked test accounts and real JSON-RPC execution.

Run `npm run compile` first. Installed Edge is the default Playwright channel; select a supported installed browser on other systems. Do not expose the Ganache port beyond loopback. Testnet timestamp manipulation is available only inside this isolated environment, never as a production UI action.

## Operational limits

- Optional email notifications require the Supabase migration, server environment and a configured Resend sender. See [notifications.md](notifications.md). Legal identity verification and autonomous guardian approval are not supplied.
- RPC history loads recent 10,000-block windows and is bounded at 100,000 loaded blocks per view. Use an indexer/explorer for older or complete long-term histories.
- The CRE workflow handles one configured index batch. Add distinct registered batches for vault indices outside that range and watch account/service quotas.
- Fresh testnet source/contract verification, browser wallet interoperability, real anonymity-network reachability and real DON execution remain separate acceptance steps.
- The app has no private personal-instruction storage. Onchain addresses and rules are public. Host access control does not hide the chain.

## Vercel

Set Root Directory to `frontend`, framework Next.js, install `npm ci`, build `npm run build`, and retain the default output directory. CRE stays a separate CLI/DON project and is not compiled by Vercel. Commit `frontend/package-lock.json` for reproducibility. Use a supported Node 22+ runtime for the current server dependencies.

Copy public variables and optional notification server variables from `frontend/.env.example` into Vercel's environment settings. Set `APP_ORIGIN` to the exact HTTPS production origin; previews need their own matching settings. Rebuild for public-variable changes. Do not prefix any server secret with `NEXT_PUBLIC_`. No app hosting or paid service is provisioned by this implementation.

Smoke-test wallet connections, ENS reads/writes, anonymous bootstrap, deposits/withdrawals, API origin rejection, email verification and webhooks on the actual HTTPS host. The dashboard opens `#vault=0x...` without wallet login; URL fragments are not sent in the HTTP request.
