import type { Metadata } from "next";

import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const url = `${getSiteUrl()}/kayit`;
const title = `Kayıt ol — ${BRAND_SITE}`;
const description = "Hesap oluştur, iyilik görevleri ve topluluk özelliklerine katıl.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: { index: false, follow: true },
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

export default function KayitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
