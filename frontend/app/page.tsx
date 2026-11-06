"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { Brand, Badge, WalletButton } from "@/components/ui";
import { HeroPerspectiveGrid } from "@/components/hero-perspective-grid";
import "./landing.css";

const styles = {
  anatomy: "ss-anatomy",
  cardFooter: "ss-cardFooter",
  cardIcon: "ss-cardIcon",
  closing: "ss-closing",
  closingAction: "ss-closingAction",
  cubeFront: "ss-cubeFront",
  cubeSide: "ss-cubeSide",
  cubeTop: "ss-cubeTop",
  detail: "ss-detail",
  detailArt: "ss-detailArt",
  editorLink: "ss-editorLink",
  feature: "ss-feature",
  featureArt: "ss-featureArt",
  features: "ss-features",
  fingerprint: "ss-fingerprint",
  flowArt: "ss-flowArt",
  footer: "ss-footer",
  header: "ss-header",
  headerActions: "ss-headerActions",
  hero: "ss-hero",
  heroActions: "ss-heroActions",
  heroFoot: "ss-heroFoot",
  heroLabel: "ss-heroLabel",
  home: "ss-home",
  illustrationLabel: "ss-illustrationLabel",
  infrastructure: "ss-infrastructure",
  kicker: "ss-kicker",
  miniStack: "ss-miniStack",
  openApp: "ss-openApp",
  planRail: "ss-planRail",
  planStage: "ss-planStage",
  railDot: "ss-railDot",
  reassurance: "ss-reassurance",
  sculptureLabel: "ss-sculptureLabel",
  sculptureOrbit: "ss-sculptureOrbit",
  section: "ss-section",
  sectionIntro: "ss-sectionIntro",
  selected: "ss-selected",
  showcase: "ss-showcase",
  showcaseBar: "ss-showcaseBar",
  stageCard: "ss-stageCard",
  stageLines: "ss-stageLines",
  step: "ss-step",
  stepNumber: "ss-stepNumber",
  steps: "ss-steps",
  vaultCube: "ss-vaultCube",
  vaultSculpture: "ss-vaultSculpture",
};

