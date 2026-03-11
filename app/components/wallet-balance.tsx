"use client";

import useSWR from "swr";
import { fetchJSON } from "@/lib/api";

function getUserId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("userId") || "user1"; // fallback for dev/demo
}

export default function WalletBalance() {
  const userId = getUserId();
  const { data, isLoading, error } = useSWR(
    userId ? `/api/wallet/balance?userId=${encodeURIComponent(userId)}` : null,
    fetchJSON,
    { revalidateOnFocus: false }
  );

  const balance = data?.balance;
  const currency = data?.currency || "INR";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-white/60">Wallet Balance</div>
          <div className="text-lg font-semibold text-white">
            {isLoading ? "…" : error ? "—" : `${currency} ${balance}`}
          </div>
        </div>
        <button
          className="px-4 py-2.5 rounded-full bg-gold text-black text-xs font-semibold hover:brightness-105 active:brightness-95 shadow-[0_8px_24px_rgba(250,204,21,0.18)]"
          onClick={() => {
            // For now: route to wallet/topup later
            window.location.href = "/wallet";
          }}
        >
          Recharge
        </button>
      </div>
    </div>
  );
}
