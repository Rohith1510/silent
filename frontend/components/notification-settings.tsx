"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useConnection, useWalletClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Bell, Mail, ShieldCheck } from "lucide-react";
import { useProtocol } from "./protocol-provider";
import { Badge, Field, Notice, PageHeader, Panel, WalletButton } from "./ui";
import { transactionError } from "@/lib/transaction";
async function api(
  path: string,
  body?: object,
  method = body ? "POST" : "GET",
) {
  const reply = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await reply.json();
  if (!reply.ok) throw new Error(data.error || "Request failed.");
  return data;
}
type Preferences = {
  wallet: string;
  role: string;
  subscribed: boolean;
  verified: boolean;
  deliveries: {
    kind: string;
    status: string;
    created_at: string;
    provider_id?: string;
  }[];
};
export function NotificationSettings() {
  const { address } = useConnection();
  const { data: wallet } = useWalletClient();
  const { query } = useProtocol();
  const vault = query.data?.vault;
  const [signedWallet, setSignedWallet] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const setup = useQuery({
    queryKey: ["notification-status"],
    queryFn: () => api("/api/status"),
    retry: false,
  });
  const prefs = useQuery<Preferences>({
    queryKey: ["notification-preferences", vault, signedWallet, address],
    enabled:
      !!vault &&
      !!address &&
      signedWallet.toLowerCase() === address.toLowerCase(),
    queryFn: () => api(`/api/notifications/preferences?vault=${vault}`),
    retry: false,
  });
  useEffect(() => {
    let active = true;
    api("/api/auth/session")
      .then((s) => {
        if (active) setSignedWallet(s.wallet);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (e) {
      setError(transactionError(e));
    } finally {
      setBusy(false);
    }
  }
  const signedIn =
    !!address && signedWallet.toLowerCase() === address.toLowerCase();
  return (
    <>
      <PageHeader
        title="A warning. Time to respond."
        description="Optional email alerts for your vault. Signing in manages private preferences; it never approves a transaction."
      />
      <div className="two-column notification-columns">
        <Panel
          className="notification-panel"
          title="Email alerts"
          description="Register your own email as a vault owner, guardian or beneficiary."
        >
          <div className="notification-symbol">
            <Mail size={25} />
            <Badge tone={prefs.data?.verified ? "green" : "amber"}>
              {prefs.data?.verified ? "Email verified" : "Optional"}
            </Badge>
          </div>
          {!address && <WalletButton />}
          {address && !signedIn && (
            <button
              className="button primary"
              disabled={busy || !wallet}
              onClick={() =>
                run(async () => {
                  const challenge = await api("/api/auth/challenge", {
                    address,
                  });
                  const signature = await wallet!.signMessage({
                    message: challenge.message,
                  });
                  const s = await api("/api/auth/session", {
                    challenge: challenge.challenge,
                    signature,
                  });
                  setSignedWallet(s.wallet);
                })
              }
            >
              <ShieldCheck size={15} /> Sign in with wallet
            </button>
          )}
          {!vault && (
            <Notice>
              Open a vault on Overview first. You can inspect public vault data
              without signing in.
            </Notice>
          )}
          {signedIn && (
            <>
              <p className="small muted">
                Signed in as {signedWallet}.{" "}
                {prefs.data?.role && `Vault role: ${prefs.data.role}.`}
              </p>
              {prefs.data?.subscribed ? (
                <>
                  <Notice>
                    {prefs.data.verified
                      ? "Alerts are enabled for your verified address. Delivery depends on workflow execution and the email provider."
                      : "Check your inbox for the verification link. No recovery alerts are sent until verified."}
                  </Notice>
                  <button
                    className="button"
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        await api(
                          "/api/notifications/preferences",
                          { vault },
                          "DELETE",
                        );
                        await prefs.refetch();
                        setMessage(
                          "Subscription and delivery history deleted.",
                        );
                      })
                    }
                  >
                    Delete alerts & contact data
                  </button>
                </>
              ) : (
                <div className="notification-form">
                  <Field label="Your email address">
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Field>
                  <label className="consent-line">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />{" "}
                    I consent to vault email alerts and the association of this
                    address with my wallet. I can delete this preference.
                  </label>
                  <button
                    className="button primary"
                    disabled={
                      busy ||
                      !consent ||
                      !email ||
                      !vault ||
                      !!setup.data?.notificationSetup?.length
                    }
                    onClick={() =>
                      run(async () => {
                        await api("/api/notifications/preferences", {
                          vault,
                          email,
                          consent,
                        });
                        setEmail("");
                        await prefs.refetch();
                        setMessage(
                          "Verification email accepted by the provider. Check your inbox; delivery is not guaranteed.",
                        );
                      })
                    }
                  >
                    Send verification email
                  </button>
                </div>
              )}
              <button
                className="button small-button"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await api("/api/auth/session", {}, "DELETE");
                    setSignedWallet("");
                  })
                }
              >
                Sign out of private settings
              </button>
            </>
          )}
          {(error || prefs.error) && (
            <Notice
              danger
              popup={Boolean(error)}
              title="Email preferences could not be updated"
            >
              {error || transactionError(prefs.error)}
            </Notice>
          )}
          {message && (
            <Notice success popup title="Email settings updated">
              {message}
            </Notice>
          )}
        </Panel>
        <Panel
          className="notification-panel"
          title="What will you receive?"
          description="Messages are reminders. Your wallet and vault enforce every permission."
        >
          <div className="notification-types">
            {[
              [
                "Owner",
                "Check-in reminder within 24 hours; pending recovery warning.",
              ],
              ["Guardian", "A request needs review while quorum is missing."],
              [
                "Beneficiary",
                "Recovery is authorized; review your available allocation.",
              ],
            ].map(([role, copy]) => (
              <div key={role}>
                <Bell size={16} />
                <div>
                  <strong>{role}</strong>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <Notice>
            {setup.data?.automation ||
              "Automation deployment has not been verified."}
          </Notice>
          {!!setup.data?.notificationSetup?.length && (
            <Notice>
              Notifications are not configured. Email alerts will become
              available when the operator completes setup.{" "}
              <Link href="/settings">View setup details</Link>.
            </Notice>
          )}
          <p className="muted small">
            Email contacts are encrypted in storage. The app server and email
            provider still process the destination. Notification enrollment is
            outside anonymous RPC transport.
          </p>
        </Panel>
      </div>
      <Panel
        className="notification-panel"
        title="Delivery history"
        description="Accepted means the provider accepted the email. Delivered requires a verified provider webhook."
      >
        {prefs.data?.deliveries?.length ? (
          <div className="delivery-list">
            {prefs.data.deliveries.map((d, i) => (
              <div key={`${d.created_at}-${i}`}>
                <span>{d.kind.replaceAll("_", " ")}</span>
                <Badge tone={d.status === "delivered" ? "green" : "amber"}>
                  {d.status}
                </Badge>
                <small>{new Date(d.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">
            No delivery records available for your signed-in subscription.
          </p>
        )}
      </Panel>
    </>
  );
}
export function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageHeader
        title="Confirm your email."
        description="This verifies notification consent only. It does not change your vault or authorize asset transfers."
      />
      <Panel title="Finish verification" className="notification-panel">
        <p>Confirm only if you requested alerts for this address.</p>
        <button
          className="button primary"
          disabled={busy || !!message}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              const token = window.location.hash.slice(1);
              await api("/api/notifications/verify", { token });
              window.history.replaceState(null, "", window.location.pathname);
              setMessage(
                "Email verified. Return to notifications to review your subscription.",
              );
            } catch (e) {
              setError(transactionError(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          Confirm email alerts
        </button>
        {message && (
          <Notice success popup title="Email settings updated">
            {message}
          </Notice>
        )}
        {error && (
          <Notice danger popup>
            {error}
          </Notice>
        )}
      </Panel>
    </>
  );
}
