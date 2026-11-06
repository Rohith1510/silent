"use client";
import Link from "next/link";
import { useState } from "react";
import { useConnection } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Copy,
  GitBranch,
  HeartPulse,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
  Vault as VaultIcon,
} from "lucide-react";
import {
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  getAddress,
  zeroAddress,
  type Address,
} from "viem";
import { SilentSovereignVaultAbi as abi } from "@/lib/generated/SilentSovereignVault";
import { chain, environmentIssues } from "@/lib/network";
import { secondsLabel, shortAddress, validAddress } from "@/lib/configuration";
import { transactionError } from "@/lib/transaction";
import { parseAssetAmount } from "@/lib/assets";
import { states, useActivity, useProtocol } from "./protocol-provider";
import { useReadTransport } from "./providers";
import {
  Badge,
  Empty,
  External,
  Field,
  Notice,
  PageHeader,
  Panel,
  WalletButton,
} from "./ui";

const date = (timestamp?: bigint) =>
  timestamp
    ? new Date(Number(timestamp) * 1000).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
const units = (value: bigint, decimals: number) => formatUnits(value, decimals);
function VaultSelector() {
  const { query, select, selected } = useProtocol();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="vault-selector">
      <div className="selector-owned">
        <VaultIcon size={16} />
        <select
          aria-label="Select owned vault"
          value={selected || ""}
          onChange={(e) =>
            select(e.target.value ? getAddress(e.target.value) : undefined)
          }
        >
          <option value="">Latest owned vault</option>
          {query.data?.owned.map((v) => (
            <option key={v} value={v}>
              {shortAddress(v)}
            </option>
          ))}
        </select>
      </div>
      <form
        className="vault-lookup"
        onSubmit={(e) => {
          e.preventDefault();
          if (validAddress(input)) {
            select(getAddress(input));
            setError("");
          } else setError("Enter a valid vault address.");
        }}
      >
        <input
          aria-label="Vault address to inspect"
          placeholder="Review a vault by address — no wallet connection needed"
          value={input}
          onChange={(e) => setInput(e.target.value.trim())}
        />
        <button className="button small-button" type="submit">
          Open <ArrowUpRight size={13} />
        </button>
      </form>
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}
function VaultGate({ children }: { children: React.ReactNode }) {
  const { query } = useProtocol();
  const { address } = useConnection();
  const { privacy, client } = useReadTransport();
  if (environmentIssues.length)
    return (
      <Panel>
        <Empty
          title="Contract not configured"
          description="Your workspace is ready. Deploy the factory in Remix and add its address to connect this app to your protocol."
          action={
            <Link href="/settings" className="button primary">
              View setup instructions <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="gate-note">
          <Notice>{environmentIssues.join(" ")}</Notice>
        </div>
      </Panel>
    );
  if (!client)
    return (
      <Panel>
        <Empty
          title={
            privacy.mode === "failed"
              ? "Read transport unavailable"
              : "Connecting to your read transport"
          }
          description={privacy.detail}
          action={
            <Link href="/privacy" className="button">
              Review connection
            </Link>
          }
        />
      </Panel>
    );
  if (query.error)
    return (
      <Panel>
        <Empty
          title="Vault read failed"
          description={transactionError(query.error)}
          action={
            <button className="button" onClick={() => query.refetch()}>
              <RefreshCw size={14} />
              Retry real reads
            </button>
          }
        />
      </Panel>
    );
  if (query.isLoading)
    return (
      <Panel>
        <Empty
          title="Reading your vault"
          description="Checking the factory and contract state on the configured network."
        />
      </Panel>
    );
  if (!query.data?.vault)
    return (
      <Panel>
        <Empty
          title={
            address
              ? "Your future starts with a plan."
              : "Your legacy is yours to protect."
          }
          description={
            address
              ? "This wallet has no vault in the configured factory. Create one, or open an existing vault by address above."
              : "Inspect a vault by entering its address above, without connecting. Connect only to discover your own vaults or take an authorized action."
          }
          action={
            address ? (
              <Link className="button primary" href="/create">
                <Plus size={15} />
                Create your first vault
              </Link>
            ) : (
              <WalletButton />
            )
          }
        />
      </Panel>
    );
  return <>{children}</>;
}
export function OverviewPage() {
  const { query } = useProtocol();
  const data = query.data;
  const eth = data?.assets?.find((a) => a.address === zeroAddress);
  return (
    <>
      <PageHeader
        title="A future, protected."
        description="Your assets. Your people. A plan that stays in your hands."
        action={
          <Link href="/create" className="button primary">
            <Plus size={15} />
            Create vault
          </Link>
        }
      />
      <VaultSelector />
      <VaultGate>
        <div className="overview-stats">
          <div className="stat">
            <div>
              <span>Inheritance reserve</span>
              <VaultIcon size={17} />
            </div>
            <strong>
              {eth ? units(eth.balance, eth.decimals) : "—"}
              <small> ETH</small>
            </strong>
            <p>Assets inside this vault · verified on {chain.name}</p>
          </div>
          <div className="stat">
            <div>
              <span>Recovery state</span>
              <ShieldCheck size={17} />
            </div>
            <strong className="stat-state">
              {data?.state === undefined ? "—" : states[data.state]}
            </strong>
            <p>
              {data?.paused
                ? "Recovery requests paused by owner"
                : "Contract-enforced safeguards"}
            </p>
          </div>
          <div className="stat">
            <div>
              <span>People protected</span>
              <Users size={17} />
            </div>
            <strong>
              {data?.config?.beneficiaries.length ?? "—"}
              <small> beneficiaries</small>
            </strong>
            <p>
              {data?.config?.guardianThreshold ?? "—"} guardian approvals
              required
            </p>
          </div>
        </div>
        <div className="overview-grid">
          <Panel
            title="Your inheritance plan"
            description="A deliberate path from custody to continuity."
            action={
              <Link className="inline-link" href="/builder">
                Open builder <ArrowUpRight size={14} />
              </Link>
            }
          >
            <div className="plan-visual">
              <div className="mini-node">
                <span className="icon-tile violet">
                  <VaultIcon size={19} />
                </span>
                <strong>Your vault</strong>
                <small>{shortAddress(data?.vault)}</small>
              </div>
              <div className="mini-connector" />
              <div className="mini-node">
                <span className="icon-tile">
                  <ShieldCheck size={19} />
                </span>
                <strong>Safeguards</strong>
                <small>Quorum + challenge</small>
              </div>
              <div className="mini-connector" />
              <div className="mini-node">
                <span className="icon-tile blue">
                  <Users size={19} />
                </span>
                <strong>Your people</strong>
                <small>{data?.config?.beneficiaries.length} allocations</small>
              </div>
            </div>
            <div className="beneficiary-rows">
              {data?.config?.beneficiaries.map((b, i) => (
                <div className="beneficiary-row" key={b.id}>
                  <span className={`avatar avatar-${i % 3}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <External hash={b.address} kind="address" />
                    <small>Pinned beneficiary address</small>
                  </div>
                  <strong>{b.allocationBps / 100}%</strong>
                  <div className="allocation-track">
                    <span style={{ width: `${b.allocationBps / 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel
            title="Your next check-in"
            description="A small signal. An essential safeguard."
          >
            <div className="heartbeat-orb">
              <HeartPulse size={40} strokeWidth={1.2} />
            </div>
            <div className="checkin-date">{date(data?.deadline)}</div>
            <p className="center muted small">
              Liveness deadline ·{" "}
              {data?.config && secondsLabel(data.config.heartbeatInterval)}{" "}
              interval
            </p>
            <Link href="/recovery" className="button full">
              <HeartPulse size={15} />
              Manage liveness
            </Link>
            <div className="fine-note">
              A missed check-in never releases assets automatically.
            </div>
          </Panel>
        </div>
        <ActivityPanel compact />
      </VaultGate>
      <div className="overview-bottom">
        <div>
          <span className="icon-tile">
            <GitBranch size={20} />
          </span>
          <div>
            <strong>Make your plan personal.</strong>
            <p>Design allocations and safeguards on a visual canvas.</p>
          </div>
          <Link href="/builder" className="inline-link">
            Explore builder <ArrowRight size={14} />
          </Link>
        </div>
        <div>
          <span className="icon-tile">
            <ShieldCheck size={20} />
          </span>
          <div>
            <strong>Know what protects you.</strong>
            <p>Understand the privacy and security boundaries.</p>
          </div>
          <Link href="/privacy" className="inline-link">
            See architecture <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}

export function VaultDetailsPage() {
  const { query } = useProtocol();
  const d = query.data;
  const [copied, setCopied] = useState(false);
  return (
    <>
      <PageHeader
        title="Your sovereign vault."
        description="Isolated custody. Transparent accounting. Every asset, verified onchain."
        action={
          <Link className="button" href="/builder">
            <GitBranch size={15} />
            Edit plan
          </Link>
        }
      />
      <VaultSelector />
      <VaultGate>
        {d?.vault && (
          <div className="vault-address-bar">
            <Badge tone={d.state === 0 ? "green" : "amber"}>
              {states[d.state!]}
            </Badge>
            <External hash={d.vault} kind="address">
              {d.vault}
            </External>
            <button
              aria-label="Copy vault address"
              className="icon-button"
              onClick={async () => {
                await navigator.clipboard.writeText(d.vault!);
                setCopied(true);
              }}
            >
              {copied ? "Copied" : <Copy size={14} />}
            </button>
            <span className="muted small">
              Verified at block {d.blockNumber.toString()}
            </span>
          </div>
        )}
        <div className="two-column">
          <Panel
            title="Assets in your vault"
            description="Raw balance is shown separately from protected accounting."
          >
            <div className="asset-table">
              <div className="asset-table-heading">
                <span>ASSET</span>
                <span>ONCHAIN BALANCE</span>
                <span>
                  {d?.state === 0 ? "ACCOUNTED" : "UNCLAIMED SNAPSHOT"}
                </span>
              </div>
              {d?.assets?.map((a) => (
                <div className="asset-row" key={a.address}>
                  <div>
                    <span
                      className={`asset-icon ${a.address === zeroAddress ? "eth" : ""}`}
                    >
                      {a.address === zeroAddress ? "Ξ" : a.symbol.slice(0, 1)}
                    </span>
                    <span>
                      <strong>{a.symbol}</strong>
                      <small>
                        {a.address === zeroAddress
                          ? "Native asset"
                          : shortAddress(a.address)}
                      </small>
                    </span>
                  </div>
                  <strong className="mono">
                    {units(a.balance, a.decimals)}
                  </strong>
                  <span className="mono">
                    {units(
                      d.state === 0 ? a.accounted : a.remaining,
                      a.decimals,
                    )}
                  </span>
                </div>
              ))}
            </div>
            <Notice>
              Only accounted deposits enter the recovery snapshot. Direct ERC-20
              donations, forced ETH and transfers after authorization cannot
              expand a beneficiary’s allocation.
            </Notice>
          </Panel>
          <AssetOperations />
        </div>
        <Panel
          title="Vault configuration"
          description="Read directly from this vault at one block."
        >
          <div className="configuration-readout">
            <div>
              <small>Owner</small>
              <strong>{shortAddress(d?.owner)}</strong>
            </div>
            <div>
              <small>Heartbeat</small>
              <strong>
                {d?.config && secondsLabel(d.config.heartbeatInterval)}
              </strong>
            </div>
            <div>
              <small>Challenge</small>
              <strong>
                {d?.config && secondsLabel(d.config.challengePeriod)}
              </strong>
            </div>
            <div>
              <small>Guardian quorum</small>
              <strong>
                {d?.config?.guardianThreshold} of {d?.config?.guardians.length}
              </strong>
            </div>
            <div>
              <small>Initial allowance</small>
              <strong>{(d?.config?.initialBps || 0) / 100}% of share</strong>
            </div>
            <div>
              <small>Recurring allowance</small>
              <strong>
                {(d?.config?.trancheBps || 0) / 100}% /{" "}
                {d?.config && secondsLabel(d.config.releaseInterval)}
              </strong>
            </div>
          </div>
        </Panel>
        <ActivityPanel compact />
      </VaultGate>
    </>
  );
}

function AssetOperations() {
  const { query, execute, transaction } = useProtocol();
  const { address, chainId } = useConnection();
  const { client } = useReadTransport();
  const [tab, setTab] = useState("deposit");
  const [assetAddress, setAsset] = useState<Address>(zeroAddress);
  const [amount, setAmount] = useState("");
  const [tokenAddress, setToken] = useState("");
  const [ack, setAck] = useState(false);
  const [error, setError] = useState("");
  const d = query.data;
  const asset = d?.assets?.find((a) => a.address === assetAddress);
  let parsed = 0n;
  let amountError = "";
  try {
    if (asset && amount) parsed = parseAssetAmount(amount, asset.decimals);
  } catch (error) {
    amountError = transactionError(error);
  }
  const isOwner = address?.toLowerCase() === d?.owner?.toLowerCase();
  const busy = ["signing", "confirming"].includes(transaction.phase);
  const connected = !!address && chainId === chain.id;
  const allowance = useQuery({
    queryKey: [
      "allowance",
      address,
      d?.vault,
      assetAddress,
      transaction.hash,
      transaction.phase,
    ],
    enabled:
      !!client && !!address && !!d?.vault && assetAddress !== zeroAddress,
    queryFn: async () =>
      client!.readContract({
        address: assetAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, d!.vault!],
      }),
    refetchInterval: 15000,
  });
  const walletBalance = useQuery({
    queryKey: ["spendable-native", address, client?.uid, transaction.phase],
    enabled: !!client && !!address && tab === "deposit",
    queryFn: () => client!.getBalance({ address: address! }),
    staleTime: 15000,
  });
  const approveNeeded =
    assetAddress !== zeroAddress &&
    (allowance.data === undefined || allowance.data < parsed);
  const transact = async (
    operation:
      | "deposit"
      | "withdraw"
      | "approve"
      | "scheduled"
      | "emergency"
      | "support",
  ) => {
    if (!d?.vault) return;
    setError("");
    try {
      let data;
      let to = d.vault;
      let value: bigint | undefined;
      if (operation === "support") {
        if (!validAddress(tokenAddress) || !ack)
          throw new Error(
            "Enter a standard token contract and acknowledge its accounting requirements.",
          );
        data = encodeFunctionData({
          abi,
          functionName: "addSupportedToken",
          args: [getAddress(tokenAddress)],
        });
      } else if (operation === "scheduled" || operation === "emergency")
        data = encodeFunctionData({
          abi,
          functionName: "claim",
          args: [assetAddress, operation === "emergency"],
        });
      else {
        if (parsed <= 0n) throw new Error("Enter a positive asset amount.");
        if (
          operation === "deposit" &&
          assetAddress === zeroAddress &&
          client &&
          address &&
          parsed >= (await client.getBalance({ address }))
        )
          throw new Error(
            "Keep native tokens in your wallet for gas. Choose a smaller reserve deposit.",
          );
        if (operation === "approve") {
          to = assetAddress;
          data = encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [d.vault, parsed],
          });
        } else if (operation === "withdraw")
          data = encodeFunctionData({
            abi,
            functionName: "withdraw",
            args: [assetAddress, parsed],
          });
        else if (assetAddress === zeroAddress) {
          data = encodeFunctionData({ abi, functionName: "depositNative" });
          value = parsed;
        } else
          data = encodeFunctionData({
            abi,
            functionName: "depositToken",
            args: [assetAddress, parsed],
          });
      }
      await execute(
        operation === "support"
          ? "Enable standard token"
          : operation === "approve"
            ? `Approve ${amount} ${asset?.symbol}`
            : operation === "scheduled"
              ? "Claim scheduled allowance"
              : operation === "emergency"
                ? "Claim emergency remainder"
                : `${operation === "deposit" ? "Deposit" : "Withdraw"} ${amount} ${asset?.symbol}`,
        { to, data, value },
      );
    } catch (e) {
      setError(transactionError(e));
    }
  };
  return (
    <Panel
      title="Manage your inheritance reserve"
      description="Reserve a chosen portion of your assets. Withdraw to your wallet while the vault is active."
    >
      <div className="segmented">
        {["deposit", "withdraw", "claim"].map((t) => (
          <button
            key={t}
            className={t === tab ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="operation-form">
        {tab === "deposit" && (
          <Notice>
            Only deposited assets are protected. Keep spending money and gas in
            your wallet. Funds invested elsewhere are outside this vault.
            {walletBalance.data !== undefined &&
              ` Wallet native balance: ${units(walletBalance.data, 18)} ETH.`}
          </Notice>
        )}
        {tab === "withdraw" && (
          <Notice>
            Withdrawn funds leave your inheritance reserve. Beneficiary
            percentages apply to the assets remaining when recovery is
            authorized. Cancel pending recovery before normal management.
          </Notice>
        )}
        <Field label="Asset">
          <select
            value={assetAddress}
            onChange={(e) => setAsset(getAddress(e.target.value))}
          >
            {d?.assets?.map((a) => (
              <option key={a.address} value={a.address}>
                {a.symbol} ·{" "}
                {a.address === zeroAddress ? "Native" : shortAddress(a.address)}
              </option>
            ))}
          </select>
        </Field>
        {tab !== "claim" ? (
          <>
            <Field
              label="Amount"
              hint={
                amountError ||
                (tab === "withdraw"
                  ? "Withdrawals are available only to the owner while active."
                  : "Deposits are available only while the vault is active.")
              }
            >
              <input
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <div className="transaction-preview">
              <span>You {tab === "deposit" ? "deposit" : "withdraw"}</span>
              <strong>
                {amount || "0"} {asset?.symbol}
              </strong>
            </div>
            {tab === "deposit" && approveNeeded && (
              <button
                className="button full"
                disabled={!connected || busy || parsed <= 0n || d?.state !== 0}
                onClick={() => transact("approve")}
              >
                Approve exactly {amount || "0"} {asset?.symbol}
              </button>
            )}
            <button
              className="button primary full"
              disabled={
                !connected ||
                busy ||
                parsed <= 0n ||
                d?.state !== 0 ||
                (tab === "withdraw" &&
                  (!isOwner || parsed > (asset?.accounted || 0n))) ||
                (tab === "deposit" && approveNeeded)
              }
              onClick={() => transact(tab as "deposit" | "withdraw")}
            >
              {tab === "deposit" ? (
                <ArrowDownLeft size={15} />
              ) : (
                <ArrowUpRight size={15} />
              )}
              {tab === "deposit" ? "Deposit to vault" : "Withdraw to owner"}
            </button>
          </>
        ) : (
          <>
            <div className="claim-readout">
              <span>Scheduled allowance available</span>
              <strong>
                {asset ? units(asset.scheduled, asset.decimals) : "—"}{" "}
                {asset?.symbol}
              </strong>
              <button
                className="button primary full"
                disabled={!connected || busy || !asset?.scheduled}
                onClick={() => transact("scheduled")}
              >
                Claim scheduled allowance
              </button>
            </div>
            <div className="claim-readout">
              <span>Emergency remainder available</span>
              <strong>
                {asset ? units(asset.emergency, asset.decimals) : "—"}{" "}
                {asset?.symbol}
              </strong>
              <button
                className="button full"
                disabled={!connected || busy || !asset?.emergency}
                onClick={() => transact("emergency")}
              >
                Claim emergency remainder
              </button>
              <small>
                Requires the additional delay and a fresh guardian quorum. Paid
                amounts are deducted from both modes.
              </small>
            </div>
          </>
        )}
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        {isOwner && d?.state === 0 && (
          <details className="add-token">
            <summary>Add a supported ERC-20</summary>
            <Field label="Token contract address">
              <input
                placeholder="0x…"
                value={tokenAddress}
                onChange={(e) => setToken(e.target.value.trim())}
              />
            </Field>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={ack}
                onChange={(e) => setAck(e.target.checked)}
              />
              I verified this token is standard, non-rebasing and has no
              transfer fees.
            </label>
            <button
              className="button full"
              disabled={busy || !ack || !validAddress(tokenAddress)}
              onClick={() => transact("support")}
            >
              <Plus size={14} />
              Enable token
            </button>
          </details>
        )}
      </div>
    </Panel>
  );
}

export function RecoveryPage() {
  const { query, execute, transaction } = useProtocol();
  const { address, chainId } = useConnection();
  const d = query.data;
  const owner = !!address && d?.owner?.toLowerCase() === address.toLowerCase();
  const guardian =
    !!address &&
    d?.config?.guardians.some((g) => g.toLowerCase() === address.toLowerCase());
  const busy = ["signing", "confirming"].includes(transaction.phase);
  const disabled = busy || !address || chainId !== chain.id;
  type RecoveryCall =
    | [
        "heartbeat" | "cancelRecovery" | "requestRecovery" | "finalizeRecovery",
        [],
      ]
    | ["setRecoveryPaused", [boolean]]
    | ["approveRecovery", [bigint, boolean]];
  const action = (label: string, ...[functionName, args]: RecoveryCall) => {
    const data =
      functionName === "setRecoveryPaused"
        ? encodeFunctionData({ abi, functionName, args })
        : functionName === "approveRecovery"
          ? encodeFunctionData({ abi, functionName, args })
          : encodeFunctionData({ abi, functionName });
    return d?.vault && execute(label, { to: d.vault, data });
  };
  return (
    <>
      <PageHeader
        title="Presence is protection."
        description="Keep your plan active. Follow every recovery safeguard, onchain."
      />
      <VaultSelector />
      <VaultGate>
        <div className="recovery-state-header">
          <Badge tone={d?.state === 0 ? "green" : "amber"}>
            {d?.state === undefined ? "Unknown" : states[d.state]}
          </Badge>
          <span className="muted small">
            Request nonce {d?.recoveryNonce?.toString()} · as of block{" "}
            {d?.blockNumber.toString()}
          </span>
        </div>
        <div className="state-machine">
          {states.map((state, i) => (
            <div
              className={`${d?.state === i ? "current" : ""} ${(d?.state ?? -1) > i ? "passed" : ""}`}
              key={state}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{state}</strong>
              {i < states.length - 1 && <ArrowRight size={14} />}
            </div>
          ))}
        </div>
        <div className="two-column">
          <Panel
            title="Liveness & owner controls"
            description="Check-ins are public transactions. Choose an interval you can sustain."
          >
            <dl>
              <div>
                <dt>Liveness deadline</dt>
                <dd>{date(d?.deadline)}</dd>
              </div>
              <div>
                <dt>Time remaining at last block</dt>
                <dd>
                  {d?.deadline && d.deadline > d.timestamp
                    ? secondsLabel(Number(d.deadline - d.timestamp))
                    : "Deadline passed"}
                </dd>
              </div>
              <div>
                <dt>Recovery requests</dt>
                <dd>
                  {d?.paused
                    ? "Paused by owner"
                    : d?.config?.guardianThreshold
                      ? "Enabled"
                      : "Disabled · no guardians"}
                </dd>
              </div>
            </dl>
            <div className="stack-buttons">
              <button
                className="button primary"
                disabled={
                  disabled || !owner || (d?.state !== 0 && d?.state !== 1)
                }
                onClick={() =>
                  action("Submit liveness check-in", "heartbeat", [])
                }
              >
                <HeartPulse size={15} />
                {d?.state === 1
                  ? "Check in & cancel recovery"
                  : "Submit check-in"}
              </button>
              <button
                className="button"
                disabled={disabled || !owner || d?.state !== 1}
                onClick={() =>
                  action("Cancel pending recovery", "cancelRecovery", [])
                }
              >
                Cancel pending recovery
              </button>
              <button
                className="button"
                disabled={
                  disabled || !owner || (d?.state !== 0 && d?.state !== 1)
                }
                onClick={() =>
                  action(
                    d?.paused
                      ? "Resume recovery requests"
                      : "Pause recovery requests",
                    "setRecoveryPaused",
                    [!d?.paused],
                  )
                }
              >
                {d?.paused
                  ? "Resume recovery requests"
                  : "Pause recovery requests"}
              </button>
            </div>
            <Notice>
              Owner cancellation remains possible while recovery is pending.
              Once authorization is finalized, owner withdrawals and changes are
              permanently disabled.
            </Notice>
          </Panel>
          <Panel
            title="Recovery safeguards"
            description="All conditions are checked independently by the vault."
          >
            <dl>
              <div>
                <dt>Challenge ends</dt>
                <dd>
                  {date(
                    d?.pendingAt
                      ? d.pendingAt + BigInt(d.config!.challengePeriod)
                      : undefined,
                  )}
                </dd>
              </div>
              <div>
                <dt>Guardian approvals</dt>
                <dd>
                  {d?.approvalCount?.toString()} /{" "}
                  {d?.config?.guardianThreshold}
                </dd>
              </div>
              <div>
                <dt>Emergency approvals</dt>
                <dd>
                  {d?.emergencyApprovalCount?.toString()} /{" "}
                  {d?.config?.guardianThreshold}
                </dd>
              </div>
              <div>
                <dt>Emergency release after</dt>
                <dd>
                  {d?.config?.emergencyDelay
                    ? date(
                        d.authorizedAt
                          ? d.authorizedAt + BigInt(d.config.emergencyDelay)
                          : undefined,
                      )
                    : "Disabled"}
                </dd>
              </div>
            </dl>
            <div className="stack-buttons">
              <button
                className="button"
                disabled={disabled || d?.eligible !== 1}
                onClick={() =>
                  action("Request safeguarded recovery", "requestRecovery", [])
                }
              >
                Request recovery after deadline
              </button>
              <button
                className="button"
                disabled={
                  disabled || !guardian || d?.state !== 1 || d.hasApproved
                }
                onClick={() =>
                  action("Approve recovery request", "approveRecovery", [
                    d!.recoveryNonce!,
                    false,
                  ])
                }
              >
                {d?.hasApproved
                  ? "Your approval is recorded"
                  : "Approve recovery as guardian"}
              </button>
              <button
                className="button primary"
                disabled={disabled || d?.eligible !== 2}
                onClick={() =>
                  action(
                    "Authorize recovery after safeguards",
                    "finalizeRecovery",
                    [],
                  )
                }
              >
                Finalize eligible recovery
              </button>
              <button
                className="button"
                disabled={
                  disabled ||
                  !guardian ||
                  (d?.state !== 2 && d?.state !== 3) ||
                  !d.config?.emergencyDelay ||
                  d.hasEmergencyApproved
                }
                onClick={() =>
                  action("Approve emergency acceleration", "approveRecovery", [
                    d!.recoveryNonce!,
                    true,
                  ])
                }
              >
                {d?.hasEmergencyApproved
                  ? "Emergency approval recorded"
                  : "Approve emergency acceleration"}
              </button>
              <Link className="button" href="/vault">
                Open beneficiary claims <ArrowUpRight size={14} />
              </Link>
            </div>
          </Panel>
        </div>
        <Notice>
          Inactivity does not establish death. Guardians are trusted to assess
          the circumstances. Any connected wallet or CRE may submit an eligible
          transition; neither can skip the challenge period or quorum.
        </Notice>
      </VaultGate>
    </>
  );
}

export function ActivityPanel({ compact = false }: { compact?: boolean }) {
  const { query } = useProtocol();
  const [earlier, setEarlier] = useState(0);
  const logs = useActivity(query.data?.vault, earlier);
  const events = compact ? logs.data?.events.slice(0, 5) : logs.data?.events;
  return (
    <Panel
      title="Onchain activity"
      description="Contract events with real transaction references."
      action={
        compact ? (
          <Link href="/activity" className="inline-link">
            View all <ArrowUpRight size={14} />
          </Link>
        ) : (
          <button
            className="icon-button"
            aria-label="Refresh activity"
            onClick={() => logs.refetch()}
          >
            <RefreshCw size={15} />
          </button>
        )
      }
    >
      {logs.error ? (
        <Notice danger>{transactionError(logs.error)}</Notice>
      ) : logs.isLoading ? (
        <p className="padded muted">Reading actual contract events…</p>
      ) : !events?.length ? (
        <div className="activity-empty">
          <Activity size={21} />
          <span>No events in the loaded block range.</span>
        </div>
      ) : (
        <div className="activity-list">
          {events.map((log) => (
            <div
              className="activity-row"
              key={`${log.transactionHash}:${log.logIndex}`}
            >
              <span className="activity-icon">
                <Activity size={15} />
              </span>
              <div>
                <strong>
                  {log.eventName?.replace(/([A-Z])/g, " $1").trim()}
                </strong>
                <small>
                  Block {log.blockNumber?.toString()} ·{" "}
                  {Object.entries(log.args)
                    .map(
                      ([k, v]) =>
                        `${k}: ${typeof v === "string" && v.startsWith("0x") ? shortAddress(v) : String(v)}`,
                    )
                    .join(" · ")}
                </small>
              </div>
              {log.transactionHash && (
                <External hash={log.transactionHash}>Transaction</External>
              )}
            </div>
          ))}
        </div>
      )}
      {!compact && logs.data && (
        <div className="activity-range">
          <span>
            Loaded blocks {logs.data.from.toString()}–
            {logs.data.latest.toString()}. Recent logs may change in a chain
            reorganization.
          </span>
          <button
            className="button small-button"
            disabled={
              logs.data.from <= 0n || logs.isFetching || earlier >= 90000
            }
            onClick={() => setEarlier(earlier + 10000)}
          >
            Load earlier blocks
          </button>
        </div>
      )}
    </Panel>
  );
}
export function ActivityPage() {
  return (
    <>
      <PageHeader
        title="A transparent record."
        description="Real contract events. Real transaction references. Directly from your vault."
      />
      <VaultSelector />
      <VaultGate>
        <ActivityPanel />
      </VaultGate>
    </>
  );
}
