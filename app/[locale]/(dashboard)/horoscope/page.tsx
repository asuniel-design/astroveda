import { getTranslations } from "next-intl/server";
import HoroscopeClient from "./ui";

export default async function HoroscopePage() {
  const t = await getTranslations();

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold text-white">{t("services.dailyHoroscope_title")}</h1>
      <div className="mt-6">
        <HoroscopeClient />
      </div>
    </div>
  );
}
