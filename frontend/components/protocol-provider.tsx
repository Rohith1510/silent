"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnection, useWalletClient } from "wagmi";
import {
  decodeEventLog,
  erc20Abi,
  getAddress,
  zeroAddress,
  type Address,
  type Hex,
  type TransactionReceipt,
} from "viem";
import { SilentSovereignVaultAbi as vaultAbi } from "@/lib/generated/SilentSovereignVault";
import { SilentSovereignFactoryAbi as factoryAbi } from "@/lib/generated/SilentSovereignFactory";
import {
  chain,
  deploymentBlock,
  environmentIssues,
  factoryAddress,
} from "@/lib/network";
import {
  confirmTransaction,
  transactionError,
  type TransactionState,
} from "@/lib/transaction";
import { validAddress, type Configuration } from "@/lib/configuration";
import { useReadTransport } from "./providers";
import { rememberedIdentity } from "@/lib/ens";

export const states = [
  "Active",
  "Recovery pending",
  "Recovery authorized",
  "Releasing",
  "Completed",
];
export function useVaultQuery(selected?: Address) {
  const { address } = useConnection();
  const { client } = useReadTransport();
  return useQuery({
    queryKey: ["vault", address, selected, client?.uid],
    enabled:
      !!client &&
      !!factoryAddress &&
      environmentIssues.length === 0 &&
      (!!address || !!selected),
    refetchInterval: 15000,
    queryFn: async () => {
      if (!client || !factoryAddress)
        throw new Error("Contract not configured");
      if ((await client.getChainId()) !== chain.id)
        throw new Error("The configured RPC serves the wrong network.");
      if (!(await client.getBytecode({ address: factoryAddress })))
        throw new Error(
          "No factory contract exists at the configured address on this network.",
        );
      const block = await client.getBlock();
      const blockNumber = block.number;
      const owned = address
        ? await client.readContract({
            address: factoryAddress,
            abi: factoryAbi,
            functionName: "getVaults",
            args: [address],
            blockNumber,
          })
        : [];
      const vault = selected ?? owned.at(-1);
      if (!vault)
        return {
          owned,
          vault: undefined,
          blockNumber,
          timestamp: block.timestamp,
        };
      if (
        !(await client.readContract({
          address: factoryAddress,
          abi: factoryAbi,
          functionName: "isVault",
          args: [vault],
          blockNumber,
        }))
      )
        throw new Error(
          "This address is not a vault registered by the configured factory.",
        );
      const read = { address: vault, abi: vaultAbi, blockNumber } as const;
      const [
        owner,
        state,
        rules,
        beneficiaries,
        guardians,
        assetAddresses,
        deadline,
        pendingAt,
        authorizedAt,
        recoveryNonce,
        approvalCount,
        emergencyApprovalCount,
        paused,
        eligible,
      ] = await Promise.all([
        client.readContract({ ...read, functionName: "owner" }),
        client.readContract({ ...read, functionName: "state" }),
        client.readContract({ ...read, functionName: "rules" }),
        client.readContract({ ...read, functionName: "getBeneficiaries" }),
        client.readContract({ ...read, functionName: "getGuardians" }),
        client.readContract({ ...read, functionName: "getAssets" }),
        client.readContract({ ...read, functionName: "deadline" }),
        client.readContract({ ...read, functionName: "pendingAt" }),
        client.readContract({ ...read, functionName: "authorizedAt" }),
        client.readContract({ ...read, functionName: "recoveryNonce" }),
        client.readContract({ ...read, functionName: "approvalCount" }),
        client.readContract({
          ...read,
          functionName: "emergencyApprovalCount",
        }),
        client.readContract({ ...read, functionName: "recoveryPaused" }),
        client.readContract({ ...read, functionName: "eligibleAction" }),
      ]);
      const assets = await Promise.all(
        assetAddresses.map(async (asset) => {
          const token = { address: asset, abi: erc20Abi, blockNumber } as const;
          const [
            balance,
            accounted,
            snapshot,
            remaining,
            scheduled,
            emergency,
            decimals,
            symbol,
          ] = await Promise.all([
            asset === zeroAddress
              ? client.getBalance({ address: vault, blockNumber })
              : client.readContract({
                  ...token,
                  functionName: "balanceOf",
                  args: [vault],
                }),
            client.readContract({
              ...read,
              functionName: "accounted",
              args: [asset],
            }),
            client.readContract({
              ...read,
              functionName: "snapshot",
              args: [asset],
            }),
            client.readContract({
              ...read,
              functionName: "remaining",
              args: [asset],
            }),
            client.readContract({
              ...read,
              functionName: "claimable",
              args: [address ?? zeroAddress, asset, false],
            }),
            client.readContract({
              ...read,
              functionName: "claimable",
              args: [address ?? zeroAddress, asset, true],
            }),
            asset === zeroAddress
              ? 18
              : client.readContract({ ...token, functionName: "decimals" }),
            asset === zeroAddress
              ? "ETH"
              : client.readContract({ ...token, functionName: "symbol" }),
          ]);
          return {
            address: asset,
            balance,
            accounted,
            snapshot,
            remaining,
            scheduled,
            emergency,
            decimals,
            symbol: symbol.slice(0, 20),
          };
        }),
      );
      const config: Configuration = {
        beneficiaries: beneficiaries.map((b, i) => ({
          id: String(i),
          identity: rememberedIdentity(b.account, chain.id),
          resolvedIdentity:
            rememberedIdentity(b.account, chain.id) === b.account
              ? undefined
              : rememberedIdentity(b.account, chain.id),
          address: b.account,
          allocationBps: b.allocationBps,
        })),
        guardians: [...guardians],
        heartbeatInterval: Number(rules[0]),
        challengePeriod: Number(rules[1]),
        releaseInterval: Number(rules[2]),
        emergencyDelay: Number(rules[3]),
        initialBps: rules[4],
        trancheBps: rules[5],
        guardianThreshold: rules[6],
      };
      const [hasApproved, hasEmergencyApproved] = address
        ? await Promise.all([
            client.readContract({
              ...read,
              functionName: "approved",
              args: [recoveryNonce, address],
            }),
            client.readContract({
              ...read,
              functionName: "emergencyApproved",
              args: [recoveryNonce, address],
            }),
          ])
        : [false, false];
      return {
        owned,
        vault,
        blockNumber,
        timestamp: block.timestamp,
        owner,
        state,
        config,
        assets,
        deadline,
        pendingAt,
        authorizedAt,
        recoveryNonce,
        approvalCount,
        emergencyApprovalCount,
        paused,
        eligible,
        hasApproved,
        hasEmergencyApproved,
      };
    },
  });
}
type VaultQuery = ReturnType<typeof useVaultQuery>;
type ProtocolContextValue = {
  selected?: Address;
  select: (address?: Address) => void;
  query: VaultQuery;
  transaction: TransactionState;
  dismissTransaction: () => void;
  execute: (
    label: string,
    request: { to: Address; data: Hex; value?: bigint },
  ) => Promise<boolean>;
};
const ProtocolContext = createContext<ProtocolContextValue | null>(null);
export function useProtocol() {
  const context = useContext(ProtocolContext);
  if (!context) throw new Error("Protocol provider missing");
  return context;
}

