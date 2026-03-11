import KundliClient from "./ui";

export default function KundliPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold text-white">Free Kundli</h1>
      <p className="text-sm text-white/60 mt-1">Auto-fills from your profile if logged in.</p>
      <div className="mt-6">
        <KundliClient />
      </div>
    </div>
  );
}
