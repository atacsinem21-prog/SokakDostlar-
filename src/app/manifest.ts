import type { MetadataRoute } from "next";

import { BRAND_SITE } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();
  return {
    name: `${BRAND_SITE} Sokak Dostları`,
    short_name: "PATİSİD",
    description: "Sokak hayvanları için iyilik haritası ve gönüllü topluluk.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#18181b",
    icons: [
      {
        src: `${base}/logo.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

