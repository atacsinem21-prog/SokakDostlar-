import { headers } from "next/headers";

import { SITE_URL_DEFAULT } from "@/lib/brand";

/** Tekil kanonik site adresi — SEO, robots, sitemap, metadataBase */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT;
  return raw.replace(/\/+$/, "");
}

/**
 * Gelen HTTP isteğine göre origin — sunucuda kendi `/api` route’una fetch atarken kullan.
 * Böylece `NEXT_PUBLIC_SITE_URL=https://patisid.app` iken bile yerelde istek `localhost`a gider.
 */
export async function getServerRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return getSiteUrl();
}
