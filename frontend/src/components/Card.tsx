"use client";

import { useState } from "react";

export type CardTier = "common" | "rare" | "epic" | "legendary" | "ultramax" | "secret";

export type CardData = {
  id: number;
  name: string;
  role: string;
  pfpUrl: string;
  tier: CardTier;
  power: number;
  cardImage?: string;
  borderUrl?: string;
};

const tierColor: Record<CardTier, string> = {
  common:    "#93c5fd",
  rare:      "#c4b5fd",
  epic:      "#86efac",
  legendary: "#fcd34d",
  ultramax:  "#f9a8d4",
  secret:    "#000000",
};

const tierLabel: Record<CardTier, string> = {
  common:    "Bitty",
  rare:      "Ritty",
  epic:      "Ritualist",
  legendary: "Zealot",
  ultramax:  "Team / Mods",
  secret:    "??? Secret",
};

const glowMap: Record<CardTier, string> = {
  common:    "5px 5px 0 #1a1a1a",
  rare:      "5px 5px 0 #1a1a1a, 0 0 10px 3px rgba(192,132,252,0.6), 0 0 22px 7px rgba(192,132,252,0.25)",
  epic:      "5px 5px 0 #1a1a1a, 0 0 12px 4px rgba(74,222,128,0.85), 0 0 26px 10px rgba(34,197,94,0.5), 0 0 48px 18px rgba(16,185,129,0.22)",
  legendary: "5px 5px 0 #1a1a1a, 0 0 12px 5px rgba(252,211,77,0.95), 0 0 26px 10px rgba(167,139,250,0.65), 0 0 50px 18px rgba(245,158,11,0.35), 0 0 70px 28px rgba(139,92,246,0.2)",
  ultramax:  "5px 5px 0 #1a1a1a",
  secret:    "5px 5px 0 #1a1a1a, 0 0 14px 6px rgba(255,255,255,0.9), 0 0 30px 12px rgba(200,200,255,0.6), 0 0 60px 24px rgba(150,100,255,0.4)",
};

export default function Card({ card }: { card: CardData }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const wrapStyle: React.CSSProperties = {
    display: "inline-block",
    transform: `perspective(500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: "transform 0.15s ease",
    borderRadius: 16,
  };

  const glowAnim = card.tier === "ultramax"
    ? "rainbowPulse 3s linear infinite"
    : card.tier === "legendary"
    ? "legendPulse 2s ease-in-out infinite"
    : card.tier === "epic"
    ? "epicPulse 1.8s ease-in-out infinite"
    : card.tier === "rare"
    ? "rarePulse 2.2s ease-in-out infinite"
    : undefined;

  if (card.cardImage) {
    return (
      <div style={wrapStyle} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div style={{ position: "relative", display: "inline-block", borderRadius: 12 }}>
          {card.tier === "ultramax" && (
            <div style={{
              position: "absolute",
              inset: -5,
              borderRadius: 16,
              boxShadow: "0 0 14px 5px rgba(255,100,150,0.8), 0 0 30px 12px rgba(255,200,0,0.5), 0 0 50px 20px rgba(100,100,255,0.4)",
              animation: "rainbowGlow 3s linear infinite",
              zIndex: 0,
              pointerEvents: "none",
            }} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.cardImage}
            alt={card.name}
            style={{
              width: 200,
              height: "auto",
              display: "block",
              borderRadius: 12,
              boxShadow: card.tier !== "ultramax" ? glowMap[card.tier] : "5px 5px 0 #1a1a1a",
              animation: card.tier !== "ultramax" ? glowAnim : undefined,
              position: "relative",
              zIndex: 1,
            }}
          />
          <style>{`
            @keyframes rarePulse {
              0%, 100% { filter: brightness(1) saturate(1); }
              50%       { filter: brightness(1.06) saturate(1.1); }
            }
            @keyframes epicPulse {
              0%, 100% { filter: brightness(1) saturate(1); }
              50%       { filter: brightness(1.08) saturate(1.18); }
            }
            @keyframes legendPulse {
              0%, 100% { filter: brightness(1) saturate(1); }
              50%       { filter: brightness(1.1) saturate(1.22); }
            }
            @keyframes rainbowGlow {
              0%   { filter: hue-rotate(0deg)   brightness(1.05); }
              100% { filter: hue-rotate(360deg) brightness(1.05); }
            }
            @keyframes rainbowPulse {
              0%   { filter: hue-rotate(0deg)   brightness(1.04); }
              100% { filter: hue-rotate(360deg) brightness(1.04); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (card.borderUrl) {
    return (
      <div style={wrapStyle} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div style={{ position: "relative", width: 200, display: "inline-block", borderRadius: 12, boxShadow: glowMap[card.tier], animation: glowAnim }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.pfpUrl}
            alt={card.name}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.borderUrl}
            alt=""
            style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1 }}
          />
        </div>
        <style>{`
          @keyframes rainbowGlow {
            0%   { filter: hue-rotate(0deg)   brightness(1.05); }
            100% { filter: hue-rotate(360deg) brightness(1.05); }
          }
          @keyframes rainbowPulse {
            0%   { filter: hue-rotate(0deg)   brightness(1.04); }
            100% { filter: hue-rotate(360deg) brightness(1.04); }
          }
        `}</style>
      </div>
    );
  }

  const color = tierColor[card.tier];

  return (
    <div style={wrapStyle} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div
        style={{
          width: 200,
          background: "#ffffff",
          border: "3px solid #1a1a1a",
          borderRadius: 16,
          boxShadow: glowMap[card.tier],
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: glowAnim,
        }}
      >
        <div
          style={{
            background: color,
            padding: "5px 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #1a1a1a",
          }}
        >
          <span style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>
            {tierLabel[card.tier]}
          </span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>#{String(card.id).padStart(3, "0")}</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.pfpUrl}
          alt={card.name}
          style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            padding: "8px 10px",
            borderTop: "2px solid #1a1a1a",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {card.name}
          </span>
          <span style={{ fontSize: 11, opacity: 0.55 }}>{card.role}</span>
        </div>
      </div>
    </div>
  );
}
