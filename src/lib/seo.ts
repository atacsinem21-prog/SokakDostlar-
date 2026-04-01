import { BRAND_SITE, BRAND_TAGLINE } from "@/lib/brand";

/** Ana sayfa ve varsayılan meta — Sokak hayvanları Türkiye odağı */
export const SEO_DEFAULT_TITLE = `${BRAND_SITE} — ${BRAND_TAGLINE} | İyilik Haritası`;

export const SEO_DEFAULT_DESCRIPTION =
  "Türkiye’de sokak hayvanları için gönüllü iyilik haritası: yakınındaki kayıtlar, görevler ve topluluk. Sokak kedisi ve köpeği için saygılı, güvenli dil; harita ve liderlik.";

export const SEO_KEYWORDS: string[] = [
  "sokak hayvanları",
  "Türkiye sokak hayvanları",
  "sokak kedisi",
  "sokak köpeği",
  "hayvan refahı",
  "gönüllü hayvan yardımı",
  "sokak hayvanları haritası",
  "iyilik haritası",
  "PATİSİD",
  "patili ekle",
  "sokak dostları",
];

/** WebSite JSON-LD `keywords` alanı için (virgülle ayrılmış metin) */
export const SEO_KEYWORDS_STRING = SEO_KEYWORDS.join(", ");
