# Optional email warnings

This feature never authorizes recovery or transfers assets. The app verifies wallet signatures, vault membership and current onchain state. CRE supplies a vault address, not email addresses or message text. The server derives recipients and message eligibility. Core vault management remains usable without a database or email.

## Supabase

The requested project is `blkpbfmhcufobvypcwta`. Codex MCP registration and OAuth succeeded on 2026-10-30. Newly registered tools were unavailable to the already-running session; the migration has NOT been applied to the hosted project by this work. Start a new Codex session and check `/mcp` to expose its tools, or paste `supabase/migrations/202610300001_notifications.sql` into this project's SQL Editor and run it once. Inspect existing tables first; this migration creates only `silent_*` tables and functions.

Follow-up: after the user configured runtime credentials, read-only probes verified all six application tables are present and accessible. Do not rerun the creation migration over existing tables; the agent did not apply or modify that hosted schema. Next verify wallet login and real email delivery through the app. `node scripts/check-setup.mjs --live` repeats the read-only setup checks without printing secrets.

Tables have RLS enabled, no client policies and no grants to anon/authenticated. All database access is through authenticated Next.js routes using the server secret. **Keep Supabase's Data API enabled** for this implementation: supabase-js uses its REST/RPC endpoints. Disabling the Data API breaks this backend. The client has no Supabase key or direct database access. Existing Supabase users/tables are not modified.

Get the project URL and server secret from Supabase's project Connect/API keys settings. `SUPABASE_SECRET_KEY` accepts the server secret key (or legacy service-role key); it must never be exposed in client JavaScript. Store it in `frontend/.env.local` and Vercel server environment variables only. MCP OAuth is developer tooling authentication, not a runtime database credential.

## Resend

1. Create a Resend account and API key. Add a sending domain you control and complete its DNS verification; set `EMAIL_FROM` to a sender on that domain. For development, Resend's testing sender has recipient restrictions; follow the provider's current dashboard instructions.
2. Configure the variables in `frontend/.env.example`: `APP_ORIGIN`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SERVER_RPC_URL`, `NOTIFICATION_ENCRYPTION_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `RESEND_WEBHOOK_SECRET`, `CRE_NOTIFICATION_TOKEN`. Restart Next.js after changes.
3. Generate the encryption key locally: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Generate a second independent token for `CRE_NOTIFICATION_TOKEN`; put the same value in the frontend's server environment and `cre/.env`. Never send these values in chat. Keep the encryption key stable; rotation requires decrypting and re-encrypting stored contacts.
4. Configure a Resend webhook at `https://YOUR_HOST/api/webhooks/email`, select delivered/bounced/complained/failed events, and copy its signing secret into `RESEND_WEBHOOK_SECRET`. The backend verifies raw-body Svix signatures. `accepted` is not the same as `delivered`.
5. Open a vault in the app, visit Email alerts, sign the domain-bound SIWE login, enter your own email and consent. Open the verification link and explicitly confirm. Link GETs alone do not verify. The fragment token is omitted from server access URLs.
6. Configure and run CRE as below. Email messages are real external side effects: use only verified recipients you have authorized. No email was sent by the agent while implementing this feature.

## CRE configuration

Copy `cre/config/recovery.example.json` to ignored `recovery.json`. Set the real factory. Start with `executionMode: "observe"` and `receiverAddress: ""`: a receiver deployment is unnecessary for read-only/email simulation. Set `notifications.enabled: true` and an HTTPS endpoint ending `/api/notifications/dispatch`. Your local app needs a deliberately configured HTTPS tunnel, or your own deployed application, reachable from the CLI. Do not use localhost as a public DON endpoint.

`cre/secrets.yaml` maps `CRE_NOTIFICATION_TOKEN` to the local environment for simulation. Run from `cre/`:

```sh
cre workflow simulate ./workflows/recovery --target staging-settings
```

