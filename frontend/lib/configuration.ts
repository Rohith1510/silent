import { getAddress, isAddress, zeroAddress, type Address } from "viem";
import { normalize } from "viem/ens";
import type { Node, Edge } from "@xyflow/react";

export type Beneficiary = {
  id: string;
  identity: string;
  address: string;
  resolvedIdentity?: string;
  allocationBps: number;
};
export type Configuration = {
  beneficiaries: Beneficiary[];
  guardians: string[];
  heartbeatInterval: number;
  challengePeriod: number;
  releaseInterval: number;
  emergencyDelay: number;
  initialBps: number;
  trancheBps: number;
  guardianThreshold: number;
};
export type NodeKind =
  | "owner"
  | "vault"
  | "heartbeat"
  | "guardians"
  | "challenge"
  | "allowance"
  | "emergency"
  | "beneficiary";
export type ProtocolNode = Node<
  {
    kind: NodeKind;
    label: string;
    detail: string;
    invalid?: boolean;
    beneficiaryId?: string;
  },
  "protocol"
>;
export type ProtocolEdge = Edge;
export type Graph = { nodes: ProtocolNode[]; edges: ProtocolEdge[] };
export type ValidationIssue = { node: string; message: string };
export const defaultConfiguration: Configuration = {
  beneficiaries: [],
  guardians: [],
  heartbeatInterval: 30 * 86400,
  challengePeriod: 7 * 86400,
  releaseInterval: 30 * 86400,
  emergencyDelay: 90 * 86400,
  initialBps: 1000,
  trancheBps: 1000,
  guardianThreshold: 0,
};
export const secondsLabel = (s: number) =>
  s === 0
    ? "Disabled"
    : s >= 86400
      ? `${+(s / 86400).toFixed(1)} days`
      : s >= 3600
        ? `${+(s / 3600).toFixed(1)} hours`
        : `${+(s / 60).toFixed(1)} min`;
export const shortAddress = (a?: string) =>
  a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "Not connected";
export function validAddress(value: string): value is Address {
  return isAddress(value) && value.toLowerCase() !== zeroAddress;
}

export function validateConfiguration(
  config: Configuration,
  owner?: string,
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  const add = (node: string, message: string) => errors.push({ node, message });
  if (config.beneficiaries.length < 1 || config.beneficiaries.length > 16)
    add("vault", "Add between 1 and 16 beneficiaries.");
  if (config.beneficiaries.reduce((n, b) => n + b.allocationBps, 0) !== 10000)
    add("vault", "Beneficiary allocations must total exactly 100%.");
  const addresses = new Set<string>();
  const ids = new Set<string>();
  for (const b of config.beneficiaries) {
    const node = `beneficiary:${b.id}`;
    if (!b.id || ids.has(b.id)) add(node, "Beneficiary IDs must be unique.");
    ids.add(b.id);
    if (!validAddress(b.address))
      add(node, "Resolve an ENS name or enter a valid, nonzero address.");
    if (
      !Number.isInteger(b.allocationBps) ||
      b.allocationBps < 1 ||
      b.allocationBps > 10000
    )
      add(node, "Allocation must be between 0.01% and 100%.");
    const address = b.address.toLowerCase();
    if (addresses.has(address))
      add(node, "Each beneficiary must have a different address.");
    addresses.add(address);
    if (!isAddress(b.identity)) {
      try {
        if (normalize(b.identity) !== b.resolvedIdentity)
          add(node, "Resolve this ENS identity before saving.");
      } catch {
        add(node, "This ENS name is invalid.");
      }
    } else if (b.identity.toLowerCase() !== address)
      add(node, "The identity and pinned address disagree.");
  }
  const guardianSet = new Set<string>();
  if (config.guardians.length > 16)
    add("guardians", "At most 16 guardians are supported.");
  for (const g of config.guardians) {
    if (!validAddress(g) || g.toLowerCase() === owner?.toLowerCase())
      add(
        "guardians",
        "Guardians must be nonzero addresses different from the owner.",
      );
    if (guardianSet.has(g.toLowerCase()))
      add("guardians", "Remove duplicate guardians.");
    guardianSet.add(g.toLowerCase());
  }
  if (
    !Number.isInteger(config.guardianThreshold) ||
    (config.guardians.length === 0
      ? config.guardianThreshold !== 0
      : config.guardianThreshold < 1 ||
        config.guardianThreshold > config.guardians.length)
  )
    add(
      "guardians",
      "Set a guardian threshold between 1 and the guardian count; use 0 only with no guardians.",
    );
  for (const [field, node] of [
    ["heartbeatInterval", "heartbeat"],
    ["challengePeriod", "challenge"],
    ["releaseInterval", "allowance"],
  ] as const) {
    if (
      !Number.isSafeInteger(config[field]) ||
      config[field] < 60 ||
      config[field] > 315360000
    )
      add(
        node,
        "Duration must be a whole number of seconds from 60 to 315360000.",
      );
  }
  if (
    !Number.isSafeInteger(config.emergencyDelay) ||
    (config.emergencyDelay !== 0 &&
      (config.emergencyDelay < 60 || config.emergencyDelay > 315360000))
  )
    add(
      "emergency",
      "Emergency delay must be 0 (disabled), or between 60 and 315360000 seconds.",
    );
  if (
    !Number.isInteger(config.initialBps) ||
    config.initialBps < 0 ||
    config.initialBps > 10000
  )
    add("allowance", "Initial release must be between 0% and 100%.");
  if (
    !Number.isInteger(config.trancheBps) ||
    config.trancheBps < 1 ||
    config.trancheBps > 10000
  )
    add("allowance", "Each tranche must be between 0.01% and 100%.");
  return errors;
}

