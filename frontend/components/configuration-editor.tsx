"use client";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useConnection } from "wagmi";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Connection,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ArrowRight,
  Check,
  Clock3,
  GitBranch,
  HeartPulse,
  Fingerprint,
  KeyRound,
  LayoutGrid,
  Maximize2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  Vault,
  X,
  Zap,
} from "lucide-react";
import { encodeFunctionData, getAddress, isAddress } from "viem";
import {
  buildGraph,
  defaultConfiguration,
  secondsLabel,
  serializeConfiguration,
  shortAddress,
  validateGraph,
  type Configuration,
  type Graph,
  type NodeKind,
  type ProtocolNode,
} from "@/lib/configuration";
import { SilentSovereignFactoryAbi } from "@/lib/generated/SilentSovereignFactory";
import { SilentSovereignVaultAbi } from "@/lib/generated/SilentSovereignVault";
import { chain, environmentIssues, factoryAddress } from "@/lib/network";
import {
  inspectIdentity,
  inspectEnsProfile,
  registryEntry,
  rememberIdentity,
  rememberIdentityHealth,
  rememberedIdentity,
} from "@/lib/ens";
import { IdentityManager } from "./identity-manager";
import { EnsFamilySetup } from "./ens-family-setup";
import { transactionError } from "@/lib/transaction";
import { useProtocol } from "./protocol-provider";
import { useReadTransport } from "./providers";
import { Badge, Field, Notice, PageHeader, Panel, StepIcon } from "./ui";

const icons = {
  owner: KeyRound,
  vault: Vault,
  heartbeat: HeartPulse,
  guardians: ShieldCheck,
  challenge: Clock3,
  allowance: GitBranch,
  emergency: Zap,
  beneficiary: Users,
};
type BeneficiaryProfilePreview = {
  avatar?: string;
  description?: string;
};

function profileInitials(label: string) {
  const value = label.split(".")[0].replace(/[-_]+/g, " ").trim();
  const initials = value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "B";
}

function ProtocolNodeView({ data, selected }: NodeProps<ProtocolNode>) {
  const Icon = icons[data.kind];
  const target =
    data.kind === "guardians" ||
    data.kind === "allowance" ||
    data.kind === "emergency"
      ? Position.Top
      : data.kind === "challenge"
        ? Position.Right
        : Position.Left;
  const source =
    data.kind === "heartbeat" || data.kind === "challenge"
      ? Position.Bottom
      : data.kind === "guardians"
        ? Position.Left
        : Position.Right;
  return (
    <div
      className={`protocol-node ${selected ? "selected" : ""} ${data.invalid ? "invalid" : ""} kind-${data.kind}`}
    >
      <Handle type="target" position={target} />
      <div className="protocol-node-top">
        <span className="node-symbol">
          <Icon size={17} />
        </span>
        <span className="node-kind">{data.kind}</span>
        <span className={`status-dot ${data.invalid ? "red-dot" : ""}`} />
      </div>
      {data.kind === "beneficiary" ? (
        <div className="node-person-profile">
          <span className="node-person-avatar">
            {data.profileAvatar ? (
              // ENS avatars are public, user-controlled remote resources.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.profileAvatar}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : (
              profileInitials(data.label)
            )}
          </span>
          <span className="node-person-copy">
            <strong>{data.label}</strong>
            {data.profileDescription && (
              <small className="node-person-description">
                {data.profileDescription}
              </small>
            )}
            <small>{data.detail}</small>
            {data.profileAddress && (
              <span className="node-person-address">
                {shortAddress(data.profileAddress)}
              </span>
            )}
          </span>
        </div>
      ) : (
        <>
          <strong>{data.label}</strong>
          <small>{data.detail}</small>
        </>
      )}
      {data.invalid && (
        <span className="node-error">Configuration needs attention</span>
      )}
      <Handle type="source" position={source} />
    </div>
  );
}
const nodeTypes = { protocol: ProtocolNodeView };
const fieldKinds: { kind: NodeKind; label: string }[] = [
  { kind: "vault", label: "People" },
  { kind: "heartbeat", label: "Liveness" },
  { kind: "guardians", label: "Guardians" },
  { kind: "challenge", label: "Challenge" },
  { kind: "allowance", label: "Schedule" },
  { kind: "emergency", label: "Emergency" },
];

