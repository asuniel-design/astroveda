"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { motion, useAnimationControls } from "framer-motion";
import { fetchJSON } from "@/lib/api";

type Remedy = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  price_inr?: number;
  price?: number;
  category?: string;
};

function normalize(r: any): Remedy {
  return {
    id: String(r.id ?? r.slug ?? Math.random()),
    title: r.title ?? r.name,
    description: r.description ?? r.subtitle,
    price_inr: r.price_inr ?? r.price,
    category: r.category,
  };
}

export default function InfiniteRemedyCarousel() {
  const t = useTranslations();
  const { data, error, isLoading } = useSWR("/api/remedies", fetchJSON, {
    revalidateOnFocus: false,
  });

  const remedies: Remedy[] = useMemo(() => {
    const raw = data?.remedies ?? data ?? [];
    const list = Array.isArray(raw) ? raw.map(normalize) : [];
    if (list.length) return list;
    // Fallback (keeps UI demonstrable even if backend is unavailable)
    return [
      { id: "r1", title: "Celestial Protection", description: "Ward off negativity with Vedic rituals.", price_inr: 299, category: "Remedy" },
      { id: "r2", title: "Prosperity Pooja", description: "Attract abundance and career growth.", price_inr: 499, category: "Pooja" },
      { id: "r3", title: "Relationship Harmony", description: "Bring balance and clarity to love life.", price_inr: 399, category: "Love" },
      { id: "r4", title: "Health Shield", description: "Strengthen energy and wellbeing.", price_inr: 349, category: "Health" },
    ];
  }, [data]);

  const doubled = useMemo(() => [...remedies, ...remedies], [remedies]);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [halfWidth, setHalfWidth] = useState<number>(0);

  const controls = useAnimationControls();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // track scrollWidth equals full doubled width. Half is one loop.
    const w = el.scrollWidth / 2;
    if (!Number.isFinite(w) || w <= 0) return;
    setHalfWidth(w);
  }, [remedies.length]);

  useEffect(() => {
    if (!halfWidth) return;
    if (paused) return;

    controls.start({
      x: [0, -halfWidth],
      transition: {
        duration: Math.max(18, halfWidth / 60),
        ease: "linear",
        repeat: Infinity,
      },
    });

    return () => {
      controls.stop();
    };
  }, [halfWidth, paused, controls]);

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">{t("home.remediesTitle")}</h2>
          <p className="text-sm text-white/60">{t("home.remediesSubtitle")}</p>
        </div>
        {isLoading && <span className="text-xs text-white/50">{t("home.loading")}</span>}
        {error && <span className="text-xs text-rose-200">{t("home.usingFallback")}</span>}
      </div>

      <div
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
        onMouseEnter={() => {
          setPaused(true);
          controls.stop();
        }}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative">
          {/* left/right fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#0b0a1c]/70 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0b0a1c]/70 to-transparent" />

          <motion.div
            animate={controls}
            className="flex gap-4 py-7 md:py-8 px-4 md:px-6 will-change-transform items-center"
          >
            <div ref={trackRef} className="flex gap-4">
              {doubled.map((r, idx) => (
                <div
                  key={`${r.id}-${idx}`}
                  className="shrink-0 w-[260px] sm:w-[280px] md:w-[320px]"
                >
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-white/50">{r.category || t("home.remediesTitle")}</div>
                      <div className="text-xs font-semibold text-gold">₹ {r.price_inr ?? "—"}</div>
                    </div>
                    <div className="mt-2 text-white font-semibold">{r.title || "—"}</div>
                    <div className="mt-1 text-sm text-white/60 line-clamp-2">
                      {r.description || "—"}
                    </div>
                    <button className="mt-4 w-full rounded-xl bg-gold text-black text-sm font-semibold py-2 hover:brightness-105 active:brightness-95">
                      {t("home.viewRemedy")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile 1.5 cards hint: keep container full width and card widths fixed */}
        </div>
      </div>
    </section>
  );
}
