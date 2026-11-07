"use client";
import { useId, useState } from "react";
import { useConnection } from "wagmi";
import {
  encodeFunctionData,
  getAddress,
  zeroAddress,
  type Address,
} from "viem";
import { normalize } from "viem/ens";
import {
  Fingerprint,
  Image as ImageIcon,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  findSubregistry,
  inspectIdentity,
  registryAbi,
  registryEntry,
  resolverAbi,
  ethAddressResource,
  addressRecordCall,
  avatarPreviewUrl,
  emptyEnsProfile,
  ensProfileKeys,
  inspectEnsProfile,
  identityProfileMulticall,
  profileMulticall,
  rememberIdentity,
  rememberIdentityHealth,
  roleSetText,
  textRecordResource,
  textSetterPermissionCall,
  type EnsProfileKey,
  type EnsProfileRecords,
} from "@/lib/ens";
import { shortAddress, validAddress } from "@/lib/configuration";
import { transactionError } from "@/lib/transaction";
import { loadActiveEnsFamily } from "@/lib/ens-setup";
import { useReadTransport } from "./providers";
import { useProtocol } from "./protocol-provider";
import { Badge, External, Field, Notice, Panel } from "./ui";

const profileLabels: Record<EnsProfileKey, string> = {
  avatar: "Avatar URI",
  description: "Public description",
  url: "Website",
  "com.twitter": "X / Twitter handle",
  "com.github": "GitHub handle",
};
const emptyProfilePermissions = () =>
  Object.fromEntries(ensProfileKeys.map((key) => [key, false])) as Record<
    EnsProfileKey,
    boolean
  >;

