# Security model and limitations

## Optional notification service — 2026-10-30

The Next.js server authenticates private preferences with server-created SIWE messages bound to a fixed origin, chain, nonce and five-minute expiry. Nonces are consumed atomically before signature verification. Session tokens are random, stored as hashes, expire after one hour, and use HttpOnly/SameSite=Strict cookies (Secure and host-only in production). Mutating browser endpoints check Origin. Subscription enrollment verifies current factory provenance and wallet membership, then requires separate expiring email consent. Former vault participants stop receiving alerts; they can still delete their own subscription.

Supabase's service key stays on the server. `silent_*` tables have RLS and no browser-role grants; RPC functions are invoker-mode and callable only by service_role. Contacts are encrypted with AES-256-GCM and a server-managed key. Protect/backup that key separately from the database. Losing it prevents decryption; compromise of server credentials can reveal contacts and interfere with warnings, but grants no contract withdrawal powers.

CRE's notification token authorizes only a notification request; the endpoint rereads chain state and selects fixed templates and consented recipients. This token does not cryptographically prove a particular DON execution. It never authorizes a contract transition. Atomic delivery leases plus provider idempotency bound duplicate sends; ambiguous sends past the provider window require operator review. Verified raw-body webhooks update delivery state atomically and reject replay or invalid signatures. Email failures, reorgs, chain changes after inspection and delayed delivery can create stale warnings; users must independently monitor their vault.

API rate limits use database counters, wallet identifiers and hashed forwarded client IPs. Deploy behind a trusted proxy that normalizes forwarding headers; arbitrary self-hosted forwarded headers are not a robust IP identity. Recipient verification and per-recipient limits also apply. Before broad deployment, configure retention/purging and review provider limits. No email was sent or real provider webhook verified during implementation.

**This is unaudited testnet software.** Solidity compilation, adversarial tests and browser verification do not establish production security. Get independent contract and frontend audits, fuzz/invariant testing, operational review and a legal review before real-value use.

## Trust boundaries

- The owner wallet controls configuration, deposits/withdrawals where applicable, liveness and cancellation. Key compromise gives the attacker these powers while ACTIVE/PENDING. The owner is immutable; there is no key-rotation backdoor.
- Guardians are trusted to assess the recovery request. A missed deadline is evidence of inactivity only. A colluding quorum can authorize recovery after a genuine missed deadline and challenge. The protocol cannot prove death or the owner's capacity.
- The owner must keep their challenge window practical and guardian set reachable. Lost keys or an unreachable quorum can lock funds after pending recovery. A dishonest guardian can refuse approval indefinitely.
- A beneficiary may also be a guardian. The UI does not represent this as independent social verification; select genuinely independent guardians for a stronger trust model.
- Factory and CRE receiver have no asset-transfer rights. The receiver authenticates forwarder and workflow owner, but direct public automation is intentionally available with identical contract checks.
- RPC providers, wallets, dependencies, ENS contracts and anonymity networks remain trusted infrastructure. A compromised frontend or bootstrap RPC can mislead a user even when the vault code is correct. Always review wallet destinations and decoded changes.

## Enforced invariants

1. Configurations are owner-authorized and ACTIVE-only; no zero/duplicate beneficiaries, invalid allocations, duplicate guardians, owner guardians or impossible quorums.
2. Allocations total exactly 10,000 basis points. At most 16 people in each role and 16 tracked assets, bounding gas loops.
3. `block.timestamp > deadline` is required to request recovery. Equality is not sufficient. Finalization requires `block.timestamp >= pendingAt + challengePeriod` and quorum.
4. Pending recovery freezes deposits, owner withdrawals, support-list expansion and configuration. No opportunistic allocation change after a request.
5. Owner cancellation/heartbeat/pause is available while pending. It cannot undo an already-authorized recovery. Check-ins reset the deadline; pause blocks new requests and can cancel an existing request.
6. Guardian approvals are sender-verified and tied to a monotonically increasing recovery nonce. A guardian can approve once per mode per request; old votes cannot satisfy a new request.
7. Only credited assets enter a fixed snapshot. Pull claims pay the sender only. Checks/effects precede transfer and claims use OpenZeppelin ReentrancyGuard.
8. Claimed amounts and asset remaining amounts decrease consistently. Both release modes share the paid ledger. Cumulative allocation rounding gives total entitlement equal to the snapshot.
9. Emergency release requires elapsed additional delay and a fresh, separately recorded quorum. A recovery authorization vote is not an emergency vote.
10. CRE payloads bind chain ID, receiver address, registered vault, action and request nonce. Consumed successful reports are ignored on repetition. Ineligible deliveries may retry; the core rechecks state and cannot release assets on a report's assertion alone.

