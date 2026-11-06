import { ConfigurationScreen } from "@/components/configuration-editor";
import { IdentityManager } from "@/components/identity-manager";
import { IdentityDrift } from "@/components/identity-drift";
export default function BeneficiariesPage() {
  return (
    <>
      <IdentityDrift />
      <ConfigurationScreen mode="beneficiaries" />
      <IdentityManager />
    </>
  );
}
