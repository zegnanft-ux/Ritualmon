"use client";

import { useState, useMemo, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Link from "next/link";
import Card, { type CardData, type CardTier } from "@/components/Card";
import { drawPack, PACK_CONFIG, type PackType } from "@/lib/cards";
import { addPulls } from "@/lib/inventory";
import { ritual } from "@/lib/config";
import WalletButton from "@/components/WalletButton";
import dynamic from "next/dynamic";

const BoosterPack = dynamic(() => import("@/components/BoosterPack3D"), {
  ssr: false,
  loading: () => <div style={{ width: 340, height: 480 }} />,
});

type Phase = "idle" | "ripping" | "revealing" | "done";

const tierFlash: Record<CardTier, string> = {
  common:    "transparent",
  rare:      "#60a5fa22",
  epic:      "#4ade8033",
  legendary: "#fcd34d33",
  ultramax:  "#f472b633",
  secret:    "#a78bfa22",
};

const dramaConfig: Partial<Record<CardTier, { label: string; color: string; bg: string; glow: string }>> = {
  epic: {
    label: "✦ RITUALIST ✦",
    color: "#4ade80",
    bg: "rgba(34,197,94,0.13)",
    glow: "0 0 30px rgba(74,222,128,0.85), 0 0 80px rgba(34,197,94,0.4)",
  },
  legendary: {
    label: "✦ ZEALOT ✦",
    color: "#fcd34d",
    bg: "rgba(139,92,246,0.12)",
    glow: "0 0 25px rgba(252,211,77,0.95), 0 0 60px rgba(167,139,250,0.7), 0 0 100px rgba(245,158,11,0.35)",
  },
  ultramax: {
    label: "✦ TEAM / MODS ✦",
    color: "#f9a8d4",
    bg: "rgba(244,114,182,0.12)",
    glow: "0 0 20px rgba(249,168,212,0.9), 0 0 50px rgba(167,139,250,0.6), 0 0 90px rgba(251,191,36,0.4)",
  },
  secret: {
    label: "✦ ??? SECRET ✦",
    color: "#ffffff",
    bg: "rgba(150,100,255,0.15)",
    glow: "0 0 30px rgba(255,255,255,0.9), 0 0 80px rgba(150,100,255,0.6)",
  },
};


export default function PackPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: rawType } = use(params);
  const { isConnected, chain } = useAccount();
  const router = useRouter();

  const packType: PackType | null =
    rawType === "single" || rawType === "small" || rawType === "big"
      ? (rawType as PackType)
      : null;
  const cfg = packType ? PACK_CONFIG[packType] : null;

  const [phase, setPhase] = useState<Phase>("idle");
  const [revealedIdx, setRevealedIdx] = useState<number>(-1);
  const [flash, setFlash] = useState<string>("transparent");
  const [dramaTier, setDramaTier] = useState<CardTier | null>(null);
  const dramaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("paid") !== "1") {
      router.replace("/");
    } else {
      sessionStorage.removeItem("paid");
    }
  }, [router]);

  const cards: CardData[] = useMemo(
    () => drawPack(packType!),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const needsConnect = !isConnected || chain?.id !== ritual.id;


  // Card flip reveal sequence
  useEffect(() => {
    if (phase !== "revealing" || !cards.length) return;
    if (revealedIdx >= cards.length - 1) {
      const t = setTimeout(() => {
        addPulls(cards);
        setPhase("done");
      }, 600);
      return () => clearTimeout(t);
    }
    const next = revealedIdx + 1;
    const card = cards[next];
    const isHighTier = card.tier === "epic" || card.tier === "legendary" || card.tier === "ultramax" || card.tier === "secret";
    const baseDelay = next === 0 ? 200 : isHighTier ? 700 : 500;

    const t = setTimeout(() => {
      if (isHighTier) {
        setDramaTier(card.tier);
        setFlash(tierFlash[card.tier]);
        dramaTimer.current = setTimeout(() => {
          setDramaTier(null);
          setFlash("transparent");
          setRevealedIdx(next);
        }, 1300);
      } else {
        setRevealedIdx(next);
        setFlash(tierFlash[card.tier]);
        setTimeout(() => setFlash("transparent"), 400);
      }
    }, baseDelay);

    return () => {
      clearTimeout(t);
      if (dramaTimer.current) clearTimeout(dramaTimer.current);
    };
  }, [phase, revealedIdx, cards]);

  function handlePackClick() {
    if (phase !== "idle") return;
    setPhase("ripping");
    setTimeout(() => {
      setRevealedIdx(-1);
      setPhase("revealing");
    }, 750);
  }

  if (!packType) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
        <h1 className="font-brush text-[36px]">Unknown pack type</h1>
        <Link href="/" className="doodle-btn px-5 py-2 text-[20px]">← Home</Link>
      </main>
    );
  }

  const drama = dramaTier ? dramaConfig[dramaTier] : null;

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center px-4 pt-8 pb-16">

      <PackDoodles />

      {/* Tier flash overlay */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[5] transition-colors duration-300"
        style={{ background: flash }}
      />

      {/* Drama overlay */}
      {drama && (
        <div
          aria-hidden
          className="fixed inset-0 z-[40] pointer-events-none flex items-center justify-center"
          style={{ background: drama.bg }}
        >
          <span
            className="font-banner"
            style={{
              fontSize: "clamp(52px, 10vw, 100px)",
              color: drama.color,
              textShadow: drama.glow,
              animation: "dramaIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {drama.label}
          </span>
          <style>{`
            @keyframes dramaIn {
              from { transform: scale(0.4); opacity: 0; }
              to   { transform: scale(1);   opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Top bar */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 relative z-10">
        <Link href="/" className="doodle-btn px-4 py-2 text-[18px]" style={{ background: "#ffffff" }}>← Home</Link>
        <h1 className="font-banner text-[44px] leading-none">{cfg!.label}</h1>
        <WalletButton />
      </div>

      {/* Pack — idle / ripping */}
      {(phase === "idle" || phase === "ripping") && (
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div
            onClick={handlePackClick}
            style={{ cursor: needsConnect ? "default" : phase === "idle" ? "pointer" : "default" }}
          >
            <BoosterPack ripping={phase === "ripping"} />
          </div>

          {phase === "idle" ? (
            <p className="text-[20px] text-black/50 font-brush">tap to open</p>
          ) : (
            <p className="text-[20px] text-black/50 blink">Opening…</p>
          )}
        </div>
      )}

      {/* Card reveal grid */}
      {(phase === "revealing" || phase === "done") && (
        <div className="flex flex-col items-center gap-6 relative z-10 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 justify-items-center">
            {cards.map((card, i) => (
              <div key={i} className={`card-flip ${i <= revealedIdx ? "revealed" : ""}`}>
                <div className="card-flip-inner">
                  <div className="card-flip-back">
                    <PackBackArt />
                  </div>
                  <div className="card-flip-front">
                    <Card card={card} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {phase === "done" && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button onClick={() => router.replace('/inventory')} className="doodle-btn px-6 py-3 text-[22px]">My Collection →</button>
              <button onClick={() => router.replace('/')} className="doodle-btn secondary px-6 py-3 text-[22px]">Open Another</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .card-flip {
          width: 200px;
          height: 260px;
          perspective: 1000px;
        }
        .card-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateY(180deg);
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .card-flip.revealed .card-flip-inner {
          transform: rotateY(0deg);
        }
        .card-flip-front, .card-flip-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-flip-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </main>
  );
}

function PackBackArt() {
  return (
    <div
      style={{
        width: 200,
        height: 260,
        background: "linear-gradient(135deg, #7CFF4D 0%, #FFD93D 100%)",
        border: "4px solid #1a1a1a",
        borderRadius: 14,
        boxShadow: "5px 5px 0 #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Caveat Brush, cursive",
        fontSize: 56,
        color: "#1a1a1a",
      }}
    >
      ?
    </div>
  );
}

function PackDoodles() {
  return (
    <>
      <svg className="doodle-scribble float" style={{ top: 60, left: 30, width: 55, height: 55, ["--rot" as any]: "-15deg", animationDelay: "0s" }} viewBox="0 0 60 60" fill="none">
        <path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" fill="#7CFF4D" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <svg className="doodle-scribble float" style={{ top: 40, right: 50, width: 70, height: 60, ["--rot" as any]: "10deg", animationDelay: "0.8s" }} viewBox="0 0 80 60" fill="none">
        <path d="M8 45 L18 15 L30 35 L40 10 L50 35 L62 15 L72 45 Z" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="8" y1="50" x2="72" y2="50" stroke="#1a1a1a" strokeWidth="2.5" />
      </svg>
      <svg className="doodle-scribble float" style={{ top: 200, left: 50, width: 48, height: 90, ["--rot" as any]: "-10deg", animationDelay: "0.4s" }} viewBox="0 0 50 90" fill="none">
        <path d="M28 5 L8 50 L22 50 L18 85 L42 35 L26 35 Z" fill="#7CFF4D" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <svg className="doodle-scribble float" style={{ top: 260, right: 55, width: 65, height: 65, ["--rot" as any]: "14deg", animationDelay: "1.2s" }} viewBox="0 0 70 70" fill="none">
        <path d="M35 60 C 10 42 5 20 20 15 C 28 12 33 18 35 22 C 37 18 42 12 50 15 C 65 20 60 42 35 60 Z" fill="#FF8B8B" stroke="#1a1a1a" strokeWidth="2.5" />
      </svg>
      <svg className="doodle-scribble float" style={{ bottom: 120, left: 70, width: 60, height: 30, ["--rot" as any]: "5deg", animationDelay: "0.6s" }} viewBox="0 0 120 30" fill="none">
        <path d="M5 15 Q 20 0, 35 15 T 65 15 T 95 15 T 115 15" stroke="#B5E0FF" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <svg className="doodle-scribble float" style={{ bottom: 80, right: 80, width: 50, height: 50, ["--rot" as any]: "-8deg", animationDelay: "1.8s" }} viewBox="0 0 60 60" fill="none">
        <path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" fill="#c084fc" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </>
  );
}
