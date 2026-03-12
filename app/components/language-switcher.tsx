"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

const LANGS: Array<{ code: string; label: string; flag: string; menuLineHeight?: string }> = [
  { code: "en", label: "English (US)", flag: "🇺🇸" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳", menuLineHeight: "1.6" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳", menuLineHeight: "1.6" },
];

function getCurrentLocale(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "en";
}

function setNextLocaleCookie(code: string) {
  try {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `NEXT_LOCALE=${code}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } catch {}
}

export default function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const current = getCurrentLocale(pathname);

  const currentLabel = useMemo(() => LANGS.find((l) => l.code === current)?.label || "English (US)", [current]);
  const currentFlag = useMemo(() => LANGS.find((l) => l.code === current)?.flag || "🇺🇸", [current]);

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function navigateTo(next: string) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) {
      router.push(`/${next}`);
      return;
    }
    parts[0] = next;
    router.push(`/${parts.join("/")}`);
  }

  return (
    <div className={compact ? "" : "w-full"} ref={wrapRef}>
      {!compact && <div className="text-[11px] text-white/50 mb-2">{t("ui.language")}</div>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          "w-full rounded-3xl bg-white/5 border border-white/10 px-4 py-3 text-xs text-white/85 outline-none " +
          "shadow-[0_16px_45px_rgba(0,0,0,0.45)] hover:bg-white/10 transition flex items-center justify-between"
        }
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-base">{currentFlag}</span>
          <span className="truncate">{currentLabel}</span>
        </span>
        <ChevronDown className={"w-4 h-4 text-white/60 transition " + (open ? "rotate-180" : "")} />
      </button>

      {open && (
        <div className="mt-2 rounded-3xl border border-gold/25 bg-[#140b2e]/75 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.65)] overflow-hidden">
          <div className="p-2">
            {LANGS.map((l) => {
              const active = l.code === current;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setNextLocaleCookie(l.code);
                    setOpen(false);
                    navigateTo(l.code);
                  }}
                  className={
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition " +
                    (active
                      ? "bg-gold text-[#311B92]"
                      : "bg-transparent text-white/85 hover:bg-white/10")
                  }
                >
                  <span className="text-lg">{l.flag}</span>
                  <span className="text-sm" style={l.menuLineHeight ? { lineHeight: l.menuLineHeight } : undefined}>
                    {l.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
