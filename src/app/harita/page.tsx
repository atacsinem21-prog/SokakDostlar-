import type { Metadata } from "next";

import { AnimalMap } from "@/components/map/animal-map";
import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const haritaUrl = `${getSiteUrl()}/harita`;
const haritaTitle = `Harita — ${BRAND_SITE}`;
const haritaDesc =
  "Sokak hayvanı kayıtlarını haritada gör; yakınındaki bildirimler ve topluluk verisi — PATİSİD İyilik Haritası.";

export const metadata: Metadata = {
  title: haritaTitle,
  description: haritaDesc,
  alternates: { canonical: haritaUrl },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: haritaUrl,
    siteName: BRAND_SITE,
    title: haritaTitle,
    description: haritaDesc,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: haritaTitle,
    description: haritaDesc,
    images: [SEO_OG_IMAGE.url],
  },
};

export default function HaritaPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/** flex-1 + min-h: Leaflet için kesin yükseklik zinciri (üretimde boş beyaz harita önlenir) */}
      <div className="relative flex min-h-[calc(100dvh-5.5rem)] flex-1 flex-col md:min-h-[calc(100dvh-10rem)]">
        <AnimalMap />
      </div>
    </div>
  );
}
