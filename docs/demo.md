# Real testnet demo

For the integrated classical-track story, also follow [prize-fit.md](prize-fit.md) and [notifications.md](notifications.md): inspect without a wallet, onboard an ENSv2 subname with real record permissions, deposit a chosen reserve, opt into verified email, run official CRE CLI observe mode, then demonstrate cancellation and a separate authorized claim. Email setup is optional for core vault use. CLI observe mode never creates a recovery transaction; use explicit transition mode or the wallet's manual eligible actions for that part.

Do not use real-value assets. Have an owner (O), beneficiary wallets (B1/B2), and a separate guardian (G) with Sepolia test ETH for gas. Keep their keys in wallets. This guide describes actions for you to approve; no public-network transactions were sent automatically.

## Prerequisites

Deploy `SilentSovereignFactory` in Remix and configure `frontend/.env.local` as in [the deployment guide](../contracts/remix-deployment.md). Rebuild/restart. Confirm Privacy accurately reports the selected transport. Leave Anon-RPC disabled initially if you want to verify the basic protocol independently of an anonymity network.

## Plan and deposit

1. Connect O and switch to Sepolia using the wallet menu.
2. Open Create Vault. Add B1 at 60% and B2 at 40%. If using ENS, resolve a real Sepolia name and inspect its pinned address; no name is required for the address-only path.
3. Add G as guardian, threshold 1. Set heartbeat 60 seconds, challenge 60 seconds, release interval 60 seconds, initial release 10%, tranche 10%, emergency delay 120 seconds. These are deliberately short **test values**.
4. Review the recipients and rules, open the wallet and approve creation. Wait for the successful receipt. Record the real vault address from the details page or `VaultCreated` event.
5. Open Inheritance Builder. Drag the nodes, select liveness/guardian/schedule nodes and edit a supported field. Save and wait for the actual transaction. Confirm the flow rebuilds from onchain configuration. Removing a mandatory safeguard or adding a bypass must block saving; Auto-layout & restore repairs the supported topology.
6. Open My Vault. Deposit `0.01` Sepolia ETH. Wait for its receipt; verify the displayed chain balance and accounted balance match your transaction. For a supported test ERC-20, O must first enable its actual standard token address, the depositor must approve exactly the desired amount, then submit a separate deposit. Do not use taxed/rebasing tokens.
7. Open Liveness & Recovery and submit a heartbeat from O. Check its actual `Heartbeat` event and renewed deadline.

## Scenario A: owner cancellation

8. Wait until the latest block timestamp strictly exceeds the deadline. The UI refreshes every 15 seconds. Anyone can request recovery; sign a real request transaction.
9. Observe RECOVERY_PENDING and its challenge end. From G, open the same vault by address and approve the **current nonce**. This is optional for the cancellation demonstration but verifies the guardian role.
10. Return to O before final authorization and cancel pending recovery (or submit its check-in). Confirm ACTIVE, renewed deadline and cancellation transition. Earlier approvals cannot be reused for the next request.

## Scenario B: authorization and claims

11. Wait for the new deadline to be strictly exceeded and request recovery again. Read the new nonce.
12. Connect G, open the recorded vault by address, and approve recovery. After the challenge has elapsed, any wallet may finalize. Attempting earlier or without quorum must fail; there is no backend override.
13. Confirm RECOVERY_AUTHORIZED, the authorization timestamp and SnapshotTaken events. Owner withdrawals/configuration/cancellation are now disabled.
14. Connect B1, open the vault by address, select Claim. Initial scheduled availability for a `0.01 ETH` snapshot and 60% allocation is `0.0006 ETH`. Claim; verify `claimed(B1,native)` equals that amount and a real event/receipt exists. Repeating immediately must not pay twice.
15. At each 60-second release interval, another 10% of each heir's allocation vests, capped at 100%. Unclaimed intervals accumulate.
16. To demonstrate emergency acceleration, G must separately approve emergency recovery **after authorization**. At/after `authorizedAt + 120`, B1 may claim the unpaid remainder of their `0.006 ETH` total entitlement. The scheduled ledger now has nothing further to pay B1.
17. B2 claims their authorized portion, either through the vesting schedule or the separately approved emergency path. Once every tracked snapshot asset is fully paid, observe COMPLETED. No fabricated completion state is used.
18. Open Activity. Verify Heartbeat, RecoveryRequested, GuardianApproved, StateChanged, SnapshotTaken and Claimed logs, with actual explorer links. Note recent receipts can still be reorganized.

## ENSv2 demonstration

19. On Beneficiaries, inspect your actual registered Sepolia name. Confirm the resolved address, resolver and ownership information where available. Run Privacy's actual v2 deployment probe; do not infer live support just from the sponsor name.
20. For `heir.your-parent.eth`, own/control a real parent and attach a v2 subregistry using the ENS app. The wallet must actually hold its ROLE_REGISTRAR. Enter parent and check permissions. Enter label, B1 owner, existing resolver and expiry, then approve the genuine registration transaction. Configure its address record through the resolver's authorized account. Resolve and review the name before registering that beneficiary in an ACTIVE vault.
21. A name record change after registration does not alter the pinned vault address. An owner-authorized configuration transaction is required to change the beneficiary account. This MVP disables offchain CCIP gateways, so only supported onchain-resolved names work.

## Anon-RPC demonstration

22. Set `NEXT_PUBLIC_ANON_RPC_ENABLED=true`, restart/rebuild, use a browser supporting the official harness and WebRTC, and open Privacy. Wait for the actual worker/hash/chain probe. Run the actual RPC request and record the returned block and successful transport timestamp.
23. If the Nox network, worker, bootstrap or RPC is unavailable, record failure honestly. Do not use the passthrough worker or relabel a public request as anonymous. Check-ins and claims remain public transactions and wallet traffic remains separate.

## CRE demonstration

24. Complete `cre/README.md`: correct receiver/forwarder deployment, CLI login, funding, config and workflow registration/activation.
25. Run authenticated CLI simulation first without broadcasting, then an explicitly approved write simulation or DON execution. Capture actual execution IDs/logs and onchain `AutomationDelivered` plus vault state transitions.
26. Demonstrate that an expired deadline can trigger only a request. Finalization still requires the genuine owner challenge window and guardian quorum. CRE never submits guardian approvals or claims.

If prerequisites are unavailable, show the implementation and exact blocker, not a fake execution log.

## Automated local counterpart

`npm run compile` then `npm run test:e2e` repeats the wallet/configuration/deposit/cancel/authorize/claim flow against isolated compiled contracts with actual receipts. Test-only time manipulation avoids waiting; it is not offered on testnet. `npm run test:contracts` covers boundary and adversarial scenarios independently. These tests do not establish live ENS, anonymity-network or DON behavior.
