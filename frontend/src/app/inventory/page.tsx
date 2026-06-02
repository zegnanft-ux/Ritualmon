"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { getInventory, seedOwnerCard, type InventoryEntry } from "@/lib/inventory";
import WalletButton from "@/components/WalletButton";
import type { CardTier } from "@/components/Card";

const tierLabel: Record<CardTier, string> = {
  secret:    "??? Secret",
  ultramax:  "Team / Mods",
  legendary: "Radiant Ritualist / Zealot",
  epic:      "Ritualist",
  rare:      "Ritty",
  common:    "Bitty",
};

const tierAccent: Record<CardTier, string> = {
  secret:    "#a78bfa",
  ultramax:  "rainbow",
  legendary: "#fbbf24",
  epic:      "#22c55e",
  rare:      "#a855f7",
  common:    "#3b82f6",
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    seedOwnerCard();
    setItems(getInventory());
  }, []);

  const grouped: Record<CardTier, InventoryEntry[]> = {
    secret:    [],
    ultramax:  [],
    legendary: [],
    epic:      [],
    rare:      [],
    common:    [],
  };
  for (const entry of items) grouped[entry.card.tier].push(entry);

  const totalCards = items.reduce((sum, e) => sum + e.count, 0);
  const uniqueCards = items.length;

return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center px-4 pt-8 pb-16">
      <CollectionDoodles />

      {/* Top bar */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 relative z-10">
        <Link href="/" className="doodle-btn px-4 py-2 text-[18px]" style={{ background: "#ffffff" }}>← Home</Link>
        <h1 className="font-banner text-[48px] leading-none">My Collection</h1>
        <WalletButton />
      </div>

      {/* Stats */}
      <div className="w-full max-w-5xl mb-6 doodle-card p-4 flex flex-wrap items-center justify-around gap-3 relative z-10" style={{ background: "#ffffff" }}>
        <Stat label="Total Pulls" value={totalCards} />
        <Stat label="Unique" value={uniqueCards} />
        <Stat label="Secret"     value={grouped.secret.reduce((s, e) => s + e.count, 0)}    color="#a78bfa" />
        <Stat label="Team/Mods"  value={grouped.ultramax.reduce((s, e) => s + e.count, 0)}  color="#f472b6" />
        <Stat label="Zealot"     value={grouped.legendary.reduce((s, e) => s + e.count, 0)} color={tierAccent.legendary} />
        <Stat label="Ritualist"  value={grouped.epic.reduce((s, e) => s + e.count, 0)}      color={tierAccent.epic} />
        <Stat label="Ritty"      value={grouped.rare.reduce((s, e) => s + e.count, 0)}      color={tierAccent.rare} />
        <Stat label="Bitty"      value={grouped.common.reduce((s, e) => s + e.count, 0)}    color={tierAccent.common} />
      </div>

      {/* Empty state */}
      {mounted && items.length === 0 && (
        <div className="doodle-card p-8 max-w-[480px] text-center flex flex-col items-center gap-4 relative z-10" style={{ background: "#FFF7CC" }}>
          <p className="font-brush text-[28px]">No cards yet!</p>
          <p className="text-[18px] text-black/70">Open a pack to start your collection.</p>
          <Link href="/" className="doodle-btn px-5 py-3 text-[20px]">Get a Pack</Link>
        </div>
      )}

      {/* Sections by tier */}
      <div className="w-full max-w-6xl flex flex-col gap-10 relative z-10">
        {(Object.keys(grouped) as CardTier[]).map((tier) =>
          grouped[tier].length > 0 ? (
            <section key={tier}>
              <h2
                className="font-banner text-[36px] mb-4 inline-block px-3 py-1 doodle-card"
                style={{
                  background: tier === "ultramax"
                    ? "linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#4ade80,#60a5fa,#c084fc,#f472b6)"
                    : tierAccent[tier],
                  color: "#1a1a1a",
                }}
              >
                {tierLabel[tier]} ({grouped[tier].reduce((s, e) => s + e.count, 0)})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {grouped[tier].map((entry) => (
                  <div key={entry.card.id} className="relative">
                    <Card card={entry.card} />
                    {entry.count > 1 && (
                      <span
                        className="absolute -top-3 -right-3 doodle-btn px-3 py-1 text-[18px]"
                        style={{ background: "#ffffff", zIndex: 2 }}
                      >
                        ×{entry.count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null,
        )}
      </div>

    </main>
  );
}

function Stat({ label, value, color = "#1a1a1a" }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center">
      <div className="text-[12px] text-black/60 uppercase tracking-wide">{label}</div>
      <div className="font-banner text-[36px] leading-none" style={{ color }}>{value}</div>
    </div>
  );
}

function CollectionDoodles() {
  return (
    <>
      <svg className="doodle-scribble float" style={{ top: 50, left: 20, width: 50, height: 50, ["--rot" as any]: "-12deg", animationDelay: "0s" }} viewBox="0 0 60 60" fill="none">
        <path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <svg className="doodle-scribble float" style={{ top: 80, right: 40, width: 60, height: 60, ["--rot" as any]: "8deg", animationDelay: "1s" }} viewBox="0 0 70 70" fill="none">
        <path d="M35 60 C 10 42 5 20 20 15 C 28 12 33 18 35 22 C 37 18 42 12 50 15 C 65 20 60 42 35 60 Z" fill="#FF8B8B" stroke="#1a1a1a" strokeWidth="2.5" />
      </svg>
      <svg className="doodle-scribble float" style={{ top: 220, left: 40, width: 45, height: 80, ["--rot" as any]: "-8deg", animationDelay: "0.5s" }} viewBox="0 0 50 90" fill="none">
        <path d="M28 5 L8 50 L22 50 L18 85 L42 35 L26 35 Z" fill="#7CFF4D" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <svg className="doodle-scribble float" style={{ top: 300, right: 60, width: 55, height: 55, ["--rot" as any]: "16deg", animationDelay: "1.4s" }} viewBox="0 0 60 60" fill="none">
        <path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" fill="#c084fc" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <svg className="doodle-scribble" style={{ bottom: 60, left: 60, width: 100, height: 24 }} viewBox="0 0 120 30" fill="none">
        <path d="M5 15 Q 20 0, 35 15 T 65 15 T 95 15 T 115 15" stroke="#B5E0FF" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
}
