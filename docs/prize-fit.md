# ETHGlobal Mumbai classical-track integration plan

Requirements checked on 2026-10-30:

- [EF Best Use of Anon-RPC](https://ethglobal.com/events/mumbai/prizes/ethereum-foundation): default anonymous app reads, working demo and explicit traffic exclusions.
- [ENS Best Use of ENSv2](https://ethglobal.com/events/mumbai/prizes/ens): real mainnet/Sepolia v2 features central to product, live demo and open source. The separate existing-project prize is continuity-only.
- [Chainlink Best workflow with CRE](https://ethglobal.com/events/mumbai/prizes/chainlink): blockchain plus an external API/system, meaningful workflow and official CLI simulation or deployed execution. Deployment approval is not required to present a successful CLI simulation. The CCIP prize is a separate integration.

Confirm the event's classical-track policy for pre-existing work with organizers; retain the starting commit and disclose work done during the event. Sponsor fit does not by itself establish track eligibility, and no prize outcome is guaranteed.

## User story and evidence

1. Open a vault by address without connecting a wallet. Connect a verified anonymous transport on Privacy. Capture successful `eth_call`, balance and event reads, including timestamp/latency. A successful chain-ID response alone is insufficient evidence of a reliable vault experience. Show public-mode consent and failure behavior.
2. Connect the owner, configure two beneficiaries and guardian quorum through the actual React Flow graph, save, and read the configuration back from chain. Deposit a reserve while retaining spending money and gas; demonstrate an allowed withdrawal. Funds outside the vault are excluded.
3. Under an owned parent, verify registrar rights, register a real ENSv2 subname, set its Ethereum record and resolve it in the onboarding panel. Review the wallet and allocation before using it. Use a dedicated permissioned resolver if delegating records must be isolated. The grant form explicitly exposes resolver-wide coin-type scope. Capture unauthorized-setter rejection and grant/revoke receipts. These writes require owner wallets; no live ENS write was sent by the coding agent.
4. Change the ENS record after pinning. Recheck through the selected read transport: identity drift warning must appear and the onchain beneficiary must remain unchanged. Labels cached in the browser are advisory and not a private identity database.
5. Register and verify your own optional email; demonstrate CRE reading live Sepolia and calling the external notification API. Show CLI execution output, real email and server delivery status. Distinguish CLI simulation from a deployed active workflow. Do not use `--broadcast` unless intentionally demonstrating real testnet transactions with the simulation receiver.
6. Use two scenarios: owner cancels a pending request, then another recovery completes only after quorum and challenge. Beneficiaries sign their own scheduled/emergency claims. Capture receipts and events; never substitute static success screenshots.

## Traffic and trust boundaries

Supported app RPC reads use the selected transport. Exclusions: worker bundle/specifier bootstrap (Sepolia for Nox, mainnet for Nym), host page resources, connected wallet's own provider, notifications/auth/API requests, backend verification RPC and external explorer visits. CCIP-Read gateways remain disabled. Anonymous routing hides neither public transactions nor wallet signing metadata, host visits, email identity or all network entry metadata.

## Scope

One network, ordinary native/ERC-20 custody, existing state-machine safeguards, shared release schedule, optional private contact settings. No onchain proof of death, investment strategies, WhatsApp, AI death detection, automatic wallet-key recovery or fabricated DON execution. Manual eligible contract transitions remain available without CRE.
