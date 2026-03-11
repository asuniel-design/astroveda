"use client";

import { useMemo, useState } from "react";

export type BirthData = {
  dob: string; // YYYY-MM-DD
  time: string; // HH:mm
  city: string;
};

export default function FunnelForm({
  onComplete,
}: {
  onComplete: (data: BirthData) => void;
}) {
  const steps = useMemo(
    () => [
      { key: "dob", label: "Date of Birth", placeholder: "YYYY-MM-DD" },
      { key: "time", label: "Time of Birth", placeholder: "HH:MM" },
      { key: "city", label: "Birth City", placeholder: "e.g., Chennai" },
      { key: "confirm", label: "Confirm", placeholder: "" },
      { key: "save", label: "Save", placeholder: "" },
      { key: "done", label: "Done", placeholder: "" },
    ],
    []
  );

  const [i, setI] = useState(0);
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");

  const step = steps[i];

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
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white">Quick Setup</div>
        <div className="text-xs text-white/50">Step {i + 1} / 6</div>
      </div>

      <div className="mt-4">
        <div className="text-white font-semibold">{step.label}</div>
        <div className="text-sm text-white/60 mt-1">
          {step.key === "confirm" && "Review your details before we generate your results."}
          {step.key === "save" && "We’ll store this for auto-fill next time."}
          {step.key === "done" && "Setup complete."}
        </div>

        {step.key === "dob" && (
          <input
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder={step.placeholder}
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-gold/40"
          />
        )}
        {step.key === "time" && (
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder={step.placeholder}
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-gold/40"
          />
        )}
        {step.key === "city" && (
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={step.placeholder}
            className="mt-3 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-gold/40"
          />
        )}

        {(step.key === "confirm" || step.key === "save" || step.key === "done") && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
            <div><span className="text-white/50">DOB:</span> {dob || "—"}</div>
            <div><span className="text-white/50">Time:</span> {time || "—"}</div>
            <div><span className="text-white/50">City:</span> {city || "—"}</div>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={back}
          disabled={i === 0}
          className="px-3 py-2 rounded-xl text-xs border border-white/10 bg-white/5 text-white/70 disabled:opacity-40"
        >
          Back
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
          {step.key === "save" ? "Save & Continue" : step.key === "done" ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
