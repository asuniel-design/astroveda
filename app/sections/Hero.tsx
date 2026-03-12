"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { Button } from "../components/ui/button";
import LanguageSwitcher from "../components/language-switcher";
import FunnelModal from "../components/funnel-modal";

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "hi";
}

const SLIDES = ["s1", "s2", "s3", "s4"] as const;

const HERO_IMAGES: Record<(typeof SLIDES)[number], string> = {
  s1: "/hero/hero-1.jpg",
  s2: "/hero/hero-2.jpg",
  s3: "/hero/hero-3.jpg",
  s4: "/hero/hero-4.jpg",
};

export default function Hero() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  function isAuthed() {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem("userId");
  }

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[idx];

  return (
    <section className="py-10 md:py-16 w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Top row (brand + language) */}
      <div className="w-full mb-8 flex items-start justify-between">
        <div className="text-left">
          <div className="text-sm font-semibold text-white/90 leading-snug">{t("brand.name")}</div>
          <div className="text-xs text-white/50 leading-snug">{t("brand.tagline")}</div>
        </div>
        <div className="w-[180px]">
          <LanguageSwitcher compact />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full">
        <div className="relative min-h-[340px] md:min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left copy */}
                <div className="text-center md:text-left flex flex-col items-center md:items-start">
                  <div className="descender-safe text-xs uppercase tracking-widest text-white/50">
                    {t(`heroCarousel.${slide}.kicker`)}
                  </div>
                  <h1 className="hero-headline pb-1 mt-3 text-4xl md:text-6xl font-bold bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent whitespace-normal break-words text-center md:text-left">
                    {t(`heroCarousel.${slide}.headline`)}
                  </h1>
                  <p className="descender-safe mt-4 text-white/70 max-w-2xl whitespace-normal">
                    {t(`heroCarousel.${slide}.subhead`)}
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <Button
                      className="px-7 sm:px-9 py-4 sm:py-5 text-sm sm:text-base leading-none whitespace-nowrap"
                      onClick={() => {
                        if (isAuthed()) router.push(`/${locale}/chat`);
                        else setOpen(true);
                      }}
                    >
                      {t("hero.cta")}
                    </Button>
                    <div className="descender-safe text-xs text-white/50">
                      {t(`heroCarousel.${slide}.note`)}
                    </div>
                  </div>
                </div>

                {/* Right portrait */}
                <div className="flex justify-center md:justify-end">
                  <div className="relative w-[260px] h-[320px] md:w-[320px] md:h-[360px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-gold/10 via-transparent to-black/40" />
                    <div className="pointer-events-none absolute -bottom-10 -right-10 z-10 w-64 h-64 rounded-full bg-gold/15 blur-2xl" />

                    {/* Portrait */}
                    <Image
                      src={HERO_IMAGES[slide]}
                      alt={t(`heroCarousel.${slide}.headline`)}
                      fill
                      priority={slide === "s1"}
                      sizes="(max-width: 768px) 260px, 320px"
                      className="object-cover z-0"
                    />

                    {/* Verified badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span
                        className="text-[11px] px-3 py-1 rounded-full border"
                        style={{ backgroundColor: "#D4AF37", color: "#311B92", borderColor: "#D4AF37" }}
                      >
                        {t("astroCard.verified")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={
                "h-2 rounded-full transition-all " +
                (i === idx ? "w-8 bg-gold" : "w-2 bg-white/20 hover:bg-white/30")
              }
            />
          ))}
        </div>
      </div>

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
