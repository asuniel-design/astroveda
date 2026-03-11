export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export function getZodiacSign(dobISO: string): ZodiacSign | null {
  // dobISO: YYYY-MM-DD
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(dobISO);
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);

  // Western sun sign ranges
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";

  return null;
}

export function zodiacGlow(sign: ZodiacSign | null): { name: string; glow: string } {
  switch (sign) {
    case "Aries":
      return { name: "Aries", glow: "rgba(239,68,68,0.45)" }; // red
    case "Leo":
      return { name: "Leo", glow: "rgba(250,204,21,0.40)" }; // gold
    case "Sagittarius":
      return { name: "Sagittarius", glow: "rgba(249,115,22,0.40)" }; // orange
    case "Cancer":
      return { name: "Cancer", glow: "rgba(96,165,250,0.40)" }; // blue
    case "Scorpio":
      return { name: "Scorpio", glow: "rgba(168,85,247,0.40)" }; // purple
    case "Pisces":
      return { name: "Pisces", glow: "rgba(34,211,238,0.35)" }; // cyan
    default:
      return { name: sign || "Zodiac", glow: "rgba(250,204,21,0.18)" };
  }
}
