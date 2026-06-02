"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ritual } from "@/lib/config";
import { GACHA_ADDRESS, GACHA_ABI, PULL_COST } from "@/lib/contract";

export default function PullButton() {
  const { isConnected, chain } = useAccount();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [pending, setPending] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const needsConnect = !isConnected || chain?.id !== ritual.id;

  useEffect(() => {
    if (isSuccess && hash) {
      sessionStorage.setItem("paid", "1");
      router.push("/pack/single");
    }
  }, [isSuccess, hash, router]);

  async function handlePull() {
    if (needsConnect || pending) return;
    setError(null);
    setPending(true);
    try {
      const txHash = await writeContractAsync({
        address: GACHA_ADDRESS,
        abi: GACHA_ABI,
        functionName: "pull",
        value: PULL_COST,
      });
      setHash(txHash);
    } catch (e: unknown) {
      const err = e as { shortMessage?: string };
      setError(err?.shortMessage || "Transaction rejected");
      setPending(false);
    }
  }

  if (needsConnect) {
    return <p className="text-[13px] text-black/50 text-center">Connect wallet on Ritual chain to pull</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePull}
        disabled={pending}
        className="doodle-btn secondary px-4 py-2"
        style={{ opacity: pending ? 0.6 : 1, cursor: pending ? "default" : "pointer" }}
      >
        {pending && !hash ? "Confirm in wallet…" : hash ? "Confirming…" : "PULL"}
      </button>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
