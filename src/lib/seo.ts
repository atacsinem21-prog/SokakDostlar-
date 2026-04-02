import { BRAND_SITE, BRAND_TAGLINE } from "@/lib/brand";

/** Ana sayfa ve varsayılan meta — Sokak hayvanları Türkiye odağı */
export const SEO_DEFAULT_TITLE = `${BRAND_SITE} — ${BRAND_TAGLINE} | İyilik Haritası`;

export const SEO_DEFAULT_DESCRIPTION =
  "Türkiye’de sokak hayvanları için gönüllü iyilik haritası: yakınındaki kayıtlar, görevler ve topluluk. Sokak kedisi ve köpeği için saygılı, güvenli dil; harita ve liderlik.";

/** Ana sayfa — arama sonuçlarında net ayrışan başlık */
export const SEO_HOME_TITLE = `İyilik Haritası — ${BRAND_SITE} | Sokak hayvanları, görevler ve topluluk`;

export const SEO_HOME_DESCRIPTION =
  "Yakınındaki sokak hayvanı kayıtları, harita, görevler ve topluluk — PATİSİD ile Türkiye’de gönüllü iyilik haritasına katıl.";

/** opengraph-image.tsx / twitter-image ile uyumlu paylaşım görseli */
export const SEO_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${BRAND_SITE} — ${BRAND_TAGLINE} · İyilik Haritası`,
} as const;

export const SEO_KEYWORDS: string[] = [
  "sokak dostları",
  "sokak hayvanları",
  "sokak kedisi",
  "sokak köpeği",
  "sokak hayvanlarına destek",
  "sokak hayvanlarına destek vermek",
  "Türkiye sokak hayvanları",
  "gönüllü hayvan yardımı",
  "gönüllü sokak hayvanı yardımı",
  "sokak hayvanları haritası",
  "iyilik haritası",
  "PATİSİD",
  "patili ekle",
  "hayvan refahı",
  "sokak hayvanlarına mama vermek",
  "sokak köpeği mama",
  "sokak kedisi mama",
];

/** WebSite JSON-LD `keywords` alanı için (virgülle ayrılmış metin) */
export const SEO_KEYWORDS_STRING = SEO_KEYWORDS.join(", ");
