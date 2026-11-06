"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Fingerprint,
  GitBranch,
  HeartPulse,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Users,
  Vault,
} from "lucide-react";
import { useState } from "react";
import { Brand, Badge, WalletButton } from "@/components/ui";

const anatomy = [
  {
    icon: Vault,
    title: "Your vault",
    subtitle: "Isolated. Owner controlled.",
    detail:
      "Deposit only the assets you want this plan to protect. While your vault is active, you can withdraw or update your plan.",
  },
  {
    icon: HeartPulse,
    title: "A sign of life",
    subtitle: "A check-in, on your terms.",
    detail:
      "Choose your liveness interval. A missed deadline only makes a recovery request possible. It never proves death or releases assets.",
  },
  {
    icon: Users,
    title: "People you trust",
    subtitle: "Guardian quorum + challenge.",
    detail:
      "Recovery needs guardian approval and an owner challenge period. Return to your wallet and cancel a pending request before authorization.",
  },
  {
    icon: GitBranch,
    title: "A thoughtful release",
    subtitle: "Your people. Your schedule.",
    detail:
      "Beneficiaries claim their own allocations over time. Emergency acceleration requires an additional delay and a fresh guardian quorum.",
  },
];
export default function Home() {
  const [active, setActive] = useState(0);
  const CurrentIcon = anatomy[active].icon;
  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <nav>
          <a href="#how-it-works">How it works</a>
          <a href="#privacy">Privacy by design</a>
          <Link href="/privacy">Integrations</Link>
        </nav>
        <div className="landing-actions">
          <Link href="/dashboard" className="text-link">
            Open app <ArrowUpRight size={14} />
          </Link>
          <WalletButton />
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-beta-badge">BETA VERSION</span>
            </div>
            <h1>
              Your legacy.
              <br />
              <span>In your hands.</span>
            </h1>
            <p className="hero-description">
              Protect your digital assets. Provide for your people.
              <br />
              An inheritance plan that follows your rules,
              <br className="desktop-only" /> without giving up control today.
            </p>
            <div className="hero-buttons">
              <Link href="/create" className="button primary large">
                Create your vault <ArrowRight size={17} />
              </Link>
              <Link className="button subtle large" href="/dashboard">
                Review a vault <ArrowRight size={15} />
              </Link>
            </div>
            <div className="hero-reassurance">
              <span>
                <Check size={13} /> Self-custody first
              </span>
              <span>
                <Check size={13} /> No privileged custodian
              </span>
              <span>
                <Check size={13} /> Your rules, onchain
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="visual-cross cross-one">+</div>
            <div className="visual-cross cross-two">+</div>
            <div className="sovereign-emblem">
              <div className="emblem-inner">
                <ShieldCheck size={70} strokeWidth={1} />
              </div>
              <div className="emblem-caption">SILENT SOVEREIGN</div>
              <span className="emblem-pip" />
            </div>
            <div className="floating-node node-top">
              <span className="icon-tile violet">
                <KeyRound size={18} />
              </span>
              <div>
                You hold the keys<small>Owner-authorized configuration</small>
              </div>
              <LockKeyhole size={13} />
            </div>
            <div className="floating-node node-left">
              <span className="status-dot green-dot" />
              <span>Contract-enforced recovery</span>
            </div>
            <div className="floating-node node-bottom">
              <span className="icon-tile blue">
                <Users size={18} />
              </span>
              <div>
                A path for your people
                <small>Guardian-protected inheritance</small>
              </div>
              <ArrowUpRight size={16} />
            </div>
            <div className="visual-coordinate">NONCUSTODIAL / ETHEREUM</div>
          </div>
        </section>
        <div className="protocol-strip">
          <div>
            <span>BUILT ON OPEN INFRASTRUCTURE</span>
            <small>Capabilities depend on network and configuration</small>
          </div>
          <strong>
            <Image
              className="protocol-logo protocol-logo-ethereum"
              src="/ethereum.png"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
            Ethereum
          </strong>
          <strong>
            <Image
              className="protocol-logo protocol-logo-ens"
              src="/ens.png"
              alt=""
              width={27}
              height={27}
              aria-hidden="true"
            />
            ENS
          </strong>
          <strong>
            <Image
              className="protocol-logo protocol-logo-chainlink"
              src="/chainlink.png"
              alt=""
              width={27}
              height={27}
              aria-hidden="true"
            />
            Chainlink CRE
          </strong>
          <strong>
            <Fingerprint size={23} /> Anon-RPC
          </strong>
        </div>
        <section className="landing-section" id="how-it-works">
          <div className="section-intro">
            <div>
              <div className="eyebrow">CONTINUITY, WITHOUT COMPROMISE</div>
              <h2>
                A plan for tomorrow.
                <br />
                <span>Control for today.</span>
              </h2>
            </div>
            <p>
              Inactivity is a signal, never a verdict. Every step toward
              recovery has safeguards your vault independently enforces.
            </p>
          </div>
          <div className="anatomy">
            <div className="anatomy-steps">
              {anatomy.map((step, i) => (
                <button
                  className={`anatomy-step ${active === i ? "selected" : ""}`}
                  key={step.title}
                  onClick={() => setActive(i)}
                >
                  <span className="anatomy-number">0{i + 1}</span>
                  <step.icon size={20} strokeWidth={1.5} />
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.subtitle}</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
            <div className="anatomy-detail">
              <div className="detail-icon">
                <CurrentIcon size={37} strokeWidth={1.2} />
              </div>
              <Badge tone="violet">Protocol anatomy · interactive</Badge>
              <h3>{anatomy[active].title}</h3>
              <p>{anatomy[active].detail}</p>
              <div className="state-path">
                <span>Active</span>
                <ArrowRight size={13} />
                <span>Challenge</span>
                <ArrowRight size={13} />
                <span>Authorized</span>
              </div>
              <Link href="/builder" className="inline-link">
                Design your inheritance flow <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
        <section className="landing-section privacy-section" id="privacy">
          <div className="privacy-art">
            <Fingerprint size={130} strokeWidth={0.7} />
            <div className="privacy-art-line" />
          </div>
          <div>
            <div className="eyebrow">PRIVACY WITH PRECISE BOUNDARIES</div>
            <h2>
              Less exposure.
              <br />
              <span>More peace of mind.</span>
            </h2>
            <p>
              Optional Anon-RPC transport can protect network metadata for
              supported reads. Wallet signing stays separate, and every onchain
              transaction remains public.
            </p>
            <p className="muted small">
              No private instructions onchain. No claims of invisible
              transactions. Always see which transport is in use.
            </p>
            <Link href="/privacy" className="inline-link">
              Understand the privacy architecture <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
        <section className="landing-cta">
          <span className="icon-tile violet">
            <ShieldCheck size={24} />
          </span>
          <h2>The future deserves a plan.</h2>
          <p>Start with the people who matter. Keep control of the rest.</p>
          <Link href="/create" className="button primary large">
            Create your vault <ArrowRight size={16} />
          </Link>
          <small>
            Unaudited software. Sepolia testnet only. No real-value assets.
          </small>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand />
        <span>Built for ETHGlobal Mumbai 2026</span>
        <Link href="/settings">
          Protocol documentation <ArrowUpRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