export function buildGraph(c: Configuration, owner?: string): Graph {
  const nodes: ProtocolNode[] = [
    {
      id: "owner",
      type: "protocol",
      position: { x: 0, y: 0 },
      data: {
        kind: "owner",
        label: "Vault owner",
        detail: shortAddress(owner),
      },
    },
    {
      id: "vault",
      type: "protocol",
      position: { x: 280, y: 0 },
      data: {
        kind: "vault",
        label: "Your silent vault",
        detail: `${c.beneficiaries.length} beneficiaries · isolated custody`,
      },
    },
    {
      id: "heartbeat",
      type: "protocol",
      position: { x: 560, y: 0 },
      data: {
        kind: "heartbeat",
        label: "Liveness condition",
        detail: `No check-in for ${secondsLabel(c.heartbeatInterval)}`,
      },
    },
    {
      id: "guardians",
      type: "protocol",
      position: { x: 560, y: 190 },
      data: {
        kind: "guardians",
        label: "Guardian approval",
        detail: c.guardianThreshold
          ? `${c.guardianThreshold} of ${c.guardians.length} signatures`
          : "No quorum · recovery disabled",
      },
    },
    {
      id: "challenge",
      type: "protocol",
      position: { x: 280, y: 190 },
      data: {
        kind: "challenge",
        label: "Owner challenge",
        detail: `${secondsLabel(c.challengePeriod)} to respond`,
      },
    },
    {
      id: "allowance",
      type: "protocol",
      position: { x: 0, y: 380 },
      data: {
        kind: "allowance",
        label: "Scheduled allowance",
        detail: `${c.initialBps / 100}% initially · ${c.trancheBps / 100}% / ${secondsLabel(c.releaseInterval)}`,
      },
    },
    {
      id: "emergency",
      type: "protocol",
      position: { x: 0, y: 570 },
      data: {
        kind: "emergency",
        label: "Emergency release",
        detail: c.emergencyDelay
          ? `${secondsLabel(c.emergencyDelay)} + fresh guardian quorum`
          : "Accelerated release disabled",
      },
    },
    ...c.beneficiaries.map((b, i): ProtocolNode => ({
      id: `beneficiary:${b.id}`,
      type: "protocol",
      position: { x: 560, y: 380 + i * 190 },
      data: {
        kind: "beneficiary",
        beneficiaryId: b.id,
        label: isAddress(b.identity)
          ? shortAddress(b.identity)
          : b.identity || "New beneficiary",
        detail: `${b.allocationBps / 100}% allocation · pinned address`,
      },
    })),
  ];
  const pairs = [
    ["owner", "vault"],
    ["vault", "heartbeat"],
    ["heartbeat", "guardians"],
    ["guardians", "challenge"],
    ["challenge", "allowance"],
    ["challenge", "emergency"],
    ...c.beneficiaries.flatMap((b) => [
      ["allowance", `beneficiary:${b.id}`],
      ["emergency", `beneficiary:${b.id}`],
    ]),
  ];
  const issues = validateConfiguration(c, owner);
  return {
    nodes: nodes.map((n) => ({
      ...n,
      data: { ...n.data, invalid: issues.some((e) => e.node === n.id) },
    })),
    edges: pairs.map(([source, target]) => ({
      id: `${source}->${target}`,
      source,
      target,
      animated: true,
    })),
  };
}

export function validateGraph(
  c: Configuration,
  graph: Graph,
  owner?: string,
): ValidationIssue[] {
  const errors = validateConfiguration(c, owner);
  const expected = buildGraph(c, owner);
  if (new Set(graph.nodes.map((n) => n.id)).size !== graph.nodes.length)
    errors.push({
      node: "vault",
      message: "Duplicate node IDs are unsupported.",
    });
  if (
    graph.nodes.length !== expected.nodes.length ||
    graph.nodes.some(
      (n) =>
        !expected.nodes.some(
          (e) =>
            e.id === n.id &&
            e.data.kind === n.data.kind &&
            e.data.beneficiaryId === n.data.beneficiaryId,
        ),
    )
  )
    errors.push({
      node: "vault",
      message:
        "Restore the required protocol nodes. Custom conditions cannot be enforced by this contract.",
    });
  const edges = graph.edges.map((e) => `${e.source}->${e.target}`).sort();
  const canonical = expected.edges
    .map((e) => `${e.source}->${e.target}`)
    .sort();
  if (JSON.stringify(edges) !== JSON.stringify(canonical))
    errors.push({
      node: "vault",
      message:
        "Connections must preserve the owner, liveness, quorum, challenge and release paths. Use Auto-layout & restore to repair.",
    });
  return errors;
}

export function serializeConfiguration(
  c: Configuration,
  graph: Graph = buildGraph(c),
  owner?: string,
) {
  const issues = validateGraph(c, graph, owner);
  if (issues.length) throw new Error(issues.map((e) => e.message).join(" "));
  return [
    c.beneficiaries.map((b) => ({
      account: getAddress(b.address),
      allocationBps: b.allocationBps,
    })),
    c.guardians.map((g) => getAddress(g)),
    {
      heartbeatInterval: BigInt(c.heartbeatInterval),
      challengePeriod: BigInt(c.challengePeriod),
      releaseInterval: BigInt(c.releaseInterval),
      emergencyDelay: BigInt(c.emergencyDelay),
      initialBps: c.initialBps,
      trancheBps: c.trancheBps,
      guardianThreshold: c.guardianThreshold,
    },
  ] as const;
}
