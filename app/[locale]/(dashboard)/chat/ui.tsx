"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatClient() {
  const sp = useSearchParams();
  const { isSignedIn, user } = useUser();
  const astroId = sp?.get("astroId") || null;
  const astroName = sp?.get("astroName") || null;

  const header = useMemo(() => {
    if (!astroId) return "General Support";
    return astroName ? `Chat with ${astroName}` : `Chat with Astrologer`;
  }, [astroId, astroName]);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Namaste — this is the soft-launch chat. Ask your question and I’ll respond.",
    },
  ]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  // Redeem free chat once per Clerk user (server-enforced)
  useEffect(() => {
    (async () => {
      try {
        if (!isSignedIn || !user?.id) return;
        const already = window.localStorage.getItem("freeChatRedeemed") === "true";
        if (already) return;

        const res = await fetch("/api/freechat/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data?.ok) {
          window.localStorage.setItem("freeChatRedeemed", "true");
          if (data.alreadyUsed) {
            setMessages((m) => [
              ...m,
              { role: "assistant", text: "Note: Your free chat has already been used." },
            ]);
          } else {
            setMessages((m) => [
              ...m,
              { role: "assistant", text: "✅ Free chat unlocked. You can start your consultation." },
            ]);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, [isSignedIn, user?.id]);

  async function send() {
    const t = text.trim();
    if (!t || sending) return;
    setText("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t, astroId }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply || "…" }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Network error. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">{header}</div>
          <div className="text-xs text-white/50">Session: MVP</div>
        </div>
        <div className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          ONLINE
        </div>
      </div>

      <div className="p-6 md:p-8 h-[56vh] overflow-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl bg-gold text-black px-4 py-3 text-sm leading-relaxed"
                : "mr-auto max-w-[85%] rounded-2xl bg-white/5 border border-white/10 text-white px-4 py-3 text-sm leading-relaxed"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-white/10 flex gap-3 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Type your message..."
          className="flex-1 h-12 rounded-full bg-white/5 border border-white/10 px-5 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-gold/40"
        />
        <button
          onClick={send}
          disabled={sending}
          className="h-12 px-6 rounded-full bg-gold text-black text-sm font-semibold disabled:opacity-60 shadow-[0_10px_28px_rgba(250,204,21,0.22)]"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
