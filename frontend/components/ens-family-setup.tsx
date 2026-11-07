"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useConnection } from "wagmi";
import {
  Check,
  Clock3,
  Coins,
  ExternalLink,
  Fingerprint,
  KeyRound,
  LoaderCircle,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  getAddress,
  parseAbi,
  toHex,
  zeroAddress,
  type Address,
} from "viem";
import { registryEntry } from "@/lib/ens";
import {
  clearRegistrationDraft,
  ensV2Sepolia,
  ethRegistrarAbi,
  labelId,
  loadRegistrationDraft,
  normalizeParentName,
  parentRegistryWriteAbi,
  predictEnsInfrastructure,
  registrationCall,
  registrationCommitmentCall,
  registryDeploymentCall,
  resolverDeploymentCall,
  saveActiveEnsFamily,
  saveRegistrationDraft,
  verifiableFactoryAbi,
  yearSeconds,
  type EnsRegistrationDraft,
} from "@/lib/ens-setup";
import { shortAddress } from "@/lib/configuration";
import { transactionError } from "@/lib/transaction";
import type { ReadClient } from "@/lib/privacy";
import { useReadTransport } from "./providers";
import { useProtocol } from "./protocol-provider";
import {
  Badge,
  External,
  Field,
  Notice,
  Panel,
  StepIcon,
  WalletButton,
} from "./ui";

const mintableTokenAbi = parseAbi(["function mint(address to,uint256 amount)"]);

type ProxyState = "missing" | "verified" | "unexpected";
type Inspection = {
  name: string;
  label: string;
  available: boolean;
  owner: Address;
  expiry: bigint;
  holdingRegistry: Address;
  attachedResolver: Address;
  attachedRegistry: Address;
  parentAddress?: Address;
  predictedResolver: Address;
  predictedRegistry: Address;
  resolverProxy: ProxyState;
  registryProxy: ProxyState;
  price: bigint;
  basePrice: bigint;
  premium: bigint;
  balance: bigint;
  allowance: bigint;
  decimals: number;
  symbol: string;
};

type CommitTiming = {
  at: bigint;
  minimumAge: bigint;
  maximumAge: bigint;
};

const durationOptions = [
  { years: 1, label: "1 year", detail: "Start small" },
  { years: 3, label: "3 years", detail: "Balanced" },
  { years: 6, label: "6 years", detail: "Best continuity" },
];

function randomSecret() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes, { size: 32 });
}

async function verifiedProxy(
  client: ReadClient,
  proxy: Address,
  expectedImplementation: Address,
): Promise<ProxyState> {
  const code = await client.getBytecode({ address: proxy });
  if (!code || code === "0x") return "missing";
  try {
    const implementation = await client.readContract({
      address: ensV2Sepolia.verifiableFactory,
      abi: verifiableFactoryAbi,
      functionName: "verifyContract",
      args: [proxy],
    });
    return implementation.toLowerCase() === expectedImplementation.toLowerCase()
      ? "verified"
      : "unexpected";
  } catch {
    return "unexpected";
  }
}

