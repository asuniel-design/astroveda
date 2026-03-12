"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

function safeCallback(locale: string, raw: string | null) {
  if (!raw) return `/${locale}`;
  if (raw.startsWith("/")) return raw;
  return `/${locale}`;
}

export default function SignupClient() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const sp = useSearchParams();

  const callbackUrl = useMemo(() => safeCallback(locale, sp?.get?.("callbackUrl") ?? null), [locale, sp]);
  const absRedirect = useMemo(() => {
    if (typeof window === "undefined") return callbackUrl;
    try {
      return new URL(callbackUrl, window.location.origin).toString();
    } catch {
      return callbackUrl;
    }
  }, [callbackUrl]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="rounded-3xl border border-gold/25 bg-[#140b2e]/30 backdrop-blur-xl p-3 shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
        <SignIn
          forceRedirectUrl={absRedirect}
          signUpForceRedirectUrl={absRedirect}
          appearance={{
            variables: {
              colorPrimary: "#FFD700",
              colorText: "#FFFFFF",
              colorBackground: "#140b2e",
            },
            elements: {
              card: "bg-transparent shadow-none border-0",
              headerTitle: "text-white",
              headerSubtitle: "text-white/60",
              formButtonPrimary: "bg-gold text-black hover:brightness-105",
            },
          }}
        />
      </div>
    </div>
  );
}
