"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import AstrologerCard from "@/components/astrologer-card";
import { fetchJSON } from "@/lib/api";

type Astro = any;

export default function MarketplaceClient() {
  const { data, isLoading, error } = useSWR("/api/astrologers", fetchJSON, {
    revalidateOnFocus: false,
  });

  const astrologers: Astro[] = data?.astrologers || data || [];

  const [q, setQ] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<"rating" | "priceLow">("rating");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = astrologers;
    if (onlineOnly) list = list.filter((a) => !!a.is_online);
    if (verifiedOnly) list = list.filter((a) => !!a.is_verified);
    if (query) {
      list = list.filter((a) => {
        const blob = [a.name, a.specialty, ...(a.languages || []), ...(a.expertise || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return blob.includes(query);
      });
    }
    list = [...list].sort((a, b) => {
      if (sort === "priceLow") return (a.base_rate_inr || 0) - (b.base_rate_inr || 0);
      return (b.rating || 0) - (a.rating || 0);
    });
    return list;
  }, [astrologers, onlineOnly, verifiedOnly, q, sort]);

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, language, expertise..."
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-gold/40"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOnlineOnly((v) => !v)}
              className={`px-3 py-2 rounded-xl text-xs border transition ${
                onlineOnly
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`px-3 py-2 rounded-xl text-xs border transition ${
                verifiedOnly
                  ? "bg-gold/15 text-gold border-gold/30"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
              }`}
            >
              Verified
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white/80 outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="priceLow">Price (Low → High)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 h-[160px] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-100">
            Failed to load astrologers.
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            No astrologers found. Try clearing filters.
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((astro) => (
              <AstrologerCard key={astro.id} astro={astro} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