export function IdentityManager({
  onResolved,
  layout = "stack",
}: {
  onResolved?: (name: string, address: Address) => void;
  layout?: "stack" | "tabs";
} = {}) {
  const [activeTool, setActiveTool] = useState(0);
  const toolId = useId();
  const tools = [
    { label: "Find an identity", description: "Resolve and add a beneficiary" },
    { label: "Create a subname", description: "Register under your ENS name" },
    { label: "Wallet record", description: "Address records and permissions" },
    { label: "Public profile", description: "Profile records and delegation" },
  ];
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
  const [setupName, setSetupName] = useState("");
  const [setupStage, setSetupStage] = useState<
    "details" | "registered" | "verified"
  >("details");
  const [setupProfile, setSetupProfile] =
    useState<EnsProfileRecords>(emptyEnsProfile);
  const [profileName, setProfileName] = useState("");
  const [profile, setProfile] = useState<EnsProfileRecords>(emptyEnsProfile);
  const [savedProfile, setSavedProfile] =
    useState<EnsProfileRecords>(emptyEnsProfile);
  const [profileIdentity, setProfileIdentity] =
    useState<Awaited<ReturnType<typeof inspectIdentity>>>();
  const [profileResolver, setProfileResolver] = useState<Address>();
  const [profilePermissions, setProfilePermissions] = useState<
    Record<EnsProfileKey, boolean>
  >(emptyProfilePermissions);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [resolvedProfileAvatar, setResolvedProfileAvatar] = useState<
    string | undefined
  >();
  const [profileDelegate, setProfileDelegate] = useState("");
  const [profileDelegateKey, setProfileDelegateKey] =
    useState<EnsProfileKey>("avatar");
  const [profileScopeAck, setProfileScopeAck] = useState(false);
  const [profilePermissionStatus, setProfilePermissionStatus] = useState("");
  function resumeSetup() {
    if (!client) return;
    setError("");
    try {
      const saved = localStorage.getItem(`silent:ens-setup:${client.chain.id}`);
      if (!saved)
        throw new Error("No unfinished ENS identity setup was found in this browser.");
      const value = JSON.parse(saved) as {
        name: string;
        account: string;
        resolver: string;
        profile: EnsProfileRecords;
      };
      if (!validAddress(value.account) || !validAddress(value.resolver))
        throw new Error("The saved ENS setup draft is invalid.");
      setSetupName(value.name);
      setRecordName(value.name);
      setRecordAddress(value.account);
      setHeir(value.account);
      setResolver(value.resolver);
      setSetupProfile({ ...emptyEnsProfile(), ...value.profile });
      setSetupStage("registered");
    } catch (e) {
      setError(transactionError(e));
    }
  }
  async function lookup() {
    if (!client) return;
    setChecking(true);
    setError("");
    setIdentity(undefined);
    try {
      const resolved = await inspectIdentity(client, input.trim());
      setIdentity(resolved);
      if (resolved.name) setProfileName(resolved.name);
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
  function loadConfiguredFamily() {
    if (!address) return;
    setError("");
    const family = loadActiveEnsFamily(address);
    if (!family) {
      setError(
        "No verified family identity space is saved for this wallet. Complete the guided ENS setup above first.",
      );
      return;
    }
    setParent(family.name);
    setResolver(family.resolver);
    setCanRegister(false);
    setChecked("");
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
        const createdName = `${normalizedLabel}.${checked}`;
        setInput(createdName);
        setIdentity(undefined);
        setRecordName(createdName);
        setRecordAddress(heir);
        setRecordResolver(undefined);
        setRecordPermission(false);
        setProfileName(createdName);
        setProfileLoaded(false);
        setSetupName(createdName);
        setSetupStage("registered");
        try {
          localStorage.setItem(
            `silent:ens-setup:${client.chain.id}`,
            JSON.stringify({
              name: createdName,
              account: getAddress(heir),
              resolver: getAddress(resolver),
              profile: setupProfile,
            }),
          );
        } catch {
          /* Resume storage is optional. */
        }
      }
    } catch (e) {
      setError(transactionError(e));
    }
  }
  async function configureCreatedIdentity() {
    if (
      !client ||
      !address ||
      !setupName ||
      !validAddress(heir) ||
      !validAddress(resolver)
    )
      return;
    setChecking(true);
    setError("");
    try {
      const normalizedName = normalize(setupName);
      const liveResolver = await client.getEnsResolver({ name: normalizedName });
      if (!liveResolver || liveResolver.toLowerCase() !== resolver.toLowerCase())
        throw new Error(
          "The name's resolver differs from the reviewed resolver. Recheck the name in ENS Explorer.",
        );
      const includedKeys = ensProfileKeys.filter(
        (key) => setupProfile[key].trim() !== "",
      );
      const [addressRoot, addressScoped, textRoot, ...textScoped] =
        await Promise.all([
          client.readContract({
            address: liveResolver,
            abi: resolverAbi,
            functionName: "hasRootRoles",
            args: [1n, address],
          }),
          client.readContract({
            address: liveResolver,
            abi: resolverAbi,
            functionName: "hasRoles",
            args: [ethAddressResource, 1n, address],
          }),
          client.readContract({
            address: liveResolver,
            abi: resolverAbi,
            functionName: "hasRootRoles",
            args: [roleSetText, address],
          }),
          ...includedKeys.map((key) =>
            client.readContract({
              address: liveResolver,
              abi: resolverAbi,
              functionName: "hasRoles",
              args: [textRecordResource(key), roleSetText, address],
            }),
          ),
        ]);
      if (!addressRoot && !addressScoped)
        throw new Error(
          "This wallet cannot edit Ethereum records on the selected resolver. Use an authorized resolver administrator, then retry this step.",
        );
      if (
        includedKeys.some((_, index) => !textRoot && !textScoped[index])
      )
        throw new Error(
          "This wallet cannot edit every selected public profile field. Clear unauthorized optional fields or ask the resolver administrator for text permissions.",
        );
      const records = Object.fromEntries(
        includedKeys.map((key) => [key, setupProfile[key]]),
      ) as Partial<EnsProfileRecords>;
      const ok = await execute(`Configure ${normalizedName} identity`, {
        to: liveResolver,
        data: identityProfileMulticall(
          normalizedName,
          getAddress(heir),
          records,
        ),
      });
      if (!ok) return;
      const verified = await inspectEnsProfile(client, normalizedName);
      if (verified.identity.address.toLowerCase() !== heir.toLowerCase())
        throw new Error(
          "The receipt confirmed, but the name does not resolve to the beneficiary wallet.",
        );
      const mismatch = includedKeys.find(
        (key) => verified.records[key] !== setupProfile[key],
      );
      if (mismatch)
        throw new Error(
          `The receipt confirmed, but the ${profileLabels[mismatch]} record did not verify.`,
        );
      const entry = await registryEntry(client, normalizedName);
      rememberIdentity(normalizedName, getAddress(heir), client.chain.id);
      rememberIdentityHealth(
        {
          name: normalizedName,
          address: getAddress(heir),
          resolver: liveResolver,
          owner: verified.identity.owner,
          expiry: entry.expiry.toString(),
        },
        client.chain.id,
      );
      setIdentity(verified.identity);
      setInput(normalizedName);
      setProfileName(normalizedName);
      setProfile(verified.records);
      setSavedProfile(verified.records);
      setSetupStage("verified");
      try {
        localStorage.removeItem(`silent:ens-setup:${client.chain.id}`);
      } catch {
        /* Resume storage is optional. */
      }
      onResolved?.(normalizedName, getAddress(heir));
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setChecking(false);
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
        setProfileName(recordName);
        setProfileLoaded(false);
      }
    } catch (e) {
      setError(transactionError(e));
    }
  }
  async function loadProfile(name = profileName) {
    if (!client || !name.trim()) return;
    setChecking(true);
    setError("");
    setProfileLoaded(false);
    setProfilePermissionStatus("");
    try {
      const normalizedName = normalize(name);
      const result = await inspectEnsProfile(client, normalizedName);
      if (!result.identity.resolver)
        throw new Error("This ENS name has no resolver attached.");
      const permissions = emptyProfilePermissions();
      if (address) {
        const root = await client.readContract({
          address: result.identity.resolver,
          abi: resolverAbi,
          functionName: "hasRootRoles",
          args: [roleSetText, address],
        });
        const scoped = await Promise.all(
          ensProfileKeys.map((key) =>
            client.readContract({
              address: result.identity.resolver!,
              abi: resolverAbi,
              functionName: "hasRoles",
              args: [textRecordResource(key), roleSetText, address],
            }),
          ),
        );
        ensProfileKeys.forEach((key, index) => {
          permissions[key] = root || scoped[index];
        });
      }
      setProfileName(normalizedName);
      setProfile(result.records);
      setSavedProfile(result.records);
      setProfileIdentity(result.identity);
      setProfileResolver(result.identity.resolver);
      setResolvedProfileAvatar(result.avatarUrl);
      setProfilePermissions(permissions);
      setProfileLoaded(true);
    } catch (e) {
      setProfileIdentity(undefined);
      setProfileResolver(undefined);
      setResolvedProfileAvatar(undefined);
      setProfilePermissions(emptyProfilePermissions());
      setError(transactionError(e));
    } finally {
      setChecking(false);
    }
  }
  async function saveProfile() {
    if (!client || !profileResolver || !profileLoaded) return;
    setError("");
    try {
      const changedKeys = ensProfileKeys.filter(
        (key) => profile[key] !== savedProfile[key],
      );
      if (!changedKeys.length)
        throw new Error("Change at least one profile field before saving.");
      const unauthorized = changedKeys.filter(
        (key) => !profilePermissions[key],
      );
      if (unauthorized.length)
        throw new Error(
          `The connected wallet cannot edit: ${unauthorized.map((key) => profileLabels[key]).join(", ")}.`,
        );
      const liveResolver = await client.getEnsResolver({
        name: normalize(profileName),
      });
      if (liveResolver?.toLowerCase() !== profileResolver.toLowerCase())
        throw new Error("Resolver changed. Reload the ENS profile first.");
      const records = Object.fromEntries(
        changedKeys.map((key) => [key, profile[key]]),
      ) as Partial<EnsProfileRecords>;
      const ok = await execute(`Save ${profileName} ENS profile`, {
        to: profileResolver,
        data: profileMulticall(profileName, records),
      });
      if (ok) await loadProfile(profileName);
    } catch (e) {
      setError(transactionError(e));
    }
  }
  async function writeProfilePermission(operation: "grant" | "revoke") {
    if (!client || !profileResolver || !validAddress(profileDelegate)) return;
    setError("");
    setProfilePermissionStatus("");
    try {
      if (!profileScopeAck)
        throw new Error("Acknowledge the resolver-wide name scope first.");
      const liveResolver = await client.getEnsResolver({
        name: normalize(profileName),
      });
      if (liveResolver?.toLowerCase() !== profileResolver.toLowerCase())
        throw new Error("Resolver changed. Reload the ENS profile first.");
      const delegateAddress = getAddress(profileDelegate);
      const data =
        operation === "grant"
          ? encodeFunctionData({
              abi: resolverAbi,
              functionName: "grantSetterRoles",
              args: [
                textSetterPermissionCall(profileDelegateKey),
                delegateAddress,
              ],
            })
          : encodeFunctionData({
              abi: resolverAbi,
              functionName: "revokeRoles",
              args: [
                textRecordResource(profileDelegateKey),
                roleSetText,
                delegateAddress,
              ],
            });
      const ok = await execute(
        `${operation === "grant" ? "Grant" : "Revoke"} ${profileDelegateKey} editing`,
        { to: profileResolver, data },
      );
      if (!ok) return;
      const [textRoot, textScoped, addressRoot, addressScoped] =
        await Promise.all([
          client.readContract({
            address: profileResolver,
            abi: resolverAbi,
            functionName: "hasRootRoles",
            args: [roleSetText, delegateAddress],
          }),
          client.readContract({
            address: profileResolver,
            abi: resolverAbi,
            functionName: "hasRoles",
            args: [
              textRecordResource(profileDelegateKey),
              roleSetText,
              delegateAddress,
            ],
          }),
          client.readContract({
            address: profileResolver,
            abi: resolverAbi,
            functionName: "hasRootRoles",
            args: [1n, delegateAddress],
          }),
          client.readContract({
            address: profileResolver,
            abi: resolverAbi,
            functionName: "hasRoles",
            args: [ethAddressResource, 1n, delegateAddress],
          }),
        ]);
      setProfilePermissionStatus(
        `${profileLabels[profileDelegateKey]} editing: ${textRoot || textScoped ? "allowed" : "not allowed"}. Ethereum-address editing: ${addressRoot || addressScoped ? "already allowed by a separate grant" : "not allowed"}.`,
      );
    } catch (e) {
      setError(transactionError(e));
    }
  }
  const busy =
    checking || ["signing", "confirming"].includes(transaction.phase);
  const profileDirty = ensProfileKeys.some(
    (key) => profile[key] !== savedProfile[key],
  );
  const profileAvatar =
    profile.avatar === savedProfile.avatar
      ? resolvedProfileAvatar
      : avatarPreviewUrl(profile.avatar);
  return (
    <div
      className={`identity-section ${layout === "tabs" ? "identity-tools-tabbed" : ""}`}
    >
      {layout === "tabs" && (
        <div
          className="identity-tool-tabs"
          role="tablist"
          aria-label="ENS identity tools"
        >
          {tools.map((tool, index) => (
            <button
              key={tool.label}
              role="tab"
              id={`${toolId}-tab-${index}`}
              aria-controls={`${toolId}-panel-${index}`}
              aria-selected={activeTool === index}
              tabIndex={activeTool === index ? 0 : -1}
              onClick={() => setActiveTool(index)}
              onKeyDown={(event) => {
                const offsets: Record<string, number> = {
                  ArrowRight: 1,
                  ArrowLeft: -1,
                };
                if (
                  !(event.key in offsets) &&
                  event.key !== "Home" &&
                  event.key !== "End"
                )
                  return;
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? tools.length - 1
                      : (index + offsets[event.key] + tools.length) %
                        tools.length;
                setActiveTool(next);
                document.getElementById(`${toolId}-tab-${next}`)?.focus();
              }}
            >
              <span className="identity-tool-number">0{index + 1}</span>
              <span>
                <strong>{tool.label}</strong>
                <small>{tool.description}</small>
              </span>
            </button>
          ))}
        </div>
      )}

      <section
        className="identity-tool-panel"
        role={layout === "tabs" ? "tabpanel" : undefined}
        id={`${toolId}-panel-0`}
        aria-labelledby={layout === "tabs" ? `${toolId}-tab-0` : undefined}
        hidden={layout === "tabs" && activeTool !== 0}
      >
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
            <div className="identity-result-action">
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
            </div>
          )}
          <Notice>
            Only onchain ENS resolution is enabled. CCIP-Read HTTP gateways are
            disabled to prevent a name lookup from silently bypassing the
            selected read transport.
          </Notice>
        </Panel>
      </section>
      <section
        className="identity-tool-panel"
        role={layout === "tabs" ? "tabpanel" : undefined}
        id={`${toolId}-panel-1`}
        aria-labelledby={layout === "tabs" ? `${toolId}-tab-1` : undefined}
        hidden={layout === "tabs" && activeTool !== 1}
      >
        <Panel
          title="Permissioned ENSv2 subnames"
          description="Create a beneficiary identity, connect its wallet, and add an optional public profile."
        >
          <details open={!!onResolved || undefined}>
            <summary className="advanced-summary">
              <ShieldCheck size={16} />
              Create a delegated beneficiary subname
            </summary>
            <div className="form-grid">
              <Field
                label="Parent ENS name"
                hint="Use the guided family identity setup above if this name does not have a subname registry yet."
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
                className="button identity-grid-action"
                disabled={!client || !address || busy || !parent}
                onClick={checkParent}
              >
                Check parent & permissions
              </button>
            </div>
            <button
              className="inline-link"
              disabled={!address || busy}
              onClick={loadConfiguredFamily}
            >
              Use my configured family name
            </button>
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
                {new Date(Number(parentExpiry) * 1000).toLocaleString()}.
                Subnames depend on the parent remaining active.
              </p>
            )}
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
                label="Resolver (automatically discovered)"
                hint="Read from the parent name when permissions are checked."
              >
                <input
                  readOnly
                  placeholder="Check the parent first"
                  value={resolver}
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
            <div className="identity-setup-progress" aria-label="Identity setup progress">
              <span className={canRegister ? "done" : ""}>1. Parent verified</span>
              <span className={setupStage !== "details" ? "done" : ""}>2. Name registered</span>
              <span className={setupStage === "verified" ? "done" : ""}>3. Identity verified</span>
            </div>
            <div className="identity-profile-fields">
              <Field label="Avatar" hint="Optional HTTPS, IPFS, or ENSIP-12 value.">
                <input placeholder="ipfs://... or https://..." value={setupProfile.avatar} onChange={(e) => setSetupProfile({ ...setupProfile, avatar: e.target.value })} />
              </Field>
              <Field label="Description" hint="Optional, up to 160 characters.">
                <input maxLength={160} placeholder="Family beneficiary identity" value={setupProfile.description} onChange={(e) => setSetupProfile({ ...setupProfile, description: e.target.value })} />
              </Field>
              <Field label="Website">
                <input placeholder="https://..." value={setupProfile.url} onChange={(e) => setSetupProfile({ ...setupProfile, url: e.target.value })} />
              </Field>
              <Field label="X / Twitter handle">
                <input placeholder="handle" value={setupProfile["com.twitter"]} onChange={(e) => setSetupProfile({ ...setupProfile, "com.twitter": e.target.value })} />
              </Field>
              <Field label="GitHub handle">
                <input placeholder="username" value={setupProfile["com.github"]} onChange={(e) => setSetupProfile({ ...setupProfile, "com.github": e.target.value })} />
              </Field>
            </div>
            <details className="identity-advanced-resolver">
              <summary className="advanced-summary">Advanced resolver details</summary>
              <p className="small muted">
                The resolver is discovered from the parent. Only change it when an ENS administrator supplied another compatible resolver.
              </p>
            </details>
            <Notice>
              The connected wallet must hold the parent subregistry’s
              registration role. This guided flow uses two confirmed
              transactions: registration, then one resolver multicall for the
              beneficiary wallet and optional public profile. A local draft
              lets you resume step two without repeating registration.
            </Notice>
            <div className="transport-actions">
              {setupStage === "details" ? (
                <button
                  className="button primary"
                  disabled={
                    !canRegister || !label || !validAddress(heir) ||
                    !validAddress(resolver) || !expiry || busy
                  }
                  onClick={register}
                >
                  Step 1: register name
                </button>
              ) : (
                <button
                  className="button primary"
                  disabled={busy || setupStage === "verified"}
                  onClick={configureCreatedIdentity}
                >
                  {setupStage === "verified" ? "Identity verified" : "Step 2: set wallet & profile"}
                </button>
              )}
              {setupStage === "details" && (
                <button className="button" disabled={!client || busy} onClick={resumeSetup}>
                  Resume unfinished setup
                </button>
              )}
              {setupName && <span className="small">{setupName} → {shortAddress(heir)}</span>}
            </div>
            {setupStage === "verified" && identity && (
              <div className="identity-verification-result">
                <Badge tone="green">Forward resolution verified</Badge>
                <span>Registry owner: {shortAddress(identity.owner)}</span>
                <span>Resolver: {shortAddress(identity.resolver)}</span>
                <span>Profile records verified onchain</span>
              </div>
            )}
          </details>
        </Panel>
      </section>
      <section
        className="identity-tool-panel"
        role={layout === "tabs" ? "tabpanel" : undefined}
        id={`${toolId}-panel-2`}
        aria-labelledby={layout === "tabs" ? `${toolId}-tab-2` : undefined}
        hidden={layout === "tabs" && activeTool !== 2}
      >
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
              I understand this affects all names served by the resolver, not
              just this subname.
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
      </section>
      <section
        className="identity-tool-panel"
        role={layout === "tabs" ? "tabpanel" : undefined}
        id={`${toolId}-panel-3`}
        aria-labelledby={layout === "tabs" ? `${toolId}-tab-3` : undefined}
        hidden={layout === "tabs" && activeTool !== 3}
      >
        <Panel
          className="identity-profile-panel"
          title="Beneficiary ENSv2 profile"
          description="Add public identity records to an existing subname and delegate individual profile keys without changing vault entitlement."
        >
          <div className="identity-profile-content">
            <div className="form-grid identity-profile-lookup">
              <Field
                label="Existing ENSv2 name"
                hint="Profile data is public. Do not publish private inheritance instructions or contact details."
              >
                <input
                  value={profileName}
                  placeholder="heir.your-family.eth"
                  onChange={(e) => {
                    setProfileName(e.target.value);
                    setProfileLoaded(false);
                    setProfilePermissionStatus("");
                  }}
                />
              </Field>
              <button
                className="button identity-grid-action"
                disabled={!client || !profileName || busy}
                onClick={() => loadProfile()}
              >
                Load onchain profile
              </button>
            </div>
            {profileLoaded && profileIdentity && (
              <div className="ens-profile-card">
                <div className="ens-profile-avatar">
                  {profileAvatar ? (
                    // ENS avatars are user-controlled remote resources.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileAvatar}
                      alt={`${profileName} avatar`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ImageIcon size={30} />
                  )}
                </div>
                <div className="ens-profile-summary">
                  <div className="ens-profile-title">
                    <div>
                      <Badge tone="violet">ENSv2 public identity</Badge>
                      <h3>{profileName}</h3>
                    </div>
                    <div className="ens-profile-verification">
                      <Badge tone="green">Address verified</Badge>
                      {profileIdentity.owner &&
                        profileIdentity.owner !== zeroAddress && (
                          <Badge tone="green">Owner verified</Badge>
                        )}
                    </div>
                  </div>
                  <p>
                    {profile.description ||
                      "No public description has been set."}
                  </p>
                  <dl>
                    <div>
                      <dt>Pinned recipient</dt>
                      <dd>
                        <External
                          hash={profileIdentity.address}
                          kind="address"
                        />
                      </dd>
                    </div>
                    <div>
                      <dt>Resolver</dt>
                      <dd>
                        {profileResolver && (
                          <External hash={profileResolver} kind="address" />
                        )}
                      </dd>
                    </div>
                  </dl>
                  {profile.url && /^https:\/\//i.test(profile.url) && (
                    <a
                      className="inline-link"
                      href={profile.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open public website
                    </a>
                  )}
                </div>
              </div>
            )}
            {profileLoaded && (
              <>
                <div className="ens-profile-fields">
                  <Field
                    label="Avatar URI"
                    hint="Use an HTTPS, ipfs:// or ENSIP-12 compatible avatar URI. HTTPS/IPFS previews contact the image host separately from Anon-RPC."
                  >
                    <input
                      value={profile.avatar}
                      disabled={!profilePermissions.avatar}
                      placeholder="ipfs://... or https://..."
                      onChange={(e) =>
                        setProfile((current) => ({
                          ...current,
                          avatar: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field
                    label="Public description"
                    hint={`${profile.description.length}/160 characters`}
                  >
                    <textarea
                      value={profile.description}
                      disabled={!profilePermissions.description}
                      maxLength={160}
                      placeholder="A short public beneficiary identity description"
                      onChange={(e) =>
                        setProfile((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Website">
                    <input
                      value={profile.url}
                      disabled={!profilePermissions.url}
                      placeholder="https://..."
                      onChange={(e) =>
                        setProfile((current) => ({
                          ...current,
                          url: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="X / Twitter handle">
                    <input
                      value={profile["com.twitter"]}
                      disabled={!profilePermissions["com.twitter"]}
                      placeholder="handle without @"
                      onChange={(e) =>
                        setProfile((current) => ({
                          ...current,
                          "com.twitter": e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="GitHub handle">
                    <input
                      value={profile["com.github"]}
                      disabled={!profilePermissions["com.github"]}
                      placeholder="github-user"
                      onChange={(e) =>
                        setProfile((current) => ({
                          ...current,
                          "com.github": e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
                <div className="ens-profile-access-grid">
                  {ensProfileKeys.map((key) => (
                    <div key={key}>
                      <span>{profileLabels[key]}</span>
                      <Badge
                        tone={profilePermissions[key] ? "green" : "neutral"}
                      >
                        {profilePermissions[key] ? "Editable" : "Read only"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="identity-record-actions">
                  <button
                    className="button primary"
                    disabled={!profileDirty || busy}
                    onClick={saveProfile}
                  >
                    Save profile records in one transaction
                  </button>
                  <button
                    className="button"
                    disabled={busy}
                    onClick={() => loadProfile()}
                  >
                    Discard changes and reload
                  </button>
                </div>
                <Notice>
                  Avatar, description and social records are public presentation
                  metadata. SilentSovereign claims remain bound to the verified
                  wallet address stored in the vault, even if profile records
                  later change.
                </Notice>
              </>
            )}
          </div>
          <details>
            <summary className="advanced-summary">
              Delegate one ENSv2 profile field
            </summary>
            <Notice>
              ENSv2 scopes this permission to one text key, but the grant
              applies to that key on every name served by this resolver
              instance. Use a dedicated resolver when each beneficiary needs
              isolated control.
            </Notice>
            <div className="form-grid">
              <Field label="Profile field">
                <select
                  value={profileDelegateKey}
                  onChange={(e) =>
                    setProfileDelegateKey(e.target.value as EnsProfileKey)
                  }
                >
                  {ensProfileKeys.map((key) => (
                    <option key={key} value={key}>
                      {profileLabels[key]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Delegate wallet">
                <input
                  value={profileDelegate}
                  onChange={(e) => setProfileDelegate(e.target.value)}
                  placeholder="0xâ€¦"
                />
              </Field>
            </div>
            <label className="consent-line">
              <input
                type="checkbox"
                checked={profileScopeAck}
                onChange={(e) => setProfileScopeAck(e.target.checked)}
              />{" "}
              I understand this key permission covers every name using this
              resolver and grants no vault or Ethereum-address authority.
            </label>
            <div className="transport-actions">
              <button
                className="button"
                disabled={
                  !profileResolver ||
                  !validAddress(profileDelegate) ||
                  !profileScopeAck ||
                  busy
                }
                onClick={() => writeProfilePermission("grant")}
              >
                Grant selected profile key
              </button>
              <button
                className="button"
                disabled={
                  !profileResolver ||
                  !validAddress(profileDelegate) ||
                  !profileScopeAck ||
                  busy
                }
                onClick={() => writeProfilePermission("revoke")}
              >
                Revoke selected profile key
              </button>
            </div>
            {profilePermissionStatus && (
              <p className="small identity-record-status">
                {profilePermissionStatus}
              </p>
            )}
            <p className="muted small">
              The connected wallet must hold the matching administrator role.
              Granting a text key never grants Ethereum-address editing.
            </p>
          </details>
        </Panel>
      </section>
      {error && <Notice danger>{error}</Notice>}
    </div>
  );
}
