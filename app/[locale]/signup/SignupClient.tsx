"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AuthModal from "@/components/modals/AuthModal";

function safeCallback(locale: string, raw: string | null) {
  if (!raw) return `/${locale}`;
  // Only allow internal paths
  if (raw.startsWith("/")) return raw;
  return `/${locale}`;
}

export default function SignupClient() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "hi";
  const sp = useSearchParams();

  const callbackUrl = useMemo(() => safeCallback(locale, sp?.get?.("callbackUrl") ?? null), [locale, sp]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, [callbackUrl]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <AuthModal
        open={open}
        onClose={() => {
          setOpen(false);
          router.push(`/${locale}`);
        }}
        onContinue={() => {
          try {
            // MVP sign-in: set a local session marker.
            window.localStorage.setItem("userId", "user1");
            window.localStorage.setItem("isFirstChatFree", "true");
          } catch {}
          router.push(callbackUrl);
        }}
      />
    </div>
  );
}
