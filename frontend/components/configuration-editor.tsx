"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection } from "wagmi";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Handle,
  MiniMap,
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
import { inspectIdentity, rememberIdentity } from "@/lib/ens";
import { IdentityManager } from "./identity-manager";
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
      <strong>{data.label}</strong>
      <small>{data.detail}</small>
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
  const { address, chainId } = useConnection();
  const { client } = useReadTransport();
  const { query, execute, transaction } = useProtocol();
  const vault = mode === "create" ? undefined : query.data?.vault;
  const owner = vault ? query.data?.owner : address;
  const [config, setConfig] = useState<Configuration>(() =>
    structuredClone(initial),
  );
  const [graph, setGraph] = useState<Graph>(() => buildGraph(initial, owner));
  const [selected, setSelected] = useState<NodeKind>("vault");
  const [selectedId, setSelectedId] = useState<string>();
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState<string>();
  const router = useRouter();
  const issues = validateGraph(config, graph, owner);
  const busy = ["signing", "confirming"].includes(transaction.phase);
  const isOwner = !vault || owner?.toLowerCase() === address?.toLowerCase();
  const frozen = !!vault && query.data?.state !== 0;
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
  async function save() {
    setError("");
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
        setPreview(false);
        if (vault) {
          const verified = await query.refetch();
          if (verified.data?.config) {
            setConfig(verified.data.config);
            setGraph(buildGraph(verified.data.config, verified.data.owner));
          }
        } else router.push("/vault");
      }
    } catch (e) {
      setError(transactionError(e));
    }
  }
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
      <details className="beneficiary-onboarding">
        <summary className="advanced-summary">
          Create or inspect an ENSv2 beneficiary identity
        </summary>
        <IdentityManager
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
          className={`beneficiary-form ${selectedId === b.id ? "highlighted" : ""}`}
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
          <Field label={`Beneficiary ${i + 1} identity`}>
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
          <Field label={`Beneficiary ${i + 1} allocation (%)`}>
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
              placeholder="0x… guardian wallet"
              onChange={(e) =>
                change(
                  "guardians",
                  config.guardians.map((old, index) =>
                    index === i ? e.target.value.trim() : old,
                  ),
                )
              }
            />
          </Field>
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
        Connected: {shortAddress(address)}.
      </Notice>
    ) : selected === "allowance" || selected === "emergency" ? (
      schedule
    ) : (
      safeguards
    );
  return (
    <>
      <PageHeader
        title={
          mode === "create"
            ? "A little planning. Lasting protection."
            : mode === "builder"
              ? "Design your legacy."
              : "Your people, protected."
        }
        description={
          mode === "builder"
            ? "A visual plan, enforced by your vault. Select any node to edit its rules."
            : mode === "create"
              ? "Choose your people, set your safeguards, and review your plan."
              : "Manage pinned beneficiary identities, allocations and guardian safeguards."
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
              nodes={graph.nodes.map((n) => ({
                ...n,
                data: {
                  ...n.data,
                  invalid: issues.some((e) => e.node === n.id),
                },
              }))}
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
                style: { stroke: "#8a8a8a", strokeWidth: 1.4 },
              }}
              deleteKeyCode={["Backspace", "Delete"]}
            >
              <Background color="#d8d8d8" gap={22} size={1} />
              <Controls showInteractive={false} />
              <MiniMap
                nodeColor={(n) =>
                  n.data.kind === "beneficiary" ? "#242424" : "#b5b5b5"
                }
                maskColor="#f5f5f599"
                pannable
                zoomable
              />
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
              <span>Ready for your review. No changes have been sent.</span>
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
            !address ||
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
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        </details>
      )}
      {error && <Notice danger>{error}</Notice>}
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
            {error && <p className="error-text">{error}</p>}
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
