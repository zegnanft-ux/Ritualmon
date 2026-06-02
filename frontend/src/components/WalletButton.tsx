"use client";

import { useAccount, useBalance, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import { ritual } from "@/lib/config";
import { useState } from "react";

function shortAddr(a?: string) {
  if (!a) return "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function formatBalance(value: bigint | undefined, symbol = "RITUAL") {
  if (value === undefined) return "…";
  const n = Number(formatEther(value));
  if (!Number.isFinite(n)) return `0.000 ${symbol}`;
  return `${n.toFixed(3)} ${symbol}`;
}

export default function WalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const onRitual = chain?.id === ritual.id;
  const { data: bal } = useBalance({
    address,
    chainId: ritual.id,
    query: { enabled: !!address && onRitual, refetchInterval: 8_000 },
  });
  const [open, setOpen] = useState(false);

  // Not connected
  if (!isConnected) {
    const injectedConnector = connectors.find((c) => c.id === "injected");
    const wcConnector = connectors.find((c) => c.id === "walletConnect");
    return (
      <div className="flex flex-col items-end gap-2">
        {injectedConnector && (
          <button
            onClick={() => connect({ connector: injectedConnector })}
            disabled={isConnecting}
            className="doodle-btn px-4 py-2 text-[16px]"
            style={{ background: "#FFD93D" }}
          >
            {isConnecting ? "Connecting…" : "MetaMask"}
          </button>
        )}
        {wcConnector && (
          <button
            onClick={() => connect({ connector: wcConnector })}
            disabled={isConnecting}
            className="doodle-btn px-4 py-2 text-[16px]"
            style={{ background: "#B5E0FF" }}
          >
            {isConnecting ? "Connecting…" : "WalletConnect"}
          </button>
        )}
      </div>
    );
  }

  // Wrong chain (or unknown chain not in wagmi config)
  if (!onRitual) {
    return (
      <button
        onClick={() => switchChain({ chainId: ritual.id })}
        disabled={isSwitching}
        className="doodle-btn px-5 py-2 text-[18px]"
        style={{ background: "#FF8B8B" }}
      >
        {isSwitching ? "Switching…" : "Switch to Ritual"}
      </button>
    );
  }

  // Connected + right chain
  const balanceLabel = formatBalance(bal?.value, bal?.symbol ?? "RITUAL");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="doodle-btn px-4 py-2 text-[18px] flex items-center gap-2"
        style={{ background: "#B5E0FF" }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
        <span>{shortAddr(address)}</span>
        <span className="opacity-70">·</span>
        <span>{balanceLabel}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 doodle-card p-3 z-30"
          style={{ background: "#ffffff" }}
        >
          <div className="text-[16px] mb-2">
            <div className="opacity-60">Address</div>
            <div className="break-all">{address}</div>
          </div>
          <div className="text-[16px] mb-3">
            <div className="opacity-60">Balance</div>
            <div>{balanceLabel}</div>
          </div>
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="doodle-btn w-full py-2 text-[18px]"
            style={{ background: "#FF8B8B" }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
