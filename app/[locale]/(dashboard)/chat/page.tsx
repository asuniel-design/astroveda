import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ChatClient from "./ui";

export default async function ChatPage() {
  const t = await getTranslations();

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold text-white">{t("nav.chat")}</h1>
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