const anatomy = [
  {
    icon: Vault,
    title: "Your vault",
    subtitle: "Isolated. Owner controlled.",
    detail:
      "Deposit only the assets you want this plan to protect. While your vault is active, you can withdraw or update your plan.",
    note: "01 / SET THE FOUNDATION",
  },
  {
    icon: HeartPulse,
    title: "A sign of life",
    subtitle: "A check-in, on your terms.",
    detail:
      "Choose your liveness interval. A missed deadline only makes a recovery request possible. It never proves death or releases assets.",
    note: "02 / STAY IN CONTROL",
  },
  {
    icon: Users,
    title: "People you trust",
    subtitle: "Guardian quorum + challenge.",
    detail:
      "Recovery needs guardian approval and an owner challenge period. Return to your wallet and cancel a pending request before authorization.",
    note: "03 / ADD HUMAN JUDGMENT",
  },
  {
    icon: GitBranch,
    title: "A thoughtful release",
    subtitle: "Your people. Your schedule.",
    detail:
      "Beneficiaries claim their own allocations over time. Emergency acceleration requires an additional delay and a fresh guardian quorum.",
    note: "04 / PROVIDE A PATH FORWARD",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const CurrentIcon = anatomy[active].icon;
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#safeguards">Safeguards</a>
          <Link href="/privacy">Integrations</Link>
        </nav>
        <div className={styles.headerActions}>
          <Link href="/dashboard" className={styles.openApp}>
            Open app <ArrowUpRight size={14} />
          </Link>
          <WalletButton />
        </div>
      </header>
      <main>
        <section className={styles.hero}>
          <HeroPerspectiveGrid />
          <div className={styles.heroLabel}>
            <span /> YOUR ASSETS. YOUR PEOPLE. YOUR RULES.
          </div>
          <h1>
            Your legacy.
            <br />
            <span>In your hands.</span>
          </h1>
          <p>
            A future for the people who matter.
            <br />
            An inheritance plan that keeps you in control today.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className="button primary large">
              Create your vault <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="button large">
              Review a vault <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className={styles.reassurance}>
            <span>
              <Check size={13} /> Noncustodial
            </span>
            <span>
              <Check size={13} /> Guardian protected
            </span>
            <span>
              <Check size={13} /> Onchain rules
            </span>
          </div>
          <div className={styles.heroFoot}>
            <span>BUILT FOR CLASSIC</span>
            <span>SCROLL TO EXPLORE ↓</span>
          </div>
        </section>

        <section
          className={styles.showcase}
          aria-label="Illustration of a vault recovery plan"
        >
          <div className={styles.showcaseBar}>
            <span>
              <ShieldCheck size={16} /> A plan with safeguards built in.
            </span>
            <span className={styles.illustrationLabel}>ILLUSTRATIVE PLAN</span>
          </div>
          <div className={styles.planStage}>
            <div className={styles.stageLines} aria-hidden="true" />
            <div className={styles.stageCard}>
              <div className={styles.cardIcon}>
                <KeyRound size={19} />
              </div>
              <small>01 / OWNER</small>
              <h3>You hold the keys.</h3>
              <p>
                Configure, fund and check in.
                <br />
                Stay in control while active.
              </p>
              <div className={styles.cardFooter}>
                <LockKeyhole size={12} /> Owner authorized
              </div>
            </div>
            <div className={styles.vaultSculpture} aria-hidden="true">
              {/* <div className={styles.sculptureOrbit} /> */}
              <div className={styles.vaultCube}>
                <div className={styles.cubeFront}>
                  <ShieldCheck size={58} strokeWidth={1} />
                  <span>SILENT.</span>
                  <i />
                </div>
                <div className={styles.cubeSide} />
                <div className={styles.cubeTop} />
              </div>
              <span className={styles.sculptureLabel}>
                ISOLATED VAULT / ETHEREUM
              </span>
            </div>
            <div className={styles.stageCard}>
              <div className={styles.cardIcon}>
                <Users size={19} />
              </div>
              <small>02 / YOUR PEOPLE</small>
              <h3>A path forward.</h3>
              <p>
                Guardian approval. Time to respond.
                <br />A release on your terms.
              </p>
              <div className={styles.cardFooter}>
                <GitBranch size={12} /> Contract enforced
              </div>
            </div>
          </div>
          <div className={styles.planRail}>
            <span>
              <span className={styles.railDot} /> Active
            </span>
            <ChevronRight size={13} />
            <span>Request</span>
            <ChevronRight size={13} />
            <span>Guardian quorum</span>
            <ChevronRight size={13} />
            <span>Challenge period</span>
            <ChevronRight size={13} />
            <span>Beneficiary claims</span>
          </div>
        </section>

        <div className={styles.infrastructure}>
          <div>
            <span>OPEN INFRASTRUCTURE</span>
            <small>Integration availability varies by setup.</small>
          </div>
          <strong>
            <Image src="/ethereum.png" alt="" width={25} height={25} />
            Ethereum
          </strong>
          <strong>
            <Image src="/ens.png" alt="" width={25} height={25} />
            ENS
          </strong>
          <strong>
            <Image src="/chainlink.png" alt="" width={25} height={25} />
            Chainlink CRE
          </strong>
          <strong>
            <Fingerprint size={23} />
            Anon-RPC
          </strong>
        </div>

        <section id="how-it-works" className={styles.section}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.kicker}>
                THOUGHTFULLY DESIGNED, AT EVERY STEP
              </span>
              <h2>
                A plan for tomorrow.
                <br />
                <span>Control for today.</span>
              </h2>
            </div>
            <p>
              Inactivity is a signal, never a verdict. Your vault independently
              enforces the safeguards between a missed check-in and a release.
            </p>
          </div>
          <div className={styles.anatomy}>
            <div className={styles.steps}>
              {anatomy.map((step, i) => (
                <button
                  className={`${styles.step} ${active === i ? styles.selected : ""}`}
                  key={step.title}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                >
                  <span className={styles.stepNumber}>0{i + 1}</span>
                  <step.icon size={20} strokeWidth={1.5} />
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.subtitle}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
            <div
              className={`${styles.detail} anatomy-detail`}
              aria-live="polite"
            >
              <span className={styles.kicker}>{anatomy[active].note}</span>
              <div className={styles.detailArt} aria-hidden="true">
                <div />
                <CurrentIcon key={active} size={64} strokeWidth={1} />
                <div />
              </div>
              <h3>{anatomy[active].title}</h3>
              <p>{anatomy[active].detail}</p>
              <Link href="/builder" className={styles.editorLink}>
                Design your inheritance flow <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section id="safeguards" className={styles.section}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.kicker}>
                TRUST PEOPLE. VERIFY THE RULES.
              </span>
              <h2>
                Protection in layers.
                <br />
                <span>Clarity at every step.</span>
              </h2>
            </div>
            <p>
              No privileged custodian. No instant release on a timer. A defined
              recovery process you can inspect before it is ever needed.
            </p>
          </div>
          <div className={styles.features}>
            <article className={styles.feature}>
              <div className={styles.featureArt} aria-hidden="true">
                <div className={styles.miniStack}>
                  <span>
                    <KeyRound size={15} /> Owner controlled <Check size={13} />
                  </span>
                  <span>
                    <Users size={15} /> Guardian approval <Check size={13} />
                  </span>
                  <span>
                    <HeartPulse size={15} /> Time to respond <Check size={13} />
                  </span>
                </div>
              </div>
              <span className={styles.kicker}>01 / HUMAN SAFEGUARDS</span>
              <h3>
                A missed check-in.
                <br />
                Never an instant handover.
              </h3>
              <p>
                A guardian quorum and challenge period stand between inactivity
                and recovery.
              </p>
              <Link href="/recovery">
                Explore recovery <ArrowUpRight size={16} />
              </Link>
            </article>
            <article className={styles.feature}>
              <div
                className={`${styles.featureArt} ${styles.flowArt}`}
                aria-hidden="true"
              >
                <div>
                  <Vault size={22} />
                  <span />
                  <GitBranch size={22} />
                </div>
                <div>
                  <span>Scheduled release</span>
                  <span>Beneficiary claims</span>
                </div>
              </div>
              <span className={styles.kicker}>02 / MEANINGFUL CONTROL</span>
              <h3>
                Your people.
                <br />
                Your release schedule.
              </h3>
              <p>
                Set allocations and phased releases through a visual editor
                backed by contract rules.
              </p>
              <Link href="/builder">
                Open the visual builder <ArrowUpRight size={16} />
              </Link>
            </article>
            <article className={styles.feature}>
              <div
                className={`${styles.featureArt} ${styles.fingerprint}`}
                aria-hidden="true"
              >
                <div>
                  <Fingerprint size={84} strokeWidth={1} />
                </div>
              </div>
              <span className={styles.kicker}>03 / PRECISE PRIVACY</span>
              <h3>
                Less exposure.
                <br />
                Clear boundaries.
              </h3>
              <p>
                Optional anonymous read transport. Public onchain transactions.
                Always know the difference.
              </p>
              <Link href="/privacy">
                Understand privacy <ArrowUpRight size={16} />
              </Link>
            </article>
          </div>
        </section>

        <section className={styles.closing}>
          <div>
            <Badge>YOUR NEXT CHAPTER STARTS HERE</Badge>
            <h2>
              The future
              <br />
              deserves a plan.
            </h2>
            <p>
              Start with the people who matter.
              <br />
              Keep control of the rest.
            </p>
          </div>
          <div className={styles.closingAction}>
            <Link href="/create" className="button primary large">
              Create your vault <ArrowRight size={17} />
            </Link>
            <small>
              Unaudited software. Sepolia testnet only.
              <br />
              No real-value assets.
            </small>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <Brand />
        <span>Built for ETHGlobal Mumbai 2026</span>
        <Link href="/settings">
          Protocol documentation <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}
