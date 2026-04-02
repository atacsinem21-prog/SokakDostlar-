import { BRAND_SITE } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  headline: string;
  description: string;
  /** Tam yol, örn. `/rehber/sokak-hayvanlarina-destek` */
  path: string;
  datePublished: string;
  dateModified: string;
};

/** Tekil makale / rehber sayfaları için Article + WebPage referansı */
export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: Props) {
  const base = getSiteUrl();
  const url = `${base}${path}`;

  const article: Record<string, unknown> = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    inLanguage: "tr-TR",
    isAccessibleForFree: true,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: BRAND_SITE,
      url: base,
    },
    publisher: { "@id": `${base}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [article],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
