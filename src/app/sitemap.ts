import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

/** Statik, herkese açık rotalar — arama motorları için */
const paths: string[] = [
  "/",
  "/harita",
  "/harita/patili-ekle",
  "/gorevler",
  "/liderlik",
  "/kanit",
  "/gizlilik",
  "/cerez-politikasi",
  "/hakkinda",
  "/ara",
  "/rehber/sokak-hayvanlarina-destek",
  "/rehber/sokak-hayvanlarina-mama-vermek",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const rehberWeekly = new Set([
    "/rehber/sokak-hayvanlarina-destek",
    "/rehber/sokak-hayvanlarina-mama-vermek",
  ]);

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || rehberWeekly.has(path) ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : rehberWeekly.has(path)
          ? 0.85
          : 0.7,
  }));
}
