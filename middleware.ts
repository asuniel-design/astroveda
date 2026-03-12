import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "./i18n";

const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  // Geo hint cookie for client + API routes (fixes cases where x-vercel-ip-country is missing downstream)
  const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "IN";
  try {
    res.cookies.set("av_country", country, { path: "/", sameSite: "lax" });
  } catch {
    // ignore cookie set failures
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
