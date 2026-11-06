# Solidity protocol

Solidity `^0.8.24`, pinned OpenZeppelin Contracts 5.4.0, non-upgradeable. **Unaudited / testnet only.**

- `SilentSovereignFactory`: anyone creates an isolated vault owned by their sending wallet. Tracks provenance; no admin.
- `SilentSovereignVault`: owner configuration, deposited-asset accounting, guardian-protected recovery, snapshot-based phased pull claims.
- `SilentSovereignCREReceiver`: authenticated forwarder/workflow-owner adapter. Does not own assets or bypass eligibility.
- `libraries/AllocationMath`: cumulative basis-point rounding assigns every snapshot wei.
- `interfaces/ISilentAutomation`: public, nonce-bound automation surface.
- `test/Adversaries.sol`: **test-only** standard/taxed token and reentrant beneficiary fixtures. Do not use these as production token infrastructure.

Deployment does not require Hardhat or Foundry. See [remix-deployment.md](remix-deployment.md). For automated checks run `npm run compile` and `npm run test:contracts` from the root. Compilation generates the actual typed ABIs in the frontend and CRE; do not hand-edit them.

Read [../docs/security.md](../docs/security.md) before depositing anything, even on testnet. Neither contracts nor ENS can recover balances held outside this vault.
