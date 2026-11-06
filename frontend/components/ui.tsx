"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useId,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  useConnect,
  useConnectors,
  useConnection,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { chain, explorer } from "@/lib/network";
import { shortAddress } from "@/lib/configuration";
import { transactionError } from "@/lib/transaction";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="silent home">
      <span className={`brand-logo ${compact ? "brand-logo-compact" : ""}`}>
        <Image
          src="/silent-logo.png"
          alt="silent."
          width={2000}
          height={2000}
          sizes={compact ? "200px" : "400px"}
          preload
        />
      </span>
    </Link>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "violet" | "amber" | "red";
}) {
  return (
    <span className={`badge ${tone}`}>
      <span className="status-dot" />
      {children}
    </span>
  );
}
export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <div className="panel-heading">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow || "YOUR LEGACY, BY DESIGN"}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Empty({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {icon || <ShieldCheck size={27} strokeWidth={1.4} />}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Notice({
  children,
  danger = false,
  popup = false,
  title,
  success = false,
}: {
  children: ReactNode;
  danger?: boolean;
  popup?: boolean;
  title?: string;
  success?: boolean;
}) {
  const [details, setDetails] = useState(false);
  const [dismissed, setDismissed] = useState<ReactNode>(null);
  const heading =
    title ||
    (danger
      ? "Unable to complete the request"
      : success
        ? "Request completed"
        : "Important information");
  return (
    <>
      <div
        className={`notice ${danger ? "danger" : success ? "success" : ""}`}
        role={danger ? "alert" : success ? "status" : undefined}
      >
        {success ? <CircleCheck size={17} /> : <CircleAlert size={17} />}
        <div className="notice-content">{children}</div>
        {(danger || popup) && (
          <button
            className="notice-details"
            onClick={() => setDetails(true)}
            aria-label={`View details: ${heading}`}
          >
            Details <ArrowUpRight size={12} />
          </button>
        )}
      </div>
      {(danger || popup) && (
        <MessageDialog
          open={details || (popup && dismissed !== children)}
          onClose={() => {
            setDetails(false);
            setDismissed(children);
          }}
          title={heading}
          tone={danger ? "error" : success ? "success" : "warning"}
        >
          {children}
        </MessageDialog>
      )}
    </>
  );
}

export function MessageDialog({
  open,
  onClose,
  title,
  children,
  tone = "warning",
  onAfterClose,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  tone?: "error" | "success" | "warning";
  onAfterClose?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) {
      dialog.close();
      onAfterClose?.();
    }
  }, [open, onAfterClose]);
  return (
    <dialog
      ref={ref}
      className={`alert-dialog ${tone}`}
      role={tone === "error" ? "alertdialog" : "dialog"}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-message`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          onClose();
      }}
    >
      <div className="alert-dialog-top">
        <span className="alert-dialog-icon">
          {tone === "success" ? (
            <CircleCheck size={24} />
          ) : (
            <CircleAlert size={24} />
          )}
        </span>
        <button
          className="icon-button"
          aria-label="Close alert"
          onClick={onClose}
        >
          <X size={19} />
        </button>
      </div>
      <span className="eyebrow">
        {tone === "error"
          ? "ACTION REQUIRED"
          : tone === "success"
            ? "CONFIRMATION"
            : "PLEASE REVIEW"}
      </span>
      <h2 id={`${id}-title`}>{title}</h2>
      <div id={`${id}-message`} className="alert-dialog-message">
        {children}
      </div>
      <div className="alert-dialog-footer">
        <button className="button primary" onClick={onClose}>
          {tone === "success" ? "Done" : "Understood"}
        </button>
      </div>
    </dialog>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  const id = useId();
  const control = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{
          "aria-labelledby"?: string;
          "aria-describedby"?: string;
        }>,
        {
          "aria-labelledby": `${id}-label`,
          "aria-describedby": hint ? `${id}-hint` : undefined,
        },
      )
    : children;
  return (
    <label className="field">
      <span id={`${id}-label`}>{label}</span>
      {control}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </label>
  );
}
export function External({
  hash,
  kind = "tx",
  children,
}: {
  hash: string;
  kind?: "tx" | "address";
  children?: ReactNode;
}) {
  const url = explorer(hash, kind);
  return url ? (
    <a className="inline-link" href={url} target="_blank" rel="noreferrer">
      {children || shortAddress(hash)}
      <ArrowUpRight size={13} />
    </a>
  ) : (
    <span className="mono">{children || shortAddress(hash)}</span>
  );
}
export function WalletButton() {
  const { address, chainId, isConnected } = useConnection();
  const connectors = useConnectors();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="wallet-control">
      <button
        className={isConnected ? "button wallet-button" : "button primary"}
        onClick={() => setOpen(!open)}
      >
        <Wallet size={15} />
        {isConnected ? shortAddress(address) : "Connect wallet"}
      </button>
      {open && (
        <div className="wallet-popover">
          <div className="between">
            <strong>{isConnected ? "Your wallet" : "Connect securely"}</strong>
            <button
              className="icon-button"
              aria-label="Close wallet menu"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          <p>Your wallet keeps control of every signature.</p>
          {isConnected ? (
            <>
              <div className="address-wrap mono">{address}</div>
              {chainId !== chain.id && (
                <button
                  className="button primary full"
                  onClick={async () => {
                    try {
                      await switchChain.mutateAsync({ chainId: chain.id });
                      setError("");
                    } catch (e) {
                      setError(transactionError(e));
                    }
                  }}
                >
                  Switch to {chain.name}
                </button>
              )}
              <button
                className="button full"
                onClick={() => {
                  disconnect.mutate();
                  setOpen(false);
                }}
              >
                Disconnect wallet
              </button>
            </>
          ) : (
            connectors.map((connector) => (
              <button
                className="button full"
                key={connector.uid}
                disabled={connect.isPending}
                onClick={async () => {
                  try {
                    await connect.mutateAsync({ connector });
                    setOpen(false);
                    setError("");
                  } catch (e) {
                    setError(transactionError(e));
                  }
                }}
              >
                {connect.isPending ? (
                  <LoaderCircle className="spin" size={15} />
                ) : (
                  <Wallet size={15} />
                )}
                {connector.name === "Injected"
                  ? "Browser wallet"
                  : connector.name}
              </button>
            ))
          )}
          {error && (
            <Notice danger popup title="Wallet request unsuccessful">
              {error}
            </Notice>
          )}
          <small>
            Use an EIP-1193 browser wallet. {chain.name} testnet only.
          </small>
        </div>
      )}
    </div>
  );
}
export function StepIcon({
  done,
  children,
}: {
  done: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`step-icon ${done ? "done" : ""}`}>
      {done ? <Check size={15} /> : children}
    </span>
  );
}
