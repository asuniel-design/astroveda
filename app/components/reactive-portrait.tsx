"use client";

import { useMemo } from "react";
import { getZodiacSign, zodiacGlow } from "@/lib/zodiac";

export default function ReactivePortrait({ dob }: { dob: string | null }) {
  const sign = useMemo(() => (dob ? getZodiacSign(dob) : null), [dob]);
  const glow = useMemo(() => zodiacGlow(sign).glow, [sign]);

  return (
    <div
      className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center relative"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px ${glow}` }}
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20" />
      <div
        className="absolute -inset-3 rounded-[28px] opacity-60 blur-xl"
        style={{ background: `radial-gradient(circle at 50% 50%, ${glow}, transparent 60%)` }}
      />
    </div>
  );
}