export function ConfigurationScreen({
  mode,
}: {
  mode: "create" | "builder" | "beneficiaries";
}) {
  const { query } = useProtocol();
  if (mode !== "create" && query.isLoading)
    return (
      <div className="loading-page">Reading verified vault configuration…</div>
    );
  return (
    <ConfigurationEditor
      key={mode === "create" ? "new" : query.data?.vault || "draft"}
      mode={mode}
      initial={
        mode === "create"
          ? defaultConfiguration
          : query.data?.config || defaultConfiguration
      }
    />
  );
}
function ConfigurationEditor({
  mode,
  initial,
}: {
  mode: "create" | "builder" | "beneficiaries";
  initial: Configuration;
}) {
  const edgeGradient = `flow-edge-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { address, chainId } = useConnection();
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const renderedAddress = hydrated ? address : undefined;
  const { client } = useReadTransport();
  const { query, execute, transaction } = useProtocol();
  const vault =
    hydrated && mode !== "create" ? query.data?.vault : undefined;
  const owner = vault ? query.data?.owner : renderedAddress;
  const [config, setConfig] = useState<Configuration>(() =>
    structuredClone(initial),
  );
  const [graph, setGraph] = useState<Graph>(() => buildGraph(initial));
  const [selected, setSelected] = useState<NodeKind>("vault");
  const [selectedId, setSelectedId] = useState<string>();
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState<string>();
  const [guardianResolving, setGuardianResolving] = useState<number>();
  const [beneficiaryProfiles, setBeneficiaryProfiles] = useState<
    Record<string, BeneficiaryProfilePreview>
  >({});
  const router = useRouter();
  const issues = validateGraph(config, graph, owner);
  const busy = saving || ["signing", "confirming"].includes(transaction.phase);
  const isOwner =
    !vault || owner?.toLowerCase() === renderedAddress?.toLowerCase();
  const frozen = !!vault && query.data?.state !== 0;
  useEffect(() => {
    let cancelled = false;
    if (mode !== "builder" || !client) {
      void Promise.resolve().then(() => {
        if (!cancelled) setBeneficiaryProfiles({});
      });
      return () => {
        cancelled = true;
      };
    }
    const named = config.beneficiaries.filter(
      (beneficiary) =>
        beneficiary.identity && !isAddress(beneficiary.identity),
    );
    if (!named.length) {
      void Promise.resolve().then(() => {
        if (!cancelled) setBeneficiaryProfiles({});
      });
      return () => {
        cancelled = true;
      };
    }
    void Promise.all(
      named.map(async (beneficiary) => {
        try {
          const result = await inspectEnsProfile(
            client,
            beneficiary.resolvedIdentity || beneficiary.identity,
          );
          return [
            beneficiary.id,
            {
              avatar: result.avatarUrl,
              description: result.records.description || undefined,
            },
          ] as const;
        } catch {
          return [beneficiary.id, {}] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) setBeneficiaryProfiles(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [client, config.beneficiaries, mode]);
  function update(next: Configuration) {
    setConfig(next);
    const canonical = buildGraph(next, owner);
    setGraph((g) => ({
      nodes: canonical.nodes.map((n) => ({
        ...n,
        position:
          g.nodes.find((old) => old.id === n.id)?.position || n.position,
      })),
      edges: g.edges
        .filter(
          (e) =>
            canonical.nodes.some((n) => n.id === e.source) &&
            canonical.nodes.some((n) => n.id === e.target),
        )
        .concat(
          canonical.edges.filter(
            (e) =>
              !g.edges.some(
                (old) => old.source === e.source && old.target === e.target,
              ) &&
              e.target.startsWith("beneficiary:") &&
              !g.nodes.some((old) => old.id === e.target),
          ),
        ),
    }));
  }
  const change = <K extends keyof Configuration>(
    field: K,
    value: Configuration[K],
  ) => update({ ...config, [field]: value });
  function addBeneficiary() {
    update({
      ...config,
      beneficiaries: [
        ...config.beneficiaries,
        {
          id: crypto.randomUUID(),
          identity: "",
          address: "",
          allocationBps: Math.max(
            0,
            10000 -
              config.beneficiaries.reduce((n, b) => n + b.allocationBps, 0),
          ),
        },
      ],
    });
  }
  async function resolve(id: string) {
    const b = config.beneficiaries.find((b) => b.id === id);
    if (!b || !client) return;
    setResolving(id);
    setError("");
    try {
      const result = await inspectIdentity(client, b.identity);
      if (result.name) {
        rememberIdentity(result.name, result.address, client.chain.id);
        try {
          const entry = await registryEntry(client, result.name);
          rememberIdentityHealth(
            {
              name: result.name,
              address: result.address,
              resolver: result.resolver,
              owner: result.owner,
              expiry: entry.expiry.toString(),
            },
            client.chain.id,
          );
        } catch {
          /* Legacy ENS names may not expose an ENSv2 registry entry. */
        }
      }
      update({
        ...config,
        beneficiaries: config.beneficiaries.map((old) =>
          old.id === id
            ? {
                ...old,
                address: result.address,
                resolvedIdentity: result.name || undefined,
              }
            : old,
        ),
      });
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setResolving(undefined);
    }
  }
  async function resolveGuardian(index: number) {
    const value = config.guardians[index];
    if (!value || !client || isAddress(value)) return;
    setGuardianResolving(index);
    setError("");
    try {
      const result = await inspectIdentity(client, value);
      if (result.address.toLowerCase() === owner?.toLowerCase())
        throw new Error("The vault owner cannot also be a guardian.");
      if (
        config.guardians.some(
          (guardian, other) =>
            other !== index &&
            isAddress(guardian) &&
            guardian.toLowerCase() === result.address.toLowerCase(),
        )
      )
        throw new Error("This guardian wallet is already included.");
      if (result.name)
        rememberIdentity(result.name, result.address, client.chain.id);
      change(
        "guardians",
        config.guardians.map((guardian, other) =>
          other === index ? result.address : guardian,
        ),
      );
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setGuardianResolving(undefined);
    }
  }
  async function save() {
    setError("");
    setSaving(true);
    try {
      if (!isOwner || frozen)
        throw new Error("Only the owner can update an active vault.");
      if (!factoryAddress || !client)
        throw new Error(
          "Configure your factory and read transport before saving.",
        );
      if (chainId !== chain.id)
        throw new Error(`Wrong network. Switch to ${chain.name}.`);
      const args = serializeConfiguration(config, graph, owner);
      // Pin the address only after checking that the current ENS record still matches the reviewed plan.
      for (const b of config.beneficiaries)
        if (!isAddress(b.identity)) {
          const identity = await inspectIdentity(client, b.identity);
          if (identity.address.toLowerCase() !== b.address.toLowerCase())
            throw new Error(
              `${b.identity} changed its address. Resolve it again and review the new beneficiary.`,
            );
        }
      const ok = await execute(
        vault ? "Update inheritance plan" : "Create inheritance vault",
        {
          to: vault || factoryAddress,
          data: vault
            ? encodeFunctionData({
                abi: SilentSovereignVaultAbi,
                functionName: "configure",
                args,
              })
            : encodeFunctionData({
                abi: SilentSovereignFactoryAbi,
                functionName: "createVault",
                args,
              }),
        },
      );
      if (ok) {
        for (const b of config.beneficiaries)
          if (!isAddress(b.identity))
            rememberIdentity(b.identity, getAddress(b.address), chain.id);
        if (vault) {
          const verified = await query.refetch();
          if (verified.data?.config) {
            setConfig(verified.data.config);
            setGraph(buildGraph(verified.data.config, verified.data.owner));
          }
        } else router.push("/vault");
        // Keep review open until the verified configuration has replaced the
        // saved draft, so a delayed refresh cannot overwrite the next edit.
        setPreview(false);
      }
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setSaving(false);
    }
  }
  const allocatedBps = config.beneficiaries.reduce(
    (total, person) => total + person.allocationBps,
    0,
  );
  const addressesSet = config.beneficiaries.filter((person) =>
    isAddress(person.address),
  ).length;
  const issueSection = (node: string) =>
    ["heartbeat", "guardians", "challenge"].includes(node)
      ? 1
      : ["allowance", "emergency"].includes(node)
        ? 2
        : 0;
  function focusSection(node: string) {
    setStep(issueSection(node));
    document
      .getElementById(`${edgeGradient}-editor`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const onboarding = (
    <details className="beneficiary-onboarding">
      <summary className="advanced-summary">
        <Fingerprint size={20} />
        <span>
          <strong >ENS names &amp; profiles</strong>
          <small>
            Find an identity, create a subname, or manage wallet records and
            public profiles.
          </small>
        </span>
        <Plus size={18} className="beneficiary-tools-toggle" />
      </summary>
      <IdentityManager
        layout={mode === "beneficiaries" ? "tabs" : "stack"}
        onResolved={(name, account) => {
          if (frozen || !isOwner) {
            setError("Only the owner can edit an active inheritance plan.");
            return;
          }
          const empty = config.beneficiaries.find(
            (b) => !b.identity && !b.address,
          );
          if (!empty && config.beneficiaries.length >= 16) {
            setError("The vault supports at most 16 beneficiaries.");
            return;
          }
          if (
            config.beneficiaries.some(
              (b) => b.address.toLowerCase() === account.toLowerCase(),
            )
          ) {
            setError("This beneficiary address is already included.");
            return;
          }
          update({
            ...config,
            beneficiaries: empty
              ? config.beneficiaries.map((b) =>
                  b.id === empty.id
                    ? {
                        ...b,
                        identity: name,
                        resolvedIdentity: name,
                        address: account,
                      }
                    : b,
                )
              : [
                  ...config.beneficiaries,
                  {
                    id: crypto.randomUUID(),
                    identity: name,
                    resolvedIdentity: name,
                    address: account,
                    allocationBps: Math.max(
                      0,
                      10000 -
                        config.beneficiaries.reduce(
                          (sum, b) => sum + b.allocationBps,
                          0,
                        ),
                    ),
                  },
                ],
          });
        }}
      />
    </details>
  );
  const people = (
    <>
      <div className="between">
        <h3>
          Beneficiaries{" "}
          <span className="muted">{config.beneficiaries.length}/16</span>
        </h3>
        <button
          className="button small-button"
          onClick={addBeneficiary}
          disabled={config.beneficiaries.length >= 16 || frozen || !isOwner}
        >
          <Plus size={14} />
          Add person
        </button>
      </div>
      <p className="muted small">
        ENS resolves to a pinned wallet address. Future name changes never
        redirect an inheritance.
      </p>
      {mode !== "beneficiaries" && (
        <div className="ens-workspace-shortcut ens-workspace-shortcut-inspector">
          <span className="ens-workspace-shortcut-icon">
            <Fingerprint size={19} />
          </span>
          <span className="ens-workspace-shortcut-copy">
            <strong>Want to use an ENS identity?</strong>
            <small>
              Create or verify it in the dedicated identity workspace, then
              return here and enter the name.
            </small>
          </span>
          <Link
            className="button"
            href="/beneficiaries"
            target="_blank"
            rel="noreferrer"
          >
            Open ENS workspace <ArrowRight size={14} />
          </Link>
        </div>
      )}
      {config.beneficiaries.length === 0 && (
        <div className="inline-empty">
          Start with the people you want to protect.
          <button className="inline-link" onClick={addBeneficiary}>
            Add your first beneficiary <Plus size={13} />
          </button>
        </div>
      )}
      {config.beneficiaries.map((b, i) => (
        <div
          className={`beneficiary-form ${mode === "beneficiaries" ? "beneficiary-person-card" : ""} ${selectedId === b.id ? "highlighted" : ""}`}
          key={b.id}
        >
          <div className="between">
            <span className="person-number">
              BENEFICIARY {String(i + 1).padStart(2, "0")}
            </span>
            <button
              className="icon-button"
              aria-label={`Remove beneficiary ${i + 1}`}
              disabled={frozen || !isOwner}
              onClick={() =>
                change(
                  "beneficiaries",
                  config.beneficiaries.filter((old) => old.id !== b.id),
                )
              }
            >
              <Trash2 size={14} />
            </button>
          </div>
          {mode === "beneficiaries" && (
            <div className="beneficiary-person-name">
              <span>
                <Users size={18} />
              </span>
              <div>
                <h3>
                  {b.identity.includes(".")
                    ? b.identity
                    : b.address
                      ? shortAddress(b.address)
                      : "New beneficiary"}
                </h3>
                <p>
                  {b.address
                    ? "Wallet address set"
                    : "Enter a wallet address or resolve an ENS name"}
                </p>
              </div>
            </div>
          )}
          <div className="beneficiary-person-fields">
            <div>
              <Field
                label={`Beneficiary ${i + 1} identity`}
                displayLabel={
                  mode === "beneficiaries"
                    ? "Wallet address or ENS name"
                    : undefined
                }
              >
                <input
                  disabled={frozen || !isOwner}
                  placeholder="name.eth or 0x…"
                  value={b.identity}
                  onChange={(e) => {
                    const identity = e.target.value.trim();
                    change(
                      "beneficiaries",
                      config.beneficiaries.map((old) =>
                        old.id === b.id
                          ? {
                              ...old,
                              identity,
                              address: isAddress(identity)
                                ? getAddress(identity)
                                : "",
                              resolvedIdentity: undefined,
                            }
                          : old,
                      ),
                    );
                  }}
                />
              </Field>
              {b.identity && !isAddress(b.identity) && (
                <button
                  className="button small-button"
                  disabled={!client || !!resolving}
                  onClick={() => resolve(b.id)}
                >
                  {resolving === b.id ? "Resolving…" : "Resolve identity"}
                </button>
              )}
              {b.address && (
                <div className="pinned-address">
                  <Check size={12} />
                  Pinned to {shortAddress(b.address)}
                </div>
              )}
            </div>
            <div className="beneficiary-person-share">
              <Field
                label={`Beneficiary ${i + 1} allocation (%)`}
                displayLabel={
                  mode === "beneficiaries" ? "Share (%)" : undefined
                }
              >
                <input
                  disabled={frozen || !isOwner}
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={b.allocationBps / 100}
                  onChange={(e) =>
                    change(
                      "beneficiaries",
                      config.beneficiaries.map((old) =>
                        old.id === b.id
                          ? {
                              ...old,
                              allocationBps: Math.round(
                                Number(e.target.value) * 100,
                              ),
                            }
                          : old,
                      ),
                    )
                  }
                />
              </Field>
            </div>
          </div>
        </div>
      ))}
      <div className="allocation-total">
        <span>Total allocation</span>
        <strong
          className={
            config.beneficiaries.reduce((n, b) => n + b.allocationBps, 0) ===
            10000
              ? "positive"
              : "error-text"
          }
        >
          {config.beneficiaries.reduce((n, b) => n + b.allocationBps, 0) / 100}%{" "}
          <span className="muted">/ 100%</span>
        </strong>
      </div>
    </>
  );
  const numberField = (
    key:
      | "heartbeatInterval"
      | "challengePeriod"
      | "releaseInterval"
      | "emergencyDelay"
      | "initialBps"
      | "trancheBps"
      | "guardianThreshold",
    label: string,
    hint?: string,
    percent = false,
  ) => (
    <Field label={label} hint={hint}>
      <input
        disabled={frozen || !isOwner}
        type="number"
        min="0"
        step={percent ? "0.01" : "1"}
        value={config[key] / (percent ? 100 : 1)}
        onChange={(e) =>
          change(
            key,
            percent
              ? Math.round(Number(e.target.value) * 100)
              : Number(e.target.value),
          )
        }
      />
    </Field>
  );
  const safeguards = (
    <>
      {numberField(
        "heartbeatInterval",
        "Liveness interval (seconds)",
        `${secondsLabel(config.heartbeatInterval)} between check-ins. Minimum 60 seconds.`,
      )}
      {numberField(
        "challengePeriod",
        "Owner challenge period (seconds)",
        "The owner can cancel a pending recovery before it is finalized.",
      )}
      <div className="between">
        <h3>Guardians</h3>
        <button
          className="button small-button"
          disabled={frozen || !isOwner || config.guardians.length >= 16}
          onClick={() => {
            update({
              ...config,
              guardians: [...config.guardians, ""],
              guardianThreshold: Math.max(1, config.guardianThreshold),
            });
          }}
        >
          <Plus size={13} />
          Add guardian
        </button>
      </div>
      {config.guardians.map((g, i) => (
        <div className="guardian-input" key={i}>
          <Field label={`Guardian ${i + 1}`}>
            <input
              disabled={frozen || !isOwner}
              value={g}
              placeholder="guardian.eth or 0x…"
              onChange={(e) =>
                change(
                  "guardians",
                  config.guardians.map((old, index) =>
                    index === i ? e.target.value.trim() : old,
                  ),
                )
              }
            />
            {isAddress(g) && (
              <small className="muted">
                {rememberedIdentity(getAddress(g), chain.id) !== g
                  ? `${rememberedIdentity(getAddress(g), chain.id)} · pinned to ${shortAddress(g)}`
                  : "Pinned guardian wallet"}
              </small>
            )}
          </Field>
          {!isAddress(g) && g && (
            <button
              className="button small-button"
              disabled={!client || guardianResolving !== undefined}
              onClick={() => resolveGuardian(i)}
            >
              {guardianResolving === i ? "Resolving…" : "Resolve ENS"}
            </button>
          )}
          <button
            disabled={frozen || !isOwner}
            className="icon-button"
            aria-label={`Remove guardian ${i + 1}`}
            onClick={() =>
              update({
                ...config,
                guardians: config.guardians.filter((_, index) => index !== i),
                guardianThreshold: Math.min(
                  config.guardianThreshold,
                  config.guardians.length - 1,
                ),
              })
            }
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {numberField(
        "guardianThreshold",
        "Required guardian approvals",
        "Choose independent, reachable guardians. The owner cannot be a guardian.",
      )}
      {config.guardians.length === 0 && (
        <Notice>
          Recovery is disabled without guardians. You can add a quorum while the
          vault is active.
        </Notice>
      )}
    </>
  );
  const schedule = (
    <>
      {numberField(
        "initialBps",
        "Initial release (%)",
        "Percentage of each beneficiary’s allocation, not of the whole vault.",
        true,
      )}
      {numberField(
        "trancheBps",
        "Recurring release (%)",
        "Accrues over time. Unclaimed allowances remain available.",
        true,
      )}
      {numberField(
        "releaseInterval",
        "Release interval (seconds)",
        secondsLabel(config.releaseInterval),
      )}
      {numberField(
        "emergencyDelay",
        "Emergency acceleration delay (seconds)",
        "0 disables acceleration. Otherwise the delay and a fresh guardian quorum are both required.",
      )}
      <Notice>
        Scheduled and emergency claims share one ledger. An accelerated claim
        can only pay the unpaid remainder.
      </Notice>
    </>
  );
  const selectedFields =
    selected === "vault" || selected === "beneficiary" ? (
      people
    ) : selected === "owner" ? (
      <Notice>
        The wallet that creates the vault becomes its immutable owner.
        Connected: {shortAddress(renderedAddress)}.
      </Notice>
    ) : selected === "allowance" || selected === "emergency" ? (
      schedule
    ) : (
      safeguards
    );
  const reviewActions = (
    <>
      <div className="validation-bar">
        <div>
          {issues.length ? (
            <>
              <Badge tone="amber">{issues.length} to resolve</Badge>
              <span>{issues[0].message}</span>
            </>
          ) : (
            <>
              <Badge tone="green">Plan validated</Badge>
              <span>
                {mode === "beneficiaries" && !address
                  ? "Connect your wallet to review and save this plan."
                  : "Ready for your review. No changes have been sent."}
              </span>
            </>
          )}
        </div>
        <button
          className="button primary"
          disabled={
            issues.length > 0 ||
            busy ||
            frozen ||
            !isOwner ||
            !renderedAddress ||
            environmentIssues.length > 0
          }
          onClick={() => setPreview(true)}
        >
          <Save size={15} />
          {vault ? "Review & save plan" : "Review & create vault"}
        </button>
      </div>
      {issues.length > 1 && (
        <details className="validation-details">
          <summary>View all configuration checks</summary>
          <ul>
            {issues.map((e, i) => (
              <li key={i}>
                {e.message}
                {mode === "beneficiaries" && (
                  <button
                    className="button small-button"
                    onClick={() => focusSection(e.node)}
                  >
                    Edit{" "}
                    {
                      ["people & shares", "safeguards", "release schedule"][
                        issueSection(e.node)
                      ]
                    }
                    <ArrowRight size={12} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
  return (
    <>
      <PageHeader
        title={
          mode === "create"
            ? "A little planning. Lasting protection."
            : mode === "builder"
              ? "Design your legacy."
              : "Beneficiaries"
        }
        description={
          mode === "builder"
            ? "A visual plan, enforced by your vault. Select any node to edit its rules."
            : mode === "create"
              ? "Choose your people, set your safeguards, and review your plan."
              : "Choose who receives your assets and how much they receive. You stay in control until your plan is saved."
        }
        action={
          <Badge tone={vault ? "green" : "violet"}>
            {vault ? "Editing an onchain plan" : "Unsaved plan"}
          </Badge>
        }
      />
      {environmentIssues.length > 0 && (
        <Notice>{environmentIssues.join(" ")}</Notice>
      )}
      {query.error && <Notice danger>{transactionError(query.error)}</Notice>}
      {(frozen || !isOwner) && (
        <Notice>
          This plan is read-only. Changes require the owner wallet and an active
          vault.
        </Notice>
      )}
      {mode === "beneficiaries" && <EnsFamilySetup />}
      {mode === "builder" ? (
        <div className="builder-layout" id="inheritance-workspace">
          <div className="canvas-container">
            <div className="canvas-toolbar">
              <span>
                <GitBranch size={15} /> Inheritance flow <Badge>Draft</Badge>
              </span>
              <div>
                <button
                  className="icon-button"
                  aria-label="Expand inheritance workspace"
                  onClick={() =>
                    document
                      .getElementById("inheritance-workspace")
                      ?.requestFullscreen()
                      .catch(() =>
                        setError(
                          "Your browser could not enter full-screen mode.",
                        ),
                      )
                  }
                >
                  <Maximize2 size={14} />
                </button>
                <button
                  className="button small-button"
                  onClick={() => setGraph(buildGraph(config, owner))}
                >
                  <LayoutGrid size={14} />
                  Auto-layout & restore
                </button>
                <button
                  className="button small-button"
                  onClick={addBeneficiary}
                >
                  <Plus size={14} />
                  Beneficiary
                </button>
              </div>
            </div>
            <ReactFlow<ProtocolNode>
              className="inheritance-flow"
              nodes={graph.nodes.map((n) => {
                const beneficiary = n.data.beneficiaryId
                  ? config.beneficiaries.find(
                      (person) => person.id === n.data.beneficiaryId,
                    )
                  : undefined;
                const profile = n.data.beneficiaryId
                  ? beneficiaryProfiles[n.data.beneficiaryId]
                  : undefined;
                return {
                  ...n,
                  data: {
                    ...n.data,
                    detail:
                      n.data.kind === "owner"
                        ? shortAddress(owner)
                        : n.data.detail,
                    invalid: issues.some((e) => e.node === n.id),
                    profileAvatar: profile?.avatar,
                    profileDescription: profile?.description,
                    profileAddress: beneficiary?.address,
                  },
                };
              })}
              edges={graph.edges}
              nodeTypes={nodeTypes}
              onNodesChange={(changes) =>
                setGraph((g) => ({
                  ...g,
                  nodes: applyNodeChanges(changes, g.nodes),
                }))
              }
              onEdgesChange={(changes) =>
                setGraph((g) => ({
                  ...g,
                  edges: applyEdgeChanges(changes, g.edges),
                }))
              }
              onConnect={(connection: Connection) =>
                setGraph((g) => ({
                  ...g,
                  edges: addEdge({ ...connection, animated: true }, g.edges),
                }))
              }
              onNodeClick={(_, node) => {
                setSelected(node.data.kind);
                setSelectedId(node.data.beneficiaryId);
              }}
              fitView
              minZoom={0.2}
              maxZoom={1.6}
              colorMode="light"
              defaultEdgeOptions={{
                type: "smoothstep",
                animated: true,
                style: { stroke: `url(#${edgeGradient})`, strokeWidth: 1.8 },
              }}
              deleteKeyCode={["Backspace", "Delete"]}
            >
              <svg
                className="flow-gradient-definitions"
                aria-hidden="true"
                width="0"
                height="0"
              >
                <defs>
                  <linearGradient
                    id={edgeGradient}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="0"
                    x2="700"
                    y2="450"
                  >
                    <stop offset="0%" stopColor="#375d54" />
                    <stop offset="55%" stopColor="#86a59a" />
                    <stop offset="100%" stopColor="#667c77" />
                  </linearGradient>
                </defs>
              </svg>
              <Background
                variant={BackgroundVariant.Dots}
                bgColor="#f1f3f2"
                color="#b9c4bf"
                gap={22}
                size={1.35}
              />
              <Controls showInteractive={false} />
            </ReactFlow>
            <div className="canvas-caption">
              <LockLabel />
              Drag nodes to arrange · connect handles to edit paths · Delete
              removes a selection
            </div>
          </div>
          <aside className="configuration-panel">
            <div className="config-panel-heading">
              <span className="eyebrow">NODE INSPECTOR</span>
              <h2>
                {selected === "beneficiary"
                  ? "Beneficiary"
                  : fieldKinds.find((f) => f.kind === selected)?.label ||
                    "Vault owner"}
              </h2>
            </div>
            <div className="config-tabs">
              {fieldKinds.map((f) => (
                <button
                  key={f.kind}
                  onClick={() => {
                    setSelected(f.kind);
                    setSelectedId(undefined);
                  }}
                  className={selected === f.kind ? "active" : ""}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="config-fields">{selectedFields}</div>
          </aside>
        </div>
      ) : mode === "beneficiaries" ? (
        <>
          <div id="beneficiary-plan" className="beneficiaries-overview" aria-label="Plan overview">
            <div>
              <Users size={18} />
              <span>
                <small>People in your plan</small>
                <strong>
                  {config.beneficiaries.length}
                  <em> / 16</em>
                </strong>
              </span>
            </div>
            <div>
              <GitBranch size={18} />
              <span>
                <small>Total allocated</small>
                <strong
                  className={
                    allocatedBps === 10000
                      ? "positive"
                      : allocatedBps > 10000
                        ? "error-text"
                        : ""
                  }
                >
                  {allocatedBps / 100}
                  <em>%</em>
                </strong>
              </span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <span>
                <small>Wallet addresses set</small>
                <strong>
                  {addressesSet}
                  <em> / {config.beneficiaries.length}</em>
                </strong>
              </span>
            </div>
          </div>
          <div className="beneficiaries-layout">
            <div id={`${edgeGradient}-editor`}>
              <Panel className="beneficiaries-editor">
                <div
                  className="beneficiaries-tab-nav"
                  aria-label="Plan sections"
                >
                  {[
                    { label: "People & shares", icon: Users },
                    { label: "Safeguards", icon: ShieldCheck },
                    { label: "Release schedule", icon: Clock3 },
                  ].map(({ label, icon: Icon }, index) => (
                    <button
                      key={label}
                      className={step === index ? "active" : ""}
                      aria-pressed={step === index}
                      onClick={() => setStep(index)}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div className="beneficiaries-tab-content">
                  {step !== 0 && (
                    <div className="beneficiaries-section-intro">
                      <span className="eyebrow">
                        {step === 1
                          ? "PROTECT YOUR PLAN"
                          : "CONTROL THE RELEASE"}
                      </span>
                      <h2>
                        {step === 1
                          ? "Recovery safeguards"
                          : "When your people receive their share"}
                      </h2>
                      <p>
                        {step === 1
                          ? "Set your check-in window and choose who can help authorize recovery."
                          : "Set the initial payment and the recurring release of each beneficiary’s allocation."}
                      </p>
                    </div>
                  )}
                  {step === 0 ? people : step === 1 ? safeguards : schedule}
                </div>
                <div className="beneficiaries-editor-footer">
                  <span>Changes remain a draft until you review and sign.</span>
                  <div>
                    <button
                      className="button small-button"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </button>
                    {step < 2 && (
                      <button
                        className="button primary small-button"
                        onClick={() => setStep(step + 1)}
                      >
                        {step === 0
                          ? "Next: safeguards"
                          : "Next: release schedule"}
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </Panel>
              {reviewActions}
            </div>
            <aside
              className="beneficiaries-summary"
              aria-label="Allocation summary"
            >
              <Panel
                title="Your allocation"
                description="A live view of the plan you’re editing."
              >
                <div className="beneficiaries-distribution">
                  <div
                    className="beneficiaries-allocation-meter"
                    aria-hidden="true"
                  >
                    {config.beneficiaries.map((person, index) => (
                      <span
                        key={person.id}
                        style={{
                          width: `${Math.max(0, Math.min(100, person.allocationBps / 100))}%`,
                          background: [
                            "#254f40",
                            "#789788",
                            "#aabbb1",
                            "#4f6c5e",
                          ][index % 4],
                        }}
                      />
                    ))}
                  </div>
                  {config.beneficiaries.length === 0 ? (
                    <p className="beneficiaries-summary-empty">
                      Add your first person to start building your allocation.
                    </p>
                  ) : (
                    config.beneficiaries.map((person, index) => (
                      <div
                        className="beneficiary-distribution-row"
                        key={person.id}
                      >
                        <span>
                          <i
                            style={{
                              background: [
                                "#254f40",
                                "#789788",
                                "#aabbb1",
                                "#4f6c5e",
                              ][index % 4],
                            }}
                          />
                          {person.identity.includes(".")
                            ? person.identity
                            : person.address
                              ? shortAddress(person.address)
                              : `Beneficiary ${index + 1}`}
                        </span>
                        <strong>{person.allocationBps / 100}%</strong>
                      </div>
                    ))
                  )}
                  <div className="beneficiaries-distribution-total">
                    <span>Total allocated</span>
                    <strong
                      className={
                        allocatedBps === 10000 ? "positive" : "error-text"
                      }
                    >
                      {allocatedBps / 100}% <small>/ 100%</small>
                    </strong>
                  </div>
                  <p
                    className="beneficiaries-allocation-hint"
                    aria-live="polite"
                  >
                    {allocatedBps === 10000
                      ? "All shares are assigned."
                      : allocatedBps > 10000
                        ? `Reduce shares by ${(allocatedBps - 10000) / 100}% to continue.`
                        : `${(10000 - allocatedBps) / 100}% left to assign.`}
                  </p>
                </div>
              </Panel>
              <Panel
                className="beneficiaries-plan-context"
                title="Plan settings"
              >
                <dl>
                  <div>
                    <dt>Check-in window</dt>
                    <dd>{secondsLabel(config.heartbeatInterval)}</dd>
                  </div>
                  <div>
                    <dt>Guardian approvals</dt>
                    <dd>
                      {config.guardianThreshold} of {config.guardians.length}
                    </dd>
                  </div>
                  <div>
                    <dt>Initial release</dt>
                    <dd>{config.initialBps / 100}% of each share</dd>
                  </div>
                </dl>
                <details className="beneficiaries-save-checklist">
                  <summary>Before you save</summary>
                  <ul>
                    <li>
                      <Check size={15} />
                      <span>
                        Confirm every wallet belongs to the intended person.
                      </span>
                    </li>
                    <li>
                      <Check size={15} />
                      <span>Assign exactly 100% across all beneficiaries.</span>
                    </li>
                    <li>
                      <Check size={15} />
                      <span>Review safeguards and release settings.</span>
                    </li>
                  </ul>{" "}
                </details>
                <p>
                  Only assets deposited in this vault are covered. ENS names
                  stay pinned to the wallet you save.
                </p>
              </Panel>
            </aside>
          </div>
        </>
      ) : (
        <div className="editor-layout">
          <Panel className="editor-main">
            <div className="wizard-steps">
              {["Your people", "Safeguards", "Release & review"].map(
                (label, i) => (
                  <button
                    key={label}
                    className={step === i ? "active" : ""}
                    onClick={() => setStep(i)}
                  >
                    <StepIcon done={step > i}>{i + 1}</StepIcon>
                    {label}
                  </button>
                ),
              )}
            </div>
            <div className="wizard-body">
              {step === 0 ? people : step === 1 ? safeguards : schedule}
            </div>
            <div className="wizard-footer">
              <button
                className="button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              {step < 2 && (
                <button
                  className="button primary"
                  onClick={() => setStep(step + 1)}
                >
                  Continue <ArrowRight size={14} />
                </button>
              )}
            </div>
          </Panel>
          <div className="plan-summary">
            <Panel title="Your plan, at a glance">
              <div className="summary-emblem">
                <ShieldCheck size={40} strokeWidth={1.2} />
              </div>
              <dl>
                <div>
                  <dt>People protected</dt>
                  <dd>{config.beneficiaries.length}</dd>
                </div>
                <div>
                  <dt>Liveness interval</dt>
                  <dd>{secondsLabel(config.heartbeatInterval)}</dd>
                </div>
                <div>
                  <dt>Challenge period</dt>
                  <dd>{secondsLabel(config.challengePeriod)}</dd>
                </div>
                <div>
                  <dt>Guardian quorum</dt>
                  <dd>
                    {config.guardianThreshold} of {config.guardians.length}
                  </dd>
                </div>
                <div>
                  <dt>Initial release</dt>
                  <dd>{config.initialBps / 100}% of each share</dd>
                </div>
              </dl>
              <p className="muted small">
                You retain withdrawal access while active. Recovery locks this
                plan and snapshots its accounted assets.
              </p>
            </Panel>
            <Notice>
              Only assets deposited in this vault are covered. Funds elsewhere
              in your wallet stay outside this plan.
            </Notice>
          </div>
        </div>
      )}
      {mode !== "beneficiaries" && reviewActions}
      {mode === "beneficiaries" && onboarding}
      {error && !preview && (
        <Notice danger popup>
          {error}
        </Notice>
      )}
      {preview && (
        <div className="modal-backdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Review inheritance plan"
          >
            <div className="between">
              <h2>One final look.</h2>
              <button
                className="icon-button"
                aria-label="Close preview"
                disabled={busy}
                onClick={() => setPreview(false)}
              >
                <X size={18} />
              </button>
            </div>
            <p>
              You are {vault ? "updating" : "creating"} a real inheritance vault
              on {chain.name}. Your wallet will show the network fee.
            </p>
            <dl>
              <div>
                <dt>Owner</dt>
                <dd>{shortAddress(owner)}</dd>
              </div>
              {config.beneficiaries.map((b) => (
                <div key={b.id}>
                  <dt>
                    {b.identity.includes(".")
                      ? b.identity
                      : shortAddress(b.address)}
                  </dt>
                  <dd>
                    {b.allocationBps / 100}% · {shortAddress(b.address)}
                  </dd>
                </div>
              ))}
              <div>
                <dt>Guardian quorum</dt>
                <dd>
                  {config.guardianThreshold} of {config.guardians.length}
                </dd>
              </div>
              <div>
                <dt>Challenge</dt>
                <dd>{secondsLabel(config.challengePeriod)}</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>
                  {config.initialBps / 100}% + {config.trancheBps / 100}% /{" "}
                  {secondsLabel(config.releaseInterval)}
                </dd>
              </div>
            </dl>
            <Notice>
              Recovery authorization is irreversible. The owner can cancel while
              recovery is pending. This software is unaudited and testnet-only.
            </Notice>
            {error && (
              <Notice danger popup title="Plan could not be saved">
                {error}
              </Notice>
            )}
            <button
              className="button primary full"
              disabled={busy}
              onClick={save}
            >
              {busy ? "Awaiting transaction…" : "Confirm & open wallet"}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function LockLabel() {
  return (
    <span>
      <ShieldCheck size={12} /> Contract-enforced conditions
    </span>
  );
}
