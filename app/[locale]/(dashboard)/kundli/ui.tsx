"use client";

import useSWR from "swr";
import { useLocale } from "next-intl";
import BirthDataGate from "@/components/birthdata-gate";
import { fetchJSON } from "@/lib/api";

export default function KundliClient() {
  const locale = useLocale();
  return (
    <BirthDataGate>
      {(birth) => {
        const qs = new URLSearchParams({ ...(birth as any), locale } as any).toString();
        const { data, isLoading, error } = useSWR(`/api/astro/kundli?${qs}`, fetchJSON, {
          revalidateOnFocus: false,
        });

        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-sm text-white/80">
              Using: <span className="text-white/60">{birth.dob}</span> • <span className="text-white/60">{birth.time}</span> • <span className="text-white/60">{birth.city}</span>
            </div>

            {isLoading && <div className="card p-6 animate-pulse h-[220px]" />}
            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-100">
                Failed to generate Kundli.
              </div>
            )}

            {data && (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
                <div className="text-white font-semibold">Kundli Snapshot</div>
                <pre className="mt-3 text-xs text-white/70 overflow-auto whitespace-pre-wrap">
{JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      }}
    </BirthDataGate>
  );
}
