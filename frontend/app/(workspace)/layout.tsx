import { Shell } from "@/components/shell";
import { Suspense } from "react";
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="loading-page">Opening your workspace…</div>}
    >
      <Shell>{children}</Shell>
    </Suspense>
  );
}
