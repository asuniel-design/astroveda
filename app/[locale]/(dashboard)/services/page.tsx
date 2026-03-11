import { headers } from "next/headers";

export default function PriestServicesPage() {
  const h = headers();
  const country = h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || "IN";
  const isUSA = country === "US";

  const kits = isUSA
    ? {
        currency: "USD",
        note: "USA packages (Virtual/In-person)",
        packages: [
          { title: "Virtual Puja", price: 49, mode: "Video", samagri: ["Aluminum tray", "Quarters", "Incense"] },
          { title: "In-person Blessing", price: 149, mode: "In-person", samagri: ["Aluminum tray", "Quarters", "Flowers"] },
        ],
      }
    : {
        currency: "INR",
        note: "India packages (Temple-based)",
        packages: [
          { title: "Temple Puja", price: 999, mode: "Temple", samagri: ["Mango wood", "Herbs", "Ghee diya"] },
          { title: "Home Ritual", price: 1499, mode: "Home", samagri: ["Mango wood", "Herbs", "Kumkum"] },
        ],
      };

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Priest Services</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          Book priests, choose geo-smart kits, and manage bookings. Detected region: <span className="text-white/70">{country}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-8 rounded-2xl">
          <div className="text-white font-semibold">Priest Marketplace</div>
          <p className="text-sm text-white/60 leading-relaxed mt-2">
            Browse verified priests for puja bookings (MVP grid coming next).
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {[
              { title: "Griha Pravesh", desc: "Home entry ceremony" },
              { title: "Marriage Puja", desc: "Sacred wedding rituals" },
              { title: "Navagraha Shanti", desc: "Balance planetary energies" },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-white font-semibold">{s.title}</div>
                <div className="text-sm text-white/60 leading-relaxed mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8 rounded-2xl lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-white font-semibold">Geo-Smart Kits</div>
              <div className="text-sm text-white/60 leading-relaxed mt-1">{kits.note}</div>
            </div>
            <div className="text-xs text-white/50">{kits.currency}</div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {kits.packages.map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold">{p.title}</div>
                  <div className="text-gold font-semibold">{kits.currency} {p.price}</div>
                </div>
                <div className="text-sm text-white/60 mt-2">Mode: {p.mode}</div>
                <div className="mt-3 text-xs text-white/50">Samagri</div>
                <ul className="mt-2 text-sm text-white/70 leading-relaxed list-disc pl-5">
                  {p.samagri.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                {isUSA && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/50">Virtual Link (placeholder)</div>
                    <div className="text-sm text-white/80 mt-1">https://meet.astroveda.app/{Math.random().toString(36).slice(2, 10)}</div>
                  </div>
                )}

                <button className="mt-6 w-full rounded-full bg-gold text-black text-sm font-semibold py-3 shadow-[0_10px_28px_rgba(250,204,21,0.22)]">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
