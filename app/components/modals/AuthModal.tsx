"use client";

import { X } from "lucide-react";

export default function AuthModal({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: (provider: "google" | "apple" | "email") => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gold/30 bg-[#140b2e]/70 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.55)] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/10 via-transparent to-black/30" />

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/40 border border-white/15 text-white/80 hover:text-white hover:bg-black/55 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 p-6">
            <div className="text-lg font-semibold text-white">Unlock Your Free Consultation</div>
            <div className="mt-2 text-sm text-white/60">
              Sign in to continue and claim your first chat for free.
            </div>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => onContinue("google")}
                className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold py-3"
              >
                Continue with Google
              </button>
              <button
                onClick={() => onContinue("apple")}
                className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold py-3"
              >
                Continue with Apple
              </button>
              <button
                onClick={() => onContinue("email")}
                className="w-full rounded-xl bg-gold text-black text-sm font-semibold py-3 hover:brightness-105 active:brightness-95"
              >
                Continue with Email
              </button>
            </div>

            <div className="mt-5 text-xs text-white/45">
              Joined by <span className="text-white/70 font-semibold">10,000+</span> users this month.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