## Token restrictions and accounting

Only standard, non-rebasing ERC-20 contracts with stable `balanceOf`, decimals/symbol metadata and no sender/recipient transfer fees are supported. Owner token enablement is an explicit trust decision, not automatic token certification. Only enable token implementations you have reviewed; upgradeable tokens can change behavior later.

SafeERC20 handles missing/false transfer returns. Deposits enforce exact vault balance increments. Outgoing token transfers enforce both exact sender decrement and exact recipient increment. Taxed transfers revert atomically. Authorization rejects actual balances below credited accounting, rather than silently diluting heirs.

These checks cannot make arbitrary malicious token code safe. A token that later rebases negatively, blacklists, pauses, changes accounting, reenters through custom hooks, or reverts on `balanceOf` may block recovery or claims. Because all tracked assets are checked at finalization, a broken token can prevent the entire snapshot. The active owner should withdraw problematic assets before initiating recovery; there is no pending override or hidden admin sweep. Asset removal is not implemented.

Direct ERC-20 transfers, positive rebases and forcibly sent ETH are not credited. They are excluded from inheritance and may remain permanently inaccessible. After authorization native `accounted` stays the historical funded amount; `snapshot`, `remaining`, actual balance and `claimed` are the authoritative recovery ledgers. There are no new authorized deposits in this phase.

This protocol cannot move assets from an external wallet, another contract, an NFT collection or a third-party approval without separate implemented authorization. No such external recovery is promised.

## Time, ordering and finality

Block timestamps are approximate consensus time. Durations are not a reliable wall-clock alarm. Minimum durations are 60 seconds for test demonstrations; they are unsafe operational choices for real assets. Use realistic weeks/months and a challenge period that covers travel, medical emergencies, censorship and network outages.

Cancellation and finalization race in normal transaction ordering. Sending a cancellation is insufficient until it is included; finalization included first is irreversible. Frontend countdowns use the last queried block and are explicitly labeled. The UI confirms at one block and does not guarantee protection from reorganization.

## Frontend, identity and privacy

The typed graph is a constrained editor. It does not compile arbitrary user graph logic into Solidity. Unsupported conditions block saving. A save resets last heartbeat just as contract configuration does; owners should review this side effect.

ENS records may change at any time. Resolution is checked before the wallet request, but the vault stores only the reviewed account. A change between lookup and inclusion cannot redirect that stored account. To adopt a changed record the owner must explicitly resolve, review and transact a new configuration. Phishing/homoglyph risk remains; ENSIP-15 normalization helps but does not establish personal identity.

The app deliberately disables CCIP-Read HTTP gateways, so offchain-resolved names can fail rather than leaking lookups through a different path. Subname registration requires actual parent subregistry roles and an existing resolver contract. It does not create resolver records or grant resolver-write permissions automatically.

Anon-RPC protects supported network metadata, not public blockchain activity. Bootstrap reads, worker downloads and entry peers have metadata visibility. The pinned worker is only as trustworthy as its onchain specifier controller and bootstrap response. See [integrations.md](integrations.md) for the complete threat model.

No private keys, personal inheritance instructions, legal documents or secrets are stored onchain. Beneficiary/guardian addresses, percentages, time rules, transactions and events are public. Ordinary wallet ECDSA is **not post-quantum secure**; no such claim is made for Keccak or this protocol.

## Before production

Add independent audits, fuzz/invariant/property tests, multiple token implementations, malicious-token callback tests, smart-account wallet testing, accessibility review, RPC/ENS/CRE failover operations, chain reorganization tests, practical notification delivery, dependency monitoring and a reviewed incident process. None of these are replaced by a passing MVP demo.
