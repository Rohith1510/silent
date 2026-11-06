"use client";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import {
  inspectIdentity,
  registryEntry,
  rememberedIdentityHealth,
} from "@/lib/ens";
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
              const warnings: string[] = [];
              if (current.address.toLowerCase() !== b.address.toLowerCase())
                warnings.push(
                  `${b.identity} now resolves to a different wallet. Your saved allocation remains pinned to ${b.address}.`,
                );
              const baseline = rememberedIdentityHealth(
                b.identity,
                client!.chain.id,
              );
              if (
                baseline?.resolver &&
                current.resolver?.toLowerCase() !== baseline.resolver.toLowerCase()
              )
                warnings.push(`${b.identity}'s resolver changed since verification.`);
              if (
                baseline?.owner &&
                current.owner?.toLowerCase() !== baseline.owner.toLowerCase()
              )
                warnings.push(`${b.identity}'s registry owner changed since verification.`);
              try {
                const entry = await registryEntry(client!, b.identity);
                const days = Number(entry.expiry - BigInt(Math.floor(Date.now() / 1000))) / 86400;
                if (days <= 0)
                  warnings.push(`${b.identity} is expired or at its expiry boundary.`);
                else if (days <= 30)
                  warnings.push(`${b.identity} expires in ${Math.ceil(days)} days.`);
              } catch {
                /* Legacy names can resolve without an ENSv2 registry entry. */
              }
              return warnings.join(" ");
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
