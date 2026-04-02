import type { Metadata } from "next";

import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const url = `${getSiteUrl()}/gorevler`;
const title = `Görevler — ${BRAND_SITE}`;
const description =
  "İyilik odaklı görevleri tamamla, topluluğa katıl — PATİSİD İyilik Haritası gönüllü akışı.";

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

export default function GorevlerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
