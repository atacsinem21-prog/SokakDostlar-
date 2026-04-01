import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

/** Statik, herkese açık rotalar — arama motorları için */
const paths: string[] = [
  "/",
  "/giris",
  "/kayit",
  "/harita",
  "/harita/patili-ekle",
  "/gorevler",
  "/liderlik",
  "/kanit",
  "/gizlilik",
  "/cerez-politikasi",
  "/ara",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
