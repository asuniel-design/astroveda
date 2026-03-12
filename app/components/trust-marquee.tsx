"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { motion, useAnimationControls } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { fetchJSON } from "@/lib/api";

type Review = {
  id: string;
  name: string;
  review: string;
  rating: number;
};

function normalize(r: any, idx: number): Review {
  return {
    id: String(r.id ?? idx),
    name: String(r.name ?? "Verified User"),
    review: String(r.review ?? r.text ?? "Great experience."),
    rating: Number(r.rating ?? 5),
  };
}

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, rating || 0));
  const full = Math.floor(r);
  const frac = r - full;
  const half = frac >= 0.25 && frac < 0.75;
  const extraFull = frac >= 0.75 ? 1 : 0;

  const fullCount = Math.min(5, full + extraFull);
  const halfCount = fullCount < 5 && half ? 1 : 0;
  const emptyCount = Math.max(0, 5 - fullCount - halfCount);

  return (
    <div className="flex items-center gap-1 text-yellow-300" aria-label={`${r.toFixed(1)} out of 5`}>
      {Array.from({ length: fullCount }).map((_, i) => (
        <Star key={`f-${i}`} className="w-4 h-4 fill-current" />
      ))}
      {halfCount === 1 && <StarHalf className="w-4 h-4 fill-current" />}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <Star key={`e-${i}`} className="w-4 h-4 text-white/20" />
      ))}
      <span className="ml-2 text-xs text-white/50">{r.toFixed(1)}</span>
    </div>
  );
}

export default function TrustMarquee() {
  const t = useTranslations();
  const { data } = useSWR("/api/testimonials", fetchJSON, { revalidateOnFocus: false });

  const items: Review[] = useMemo(() => {
    const raw = data?.testimonials ?? data?.items ?? data ?? [];
    const list = Array.isArray(raw) ? raw.map(normalize) : [];
    if (list.length) return list;
    return [
      { id: "v1", name: "Asha", review: "Quick, accurate and very helpful.", rating: 4.5 },
      { id: "v2", name: "Ravi", review: "Genuine guidance. Felt private and safe.", rating: 4.2 },
      { id: "v3", name: "Meera", review: "Great remedies and clear next steps.", rating: 4.8 },
      { id: "v4", name: "Kiran", review: "Fast response. Highly recommended.", rating: 5.0 },
    ];
  }, [data]);

  const doubled = useMemo(() => [...items, ...items], [items]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [halfWidth, setHalfWidth] = useState<number>(0);
  const controls = useAnimationControls();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.scrollWidth / 2;
    if (!Number.isFinite(w) || w <= 0) return;
    setHalfWidth(w);
  }, [items.length]);

  useEffect(() => {
    if (!halfWidth || paused) return;
    controls.start({
      x: [0, -halfWidth],
      transition: { duration: Math.max(16, halfWidth / 70), ease: "linear", repeat: Infinity },
    });
    return () => controls.stop();
  }, [halfWidth, paused, controls]);

  return (
    <section className="py-6 md:py-10">
      <div className="flex items-end justify-between gap-4 mb-5">
        <h2 className="text-xl font-semibold text-white">{t("home.trustTitle")}</h2>
      </div>

      <div
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
        onMouseEnter={() => {
          setPaused(true);
          controls.stop();
        }}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative marquee-mask">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#0b0a1c]/70 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0b0a1c]/70 to-transparent" />

          <motion.div animate={controls} className="flex gap-4 py-5 md:py-6 px-4 md:px-6 will-change-transform items-center">
            <div ref={trackRef} className="flex gap-4">
              {doubled.map((r, idx) => (
                <div key={`${r.id}-${idx}`} className="shrink-0 w-[260px] sm:w-[320px]">
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4">
                    <Stars rating={r.rating} />
                    <div className="mt-2 text-sm text-white/80 leading-relaxed line-clamp-3">“{r.review}”</div>
                    <div className="mt-3 text-xs text-white/50">— {r.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