export function EnsFamilySetup() {
  const { address, chainId } = useConnection();
  // Wallet connectors restore persisted state only in the browser. Keep the
  // first client render identical to SSR, then reveal the restored connection.
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const renderedAddress = hydrated ? address : undefined;
  const { client, privacy } = useReadTransport();
  const { execute, transaction } = useProtocol();
  const [nameInput, setNameInput] = useState("");
  const [years, setYears] = useState(3);
  const [paymentToken, setPaymentToken] = useState<Address>(
    ensV2Sepolia.paymentTokens[0].address,
  );
  const [inspection, setInspection] = useState<Inspection>();
  const [draft, setDraft] = useState<EnsRegistrationDraft>();
  const [commitTiming, setCommitTiming] = useState<CommitTiming>();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [clock, setClock] = useState(() => Date.now());
  const busy =
    checking || ["signing", "confirming"].includes(transaction.phase);

  useEffect(() => {
    if (!commitTiming) return;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [commitTiming]);

  const now = BigInt(Math.floor(clock / 1000));
  const revealAt = commitTiming
    ? commitTiming.at + commitTiming.minimumAge
    : 0n;
  const commitmentExpires = commitTiming
    ? commitTiming.at + commitTiming.maximumAge
    : 0n;
  const secondsToReveal = revealAt > now ? Number(revealAt - now) : 0;
  const commitmentExpired = !!commitTiming && now > commitmentExpires;
  const isOwner =
    !!inspection &&
    !!renderedAddress &&
    inspection.owner.toLowerCase() === renderedAddress.toLowerCase();
  const parentReady =
    !!inspection &&
    isOwner &&
    inspection.attachedResolver !== zeroAddress &&
    inspection.attachedRegistry !== zeroAddress &&
    inspection.parentAddress?.toLowerCase() === renderedAddress?.toLowerCase();
  const infrastructurePrepared =
    inspection?.resolverProxy === "verified" &&
    inspection?.registryProxy === "verified";
  const progress = useMemo(() => {
    if (parentReady) return 4;
    if (draft && commitTiming?.at) return secondsToReveal ? 3 : 4;
    if (
      inspection &&
      inspection.allowance >= inspection.price &&
      inspection.price > 0n
    )
      return 3;
    if (infrastructurePrepared) return 2;
    if (inspection) return 1;
    return 0;
  }, [
    parentReady,
    draft,
    commitTiming,
    secondsToReveal,
    inspection,
    infrastructurePrepared,
  ]);

  async function inspect(
    requestedName = nameInput,
    requestedYears = years,
    requestedToken = paymentToken,
  ) {
    if (!client || !address) return;
    setChecking(true);
    setError("");
    try {
      if (client.chain.id !== 11155111 || chainId !== 11155111)
        throw new Error("Switch the app and wallet to Sepolia to use ENSv2.");
      const { name, label } = normalizeParentName(requestedName);
      const duration = BigInt(requestedYears * yearSeconds);
      const [available, entry, predicted, decimals, symbol, balance, allowance] =
        await Promise.all([
          client.readContract({
            address: ensV2Sepolia.ethRegistrar,
            abi: ethRegistrarAbi,
            functionName: "isAvailable",
            args: [label],
          }),
          registryEntry(client, name),
          predictEnsInfrastructure(client, address, name),
          client.readContract({
            address: requestedToken,
            abi: erc20Abi,
            functionName: "decimals",
          }),
          client.readContract({
            address: requestedToken,
            abi: erc20Abi,
            functionName: "symbol",
          }),
          client.readContract({
            address: requestedToken,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          }),
          client.readContract({
            address: requestedToken,
            abi: erc20Abi,
            functionName: "allowance",
            args: [address, ensV2Sepolia.ethRegistrar],
          }),
        ]);
      const [attachedResolver, attachedRegistry, resolverProxy, registryProxy] =
        await Promise.all([
          client.readContract({
            address: entry.registry,
            abi: parentRegistryWriteAbi,
            functionName: "getResolver",
            args: [label],
          }),
          client.readContract({
            address: entry.registry,
            abi: parentRegistryWriteAbi,
            functionName: "getSubregistry",
            args: [label],
          }),
          verifiedProxy(
            client,
            predicted.resolver,
            ensV2Sepolia.permissionedResolverImpl,
          ),
          verifiedProxy(
            client,
            predicted.registry,
            ensV2Sepolia.userRegistryImpl,
          ),
        ]);
      let basePrice = 0n;
      let premium = 0n;
      if (available) {
        [basePrice, premium] = await client.readContract({
          address: ensV2Sepolia.ethRegistrar,
          abi: ethRegistrarAbi,
          functionName: "getRegisterPrice",
          args: [label, duration, requestedToken],
        });
      }
      let parentAddress: Address | undefined;
      try {
        parentAddress =
          (await client.getEnsAddress({ name })) || undefined;
      } catch {
        /* The name may not have a resolver yet. */
      }
      const next: Inspection = {
        name,
        label,
        available,
        owner: entry.owner,
        expiry: entry.expiry,
        holdingRegistry: entry.registry,
        attachedResolver,
        attachedRegistry,
        parentAddress,
        predictedResolver: predicted.resolver,
        predictedRegistry: predicted.registry,
        resolverProxy,
        registryProxy,
        basePrice,
        premium,
        price: basePrice + premium,
        balance,
        allowance,
        decimals,
        symbol: symbol.slice(0, 16),
      };
      setNameInput(name);
      setInspection(next);
      if (
        !available &&
        entry.owner.toLowerCase() !== address.toLowerCase()
      )
        throw new Error(
          `${name} is registered to another wallet. Choose another name or connect its owner wallet.`,
        );
      if (
        !available &&
        attachedResolver !== zeroAddress &&
        attachedRegistry !== zeroAddress &&
        parentAddress?.toLowerCase() === address.toLowerCase()
      )
        saveActiveEnsFamily({
          name,
          owner: address,
          resolver: attachedResolver,
          registry: attachedRegistry,
        });
      return next;
    } catch (e) {
      setInspection(undefined);
      setError(transactionError(e));
    } finally {
      setChecking(false);
    }
  }

  async function refreshCommitment(value: EnsRegistrationDraft) {
    if (!client) return;
    const [at, minimumAge, maximumAge] = await Promise.all([
      client.readContract({
        address: ensV2Sepolia.ethRegistrar,
        abi: ethRegistrarAbi,
        functionName: "commitmentAt",
        args: [value.commitment],
      }),
      client.readContract({
        address: ensV2Sepolia.ethRegistrar,
        abi: ethRegistrarAbi,
        functionName: "MIN_COMMITMENT_AGE",
      }),
      client.readContract({
        address: ensV2Sepolia.ethRegistrar,
        abi: ethRegistrarAbi,
        functionName: "MAX_COMMITMENT_AGE",
      }),
    ]);
    if (at === 0n)
      throw new Error(
        "This registration commitment was not found onchain. Start a fresh commitment.",
      );
    setCommitTiming({ at, minimumAge, maximumAge });
  }

  async function resume() {
    if (!address) return;
    setError("");
    try {
      const saved = loadRegistrationDraft();
      if (!saved)
        throw new Error("No unfinished ENS registration was found in this browser.");
      if (saved.owner.toLowerCase() !== address.toLowerCase())
        throw new Error(
          `This setup belongs to ${shortAddress(saved.owner)}. Connect that wallet to resume.`,
        );
      setDraft(saved);
      setNameInput(saved.name);
      setYears(Math.round(Number(saved.duration) / yearSeconds));
      setPaymentToken(saved.paymentToken);
      await Promise.all([
        inspect(
          saved.name,
          Math.round(Number(saved.duration) / yearSeconds),
          saved.paymentToken,
        ),
        refreshCommitment(saved),
      ]);
    } catch (e) {
      setError(transactionError(e));
    }
  }

  async function deployResolver() {
    if (!address || !inspection || !client) return;
    setError("");
    const call = resolverDeploymentCall(
      address,
      inspection.name,
      inspection.predictedResolver,
    );
    const ok = await execute("Create your ENS identity resolver", call);
    if (!ok) return;
    const state = await verifiedProxy(
      client,
      call.predicted,
      ensV2Sepolia.permissionedResolverImpl,
    );
    if (state !== "verified") {
      setError("Resolver transaction confirmed, but factory provenance did not verify.");
      return;
    }
    await inspect();
  }

  async function deployRegistry() {
    if (!address || !inspection || !client) return;
    setError("");
    const call = registryDeploymentCall(
      address,
      inspection.name,
      inspection.predictedRegistry,
    );
    const ok = await execute("Create your ENS subname registry", call);
    if (!ok) return;
    const state = await verifiedProxy(
      client,
      call.predicted,
      ensV2Sepolia.userRegistryImpl,
    );
    if (state !== "verified") {
      setError("Registry transaction confirmed, but factory provenance did not verify.");
      return;
    }
    await inspect();
  }

  async function attach(kind: "resolver" | "registry") {
    if (!inspection) return;
    const resolver = kind === "resolver";
    const data = encodeFunctionData({
      abi: parentRegistryWriteAbi,
      functionName: resolver ? "setResolver" : "setSubregistry",
      args: [
        labelId(inspection.label),
        resolver
          ? inspection.predictedResolver
          : inspection.predictedRegistry,
      ],
    });
    const ok = await execute(
      resolver ? "Connect your ENS resolver" : "Enable beneficiary subnames",
      { to: inspection.holdingRegistry, data },
    );
    if (ok) await inspect();
  }

  async function setParentRecord() {
    if (!inspection || !address) return;
    const resolver =
      inspection.attachedResolver === zeroAddress
        ? inspection.predictedResolver
        : inspection.attachedResolver;
    const { addressRecordCall } = await import("@/lib/ens");
    const ok = await execute(`Connect ${inspection.name} to your wallet`, {
      to: resolver,
      data: addressRecordCall(inspection.name, address),
    });
    if (ok) await inspect();
  }

  async function mintTestPaymentToken() {
    if (!address || !inspection) return;
    const amount = 1000n * 10n ** BigInt(inspection.decimals);
    const ok = await execute(`Mint test ${inspection.symbol}`, {
      to: paymentToken,
      data: encodeFunctionData({
        abi: mintableTokenAbi,
        functionName: "mint",
        args: [address, amount],
      }),
    });
    if (ok) await inspect();
  }

  async function approvePayment() {
    if (!inspection) return;
    const ok = await execute(`Approve ${inspection.symbol} registration cost`, {
      to: paymentToken,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [ensV2Sepolia.ethRegistrar, inspection.price],
      }),
    });
    if (ok) await inspect();
  }

  async function commitRegistration() {
    if (!client || !address || !inspection) return;
    setError("");
    try {
      if (!inspection.available)
        throw new Error("This name is no longer available.");
      if (!infrastructurePrepared)
        throw new Error("Finish preparing the ENS infrastructure first.");
      if (inspection.allowance < inspection.price)
        throw new Error("Approve the exact registration cost first.");
      const duration = BigInt(years * yearSeconds);
      const secret = randomSecret();
      const commitment = await client.readContract(
        registrationCommitmentCall({
          label: inspection.label,
          owner: address,
          secret,
          registry: inspection.predictedRegistry,
          resolver: inspection.predictedResolver,
          duration,
        }),
      );
      const value: EnsRegistrationDraft = {
        name: inspection.name,
        label: inspection.label,
        owner: address,
        secret,
        registry: inspection.predictedRegistry,
        resolver: inspection.predictedResolver,
        duration: duration.toString(),
        paymentToken,
        commitment,
      };
      saveRegistrationDraft(value);
      setDraft(value);
      const ok = await execute(`Protect ${inspection.name} registration`, {
        to: ensV2Sepolia.ethRegistrar,
        data: encodeFunctionData({
          abi: ethRegistrarAbi,
          functionName: "commit",
          args: [commitment],
        }),
      });
      if (ok) {
        await refreshCommitment(value);
      } else {
        const at = await client.readContract({
          address: ensV2Sepolia.ethRegistrar,
          abi: ethRegistrarAbi,
          functionName: "commitmentAt",
          args: [commitment],
        });
        if (at === 0n) {
          clearRegistrationDraft();
          setDraft(undefined);
        } else {
          await refreshCommitment(value);
        }
      }
    } catch (e) {
      setError(transactionError(e));
    }
  }

  async function revealRegistration() {
    if (!client || !address || !draft) return;
    setError("");
    try {
      if (draft.owner.toLowerCase() !== address.toLowerCase())
        throw new Error("Connect the wallet that created this registration.");
      await refreshCommitment(draft);
      const at = await client.readContract({
        address: ensV2Sepolia.ethRegistrar,
        abi: ethRegistrarAbi,
        functionName: "commitmentAt",
        args: [draft.commitment],
      });
      const minimum = await client.readContract({
        address: ensV2Sepolia.ethRegistrar,
        abi: ethRegistrarAbi,
        functionName: "MIN_COMMITMENT_AGE",
      });
      const block = await client.getBlock();
      if (block.timestamp < at + minimum)
        throw new Error("The commitment protection window is still active.");
      const [base, premium] = await client.readContract({
        address: ensV2Sepolia.ethRegistrar,
        abi: ethRegistrarAbi,
        functionName: "getRegisterPrice",
        args: [draft.label, BigInt(draft.duration), draft.paymentToken],
      });
      const allowance = await client.readContract({
        address: draft.paymentToken,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, ensV2Sepolia.ethRegistrar],
      });
      if (allowance < base + premium) {
        await inspect(
          draft.name,
          Math.round(Number(draft.duration) / yearSeconds),
          draft.paymentToken,
        );
        throw new Error(
          "The live price is now above the approved amount. Refresh and approve the updated cost; your commitment remains valid.",
        );
      }
      const ok = await execute(`Register ${draft.name}`, {
        to: ensV2Sepolia.ethRegistrar,
        data: registrationCall(draft),
      });
      if (!ok) return;
      const entry = await registryEntry(client, draft.name);
      if (entry.owner.toLowerCase() !== address.toLowerCase())
        throw new Error(
          "Registration receipt confirmed, but registry ownership did not verify.",
        );
      clearRegistrationDraft();
      setDraft(undefined);
      setCommitTiming(undefined);
      await inspect(draft.name, Math.round(Number(draft.duration) / yearSeconds), draft.paymentToken);
    } catch (e) {
      setError(transactionError(e));
    }
  }

  function restartCommitment() {
    clearRegistrationDraft();
    setDraft(undefined);
    setCommitTiming(undefined);
    setError("");
  }

  const newName = inspection?.available;
  const tokenShortfall =
    !!inspection && inspection.balance < inspection.price;
  const needsApproval =
    !!inspection && inspection.price > 0n && inspection.allowance < inspection.price;

  return (
    <Panel
      className="ens-family-setup"
      title="Create your family identity space"
      description="Get a Sepolia .eth name, prepare its ENSv2 infrastructure, and issue beneficiary identities without leaving SilentSovereign."
      action={<Badge tone={parentReady ? "green" : "violet"}>{parentReady ? "Ready" : "Guided setup"}</Badge>}
    >
      <div className="ens-family-progress" aria-label="ENS setup progress">
        {["Choose name", "Prepare", "Secure name", "Ready"].map((label, index) => (
          <div key={label} className={progress > index ? "complete" : progress === index ? "current" : ""}>
            <StepIcon done={progress > index}>
              {String(index + 1).padStart(2, "0")}
            </StepIcon>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {!renderedAddress ? (
        <div className="ens-family-connect">
          <Fingerprint size={26} />
          <div>
            <h3>Start with the wallet that will own your family name</h3>
            <p>SilentSovereign never receives your key. Every ENS change is reviewed and signed in your wallet.</p>
          </div>
          <WalletButton />
        </div>
      ) : (
        <>
          <div className="ens-family-search">
            <Field
              label="Your family name"
              hint="Enter a new name or one this wallet already owns. Sepolia ENSv2 only."
            >
              <div className="ens-name-input">
                <input
                  value={nameInput}
                  placeholder="your-family.eth"
                  disabled={busy || !!draft}
                  onChange={(event) => {
                    setNameInput(event.target.value);
                    setInspection(undefined);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void inspect();
                  }}
                />
                <button
                  className="button primary"
                  disabled={!nameInput || busy || !!draft}
                  onClick={() => inspect()}
                >
                  {checking ? <LoaderCircle className="spin" size={15} /> : <Search size={15} />}
                  Check name
                </button>
              </div>
            </Field>
            <button className="inline-link" disabled={busy} onClick={resume}>
              <RefreshCw size={13} /> Resume an unfinished registration
            </button>
          </div>

          {inspection && (
            <div className="ens-family-body">
              <div className="ens-family-name-summary">
                <div className="ens-family-name-mark">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="eyebrow">FAMILY IDENTITY</span>
                  <h3>{inspection.name}</h3>
                  <p>
                    {newName
                      ? "Available to register with this wallet"
                      : isOwner
                        ? "Owned by your connected wallet"
                        : "Registered to another wallet"}
                  </p>
                </div>
                <Badge tone={newName || isOwner ? "green" : "red"}>
                  {newName ? "Available" : isOwner ? "Verified owner" : "Unavailable"}
                </Badge>
              </div>

              {newName && (
                <div className="ens-purchase-options">
                  <div>
                    <span className="ens-option-label">Keep the name for</span>
                    <div className="ens-duration-options">
                      {durationOptions.map((option) => (
                        <button
                          key={option.years}
                          className={years === option.years ? "selected" : ""}
                          disabled={busy || !!draft}
                          onClick={() => {
                            setYears(option.years);
                            setInspection(undefined);
                            setError("");
                            setNameInput(inspection.name);
                          }}
                        >
                          <strong>{option.label}</strong>
                          <small>{option.detail}</small>
                        </button>
                      ))}
                    </div>
                    <small className="muted">After changing duration, check the name again to refresh its exact price.</small>
                  </div>
                  <Field label="Payment token">
                    <select
                      value={paymentToken}
                      disabled={busy || !!draft}
                      onChange={(event) => {
                        setPaymentToken(getAddress(event.target.value));
                        setInspection(undefined);
                        setError("");
                      }}
                    >
                      {ensV2Sepolia.paymentTokens.map((token) => (
                        <option key={token.address} value={token.address}>{token.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              <div className="ens-infrastructure-grid">
                <InfrastructureCard
                  icon={<KeyRound size={18} />}
                  title="Private resolver"
                  description="Stores wallet and public profile records. Created only for your wallet."
                  state={inspection.attachedResolver !== zeroAddress ? "connected" : inspection.resolverProxy}
                  address={inspection.attachedResolver !== zeroAddress ? inspection.attachedResolver : inspection.predictedResolver}
                />
                <InfrastructureCard
                  icon={<Network size={18} />}
                  title="Subname registry"
                  description="Lets you issue owned beneficiary identities under this name."
                  state={inspection.attachedRegistry !== zeroAddress ? "connected" : inspection.registryProxy}
                  address={inspection.attachedRegistry !== zeroAddress ? inspection.attachedRegistry : inspection.predictedRegistry}
                />
                <InfrastructureCard
                  icon={<ShieldCheck size={18} />}
                  title="Wallet record"
                  description="Makes the parent name resolve back to the connected owner wallet."
                  state={inspection.parentAddress?.toLowerCase() === renderedAddress?.toLowerCase() ? "connected" : "missing"}
                  address={inspection.parentAddress}
                />
              </div>

              {newName && (
                <div className="ens-price-summary">
                  <div>
                    <span>Registration</span>
                    <strong>{formatUnits(inspection.basePrice, inspection.decimals)} {inspection.symbol}</strong>
                  </div>
                  <div>
                    <span>Temporary premium</span>
                    <strong>{formatUnits(inspection.premium, inspection.decimals)} {inspection.symbol}</strong>
                  </div>
                  <div className="total">
                    <span>Total due</span>
                    <strong>{formatUnits(inspection.price, inspection.decimals)} {inspection.symbol}</strong>
                    <small>Wallet balance {formatUnits(inspection.balance, inspection.decimals)}</small>
                  </div>
                </div>
              )}

              <div className="ens-next-action">
                <div>
                  <span className="eyebrow">NEXT STEP</span>
                  <h3>{nextActionTitle({ inspection, newName, isOwner, parentReady, infrastructurePrepared, needsApproval, draft, secondsToReveal, commitmentExpired })}</h3>
                  <p>{nextActionDescription({ inspection, newName, isOwner, parentReady, infrastructurePrepared, needsApproval, draft, secondsToReveal, commitmentExpired })}</p>
                </div>
                <div className="ens-next-controls">
                  {inspection.resolverProxy === "missing" && inspection.attachedResolver === zeroAddress ? (
                    <button className="button primary" disabled={busy} onClick={deployResolver}>Create resolver</button>
                  ) : inspection.registryProxy === "missing" && inspection.attachedRegistry === zeroAddress ? (
                    <button className="button primary" disabled={busy} onClick={deployRegistry}>Create subname registry</button>
                  ) : !newName && inspection.attachedResolver === zeroAddress ? (
                    <button className="button primary" disabled={busy} onClick={() => attach("resolver")}>Connect resolver</button>
                  ) : !newName && inspection.attachedRegistry === zeroAddress ? (
                    <button className="button primary" disabled={busy} onClick={() => attach("registry")}>Enable subnames</button>
                  ) : !newName && inspection.parentAddress?.toLowerCase() !== renderedAddress?.toLowerCase() ? (
                    <button className="button primary" disabled={busy} onClick={setParentRecord}>Connect wallet record</button>
                  ) : newName && tokenShortfall ? (
                    <button className="button primary" disabled={busy} onClick={mintTestPaymentToken}><Coins size={15} /> Mint test {inspection.symbol}</button>
                  ) : newName && needsApproval ? (
                    <button className="button primary" disabled={busy} onClick={approvePayment}>Approve exact cost</button>
                  ) : newName && !draft ? (
                    <button className="button primary" disabled={busy} onClick={commitRegistration}>Protect this registration</button>
                  ) : draft && commitmentExpired ? (
                    <button className="button primary" disabled={busy} onClick={restartCommitment}>Start a fresh commitment</button>
                  ) : draft && secondsToReveal > 0 ? (
                    <div className="ens-countdown"><Clock3 size={17} /><strong>{secondsToReveal}s</strong><span>until registration</span></div>
                  ) : draft ? (
                    <button className="button primary" disabled={busy} onClick={revealRegistration}>Register {draft.name}</button>
                  ) : parentReady ? (
                    <a className="button primary" href="#beneficiary-plan">Create beneficiary identities <ExternalLink size={14} /></a>
                  ) : null}
                </div>
              </div>

              {(inspection.resolverProxy === "unexpected" || inspection.registryProxy === "unexpected") && (
                <Notice danger>
                  A deterministic ENS address contains code that does not match the current official implementation. Do not continue until the deployment is reviewed.
                </Notice>
              )}
              {draft && (
                <Notice>
                  The registration secret is stored only in this browser until reveal. Do not clear site data or switch devices. This is not a wallet key and cannot move assets.
                </Notice>
              )}
              {parentReady && (
                <Notice success>
                  Your ENSv2 family space is verified. Beneficiary subnames created below can use <strong>{inspection.name}</strong> as their parent.
                </Notice>
              )}
            </div>
          )}
        </>
      )}

      <div className="ens-family-footer">
        <span><ShieldCheck size={13} /> Official ENSv2 Sepolia contracts</span>
        <span><Network size={13} /> Reads: {privacy.mode === "anonymous" ? "Anon-RPC" : privacy.mode === "public" ? "explicit public RPC" : "connecting"}</span>
        <span><KeyRound size={13} /> Every write requires your wallet</span>
      </div>
      {error && <Notice danger popup title="ENS setup needs attention">{error}</Notice>}
    </Panel>
  );
}

function InfrastructureCard({
  icon,
  title,
  description,
  state,
  address,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  state: ProxyState | "connected";
  address?: Address;
}) {
  const ready = state === "verified" || state === "connected";
  return (
    <div className={`ens-infrastructure-card ${ready ? "ready" : state === "unexpected" ? "danger" : ""}`}>
      <span className="ens-infrastructure-icon">{icon}</span>
      <div>
        <div className="between"><strong>{title}</strong>{ready && <Check size={14} />}</div>
        <p>{description}</p>
        {address && <External hash={address} kind="address" />}
      </div>
    </div>
  );
}

type ActionContext = {
  inspection: Inspection;
  newName?: boolean;
  isOwner: boolean;
  parentReady: boolean;
  infrastructurePrepared: boolean;
  needsApproval: boolean;
  draft?: EnsRegistrationDraft;
  secondsToReveal: number;
  commitmentExpired: boolean;
};

function nextActionTitle(context: ActionContext) {
  const { inspection } = context;
  if (context.parentReady) return "Your family identity space is ready";
  if (inspection.resolverProxy === "missing" && inspection.attachedResolver === zeroAddress) return "Create your private identity resolver";
  if (inspection.registryProxy === "missing" && inspection.attachedRegistry === zeroAddress) return "Enable owned beneficiary names";
  if (!context.newName && inspection.attachedResolver === zeroAddress) return "Connect the resolver to your name";
  if (!context.newName && inspection.attachedRegistry === zeroAddress) return "Connect the beneficiary registry";
  if (!context.newName && !context.isOwner) return "Connect the owner wallet";
  if (!context.newName && inspection.parentAddress?.toLowerCase() !== inspection.owner.toLowerCase()) return "Connect your name to its owner wallet";
  if (context.newName && inspection.balance < inspection.price) return `Get test ${inspection.symbol}`;
  if (context.newName && context.needsApproval) return "Approve the exact registration cost";
  if (context.newName && !context.draft) return "Protect your registration from front-running";
  if (context.commitmentExpired) return "The registration window expired";
  if (context.secondsToReveal) return "Your name is protected";
  if (context.draft) return "Complete the registration";
  if (context.infrastructurePrepared) return "Infrastructure prepared";
  return "Review this ENS setup";
}

function nextActionDescription(context: ActionContext) {
  const { inspection } = context;
  if (context.parentReady) return "You can now create clear, owned identities for beneficiaries and guardians.";
  if (inspection.resolverProxy === "missing" && inspection.attachedResolver === zeroAddress) return "A resolver stores wallet and profile records. The official factory creates a verifiable instance controlled by your wallet.";
  if (inspection.registryProxy === "missing" && inspection.attachedRegistry === zeroAddress) return "A UserRegistry gives each beneficiary subname a real owner and expiry.";
  if (!context.newName && inspection.attachedResolver === zeroAddress) return "This wallet owns the name, so it can attach the prepared resolver with one confirmation.";
  if (!context.newName && inspection.attachedRegistry === zeroAddress) return "Attach the prepared registry so ENS can discover beneficiary subnames.";
  if (!context.newName && !context.isOwner) return "Only the registered owner can finish this setup.";
  if (!context.newName && inspection.parentAddress?.toLowerCase() !== inspection.owner.toLowerCase()) return "Set the Ethereum record so the parent name resolves to the verified owner.";
  if (context.newName && inspection.balance < inspection.price) return "The official Sepolia payment token is mintable test currency; it has no real value.";
  if (context.newName && context.needsApproval) return "ENS receives permission for this amount only. SilentSovereign never receives the payment.";
  if (context.newName && !context.draft) return "ENS commit-reveal first hides your choice, then allows registration after the protection window.";
  if (context.commitmentExpired) return "Your secret is safe, but ENS will no longer accept this commitment. Create a fresh one.";
  if (context.secondsToReveal) return "ENS requires a short waiting period. Keep this tab open or return later and resume.";
  if (context.draft) return "The protection window is complete. Confirm payment and ownership in your wallet.";
  return "Every component is verified against the selected Sepolia read transport.";
}
