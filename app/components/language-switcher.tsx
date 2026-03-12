"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const LANGS: Array<{ code: string; label: string }> = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "as", label: "অসমীয়া" },
  { code: "mai", label: "मैथिली" },
  { code: "doi", label: "डोगरी" },
  { code: "ks", label: "کٲشُر" },
  { code: "kok", label: "कोंकणी" },
  { code: "mni", label: "মৈতৈলোন্" },
  { code: "ne", label: "नेपाली" },
  { code: "sa", label: "संस्कृतम्" },
  { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "sd", label: "سنڌي" },
  { code: "ur", label: "اردو" },
  { code: "bho", label: "भोजपुरी" },
  { code: "mwr", label: "मारवाड़ी" },
];

function getCurrentLocale(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "hi";
}

export default function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const current = getCurrentLocale(pathname);

  return (
    <div className={compact ? "" : "w-full"}>
      <div className={compact ? "text-[11px] text-white/50 mb-1" : "text-[11px] text-white/50 mb-2"}>
        {t("ui.language")}
      </div>
      <select
        value={current}
        onChange={(e) => {
          const next = e.target.value;
          const parts = pathname.split("/").filter(Boolean);
          // If no locale yet, prepend. If present, replace first segment.
          if (parts.length === 0) {
            router.push(`/${next}`);
            return;
          }
          parts[0] = next;
          router.push(`/${parts.join("/")}`);
        }}
        className={
          "w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/80 outline-none focus:ring-2 focus:ring-gold/30"
        }
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
