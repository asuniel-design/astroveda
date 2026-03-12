"use client";

import FunnelForm, { BirthData } from "./funnel-form";

export default function FunnelModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: (data: BirthData) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <FunnelForm
            onClose={onClose}
            onComplete={(data) => {
              try {
                // Mark user as "logged in" for MVP gating.
                window.localStorage.setItem("userId", "user1");
                window.localStorage.setItem("birthData", JSON.stringify(data));
              } catch {}
              onDone(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
