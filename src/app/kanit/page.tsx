import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const kanitUrl = `${getSiteUrl()}/kanit`;
const kanitTitle = `İyilik kanıtı — ${BRAND_SITE}`;
const kanitDesc =
  "PATİSİD’de puan ve görevler: fotoğraf zorunluluğu yok; iyilik onur ve merhamete dayanır.";

export const metadata: Metadata = {
  title: kanitTitle,
  description: kanitDesc,
  alternates: { canonical: kanitUrl },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: kanitUrl,
    siteName: BRAND_SITE,
    title: kanitTitle,
    description: kanitDesc,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: kanitTitle,
    description: kanitDesc,
    images: [SEO_OG_IMAGE.url],
  },
};

/**
 * Eski fotoğraflı AI kanıt akışı kapatıldı; görevler /gorevler üzerinden tamamlanıyor.
 */
export default function KanitPage() {
  return (
    <PageShell
      title="İyilik kanıtı"
      lead="Artık fotoğraf yükleme veya yapay zekâ doğrulaması yok. Puan, görevleri tamamladığında doğrudan eklenir."
    >
      <div className="card-surface space-y-4 p-5 text-sm text-zinc-700">
        <p>
          PATİSİD, iyiliği <strong>onur ve merhamete</strong> dayandırır: fotoğraf
          zorunluluğu ve admin onayı yok. Lütfen gerçekten yardım ettiğinde görevi
          tamamla; sokak hayvanlarına zarar verecek veya topluluğu aldatacak
          davranışlardan kaçın.
        </p>
        <p>
          <Link
            href="/gorevler"
            className="font-medium text-amber-900 underline"
          >
            Görevler
          </Link>{" "}
          sayfasından ilgili görevde &quot;Görevi tamamla&quot; düğmesine
          basman yeterli.
        </p>
      </div>
    </PageShell>
  );
}
