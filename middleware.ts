import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "./i18n";

// Keep the full locale list for routing, but prioritize these 6 for detection/picker.
const TARGET_LOCALES = ["en", "hi", "te", "ta", "kn", "ml"] as const;

type TargetLocale = (typeof TARGET_LOCALES)[number];

const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: "always",
});

function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
}

function pickPreferredLocale(req: NextRequest): TargetLocale {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();
  if (cookie && (TARGET_LOCALES as readonly string[]).includes(cookie)) return cookie as TargetLocale;

  const tags = parseAcceptLanguage(req.headers.get("accept-language"));
  for (const tag of tags) {
    const base = tag.split("-")[0];
    if ((TARGET_LOCALES as readonly string[]).includes(base)) return base as TargetLocale;
  }

  // Default for global users
  return "en";
}

export default clerkMiddleware((auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Never locale-redirect API routes, but still allow Clerk middleware to run.
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If URL already has a locale prefix, let next-intl handle it.
  const first = pathname.split("/").filter(Boolean)[0];
  const hasLocale = !!first && (locales as readonly string[]).includes(first as any);

  if (!hasLocale) {
    const preferred = pickPreferredLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${preferred}${pathname}`;
    const res = NextResponse.redirect(url);

    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "IN";
    res.cookies.set("av_country", country, { path: "/", sameSite: "lax" });

    return res;
  }

  const res = intlMiddleware(req);

  // Geo hint cookie for client + API routes
  const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "IN";
  try {
    res.cookies.set("av_country", country, { path: "/", sameSite: "lax" });
  } catch {
    // ignore
  }

  return res;
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