export function ProtocolProvider({ children }: { children: ReactNode }) {
  const [selected, select] = useState<Address>();
  useEffect(() => {
    const fromFragment = () => {
      const value = new URLSearchParams(window.location.hash.slice(1)).get(
        "vault",
      );
      if (value && validAddress(value)) select(getAddress(value));
    };
    fromFragment();
    window.addEventListener("hashchange", fromFragment);
    return () => window.removeEventListener("hashchange", fromFragment);
  }, []);
  const query = useVaultQuery(selected);
  const [transaction, setTransaction] = useState<TransactionState>({
    phase: "idle",
  });
  const busy = useRef(false);
  const { address, chainId } = useConnection();
  const { data: wallet } = useWalletClient();
  const { client } = useReadTransport();
  const cache = useQueryClient();
  const execute: ProtocolContextValue["execute"] = async (label, request) => {
    if (busy.current) return false;
    busy.current = true;
    setTransaction({ phase: "signing", label });
    try {
      if (!wallet || !address)
        throw new Error("Connect your wallet to continue.");
      if (chainId !== chain.id)
        throw new Error(`Wrong network. Switch your wallet to ${chain.name}.`);
      if (!client)
        throw new Error(
          "Read transport is unavailable. Check Privacy & integrations.",
        );
      if ((await client.getChainId()) !== chain.id)
        throw new Error(
          "The read RPC serves the wrong network. Correct its URL before signing.",
        );
      if (!validAddress(request.to))
        throw new Error("Invalid transaction destination.");
      const destinationCode = await client.getBytecode({ address: request.to });
      if (!destinationCode || destinationCode === "0x")
        throw new Error(
          "No deployed contract exists at this destination on the selected network. Check configuration before signing.",
        );
      if (request.to === factoryAddress)
        await client.readContract({
          address: factoryAddress,
          abi: factoryAbi,
          functionName: "vaultCount",
        });
      setTransaction({ phase: "signing", label });
      // Simulate against real state before requesting a signature. Reads use the selected transport.
      await client.call({ account: address, ...request });
      const estimatedGas = await client.estimateGas({
        account: address,
        ...request,
      });
      const hash = await wallet.sendTransaction({
        account: address,
        chain,
        ...request,
        gas: estimatedGas + estimatedGas / 5n,
      });
      setTransaction({ phase: "confirming", hash, label });
      let cancelled = false;
      let confirmedReceipt: TransactionReceipt | undefined;
      const confirmed = await confirmTransaction(hash, async (hash) => {
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 1,
          timeout: 180000,
          onReplaced: (replacement) => {
            cancelled = replacement.reason !== "repriced";
            setTransaction({
              phase: "confirming",
              label,
              hash: replacement.transaction.hash,
            });
          },
        });
        if (cancelled)
          throw new Error(
            "This transaction was cancelled in your wallet. The requested operation was not completed.",
          );
        confirmedReceipt = receipt;
        return receipt;
      });
      if (request.to === factoryAddress && confirmedReceipt) {
        let verifiedCreation = false;
        for (const log of confirmedReceipt.logs) {
          if (log.address.toLowerCase() !== factoryAddress?.toLowerCase())
            continue;
          try {
            const event = decodeEventLog({
              abi: factoryAbi,
              data: log.data,
              topics: log.topics,
            });
            if (
              event.eventName === "VaultCreated" &&
              event.args.owner.toLowerCase() === address.toLowerCase()
            ) {
              verifiedCreation = true;
              select(getAddress(event.args.vault));
            }
          } catch {
            /* Other logs are not factory creation events. */
          }
        }
        if (!verifiedCreation)
          throw new Error(
            "The transaction was mined, but no matching vault creation event was verified. Inspect its receipt and factory configuration before retrying.",
          );
      }
      await Promise.allSettled([
        cache.invalidateQueries({ queryKey: ["vault"] }),
        cache.invalidateQueries({ queryKey: ["activity"] }),
      ]);
      setTransaction({ ...confirmed, label });
      return true;
    } catch (error) {
      setTransaction((t) => ({
        ...t,
        phase: "failed",
        label,
        error: transactionError(error),
      }));
      return false;
    } finally {
      busy.current = false;
    }
  };
  return (
    <ProtocolContext.Provider
      value={{
        selected,
        select,
        query,
        transaction,
        execute,
        dismissTransaction: () => {
          if (!busy.current) setTransaction({ phase: "idle" });
        },
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
}

export function useActivity(vault?: Address, earlierBlocks = 0) {
  const { client } = useReadTransport();
  return useQuery({
    queryKey: ["activity", vault, earlierBlocks, client?.uid],
    enabled: !!client && !!vault,
    refetchInterval: 20000,
    queryFn: async () => {
      if (!client || !vault) throw new Error("Select a vault first.");
      const latest = await client.getBlockNumber();
      const window = BigInt(10000 + earlierBlocks);
      const start = latest > window ? latest - window : 0n;
      const from = deploymentBlock > start ? deploymentBlock : start;
      const events = [];
      // Bounded chunks work with providers that reject broad eth_getLogs scans.
      for (let block = from; block <= latest; block += 2000n) {
        const toBlock = block + 1999n < latest ? block + 1999n : latest;
        const logs = await client.getContractEvents({
          address: vault,
          abi: vaultAbi,
          fromBlock: block,
          toBlock,
        });
        events.push(...logs);
      }
      return { events: events.reverse(), from, latest };
    },
  });
}
