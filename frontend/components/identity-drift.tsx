"use client";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import { inspectIdentity } from "@/lib/ens";
import { useReadTransport } from "./providers";
import { useProtocol } from "./protocol-provider";
import { Notice } from "./ui";
export function IdentityDrift() {
  const { client } = useReadTransport();
  const { query } = useProtocol();
  const beneficiaries = query.data?.config?.beneficiaries;
  const result = useQuery({
    queryKey: [
      "ens-drift",
      client?.uid,
      beneficiaries?.map((b) => `${b.identity}:${b.address}`).join(","),
    ],
    enabled: !!client && !!beneficiaries?.some((b) => !isAddress(b.identity)),
    staleTime: 60000,
    queryFn: async () =>
      Promise.all(
        beneficiaries!
          .filter((b) => !isAddress(b.identity))
          .map(async (b) => {
            try {
              const current = await inspectIdentity(client!, b.identity);
              return current.address.toLowerCase() !== b.address.toLowerCase()
                ? `${b.identity} now resolves to a different wallet. Your saved allocation remains pinned to ${b.address}.`
                : "";
            } catch {
              return `${b.identity} could not be resolved. Its pinned beneficiary address remains unchanged.`;
            }
          }),
      ),
    retry: false,
  });
  const warnings = result.data?.filter(Boolean);
  return warnings?.length ? (
    <Notice danger>
      {warnings.join(" ")} Only an explicit owner-authorized configuration
      transaction changes the beneficiary.
    </Notice>
  ) : null;
}
