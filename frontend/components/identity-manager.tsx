"use client";
import { useState } from "react";
import { useConnection } from "wagmi";
import {
  encodeFunctionData,
  getAddress,
  zeroAddress,
  type Address,
} from "viem";
import { normalize } from "viem/ens";
import { Fingerprint, Search, ShieldCheck } from "lucide-react";
import {
  findSubregistry,
  inspectIdentity,
  registryAbi,
  registryEntry,
  resolverAbi,
  ethAddressResource,
  addressRecordCall,
  rememberIdentity,
} from "@/lib/ens";
import { validAddress } from "@/lib/configuration";
import { transactionError } from "@/lib/transaction";
import { useReadTransport } from "./providers";
import { useProtocol } from "./protocol-provider";
import { Badge, External, Field, Notice, Panel } from "./ui";

export function IdentityManager({
  onResolved,
}: { onResolved?: (name: string, address: Address) => void } = {}) {
  const { client } = useReadTransport();
  const { address } = useConnection();
  const { execute, transaction } = useProtocol();
  const [input, setInput] = useState("");
  const [identity, setIdentity] =
    useState<Awaited<ReturnType<typeof inspectIdentity>>>();
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [parent, setParent] = useState("");
  const [label, setLabel] = useState("");
  const [heir, setHeir] = useState("");
  const [resolver, setResolver] = useState("");
  const [expiry, setExpiry] = useState("");
  const [registry, setRegistry] = useState<Address>();
  const [checked, setChecked] = useState("");
  const [canRegister, setCanRegister] = useState(false);
  const [recordName, setRecordName] = useState("");
  const [recordAddress, setRecordAddress] = useState("");
  const [recordResolver, setRecordResolver] = useState<Address>();
  const [recordPermission, setRecordPermission] = useState(false);
  const [delegate, setDelegate] = useState("");
  const [scopeAck, setScopeAck] = useState(false);
  const [parentExpiry, setParentExpiry] = useState<bigint>();
  async function lookup() {
    if (!client) return;
    setChecking(true);
    setError("");
    setIdentity(undefined);
    try {
      const resolved = await inspectIdentity(client, input.trim());
      setIdentity(resolved);
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setChecking(false);
    }
  }
  async function checkParent() {
    if (!client || !address) return;
    setChecking(true);
    setError("");
    setRegistry(undefined);
    setCanRegister(false);
    try {
      const normalized = normalize(parent);
      const registry = await findSubregistry(client, normalized);
      const entry = await registryEntry(client, normalized);
      setParentExpiry(entry.expiry);
      const existingResolver = await client.getEnsResolver({
        name: normalized,
      });
      if (existingResolver) setResolver(existingResolver);
      const allowed = await client.readContract({
        address: registry,
        abi: registryAbi,
        functionName: "hasRootRoles",
        args: [1n, address],
      });
      setRegistry(registry);
      setChecked(normalized);
      setCanRegister(allowed);
      if (!allowed)
        throw new Error(
          "Your connected wallet does not hold ROLE_REGISTRAR on this parent’s ENSv2 subregistry. The parent’s administrator must grant it first.",
        );
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setChecking(false);
    }
  }
  async function register() {
    if (!client || !registry || !address) return;
    setError("");
    try {
      const normalizedLabel = normalize(label);
      if (normalizedLabel.includes(".") || normalize(parent) !== checked)
        throw new Error(
          "Use one subname label and recheck parent permissions after changing the parent.",
        );
      if (!validAddress(heir) || !validAddress(resolver))
        throw new Error(
          "Enter valid beneficiary owner and existing resolver addresses.",
        );
      const timestamp = BigInt(Math.floor(new Date(expiry).getTime() / 1000));
      const block = await client.getBlock();
      if (timestamp <= block.timestamp || timestamp > 18446744073709551615n)
        throw new Error(
          "Choose a future expiry within the uint64 timestamp range.",
        );
      const currentParent = await registryEntry(client, checked);
      if (timestamp > currentParent.expiry)
        throw new Error(
          "Subname expiry must not exceed the parent's current expiry. Renew the parent or choose an earlier date.",
        );
      if (!(await client.getBytecode({ address: getAddress(resolver) })))
        throw new Error("The resolver address has no deployed contract code.");
      if (
        !(await client.readContract({
          address: registry,
          abi: registryAbi,
          functionName: "hasRootRoles",
          args: [1n, address],
        }))
      )
        throw new Error(
          "Your registration permission changed. Check it again.",
        );
      const data = encodeFunctionData({
        abi: registryAbi,
        functionName: "register",
        args: [
          normalizedLabel,
          getAddress(heir),
          zeroAddress,
          getAddress(resolver),
          (1n << 24n) | (1n << 20n),
          timestamp,
        ],
      });
      const ok = await execute(`Register ${normalizedLabel}.${checked}`, {
        to: registry,
        data,
      });
      if (ok) {
        setInput(`${normalizedLabel}.${checked}`);
        setIdentity(undefined);
        setRecordName(`${normalizedLabel}.${checked}`);
        setRecordAddress(heir);
        setRecordResolver(undefined);
        setRecordPermission(false);
      }
    } catch (e) {
      setError(transactionError(e));
    }
  }
  async function checkRecords() {
    if (!client || !address) return;
    setChecking(true);
    setError("");
    setRecordPermission(false);
    setRecordResolver(undefined);
    try {
      const resolved = await client.getEnsResolver({
        name: normalize(recordName),
      });
      if (!resolved)
        throw new Error(
          "No resolver is attached. Configure it in ENS Explorer first.",
        );
      const [root, coin] = await Promise.all([
        client.readContract({
          address: resolved,
          abi: resolverAbi,
          functionName: "hasRootRoles",
          args: [1n, address],
        }),
        client.readContract({
          address: resolved,
          abi: resolverAbi,
          functionName: "hasRoles",
          args: [ethAddressResource, 1n, address],
        }),
      ]);
      setRecordResolver(resolved);
      setRecordPermission(root || coin);
      if (!root && !coin)
        throw new Error(
          "This wallet has no Ethereum-address setter permission on this resolver. Its administrator must grant it, or switch to an authorized wallet.",
        );
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setChecking(false);
    }
  }
  async function writeRecord(operation: "set" | "grant" | "revoke") {
    if (!client || !recordResolver || !validAddress(recordAddress)) return;
    setError("");
    try {
      const liveResolver = await client.getEnsResolver({
        name: normalize(recordName),
      });
      if (liveResolver?.toLowerCase() !== recordResolver.toLowerCase())
        throw new Error("Resolver changed. Recheck permissions first.");
      const setter = addressRecordCall(recordName, getAddress(recordAddress));
      if (operation !== "set" && (!validAddress(delegate) || !scopeAck))
        throw new Error(
          "Review the resolver-wide scope and enter a delegate address.",
        );
      const data =
        operation === "set"
          ? setter
          : operation === "grant"
            ? encodeFunctionData({
                abi: resolverAbi,
                functionName: "grantSetterRoles",
                args: [setter, getAddress(delegate)],
              })
            : encodeFunctionData({
                abi: resolverAbi,
                functionName: "revokeRoles",
                args: [ethAddressResource, 1n, getAddress(delegate)],
              });
      const ok = await execute(
        operation === "set"
          ? `Set ${recordName} Ethereum address`
          : `${operation} Ethereum record permission`,
        { to: recordResolver, data },
      );
      if (ok && operation === "set") {
        const result = await inspectIdentity(client, recordName);
        if (result.address.toLowerCase() !== recordAddress.toLowerCase())
          throw new Error(
            "Receipt confirmed, but forward resolution differs. Inspect resolver linking before using this identity.",
          );
        setIdentity(result);
        setInput(recordName);
      }
    } catch (e) {
      setError(transactionError(e));
    }
  }
  const busy =
    checking || ["signing", "confirming"].includes(transaction.phase);
  return (
    <div className="identity-section">
      <Panel
        title="Beneficiary identity explorer"
        description="Resolve real names, inspect their resolver, and verify primary names."
      >
        <div className="identity-lookup">
          <input
            aria-label="ENS identity to inspect"
            placeholder="heir.family.eth or 0x…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="button"
            disabled={busy || !client || !input}
            onClick={lookup}
          >
            <Search size={14} />
            {checking ? "Resolving…" : "Inspect identity"}
          </button>
        </div>
        {identity && (
          <div className="identity-result">
            <Fingerprint size={28} />
            <div>
              <Badge tone="violet">{identity.version}</Badge>
              <h3>{identity.name || "No primary name"}</h3>
              <dl>
                <div>
                  <dt>Pinned address</dt>
                  <dd>
                    <External hash={identity.address} kind="address" />
                  </dd>
                </div>
                <div>
                  <dt>Resolver</dt>
                  <dd>
                    {identity.resolver ? (
                      <External hash={identity.resolver} kind="address" />
                    ) : (
                      "Unavailable"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Registry owner</dt>
                  <dd>
                    {identity.owner && identity.owner !== zeroAddress ? (
                      <External hash={identity.owner} kind="address" />
                    ) : (
                      "Not available for this name"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
        {identity?.name && onResolved && (
          <button
            className="button primary"
            disabled={busy}
            onClick={() => {
              rememberIdentity(
                identity.name!,
                identity.address,
                client!.chain.id,
              );
              onResolved(identity.name!, identity.address);
            }}
          >
            Use this verified beneficiary
          </button>
        )}
        <Notice>
          Only onchain ENS resolution is enabled. CCIP-Read HTTP gateways are
          disabled to prevent a name lookup from silently bypassing the selected
          read transport.
        </Notice>
      </Panel>
      <Panel
        title="Permissioned ENSv2 subnames"
        description="Register under an existing parent subregistry you are authorized to manage."
      >
        <details open={!!onResolved || undefined}>
          <summary className="advanced-summary">
            <ShieldCheck size={16} />
            Create a delegated beneficiary subname
          </summary>
          <div className="form-grid">
            <Field
              label="Parent ENS name"
              hint="The parent owner must first deploy and attach a subregistry in Sepolia ENS Explorer."
            >
              <input
                placeholder="your-family.eth"
                value={parent}
                onChange={(e) => {
                  setParent(e.target.value);
                  setCanRegister(false);
                }}
              />
            </Field>
            <button
              className="button align-end"
              disabled={!client || !address || busy || !parent}
              onClick={checkParent}
            >
              Check parent & permissions
            </button>
          </div>
          {registry && (
            <p className="small">
              Parent subregistry: <External hash={registry} kind="address" />{" "}
              {canRegister && (
                <Badge tone="green">Registrar permission verified</Badge>
              )}
            </p>
          )}
          {parentExpiry !== undefined && (
            <p className="small muted">
              Parent expiry:{" "}
              {new Date(Number(parentExpiry) * 1000).toLocaleString()}. Subnames
              depend on the parent remaining active.
            </p>
          )}
          <a
            className="inline-link"
            href="https://sepolia.explorer.ens.domains/"
            target="_blank"
            rel="noreferrer"
          >
            Open ENS Explorer for parent setup
          </a>
          <div className="form-grid">
            <Field label="Subname label">
              <input
                placeholder="heir"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </Field>
            <Field label="Beneficiary owner address">
              <input
                placeholder="0x…"
                value={heir}
                onChange={(e) => setHeir(e.target.value)}
              />
            </Field>
            <Field
              label="Existing resolver contract"
              hint="Registration does not create address records or grant resolver permissions."
            >
              <input
                placeholder="0x…"
                value={resolver}
                onChange={(e) => setResolver(e.target.value)}
              />
            </Field>
            <Field label="Name expiry">
              <input
                type="datetime-local"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </Field>
          </div>
          <Notice>
            The connected wallet must hold the parent subregistry’s registration
            role. This flow grants the new owner name-level resolver and
            subregistry roles only. A resolver administrator must configure the
            beneficiary’s address record separately. Resolve and review the name
            before adding it to your vault.
          </Notice>
          <button
            className="button primary"
            disabled={
              !canRegister ||
              !label ||
              !validAddress(heir) ||
              !validAddress(resolver) ||
              !expiry ||
              busy
            }
            onClick={register}
          >
            Review registration in wallet
          </button>
        </details>
      </Panel>
      <Panel
        className="identity-record-panel"
        title="Set the beneficiary's Ethereum record"
        description="Name ownership and resolver permissions are separate. Check the connected wallet's actual rights."
      >
        <div className="identity-record-content">
          <div className="form-grid">
            <Field label="Full ENSv2 name">
              <input
                value={recordName}
                placeholder="heir.your-family.eth"
                onChange={(e) => {
                  setRecordName(e.target.value);
                  setRecordPermission(false);
                  setRecordResolver(undefined);
                }}
              />
            </Field>
            <Field label="Beneficiary wallet address">
              <input
                value={recordAddress}
                placeholder="0x…"
                onChange={(e) => setRecordAddress(e.target.value)}
              />
            </Field>
          </div>
          <div className="identity-record-actions">
            <button
              className="button"
              disabled={!client || !address || busy || !recordName}
              onClick={checkRecords}
            >
              Inspect resolver permissions
            </button>
            <button
              className="button primary"
              disabled={
                !recordPermission || !validAddress(recordAddress) || busy
              }
              onClick={() => writeRecord("set")}
            >
              Set address and verify resolution
            </button>
          </div>
          {recordResolver && (
            <p className="small identity-record-status">
              Resolver: <External hash={recordResolver} kind="address" />{" "}
              {recordPermission && (
                <Badge tone="green">Address setter verified</Badge>
              )}
            </p>
          )}
        </div>
        <details>
          <summary className="advanced-summary">
            Delegate or revoke Ethereum record editing
          </summary>
          <Notice>
            This grants Ethereum-address editing across every name served by
            this resolver instance. Use a dedicated resolver for a beneficiary
            if you need isolation. It grants no vault permissions. Root-level
            grants can still apply after an argument-scoped revocation.
          </Notice>
          <Field label="Delegate wallet">
            <input
              value={delegate}
              onChange={(e) => setDelegate(e.target.value)}
              placeholder="0x…"
            />
          </Field>
          <label className="consent-line">
            <input
              type="checkbox"
              checked={scopeAck}
              onChange={(e) => setScopeAck(e.target.checked)}
            />{" "}
            I understand this affects all names served by the resolver, not just
            this subname.
          </label>
          <div className="transport-actions">
            <button
              className="button"
              disabled={
                !recordResolver ||
                !validAddress(delegate) ||
                !scopeAck ||
                !validAddress(recordAddress) ||
                busy
              }
              onClick={() => writeRecord("grant")}
            >
              Grant Ethereum setter only
            </button>
            <button
              className="button"
              disabled={
                !recordResolver ||
                !validAddress(delegate) ||
                !scopeAck ||
                !validAddress(recordAddress) ||
                busy
              }
              onClick={() => writeRecord("revoke")}
            >
              Revoke scoped setter
            </button>
          </div>
          <p className="muted small">
            The wallet must hold the corresponding administrator role. Every
            operation is simulated against the resolver before signing.
          </p>
        </details>
      </Panel>
      {error && <Notice danger>{error}</Notice>}
    </div>
  );
}
