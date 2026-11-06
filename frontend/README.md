# silent. frontend

This is the original Next.js application, extended in place with the silent protocol UI. React Flow was retained; no second app was created.

Use the repository [README](../README.md) for setup and verification, [Remix deployment guide](../contracts/remix-deployment.md) for contracts, and [demo walkthrough](../docs/demo.md) for the real testnet flow.

Copy `.env.example` to `.env.local`, fill in your actual factory address and deployment block, and run `npm run dev` from this directory. Without a deployment the dashboard shows **Contract not configured**. Wallet signing is handled through wagmi's injected browser-wallet connector; private keys never belong here.

```sh
npm run lint
npx tsc --noEmit
npm run build
```

From the repository root, `npm run test:frontend` checks the typed configuration/transaction layer and `npm run test:e2e` runs a real local-chain browser demo. `npm run compile` regenerates the strongly typed ABIs from Solidity.

Read `../docs/security.md`. This application is unaudited and testnet-only.
