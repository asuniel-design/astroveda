"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  PhoneCall,
  Sparkles,
  HeartHandshake,
  Sun,
  Wand2,
} from "lucide-react";
import WalletBalance from "./wallet-balance";
import { cn } from "../utils/cn";

const NAV = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/talk", label: "Talk", icon: PhoneCall },
  { href: "/kundli", label: "Free Kundli", icon: Sparkles },
  { href: "/matching", label: "Matching", icon: HeartHandshake },
  { href: "/horoscope", label: "Daily Horoscope", icon: Sun },
  { href: "/tarot", label: "Tarot", icon: Wand2 },
] as const;

export default function Sidebar() {
  const pathname = usePathname() || "";

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-[260px] border-r border-white/10 bg-white/5 backdrop-blur-md">
      <div className="h-full flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="text-sm font-semibold text-white/90">AstroVeda</div>
          <div className="text-xs text-white/50">Connect</div>
          <div className="mt-4">
            <WalletBalance />
          </div>
        </div>

        <nav className="p-3 flex-1 overflow-auto flex flex-col gap-2">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 text-[11px] text-white/40">
          © {new Date().getFullYear()} AstroVeda
        </div>
      </div>
    </aside>
  );
}
