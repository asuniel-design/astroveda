"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import FunnelModal from "../components/funnel-modal";

const items = [
  { icon: "🌟", titleKey: "services.dailyHoroscope_title", descKey: "services.dailyHoroscope_desc", href: "horoscope" },
  { icon: "📜", titleKey: "services.kundli_title", descKey: "services.kundli_desc", href: "kundli" },
  { icon: "💑", titleKey: "services.matching_title", descKey: "services.matching_desc", href: "matching" },
  { icon: "🎴", titleKey: "services.tarot_title", descKey: "services.tarot_desc", href: "tarot" },
];

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "hi";
}

export default function Services() {
  const t = useTranslations();
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
            key={s.titleKey}
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
            <h3 className="font-semibold text-white mb-1">{t(s.titleKey)}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{t(s.descKey)}</p>
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
