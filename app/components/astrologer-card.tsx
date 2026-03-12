"use client";
import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';

type Props = {
  astro: any;
};

export default function AstrologerCard({ astro }: Props) {
  const t = useTranslations();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const sp = useSearchParams();

  const online = astro.is_online;

  const locale = pathname.split("/").filter(Boolean)[0] || "hi";

  function isAuthed() {
    return !!isSignedIn;
  }
  function hasBirthData() {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem("birthData");
  }
  function buildCallbackUrl(nextPath: string) {
    const p = new URLSearchParams(sp?.toString?.() || "");
    p.set("showModal", "true");
    p.set("next", nextPath);
    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <motion.div whileHover={{ y: -4 }} className="card p-4 flex flex-col gap-3 w-full max-w-[420px]">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/25 to-gold/10 flex items-center justify-center text-lg font-bold text-gold border border-gold/20">
          {astro.name?.[0] || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white truncate">{astro.name}</h4>
            {astro.is_verified && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: "#D4AF37", color: "#311B92", borderColor: "#D4AF37" }}
              >
                {t("astroCard.verified")}
              </span>
            )}
          </div>
          <div className="text-xs text-white/60 flex items-center gap-2">
            <span>★ {astro.rating?.toFixed?.(1) || '5.0'}</span>
            <span className="text-white/30">•</span>
            <span>{astro.languages?.join(' · ')}</span>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${online ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/50 border-white/10'}`}>{online ? t('astroCard.online') : t('astroCard.offline')}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {(astro.expertise || []).slice(0,3).map((tag: string) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">{tag}</span>
        ))}
      </div>
      <div className="mt-auto flex gap-2">
        <button
          onClick={() => {
            const chatPath = `/${locale}/chat?astroId=${encodeURIComponent(astro.id)}&astroName=${encodeURIComponent(astro.name || "")}`;

            if (!isAuthed()) {
              const callbackUrl = buildCallbackUrl(chatPath);
              router.push(`/${locale}/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
              return;
            }

            if (!hasBirthData()) {
              router.push(buildCallbackUrl(chatPath));
              return;
            }

            router.push(chatPath);
          }}
          className="btn-primary w-full text-center"
        >
          💬 {t('astroCard.chatNow')}
        </button>
        <a
          href="talk"
          className="glass w-11 rounded-xl border border-white/10 flex items-center justify-center"
          aria-label={t('nav.talk')}
        >
          <PhoneCall className="w-4 h-4 text-white" />
        </a>
      </div>
    </motion.div>
  );
}
