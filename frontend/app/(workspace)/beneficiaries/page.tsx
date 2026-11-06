import { ConfigurationScreen } from "@/components/configuration-editor";
import { IdentityDrift } from "@/components/identity-drift";
import "./beneficiaries.css";
export default function BeneficiariesPage() {
  return (
    <div className="beneficiaries-page">
      <IdentityDrift />
      <ConfigurationScreen mode="beneficiaries" />
    </div>
  );
}
