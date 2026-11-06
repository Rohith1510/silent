"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Fingerprint,
  GitBranch,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Settings2,
  ShieldCheck,
  Users,
  Vault,
  X,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Brand, Badge, External, WalletButton, MessageDialog } from "./ui";
import { ProtocolProvider, useProtocol } from "./protocol-provider";
import { useReadTransport } from "./providers";
import { chain } from "@/lib/network";

const navigation = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/vault", "My vault", Vault],
  ["/builder", "Inheritance builder", GitBranch],
  ["/beneficiaries", "Beneficiaries", Users],
  ["/recovery", "Liveness & recovery", Activity],
  ["/activity", "Activity", BookOpen],
  ["/notifications", "Email alerts", Bell],
] as const;
function ShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const { privacy } = useReadTransport();
  const { transaction, dismissTransaction } = useProtocol();
  const lastAction = useRef<HTMLElement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState<
    typeof transaction | null
  >(null);
  return (
    <div
      className="app-shell"
      onFocusCapture={(event) => {
        if (
          event.target instanceof HTMLElement &&
          !event.target.closest(".alert-dialog")
        )
          lastAction.current = event.target;
      }}
    >
      <aside className={`sidebar ${menu ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-button mobile-only"
            onClick={() => setMenu(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-selector">
          <span className="workspace-avatar">
            <LockKeyhole size={16} />
          </span>
          <span>
            Personal workspace<small>Testnet environment</small>
          </span>
          <ChevronDown size={13} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navigation.map(([href, label, Icon]) => (
            <Link
              onClick={() => setMenu(false)}
              className={`nav-item ${pathname === href ? "active" : ""}`}
              href={href}
              key={href}
            >
              <Icon size={17} strokeWidth={1.7} />
              {label}
              {href === "/builder" && <span className="nav-new">VISUAL</span>}
            </Link>
          ))}
        </nav>
        <div className="nav-label second">PROTOCOL</div>
        <nav>
          <Link
            className={`nav-item ${pathname === "/privacy" ? "active" : ""}`}
            href="/privacy"
          >
            <Fingerprint size={17} />
            Privacy & integrations
          </Link>
          <Link
            className={`nav-item ${pathname === "/settings" ? "active" : ""}`}
            href="/settings"
          >
            <Settings2 size={17} />
            Settings
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="quiet-card">
            <ShieldCheck size={20} />
            <strong>A future, protected.</strong>
            <p>Give the people you trust a path forward.</p>
            <Link href="/create">
              Create an inheritance plan <ArrowUpRight size={13} />
            </Link>
          </div>
          <Link className="nav-item" href="/settings">
            <CircleHelp size={17} />
            Setup & documentation
          </Link>
          <div className="sidebar-footer">
            <span className="status-dot" /> ETHGlobal Mumbai 2026
            <span>v0.1</span>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-only"
              onClick={() => setMenu(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <span>/</span>
            <strong>
              {[
                ...navigation.map((n) => [n[0], n[1]]),
                ["/privacy", "Privacy & integrations"],
                ["/settings", "Settings"],
                ["/create", "Create a vault"],
              ].find((n) => n[0] === pathname)?.[1] || "Workspace"}
            </strong>
          </div>
          <div className="topbar-actions">
            <Link href="/privacy" className="transport-indicator">
              <span
                className={`status-dot ${privacy.mode === "anonymous" ? "green-dot" : "amber-dot"}`}
              />
              {privacy.mode === "anonymous"
                ? "Anon-RPC"
                : privacy.mode === "public"
                  ? "Public RPC"
                  : privacy.mode === "failed"
                    ? "RPC unavailable"
                    : "Connecting RPC"}
            </Link>
            <Badge tone="violet">{chain.name}</Badge>
            <WalletButton />
          </div>
        </header>
        <main
          className={`workspace-content ${pathname === "/builder" ? "builder-content" : ""}`}
        >
          {children}
        </main>
        <footer className="app-footer">
          <span>
            <LockKeyhole size={12} /> Noncustodial by design
          </span>
          <span>Unaudited · Testnet only</span>
        </footer>
      </div>
      {transaction.phase !== "idle" && (
        <div
          className={`transaction-toast ${transaction.phase}`}
          role="status"
          aria-live="polite"
        >
          <div className="between">
            <strong>{transaction.label}</strong>
            <Badge
              tone={
                transaction.phase === "confirmed"
                  ? "green"
                  : transaction.phase === "failed"
                    ? "red"
                    : "violet"
              }
            >
              {transaction.phase === "signing"
                ? "Awaiting signature"
                : transaction.phase === "confirming"
                  ? "Pending confirmation"
                  : transaction.phase === "confirmed"
                    ? "Confirmed"
                    : "Not completed"}
            </Badge>
            {(transaction.phase === "confirmed" ||
              transaction.phase === "failed") && (
              <button
                className="icon-button"
                aria-label="Dismiss transaction notification"
                onClick={dismissTransaction}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p>
            {transaction.phase === "signing"
              ? "Review the transaction details in your wallet and approve when you are ready."
              : transaction.phase === "confirming"
                ? "Your transaction has been submitted. Waiting for an onchain confirmation."
                : transaction.phase === "confirmed"
                  ? `Confirmed in block ${transaction.block?.toString()}.`
                  : transaction.error}
          </p>
          {transaction.hash && (
            <External hash={transaction.hash}>View transaction</External>
          )}
          {(transaction.phase === "failed" ||
            transaction.phase === "confirmed") && (
            <button
              className="transaction-details-button"
              onClick={() => setDetailsOpen(true)}
            >
              View{" "}
              {transaction.phase === "confirmed" ? "confirmation" : "details"}{" "}
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      )}
      <MessageDialog
        open={
          detailsOpen ||
          (transaction.phase === "failed" && dismissedAlert !== transaction)
        }
        onClose={() => {
          setDetailsOpen(false);
          setDismissedAlert(transaction);
        }}
        onAfterClose={() => {
          if (
            lastAction.current?.isConnected &&
            !lastAction.current.hasAttribute("disabled")
          )
            lastAction.current.focus();
        }}
        title={
          transaction.phase === "confirmed"
            ? "Transaction confirmed"
            : "Transaction could not be completed"
        }
        tone={transaction.phase === "confirmed" ? "success" : "error"}
      >
        <p>
          {transaction.phase === "confirmed"
            ? `Your transaction was included in block ${transaction.block?.toString()}. Review the updated vault state before taking another action.`
            : transaction.error ||
              "The request could not be completed. Review your wallet and network connection before trying again."}
        </p>
        {transaction.label && (
          <div className="alert-context">
            <span>Requested action</span>
            <strong>{transaction.label}</strong>
          </div>
        )}
        {transaction.hash && (
          <External hash={transaction.hash}>
            Review transaction on explorer
          </External>
        )}
      </MessageDialog>
    </div>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  return (
    <ProtocolProvider>
      <ShellContent>{children}</ShellContent>
    </ProtocolProvider>
  );
}
