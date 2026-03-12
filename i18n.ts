// next-intl routing config
// Locale list: 22 scheduled languages + key dialects (as provided)

export const locales = [
  "en",
  "hi",
  "bn",
  "mr",
  "te",
  "ta",
  "gu",
  "kn",
  "ml",
  "or",
  "pa",
  "as",
  "mai",
  "doi",
  "ks",
  "kok",
  "mni",
  "ne",
  "sa",
  "sat",
  "sd",
  "ur",
  "bho",
  "mwr",
] as const;

export const defaultLocale = "en";

export default {
  locales: [...locales],
  defaultLocale,
  localePrefix: "always" as const,
};
