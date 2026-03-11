import { Suspense } from "react";
import ChatClient from "./ui";

export default function ChatPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold text-white">Chat</h1>
      <p className="text-sm text-white/60 mt-1">MVP chat flow (soft launch)</p>
      <div className="mt-6">
        <div className="max-w-3xl mx-auto">
          <Suspense fallback={<div className="card p-6 animate-pulse h-[320px]" />}>
            <ChatClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
