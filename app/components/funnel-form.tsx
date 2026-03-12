"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export type BirthData = {
  dob: string; // YYYY-MM-DD
  time: string; // HH:mm
  city: string;
};

export default function FunnelForm({
  onComplete,
  onClose,
}: {
  onComplete: (data: BirthData) => void;
  onClose?: () => void;
}) {
  const t = useTranslations();

  const steps = [
    {
      key: "dob",
      label: t("funnel.labels.dob"),
      placeholder: t("funnel.placeholders.dob"),
    },
    {
      key: "time",
      label: t("funnel.labels.time"),
      placeholder: t("funnel.placeholders.time"),
    },
    {
      key: "city",
      label: t("funnel.labels.city"),
      placeholder: t("funnel.placeholders.city"),
    },
    { key: "confirm", label: t("funnel.labels.confirm"), placeholder: "" },
    { key: "save", label: t("funnel.labels.save"), placeholder: "" },
    { key: "done", label: t("funnel.labels.done"), placeholder: "" },
  ] as const;

  const [i, setI] = useState(0);
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");

  const step = steps[i];

  function reset() {
    setI(0);
    setDob("");
    setTime("");
    setCity("");
  }

  function next() {
    setI((x) => Math.min(x + 1, steps.length - 1));
  }
  function back() {
    setI((x) => Math.max(x - 1, 0));
  }

  const canNext =
    (step.key === "dob" && !!dob) ||
    (step.key === "time" && !!time) ||
    (step.key === "city" && !!city) ||
    step.key === "confirm" ||
    step.key === "save" ||
    step.key === "done";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 relative">
      {onClose && (
        <button
          type="button"
          aria-label={t("ui.close")}
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 border border-white/15 text-white/80 hover:text-white hover:bg-black/50 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center justify-between pr-12">
        <div className="text-sm font-semibold text-white">{t("funnel.title")}</div>
        <div className="text-xs text-white/50">{t("funnel.step", { current: i + 1, total: 6 })}</div>
      </div>

      <div className="mt-4">
        <div className="text-white font-semibold">{step.label}</div>
        <div className="text-sm text-white/60 mt-1">
          {step.key === "confirm" && t("funnel.help.confirm")}
          {step.key === "save" && t("funnel.help.save")}
          {step.key === "done" && t("funnel.help.done")}
        </div>

        {step.key === "dob" && (
          <input
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder={step.placeholder}
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 text-center outline-none focus:ring-2 focus:ring-gold/40"
          />
        )}
        {step.key === "time" && (
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder={step.placeholder}
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 text-center outline-none focus:ring-2 focus:ring-gold/40"
          />
        )}
        {step.key === "city" && (
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={step.placeholder}
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 text-center outline-none focus:ring-2 focus:ring-gold/40"
          />
        )}

        {(step.key === "confirm" || step.key === "save" || step.key === "done") && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
            <div>
              <span className="text-white/50">{t("funnel.fields.dob")}: </span>
              {dob || "—"}
            </div>
            <div>
              <span className="text-white/50">{t("funnel.fields.time")}: </span>
              {time || "—"}
            </div>
            <div>
              <span className="text-white/50">{t("funnel.fields.city")}: </span>
              {city || "—"}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={back}
          disabled={i === 0}
          className="px-3 py-2 rounded-xl text-xs border border-white/10 bg-white/5 text-white/70 disabled:opacity-40"
        >
          {t("funnel.buttons.back")}
        </button>

        <button
          onClick={() => {
            if (step.key === "save") {
              const data = { dob, time, city };
              try {
                window.localStorage.setItem("birthData", JSON.stringify(data));
              } catch {}
              onComplete(data);
              next();
              return;
            }
            if (step.key === "done") {
              onComplete({ dob, time, city });
              return;
            }
            next();
          }}
          disabled={!canNext}
          className="px-4 py-2 rounded-xl bg-gold text-black text-xs font-semibold disabled:opacity-60"
        >
          {step.key === "save"
            ? t("funnel.buttons.saveContinue")
            : step.key === "done"
              ? t("funnel.buttons.finish")
              : t("funnel.buttons.continue")}
        </button>
      </div>
    </div>
  );
}
