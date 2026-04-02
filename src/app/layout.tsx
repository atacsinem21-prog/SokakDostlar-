import type { Metadata } from "next";

import { CookieConsent } from "@/components/cookie-consent";
import { ConditionalFooter } from "@/components/conditional-footer";
import { WebsiteJsonLd } from "@/components/seo/website-json-ld";
import { SiteHeader } from "@/components/site-header";
import { BRAND_SITE } from "@/lib/brand";
import {
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_TITLE,
  SEO_KEYWORDS,
  SEO_OG_IMAGE,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SEO_DEFAULT_TITLE,
  description: SEO_DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: BRAND_SITE,
  authors: [{ name: BRAND_SITE }],
  creator: BRAND_SITE,
  publisher: BRAND_SITE,
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: BRAND_SITE,
    title: SEO_DEFAULT_TITLE,
    description: SEO_DEFAULT_DESCRIPTION,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULT_TITLE,
    description: SEO_DEFAULT_DESCRIPTION,
    images: [SEO_OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <WebsiteJsonLd />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <ConditionalFooter />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
