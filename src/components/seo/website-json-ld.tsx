import {
  BRAND_SITE,
  SITE_CONTACT_EMAIL,
  SITE_FOUNDING_YEAR,
  SITE_SAME_AS_DEFAULT,
  SITE_SEARCH_PATH,
} from "@/lib/brand";
import { SEO_DEFAULT_DESCRIPTION, SEO_KEYWORDS_STRING } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

function getSameAsUrls(): string[] {
  const raw = process.env.NEXT_PUBLIC_SOCIAL_PROFILES?.trim();
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [...SITE_SAME_AS_DEFAULT];
}

/** WebSite + NGO — SearchAction, logo, sameAs, ContactPoint, foundingDate */
export function WebsiteJsonLd() {
  const url = getSiteUrl();
  const logoUrl = `${url}/logo.svg`;
  const sameAs = getSameAsUrls();
  const searchTarget = `${url}${SITE_SEARCH_PATH}?q={search_term_string}`;

  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: BRAND_SITE,
    alternateName: [
      "Patisid",
      "PATİSİD Sokak Dostları",
      "Patisid İyilik Haritası",
    ],
    description: SEO_DEFAULT_DESCRIPTION,
    inLanguage: "tr-TR",
    keywords: SEO_KEYWORDS_STRING,
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchTarget,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization: Record<string, unknown> = {
    "@type": "NGO",
    "@id": `${url}/#organization`,
    name: BRAND_SITE,
    alternateName: ["Patisid", "PATİSİD Sokak Dostları"],
    url,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      contentUrl: logoUrl,
    },
    description:
      "Türkiye’de sokak hayvanları için gönüllü iyilik ve harita topluluğu; kâr amacı gütmeyen dijital dayanışma platformu.",
    areaServed: { "@type": "Country", name: "Türkiye" },
    foundingDate: `${SITE_FOUNDING_YEAR}-01-01`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE_CONTACT_EMAIL,
      availableLanguage: ["Turkish", "tr"],
    },
  };

  if (sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  const data = {
    "@context": "https://schema.org",
    "@graph": [website, organization],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
