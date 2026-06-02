"use client";

import Image from "next/image";
import Link from "next/link";
import WalletButton from "@/components/WalletButton";
import Card from "@/components/Card";
import PullButton from "@/components/PullButton";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start px-4 pt-8 pb-16">
      {/* Giant knot watermark behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <Image
          src="/assets/ritual-knot.png"
          alt=""
          width={1254}
          height={1254}
          priority
          className="select-none"
          style={{
            width: "min(90vw, 900px)",
            height: "auto",
            opacity: 0.05,
            transform: "rotate(-8deg)",
          }}
        />
      </div>

      {/* Top bar */}
      <div className="relative z-20 w-full flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
        {/* Built-by watermark */}
        <div className="flex items-center gap-2">
          <Image
            src="/assets/built-by-zegnaeth.png"
            alt="Built by Zegnaeth"
            width={2000}
            height={1414}
            style={{ width: 90, height: "auto", opacity: 1 }}
          />
          <a
            href="https://x.com/Zegnaeth"
            target="_blank"
            rel="noopener noreferrer"
            className="doodle-btn px-2 py-1"
            style={{ background: "#ffffff", lineHeight: 1 }}
            title="Follow ZegnaEth on X"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
              <path d="M4 4L10.5 12.5M10.5 12.5L4 21H7.5L12 15.5M10.5 12.5L20 4H16.5L12 10M12 15.5L16.5 21H20L13.5 12.5M12 15.5L13.5 12.5M12 10L13.5 12.5" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Wallet + Collection */}
        <div className="flex items-center gap-2">
          <Link
            href="/inventory"
            className="doodle-btn px-3 py-2 text-[15px]"
            style={{ background: "#ffffff" }}
          >
            My Collection
          </Link>
          <WalletButton />
        </div>
      </div>

      {/* scattered doodles */}
      <Doodles />

      {/* Logo */}
      <div className="relative z-10 w-full max-w-[720px] mx-auto wobble">
        <Image
          src="/assets/ritualmon-logo.jpeg"
          alt="Ritualmon"
          width={1200}
          height={640}
          priority
          style={{ width: "68%", height: "auto", margin: "0 auto", display: "block", mixBlendMode: "multiply" }}
        />
      </div>

      <p className="relative z-10 font-banner text-[36px] sm:text-[44px] -mt-2 text-black/80">
        GACHA
      </p>

      {/* Pull picker + How to Play side by side */}
      <div className="relative z-10 w-full max-w-[1080px] mt-2 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Pull picker */}
        <section className="doodle-card p-6 sm:p-8 flex flex-col gap-5">
          <h2 className="text-center font-brush text-[36px] leading-none">Pull a Card</h2>
          <p className="text-center text-[16px] text-black/60 -mt-3">
            Mint a Ritualmon card and collect the faces of the community.
          </p>

          <div className="flex justify-center">
            <div
              className="doodle-card p-6 flex flex-col items-center gap-4"
              style={{ background: "#FFF7CC" }}
            >
              <div className="float">
                <Image
                  src="/assets/New%20border%20tcg%20pack.png"
                  alt="Ritualmon Pack"
                  width={260}
                  height={364}
                  style={{ width: 260, height: "auto", filter: "drop-shadow(4px 4px 0 #1a1a1a)" }}
                  priority
                />
              </div>
              <h3 className="font-brush text-[28px] leading-none">Single Pull</h3>
              <p className="text-[14px] text-black/70 text-center">6 cards · 0.0001 RITUAL</p>
              <PullButton />
            </div>
          </div>

          <p className="text-center text-[14px] text-black/50 -mb-1">
            Costs 0.0001 RITUAL · connect a wallet on Ritual (chain 1979) to pull
          </p>
        </section>

        {/* How to Play */}
        <aside className="doodle-card p-6 flex flex-col gap-4" style={{ background: "#FFF7CC" }}>
          <h2 className="font-brush text-[32px] leading-none text-center">How to Play</h2>

          <ol className="flex flex-col gap-3 text-[16px]">
            <HowStep n={1}>
              Need testnet RITUAL? Claim from the{" "}
              <a
                href="https://faucet.ritualfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Ritual faucet
              </a>
              .
            </HowStep>
            <HowStep n={2}>Connect your wallet and switch to the Ritual chain.</HowStep>
            <HowStep n={3}>
              Pull a card — drop rates:
              <ul className="mt-2 flex flex-col gap-1 text-[14px]">
                <RateRow color="#3b82f6" label="Bitty"                    pct={50}   />
                <RateRow color="#a855f7" label="Ritty"                    pct={33}   />
                <RateRow color="#22c55e" label="Ritualist"                pct={8}    />
                <RateRow color="#fbbf24" label="Radiant Ritualist/Zealot" pct={5}    />
                <RateRow color="#f472b6" label="Team/Mods"                pct={2.5}  />
                <RateRow color="#a78bfa" label="??? Secret"               pct={1.5}  />
              </ul>
            </HowStep>
            <HowStep n={4}>Commit, wait ~1 second, reveal — your card mints to your wallet.</HowStep>
            <HowStep n={5}>Check your haul in <span className="font-semibold">My Collection</span>.</HowStep>
          </ol>
        </aside>
      </div>

      {/* Special Prize */}
      <div className="relative z-10 w-full max-w-[1080px] mt-5">
        <div className="doodle-card p-6 flex flex-col sm:flex-row items-center gap-6" style={{ background: "#FFE0F0", border: "3px dashed #f472b6" }}>
          <Card card={{
            id: 80,
            name: "ZegnaEth",
            role: "Secret",
            pfpUrl: "/assets/zegna%20secret.png",
            tier: "secret",
            power: 1000,
            cardImage: "/assets/zegna%20secret.png",
          }} />
          <div className="flex flex-col gap-2 text-left">
            <p className="font-brush text-[28px] leading-none">Special Drop</p>
            <p className="text-[16px] text-black/70">
              Pull the <span className="font-bold">ZegnaEth</span> card and claim a custom{" "}
              <span className="font-bold">PFP</span> or <span className="font-bold">Banner</span> — your choice.
            </p>
            <p className="text-[13px] text-black/50">DM ZegnaEth on Discord to claim your reward.</p>
          </div>
        </div>
      </div>

    </main>
  );
}

function HowStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span
        className="shrink-0 w-7 h-7 rounded-full border-[3px] border-black flex items-center justify-center font-brush text-[18px] leading-none"
        style={{ background: "#7CFF4D" }}
      >
        {n}
      </span>
      <span className="flex-1 pt-1">{children}</span>
    </li>
  );
}

function RateRow({ color, label, pct }: { color: string; label: string; pct: number }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-sm border-2 border-black" style={{ background: color }} />
        <span>{label}</span>
      </span>
      <span className="font-semibold">{pct}%</span>
    </li>
  );
}


function Doodles() {
  return (
    <>
<svg className="doodle-scribble" style={{ top: 40, right: 48, width: 80, height: 60, ["--rot" as any]: "8deg" }} viewBox="0 0 80 60" fill="none">
        <path d="M8 45 L18 15 L30 35 L40 10 L50 35 L62 15 L72 45 Z" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="8" y1="50" x2="72" y2="50" stroke="#1a1a1a" strokeWidth="2.5" />
      </svg>

      <svg className="doodle-scribble float" style={{ top: 220, left: 60, width: 50, height: 90, ["--rot" as any]: "-15deg" }} viewBox="0 0 50 90" fill="none">
        <path d="M28 5 L8 50 L22 50 L18 85 L42 35 L26 35 Z" fill="#7CFF4D" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      <svg className="doodle-scribble float" style={{ top: 280, right: 60, width: 70, height: 70, ["--rot" as any]: "12deg", animationDelay: "0.6s" }} viewBox="0 0 70 70" fill="none">
        <path d="M35 60 C 10 42 5 20 20 15 C 28 12 33 18 35 22 C 37 18 42 12 50 15 C 65 20 60 42 35 60 Z" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      <svg className="doodle-scribble" style={{ bottom: 60, left: 80, width: 120, height: 30 }} viewBox="0 0 120 30" fill="none">
        <path d="M5 15 Q 20 0, 35 15 T 65 15 T 95 15 T 115 15" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>

      <svg className="doodle-scribble float" style={{ bottom: 80, right: 100, width: 60, height: 70, ["--rot" as any]: "-8deg", animationDelay: "1.2s" }} viewBox="0 0 60 70" fill="none">
        <path d="M10 30 Q 10 5, 30 5 T 50 30 L 50 60 L 42 52 L 34 60 L 26 52 L 18 60 L 10 52 Z" stroke="#1a1a1a" strokeWidth="2.5" fill="#ffffff" strokeLinejoin="round" />
        <circle cx="22" cy="28" r="3" fill="#1a1a1a" />
        <circle cx="38" cy="28" r="3" fill="#1a1a1a" />
      </svg>

      <svg className="doodle-scribble" style={{ bottom: 30, left: "50%", transform: "translateX(-50%)", width: 100, height: 20 }} viewBox="0 0 100 20" fill="none">
        <circle cx="10" cy="10" r="3" fill="#1a1a1a" />
        <circle cx="30" cy="10" r="3" fill="#1a1a1a" />
        <circle cx="50" cy="10" r="3" fill="#1a1a1a" />
        <circle cx="70" cy="10" r="3" fill="#1a1a1a" />
        <circle cx="90" cy="10" r="3" fill="#1a1a1a" />
      </svg>

      <svg className="doodle-scribble" style={{ top: 120, left: "40%", width: 28, height: 28, ["--rot" as any]: "20deg" }} viewBox="0 0 28 28" fill="none">
        <path d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </>
  );
}
