"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import FunnelModal from "../components/funnel-modal";

const items = [
  { icon: "🌟", title: "Daily Horoscope", desc: "Know what stars say today", href: "horoscope" },
  { icon: "📜", title: "Free Kundli", desc: "Get your birth chart", href: "kundli" },
  { icon: "💑", title: "Compatibility Match", desc: "Find your perfect match", href: "matching" },
  { icon: "🎴", title: "Tarot Reading", desc: "Unlock hidden answers", href: "tarot" },
];

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "hi";
}

export default function Services() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  function isAuthed() {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem("userId");
  }

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((s) => (
          <button
            key={s.title}
            className="card p-6 text-center hover:bg-white/10 hover:border-gold/30 transition"
            onClick={() => {
              if (isAuthed()) {
                router.push(`/${locale}/${s.href}`);
              } else {
                setTargetHref(`/${locale}/${s.href}`);
                setOpen(true);
              }
            }}
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <h3 className="font-semibold text-white mb-1">{s.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
          </button>
        ))}
      </section>

      <FunnelModal
        open={open}
        onClose={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          if (targetHref) router.push(targetHref);
        }}
      />
    </>
  );
}
