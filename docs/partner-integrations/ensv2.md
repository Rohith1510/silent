# ENSv2 — beneficiary identity that cannot redirect inheritance

**Prize:** [ENS — Best Use of ENSv2](https://ethglobal.com/events/mumbai/prizes/ens)

ENSv2 is central to silent's beneficiary experience: an owner can create a family namespace, issue owned beneficiary subnames, connect wallet records, add a public profile and use the verified identity in an inheritance plan. The vault—not the resolver—enforces entitlement.

## Product flow

1. Connect the wallet that owns or will register the parent `.eth` name.
2. Read live Sepolia availability, price, payment-token balance and registrar commitment timing.
3. Deploy a verifiable Permissioned Resolver and UserRegistry for the parent.
4. Complete the registrar commit/reveal flow with real wallet receipts.
5. Confirm the parent resolver, subregistry, owner and Ethereum record onchain.
6. Check that the connected wallet holds the registrar role on the parent registry.
7. Register an owned beneficiary subname with an expiry and resolver.
8. Set the beneficiary's Ethereum address and optional avatar, description, website and social records.
9. Read the records back, then add the verified identity to the inheritance plan.
10. Re-resolve immediately before saving and pin the resolved address in the vault.

## Exact code map

| Capability | Direct code link | What to review |
| --- | --- | --- |
| Canonical Sepolia ENSv2 contracts | [ens-setup.ts — deployment constants](https://github.com/Rohith1510/silent/blob/main/frontend/lib/ens-setup.ts#L22-L44) | Registrar, registry, Verifiable Factory, implementations and test payment tokens are centralized rather than invented in UI code. |
| Official registrar/factory interfaces | [ens-setup.ts — ABIs](https://github.com/Rohith1510/silent/blob/main/frontend/lib/ens-setup.ts#L46-L113) | Availability, pricing, commitment age, deployment and verification calls. |
| Deterministic resolver and registry deployment | [ens-setup.ts — infrastructure prediction/deployment](https://github.com/Rohith1510/silent/blob/main/frontend/lib/ens-setup.ts#L146-L218) | Uses ENS's Verifiable Factory and implementation-specific salts. |
| Commit/reveal registration | [ens-setup.ts — commitment calldata](https://github.com/Rohith1510/silent/blob/main/frontend/lib/ens-setup.ts#L220-L255) | The commitment binds owner, resolver and registry; the secret is kept in browser storage for resume. |
| Guided parent setup | [ens-family-setup.tsx — live inspection](https://github.com/Rohith1510/silent/blob/main/frontend/components/ens-family-setup.tsx#L211-L405) | Reads price, allowance, ownership, attached infrastructure and factory provenance. |
| Wallet-controlled setup transactions | [ens-family-setup.tsx — deploy/connect/register](https://github.com/Rohith1510/silent/blob/main/frontend/components/ens-family-setup.tsx#L406-L620) | Resolver deployment, registry deployment, parent attachment, address record and commit/reveal. |
| Forward resolution and ENSv2 ownership | [ens.ts — identity inspection](https://github.com/Rohith1510/silent/blob/main/frontend/lib/ens.ts#L241-L283) | Normalizes names, resolves address/resolver, checks primary-name consistency and traverses v2 registry ownership. |
| Public profile reads | [ens.ts — profile inspection](https://github.com/Rohith1510/silent/blob/main/frontend/lib/ens.ts#L285-L310) | Reads avatar, description, URL, Twitter and GitHub records from the real resolver. |
| Parent permission check | [identity-manager.tsx — registry authorization](https://github.com/Rohith1510/silent/blob/main/frontend/components/identity-manager.tsx#L163-L217) | Requires actual `ROLE_REGISTRAR`; the UI cannot register beneath an unauthorized parent. |
| Address-record permissions | [identity-manager.tsx — set/grant/revoke](https://github.com/Rohith1510/silent/blob/main/frontend/components/identity-manager.tsx#L421-L497) | Separates name ownership from resolver setter permissions and supports scoped delegation/revocation. |
| Profile editing and EAC delegation | [identity-manager.tsx — profile operations](https://github.com/Rohith1510/silent/blob/main/frontend/components/identity-manager.tsx#L498-L680) | Resolver multicall plus argument-scoped Enhanced Access Control for individual text keys. |
| Judge-facing ENS workspace | [identity-manager.tsx — complete UI](https://github.com/Rohith1510/silent/blob/main/frontend/components/identity-manager.tsx#L783-L1388) | Identity explorer, subname flow, wallet record, public profile and permission inspection. |
| Address pinning before contract write | [configuration-editor.tsx — resolve and recheck](https://github.com/Rohith1510/silent/blob/main/frontend/components/configuration-editor.tsx#L335-L454) | A name is resolved to an address, then checked again immediately before serialization. |
| Deterministic contract serialization | [configuration.ts — beneficiaries](https://github.com/Rohith1510/silent/blob/main/frontend/lib/configuration.ts#L333-L356) | Only validated, pinned addresses and allocation basis points enter contract calldata. |
| Transaction-level tests | [ens-transactions.test.ts](https://github.com/Rohith1510/silent/blob/main/frontend/tests/ens-transactions.test.ts#L1) | Verifies address/profile calldata and identity data handling. |

## Why two values appear: name and wallet address

- The **ENS name** is the human-readable, portable identity and profile.
- The **wallet address** is the immutable authorization target saved by the vault.
- silent resolves and verifies the name, shows both values for review, and pins the address only after owner approval.
- If the resolver later changes, the app warns about drift; it never silently redirects an existing inheritance allocation.

## Security decisions

- Zero addresses, duplicate beneficiaries and allocations not totaling 10,000 basis points are rejected.
- Parent ownership and registrar role are read from ENSv2 before subname registration.
- Resolver Ethereum-address permission and text-record permissions are inspected separately.
- A scoped profile permission does not grant Ethereum-address editing or vault rights.
- Shared resolvers are labeled as a permission-isolation tradeoff; dedicated resolvers are recommended when per-beneficiary isolation is required.
- ENS profile data is public. The UI warns against publishing private inheritance instructions or contact details.
- CCIP-Read HTTP gateways are deliberately unsupported in this read path; unsupported names fail visibly.

## Verification status

- **Verified live:** real Sepolia deployment reads; parent ownership/resolver/subregistry inspection; beneficiary subname creation and Ethereum address-record setup during user testing.
- **Implemented:** parent acquisition, deterministic infrastructure deployment, profiles, scoped permissions, drift checks and pinned vault serialization.
- **Demo evidence still worth capturing:** explorer links for the parent/subname/profile receipts and a final read-back screen showing name, resolver, registry owner and pinned address.

## Two-minute judge demo

1. Open **Beneficiaries → ENS names & profiles**.
2. Resolve the existing parent and show ENSv2 registry ownership.
3. Open the created beneficiary subname and show its wallet record and profile.
4. Use **Use this verified beneficiary**.
5. Save the plan and show the beneficiary node plus pinned address.
6. Explain: “ENS makes the identity usable; the vault keeps authorization stable.”

Official references: [ENSv2 overview](https://docs.ens.domains/ensv2/overview/), [subnames](https://docs.ens.domains/ensv2/subnames/), [Permissioned Registry](https://docs.ens.domains/ensv2/permissioned-registry/), [Permissioned Resolver](https://docs.ens.domains/ensv2/permissioned-resolver/), and [Enhanced Access Control](https://docs.ens.domains/ensv2/enhanced-access-control/).

