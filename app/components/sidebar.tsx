"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  MessageCircle,
  PhoneCall,
  Sparkles,
  HeartHandshake,
  Sun,
  Wand2,
} from "lucide-react";
import WalletBalance from "./wallet-balance";
import LanguageSwitcher from "./language-switcher";
import ReactivePortrait from "./reactive-portrait";
import { cn } from "../utils/cn";

const NAV = [
  { href: "/chat", labelKey: "nav.chat", icon: MessageCircle },
  { href: "/talk", labelKey: "nav.talk", icon: PhoneCall },
  { href: "/kundli", labelKey: "nav.kundli", icon: Sparkles },
  { href: "/matching", labelKey: "nav.matching", icon: HeartHandshake },
  { href: "/horoscope", labelKey: "nav.horoscope", icon: Sun },
  { href: "/tarot", labelKey: "nav.tarot", icon: Wand2 },
  { href: "/services", labelKey: "nav.services", icon: Sparkles },
] as const;

export default function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname() || "";
  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0] || "hi";
  const pathNoLocale = "/" + parts.slice(1).join("/");

  let dob: string | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("birthData");
      const parsed = raw ? JSON.parse(raw) : null;
      dob = parsed?.dob || null;
    } catch {
      dob = null;
    }
  }

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-[260px] border-r border-white/10 bg-white/5 backdrop-blur-md">
      <div className="h-full flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ReactivePortrait dob={dob} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white/90 truncate">{t("profile.guestName")}</div>
              <div className="text-xs text-white/50 truncate">{t("profile.greeting")}</div>
            </div>
          </div>

          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>

        <nav className="p-3 flex-1 overflow-auto flex flex-col gap-2">
          {NAV.map((item) => {
            const href = `/${locale}${item.href}`;
            const active = pathNoLocale === item.href || pathNoLocale.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition",
                  active && "bg-white/5 text-white"
                )}
              >
                {/* Active gold bar */}
                <span
                  className={cn(
                    "absolute left-0 top-2 bottom-2 w-1 rounded-r bg-gold opacity-0",
                    active && "opacity-100"
                  )}
                />
                <Icon className={cn("h-4 w-4", active ? "text-gold" : "text-white/70 group-hover:text-white")} />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <WalletBalance />
          <div className="mt-4 text-[11px] text-white/40">© {new Date().getFullYear()} AstroVeda</div>
        </div>
      </div>
    </aside>
  );
}
