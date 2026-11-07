"use client";
import { useState, useSyncExternalStore } from "react";
import { Fingerprint, Radio, ArrowUpRight } from "lucide-react";
import { useConnection } from "wagmi";
import { ensV2Root } from "@/lib/ens";
import {
  chain,
  environmentIssues,
  factoryAddress,
  rpcUrl,
  requestedChainId,
  deploymentBlock,
} from "@/lib/network";
import { anonymousNetworks, type AnonymousNetwork } from "@/lib/privacy";
import { transactionError } from "@/lib/transaction";
import { useReadTransport } from "./providers";
import {
  Badge,
  External,
  Field,
  Notice,
  PageHeader,
  Panel,
  MessageDialog,
  WalletButton,
} from "./ui";

export function PrivacyPage() {
  const { privacy, client, network, retry, choosePublic, chooseAnonymous } =
    useReadTransport();
  const [probe, setProbe] = useState("");
  const [ensStatus, setEnsStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [publicRpcPrompt, setPublicRpcPrompt] = useState(false);
  const runProbe = async (ens = false) => {
    if (!client) return;
    setBusy(true);
    setError("");
    try {
      if (ens) {
        const root = await ensV2Root(client);
        setEnsStatus(`ENSv2 marker and root verified: ${root}`);
      } else {
        const block = await client.getBlockNumber();
        setProbe(
          `Real ${privacy.mode === "anonymous" ? "Anon-RPC" : "public RPC"} response: block ${block}. ${new Date().toLocaleTimeString()}`,
        );
      }
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeader
        title="Privacy you can understand."
        description="See what is connected, what has been verified, and where the boundaries are."
      />
      <div className="integration-grid">
        <Panel className="integration-card">
          <div className="between">
            <span className="icon-tile violet">
              <Fingerprint size={23} />
            </span>
            <Badge
              tone={
                privacy.mode === "anonymous"
                  ? "green"
                  : privacy.mode === "failed"
                    ? "red"
                    : "amber"
              }
            >
              {privacy.mode === "anonymous"
                ? "Worker verified · request passed"
                : privacy.mode === "public"
                  ? "Public fallback selected"
                  : privacy.mode === "failed"
                    ? "Unavailable · reads blocked"
                    : "Connecting"}
            </Badge>
          </div>
          <h2>Ethereum Anon-RPC</h2>
          <p>{privacy.detail}</p>
          <dl>
            <div>
              <dt>Official harness</dt>
              <dd>@anon-rpc/browser-harness 0.3.3</dd>
            </div>
            <div>
              <dt>Network worker</dt>
              <dd>
                {anonymousNetworks[network].name} ·{" "}
                {anonymousNetworks[network].chainId === 1
                  ? "mainnet specifier; Sepolia reads"
                  : "Sepolia specifier"}
              </dd>
            </div>
            <div>
              <dt>Specifier</dt>
              <dd>
                <code className="address-wrap">
                  {anonymousNetworks[network].address}
                </code>
              </dd>
            </div>
            <div>
              <dt>Latest successful transport response</dt>
              <dd>
                {privacy.lastVerifiedAt
                  ? new Date(privacy.lastVerifiedAt).toLocaleTimeString()
                  : "No anonymous response verified"}
              </dd>
            </div>
          </dl>
          <Field label="Anonymous transport">
            <select
              value={network}
              onChange={(e) =>
                chooseAnonymous(e.target.value as AnonymousNetwork)
              }
            >
              <option value="nox">Nox · Sphinx mixnet</option>
              <option value="nym">Nym · mixnet</option>
            </select>
          </Field>
          <div className="transport-actions">
            <button className="button" onClick={retry}>
              Retry anonymous connection
            </button>
            {privacy.mode !== "public" && (
              <button
                className="button subtle"
                onClick={() => setPublicRpcPrompt(true)}
              >
                Use public RPC explicitly
              </button>
            )}
          </div>
          <p className="small muted">
            {privacy.successfulRequests || 0} responses this connection · last
            method {privacy.lastMethod || "none"}
            {privacy.latencyMs !== undefined
              ? ` · ${privacy.latencyMs} ms`
              : ""}
            . Request counts verify routing, not network anonymity.
          </p>
          <button
            className="button full"
            disabled={!client || busy}
            onClick={() => runProbe()}
          >
            Run an actual RPC request <Radio size={14} />
          </button>
          {probe && (
            <p className="probe-result" role="status">
              {probe}
            </p>
          )}
          <a
            className="inline-link"
            href="https://ethereum.github.io/anon-rpc/wallets/"
            target="_blank"
            rel="noreferrer"
          >
            Official integration guide <ArrowUpRight size={13} />
          </a>
        </Panel>
        <Panel className="integration-card">
          <div className="between">
            <span className="icon-tile blue">
              <span className="ens-glyph">⌁</span>
            </span>
            <Badge tone={ensStatus ? "green" : "amber"}>
              {ensStatus ? "Deployment probed" : "Live check required"}
            </Badge>
          </div>
          <h2>ENS & ENSv2</h2>
          <p>
            Forward resolution, verified primary names and registry discovery
            through viem’s canonical Universal Resolver. Authorized subname
            registration is available under Beneficiaries.
          </p>
          <dl>
            <div>
              <dt>Supported network</dt>
              <dd>Ethereum Sepolia</dd>
            </div>
            <div>
              <dt>Identity policy</dt>
              <dd>Resolved address pinned in vault</dd>
            </div>
            <div>
              <dt>Record changes</dt>
              <dd>Explicit owner update required</dd>
            </div>
            <div>
              <dt>Offchain gateways</dt>
              <dd>Disabled to preserve transport boundaries</dd>
            </div>
          </dl>
          <button
            className="button full"
            disabled={!client || busy || chain.id !== 11155111}
            onClick={() => runProbe(true)}
          >
            Check actual ENSv2 deployment
          </button>
          {ensStatus && (
            <p className="probe-result address-wrap">{ensStatus}</p>
          )}
          <a
            className="inline-link"
            href="https://docs.ens.domains/ensv2/tutorial-app-developers/"
            target="_blank"
            rel="noreferrer"
          >
            Official ENSv2 guide <ArrowUpRight size={13} />
          </a>
        </Panel>
        <Panel className="integration-card">
          <div className="between">
            <span className="icon-tile">
              <span className="chainlink-glyph">⬡</span>
            </span>
            <Badge tone="amber">External execution not verified</Badge>
          </div>
          <h2>Chainlink CRE</h2>
          <p>
            A dedicated TypeScript workflow uses the official SDK for scheduled
            state reads, log triggers and authenticated email-endpoint requests.
            Observe mode sends no onchain reports. Transition mode uses the
            guarded receiver.
          </p>
          <dl>
            <div>
              <dt>Workflow source</dt>
              <dd>cre/workflows/recovery</dd>
            </div>
            <div>
              <dt>Release authority</dt>
              <dd>None · vault enforces conditions</dd>
            </div>
            <div>
              <dt>Replay protection</dt>
              <dd>Chain + receiver + request nonce</dd>
            </div>
            <div>
              <dt>Execution modes</dt>
              <dd>CLI simulation or deployed workflow</dd>
            </div>
          </dl>
          <Notice>
            CLI simulation checks deadlines once per run. It can send real email
            requests when configured, even without --broadcast. Continuous
            monitoring requires a deployed active workflow. Deployment is not
            verified here. See cre/README.md.
          </Notice>
          <a
            className="inline-link"
            href="https://docs.chain.link/cre/overview"
            target="_blank"
            rel="noreferrer"
          >
            Official CRE documentation <ArrowUpRight size={13} />
          </a>
        </Panel>
      </div>
      {error && (
        <Notice danger popup>
          {error}
        </Notice>
      )}
      <MessageDialog
        open={publicRpcPrompt}
        onClose={() => setPublicRpcPrompt(false)}
        title="Continue with public RPC?"
        primaryLabel="Use public RPC"
        secondaryLabel="Keep Anon-RPC"
        onPrimary={choosePublic}
      >
        <p>
          The RPC provider may associate your IP address with your vault reads.
          SilentSovereign will clearly label the session as public mode, and
          you can retry Anon-RPC at any time.
        </p>
      </MessageDialog>
    </>
  );
}

export function SettingsPage() {
  const { address, chainId } = useConnection();
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const renderedAddress = hydrated ? address : undefined;
  const renderedChainId = hydrated ? chainId : undefined;
  return (
    <>
      <PageHeader
        title="Make it yours."
        description="Network, wallet and deployment configuration. No private keys belong in this app."
      />
      <div className="two-column">
        <Panel
          className="settings-wallet-panel"
          title="Network & wallet"
          description="This MVP supports Sepolia and isolated local tests."
        >
          <dl>
            <div>
              <dt>Application network</dt>
              <dd>
                {chain.name} · {requestedChainId}
              </dd>
            </div>
            <div>
              <dt>Wallet network</dt>
              <dd>{renderedChainId || "Not connected"}</dd>
            </div>
            <div>
              <dt>Wallet address</dt>
              <dd className="address-wrap">
                {renderedAddress || "Not connected"}
              </dd>
            </div>
            <div>
              <dt>Network selection</dt>
              <dd>Set NEXT_PUBLIC_CHAIN_ID, then restart</dd>
            </div>
          </dl>
          <WalletButton />
        </Panel>
        <Panel
          title="Contract configuration"
          description="Environment variables are read at build time."
        >
          <dl>
            <div>
              <dt>Factory</dt>
              <dd>
                {factoryAddress ? (
                  <External hash={factoryAddress} kind="address" />
                ) : (
                  "Contract not configured"
                )}
              </dd>
            </div>
            <div>
              <dt>RPC hostname</dt>
              <dd>
                {(() => {
                  try {
                    return new URL(rpcUrl).hostname;
                  } catch {
                    return "Invalid URL";
                  }
                })()}
              </dd>
            </div>
            <div>
              <dt>Deployment block</dt>
              <dd>{deploymentBlock.toString()}</dd>
            </div>
          </dl>
          {environmentIssues.length > 0 && (
            <Notice>{environmentIssues.join(" ")}</Notice>
          )}
        </Panel>
      </div>
    </>
  );
}
