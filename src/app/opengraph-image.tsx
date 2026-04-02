import { ImageResponse } from "next/og";

import { BRAND_PRODUCT, BRAND_SITE, BRAND_TAGLINE } from "@/lib/brand";

export const runtime = "edge";

export const alt = `${BRAND_SITE} — ${BRAND_TAGLINE} · ${BRAND_PRODUCT}`;

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fafaf9 0%, #fef3c7 42%, #e7e5e4 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 12,
              height: 56,
              borderRadius: 8,
              background: "#d97706",
              marginRight: 16,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              color: "#18181b",
            }}
          >
            {BRAND_SITE}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 600,
            color: "#3f3f46",
            marginBottom: 12,
          }}
        >
          {BRAND_TAGLINE} · {BRAND_PRODUCT}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            lineHeight: 1.35,
            color: "#57534e",
            maxWidth: 920,
          }}
        >
          Türkiye&apos;de sokak hayvanları için gönüllü harita, görevler ve topluluk
        </div>
      </div>
    ),
    { ...size },
  );
}
