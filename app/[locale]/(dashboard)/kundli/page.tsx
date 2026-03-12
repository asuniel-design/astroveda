import { getTranslations } from "next-intl/server";
import KundliClient from "./ui";

export default async function KundliPage() {
  const t = await getTranslations();

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold text-white">{t("services.kundli_title")}</h1>
      <div className="mt-6">
        <KundliClient />
      </div>
    </div>
  );
}
