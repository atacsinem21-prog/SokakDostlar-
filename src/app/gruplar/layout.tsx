import type { Metadata } from "next";

import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const url = `${getSiteUrl()}/gruplar`;
const title = `Mahalle grupları — ${BRAND_SITE}`;
const description =
  "Mahalle gönüllü grupları: grup oluştur, katıl ve birlikte yardım planla.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url,
    siteName: BRAND_SITE,
    title,
    description,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [SEO_OG_IMAGE.url],
  },
};

export default function GruplarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

