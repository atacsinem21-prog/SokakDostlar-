import type { Metadata } from "next";

import { BRAND_SITE } from "@/lib/brand";

const title = `Grup — ${BRAND_SITE}`;

export const metadata: Metadata = {
  title,
  robots: { index: false, follow: true },
};

export default function GrupDetayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