Select cron. Its configured bounded factory range is read. The official SDK HTTP capability calls your backend. The server independently reads a consistent latest block, validates factory provenance and determines recipients and message kind. Ordinary server RPC requests are outside Anon-RPC. Observe mode produces no recovery transaction and does not need `--broadcast`.

For actual transitions choose `executionMode: "transitions"`, supply the correct deployed receiver and use the documented simulation or DON forwarder. Receiver fields are immutable. Private-registry deployed workflows use the CRE organization address as expected workflow owner, not necessarily your wallet. Never mix the simulation and live forwarders.

Use `cre login`, `cre whoami`, `cre registry list` to check account access. Private-registry deployment is already selected in workflow.yaml, but no deployment is performed or implied. Provision the notification secret through CRE's documented secret manager before real deployment. A simulation exits after the run; it is not continuous monitoring. Sponsor prize acceptance of simulation does not mean the public platform has live automation.

## Reliability, privacy and operations

- Reminders are sent to the owner within 24 hours before deadline, once per deadline/nonce/subscription. Recovery-started notices go to owners; pending missing-quorum notices to guardians; authorized/releasing notices to beneficiaries. Claimable amounts are still checked onchain.
- Normal retries and duplicate DON requests share an atomic Postgres delivery lease and the same Resend idempotency key. Ambiguous failures older than 23 hours are not automatically resent because provider deduplication expires. Review those delivery rows operationally; this is at-least-once processing with bounded duplicate protection, not a claim of exactly-once email delivery.
- The next configured CRE run retries failed sends after the lease. There is no background email worker or secret cron pretending to be CRE. Notification failures are logged separately and cannot bypass or prevent eligible contract transitions.
- Subscription deletion also removes delivery history; wallet sessions expire in one hour. Expired challenges/sessions, rate-limit rows and webhook IDs need periodic operator cleanup. Set a retention policy before broader use. Notification requests currently cover at most 100 subscriptions per vault, comfortably beyond the contract's small owner/guardian/beneficiary bounds; serverless execution time still limits bulk delivery. Partition batches for scaling.
- Email destinations are AES-256-GCM encrypted in storage; the backend and provider necessarily process plaintext. Consent creates a wallet/email association. No contact details go onchain or into the CRE config. Email is optional and outside anonymous read transport.
- The RPC transport and email provider are external dependencies; reorgs, chain-state changes after reading, delayed delivery and provider outages can produce stale or late warnings. Never rely on email as the sole way to monitor a deadline.
- Follow Resend domain, recipient, rate-limit and webhook instructions: https://resend.com/docs/api-reference/emails/send-email and https://resend.com/docs/webhooks/verify-webhooks-requests.

## Verification still requiring your account

Read-only follow-up probes verified Supabase table access and the configured Sepolia factory using user-supplied environment values. Real email acceptance/delivery, provider webhook delivery and an official CRE CLI execution remain separate acceptance steps. `/api/status` reports missing configuration, not service health. The UI never fabricates a successful message or active workflow.

## Troubleshooting email acceptance

With `onboarding@resend.dev` as the sender, Resend permits messages only to the email associated with your Resend account. A recipient using a different email is rejected. For the local demo use your account email; to reach other people, verify a DNS sending domain and change `EMAIL_FROM` to an address on that exact domain. A `.eth` ENS identity is not the required email-sending DNS domain.

The app translates provider recipient restrictions, unverified domains, invalid keys, sender format, quotas and throttling into separate safe errors. Raw provider messages can contain private account addresses and are not sent to the browser or application logs. Definitively rejected verification enrollments are removed so the UI does not tell users to wait for an email that was never accepted. Ambiguous timeouts/in-progress requests are preserved because delivery may still occur.

`node scripts/check-email.mjs` checks local sender/key format; add `--live` for read-only domain/log inspection if the key permits it. Sending-only keys correctly cannot read those account details; inspect the failed `POST /emails` entry in the Resend dashboard instead. Do not broaden key permissions just for diagnostics. These checks send no messages. If an older failed enrollment still appears pending, delete it through Email alerts before registering again. Existing wallet/recipient rate limits still apply.
