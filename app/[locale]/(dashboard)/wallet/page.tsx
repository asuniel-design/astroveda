"use client";

import useSWR from "swr";
import { fetchJSON } from "@/lib/api";

export default function WalletPage() {
  const userId = typeof window !== "undefined" ? window.localStorage.getItem("userId") || "user1" : "user1";
  const { data } = useSWR(`/api/wallet/balance?userId=${encodeURIComponent(userId)}`, fetchJSON);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold text-white">Wallet</h1>
      <p className="text-sm text-white/60 mt-1">Recharge and manage balance (MVP).</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
        <div className="text-white/60 text-sm">Current Balance</div>
        <div className="text-2xl font-semibold text-white mt-1">
          {data?.currency || "INR"} {data?.balance ?? "—"}
        </div>
        <button className="mt-4 px-4 py-2 rounded-xl bg-gold text-black text-sm font-semibold">Recharge (next)</button>
      </div>
    </div>
  );
}
