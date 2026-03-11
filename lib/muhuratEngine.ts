import type { BirthData } from "@/components/funnel-form";

export type MuhuratSuggestion = {
  dateISO: string;
  label: string;
  score: number;
};

// MVP muhurat engine: deterministic upcoming suggestions.
// Replace with real panchang logic later.
export function suggestMarriageMuhurat(_birth: BirthData | null): MuhuratSuggestion[] {
  const now = new Date();
  const out: MuhuratSuggestion[] = [];

  // Pick next 3 Fridays as placeholder "auspicious" days
  let d = new Date(now);
  for (let i = 0; i < 60 && out.length < 3; i++) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 5) {
      const iso = d.toISOString().slice(0, 10);
      out.push({
        dateISO: iso,
        label: `Auspicious Window • ${iso}`,
        score: 90 - out.length * 5
      });
    }
  }

  return out;
}
