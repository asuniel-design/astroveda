"use client";

import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import FunnelForm, { BirthData } from "./funnel-form";
import { fetchJSON } from "@/lib/api";

function getUserId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("userId");
}

function getLocalBirthData(): BirthData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("birthData");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.dob && parsed?.time && parsed?.city) return parsed;
    return null;
  } catch {
    return null;
  }
}

export default function BirthDataGate({
  children,
}: {
  children: (data: BirthData) => React.ReactNode;
}) {
  const userId = getUserId();

  const { data: userData } = useSWR(
    userId ? `/api/user/birthdata?userId=${encodeURIComponent(userId)}` : null,
    fetchJSON,
    { revalidateOnFocus: false }
  );

  const [local, setLocal] = useState<BirthData | null>(null);

  useEffect(() => {
    setLocal(getLocalBirthData());
  }, []);

  const resolved: BirthData | null = useMemo(() => {
    const d = userData?.birthData;
    if (d?.dob && d?.time && d?.city) return d;
    if (local?.dob && local?.time && local?.city) return local;
    return null;
  }, [userData, local]);

  if (!resolved) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Tell us your birth details</h2>
          <p className="text-sm text-white/60">We’ll auto-fill Kundli and Horoscope from your profile when logged in.</p>
        </div>
        <FunnelForm
          onComplete={(d) => {
            setLocal(d);
          }}
        />
      </div>
    );
  }

  return <>{children(resolved)}</>;
}
