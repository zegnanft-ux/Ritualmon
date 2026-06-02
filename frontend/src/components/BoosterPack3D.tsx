"use client";

import { useEffect, useState } from "react";

type Props = { ripping?: boolean };

export default function BoosterPack3D({ ripping = false }: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [tearPhase, setTearPhase] = useState<"idle" | "shake" | "torn">("idle");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (ripping) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 12 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  useEffect(() => {
    if (!ripping) {
      setTearPhase("idle");
      return;
    }
    setTearPhase("shake");
    const t = setTimeout(() => setTearPhase("torn"), 600);
    return () => clearTimeout(t);
  }, [ripping]);

  const tiltTransform = !ripping
    ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
    : "none";

  return (
    <div
      style={{ width: 340, height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={tearPhase === "shake" ? "pack-shake" : !ripping ? "pack-float" : ""}
        style={{
          position: "relative",
          width: 224,
          height: 330,
          transform: tiltTransform,
          transition: ripping ? "none" : "transform 0.1s ease",
          filter: "drop-shadow(5px 8px 0px rgba(0,0,0,0.3))",
        }}
      >
        {/* Pack body — hides the top flap area once torn */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/New border tcg pack.png"
          alt="Booster Pack"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            display: "block",
            clipPath: tearPhase === "torn"
              ? "inset(18% 0 0 0 round 0 0 14px 14px)"
              : "none",
          }}
        />

        {/* Flap — only shown during shake/torn, peels off */}
        {tearPhase !== "idle" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/assets/New border tcg pack.png"
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
              clipPath: "inset(0 0 82% 0 round 14px 14px 0 0)",
              transformOrigin: "top center",
              animation: tearPhase === "torn" ? "flapPeel 0.5s ease-in forwards" : "none",
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes packFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-12px); }
        }
        @keyframes packShake {
          0%   { transform: rotate(0deg)  scale(1);    }
          12%  { transform: rotate(-6deg) scale(1.04); }
          25%  { transform: rotate(8deg)  scale(1.07); }
          40%  { transform: rotate(-9deg) scale(1.09); }
          55%  { transform: rotate(7deg)  scale(1.07); }
          70%  { transform: rotate(-4deg) scale(1.04); }
          85%  { transform: rotate(2deg)  scale(1.02); }
          100% { transform: rotate(0deg)  scale(1);    }
        }
        @keyframes flapPeel {
          0%   { transform: perspective(500px) rotateX(0deg);          opacity: 1; }
          100% { transform: perspective(500px) rotateX(-150deg) translateY(-8px); opacity: 0; }
        }
        .pack-float { animation: packFloat 3s ease-in-out infinite; }
        .pack-shake { animation: packShake 0.55s ease-in-out; }
      `}</style>
    </div>
  );
}
