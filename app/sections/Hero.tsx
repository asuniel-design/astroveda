"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "../components/ui/button";
import LanguageSwitcher from "../components/language-switcher";
import FunnelModal from "../components/funnel-modal";

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "hi";
}

export default function Hero() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);

  const [open, setOpen] = useState(false);

  function isAuthed() {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem("userId");
  }

  return (
    <section className="text-center py-12 md:py-20">
      <div className="flex items-center justify-between mb-10">
        <div className="text-left">
          <div className="text-sm font-semibold text-white/90">{t("brand.name")}</div>
          <div className="text-xs text-white/50">{t("brand.tagline")}</div>
        </div>
        <div className="w-[180px]">
          <LanguageSwitcher compact />
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent leading-tight">
        {t("hero.headlineA")}<br />
        {t("hero.headlineB")}
      </h1>
      <p className="text-white/70 max-w-2xl mx-auto mb-8">{t("hero.subtitle")}</p>

      <Button
        className="px-8 py-4 text-base"
        onClick={() => {
          if (isAuthed()) {
            router.push(`/${locale}/chat`);
          } else {
            setOpen(true);
          }
        }}
      >
        {t("hero.cta")}
      </Button>

      <FunnelModal
        open={open}
        onClose={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          router.push(`/${locale}/chat`);
        }}
      />
    </section>
  );
}
