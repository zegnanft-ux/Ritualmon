"use client";

import Card, { CardData } from "@/components/Card";

const sampleCards: CardData[] = [
  {
    id: 1,
    name: "anonpleb",
    role: "Community Member",
    pfpUrl: "https://api.dicebear.com/9.x/pixel-art/svg?seed=anonpleb",
    tier: "common",
    power: 42,
  },
  {
    id: 27,
    name: "0xCipher",
    role: "OG Contributor",
    pfpUrl: "https://api.dicebear.com/9.x/pixel-art/svg?seed=0xCipher",
    tier: "rare",
    power: 71,
  },
  {
    id: 88,
    name: "ModMaxi",
    role: "Discord Mod",
    pfpUrl: "https://api.dicebear.com/9.x/pixel-art/svg?seed=ModMaxi",
    tier: "epic",
    power: 144,
  },
  {
    id: 1,
    name: "Niraj",
    role: "Founder",
    pfpUrl: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Niraj",
    tier: "legendary",
    power: 999,
  },
  {
    id: 80,
    name: "ZegnaEth",
    role: "Secret",
    pfpUrl: "/assets/zegna%20secret.png",
    tier: "secret",
    power: 1000,
    cardImage: "/assets/zegna%20secret.png",
  },
];

export default function CardsPreview() {
  return (
    <main className="scanlines min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{ fontSize: 18, marginBottom: 8 }}>RITUAL GACHA — CARD PREVIEW</h1>
        <p style={{ fontSize: 8, opacity: 0.7, marginBottom: 32 }}>
          Hover a card. Epic & Legendary have holographic shimmer.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 32,
            justifyItems: "center",
          }}
        >
          {sampleCards.map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>
      </div>
    </main>
  );
}
