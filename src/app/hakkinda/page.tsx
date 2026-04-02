import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE, BRAND_TAGLINE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const hakkindaUrl = `${getSiteUrl()}/hakkinda`;
const hakkindaTitle = `Hakkında — ${BRAND_SITE}`;
const hakkindaDesc =
  "PATİSİD İyilik Haritası nedir? Sokak hayvanları için gönüllü harita, görevler ve topluluk — kayıt olmadan bilgi.";

export const metadata: Metadata = {
  title: hakkindaTitle,
  description: hakkindaDesc,
  alternates: {
    canonical: hakkindaUrl,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: hakkindaUrl,
    siteName: BRAND_SITE,
    title: hakkindaTitle,
    description: hakkindaDesc,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: hakkindaTitle,
    description: hakkindaDesc,
    images: [SEO_OG_IMAGE.url],
  },
};

export default function HakkindaPage() {
  return (
    <PageShell
      wide
      title="Hakkında"
      lead={`${BRAND_SITE} — ${BRAND_TAGLINE}: Türkiye’de sokak hayvanları için gönüllü dijital dayanışma.`}
    >
      <div className="space-y-6 text-sm leading-relaxed text-zinc-700">
        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Bu site ne işe yarar?</h2>
          <p>
            <strong className="text-zinc-800">{BRAND_SITE}</strong>, sokak
            hayvanlarına yardım etmek isteyen gönüllülerin bir araya geldiği bir{" "}
            <strong>iyilik haritası</strong> ve topluluk alanıdır. Yakınındaki
            kayıtları görebilir, görevlerle topluluğa katkı verebilir ve harita
            üzerinden bilgi paylaşabilirsin. Amaç, hayvanlara saygılı ve güvenli
            bir dil ile farkındalık ve pratik yardımı bir arada tutmaktır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Neler sunuyoruz?</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-zinc-800">Harita:</strong> Gönüllü
              bildirimlerine dayanan kayıtlar; konum izniyle yakın çevrene
              odaklanabilirsin.
            </li>
            <li>
              <strong className="text-zinc-800">Görevler:</strong> İyilik
              odaklı küçük adımlar ve topluluk puanları (onur sistemine uygun).
            </li>
            <li>
              <strong className="text-zinc-800">Patili ekle:</strong> Gördüğün
              sokak dostunu haritaya işaretleyerek diğer gönüllülere yardımcı
              olabilirsin (kötüye kullanıma karşı önlemler uygulanabilir).
            </li>
            <li>
              <strong className="text-zinc-800">Liderlik:</strong> Rekabet
              değil, birlikte destek olma fikriyle topluluk görünümü.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Kayıt şart mı?</h2>
          <p>
            Bu sayfayı ve genel bilgilendirme metinlerini giriş yapmadan
            okuyabilirsin. Harita, görevler ve patili ekleme gibi özellikler
            için hesap gerekir; böylece topluluk güvenliği ve kötüye kullanımın
            önlenmesine katkı sağlanır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">İletişim ve ilkeler</h2>
          <p>
            Gizlilik ve çerezler hakkında ayrı sayfalarımız var; kayıt olmadan
            önce göz atmak istersen bağlantılar aşağıda. Veriler gönüllü
            bildirimlerine dayanır; yanlış veya kötü niyetli kullanım topluluğa
            zarar verir.
          </p>
        </section>

        <p className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500">
          <Link href="/gizlilik" className="font-medium underline">
            Gizlilik
          </Link>
          <span aria-hidden>·</span>
          <Link href="/cerez-politikasi" className="font-medium underline">
            Çerez politikası
          </Link>
        </p>

        <Link
          href="/"
          className="inline-block text-sm font-medium text-zinc-900 underline"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </PageShell>
  );
}
