import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const url = `${getSiteUrl()}/mahalle-gruplari`;
const title = `Mahalle Grupları Nedir? — ${BRAND_SITE}`;
const description =
  "Mahalle grupları ne işe yarar? Sokak hayvanları için acil yardımlaşma, koordinasyon, güvenli iletişim ve yerel dayanışma modeli. PATİSİD grup yapısını adım adım keşfet.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "article",
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

export default function MahalleGruplariPage() {
  return (
    <PageShell
      wide
      title="Mahalle grupları ne işe yarar?"
      lead="Bu sayfa, gruplar özelliğinin amacını anlatır. Önce nasıl çalıştığını öğren, sonra istersen grup akışına geç."
    >
      <article className="space-y-8 text-sm leading-relaxed text-zinc-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Neden mahalle grubu?</h2>
          <p>
            Sokak hayvanlarına yardım çoğu zaman tek kişiyle değil, aynı bölgede yaşayan
            gönüllülerin koordinasyonuyla etkili olur. <strong>Mahalle grupları</strong>,
            bu koordinasyonu hızlılaştırmak için vardır: kim mama bıraktı, kim su takibi
            yapıyor, hangi noktada acil destek gerekli gibi bilgiler dağılmadan tek yerde
            toplanır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Acil yardımlaşma nasıl işler?</h2>
          <p>
            Grup içindeki mesajlarda <strong>Acil</strong> işareti kullanılabilir. Bu işaret,
            yaralı hayvan, tehlikeli durum veya hızlı yönlendirme gerektiren olaylarda
            öne çıkar. Amaç panik üretmek değil, doğru kişiyi doğru anda haberdar etmektir.
          </p>
          <p className="mt-3">
            Kötüye kullanımı azaltmak için hız sınırları ve bildirim mekanizması bulunur.
            Böylece grup akışı daha güvenli ve faydalı kalır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Gruplar kimler için uygun?</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Aynı semtte düzenli mama ve su takibi yapan gönüllüler</li>
            <li>Geçici bakım veya yönlendirme desteği sunan kişiler</li>
            <li>Mahallede iletişimi düzenli ve saygılı şekilde sürdürmek isteyen topluluklar</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Güvenli kullanım ilkeleri</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Konum ve içerik paylaşırken canlı güvenliğini öncele</li>
            <li>Kişisel veri veya üçüncü kişileri hedef gösteren içerik paylaşma</li>
            <li>Gereksiz “acil” kullanımı yapma; gerçekten gerekli durumlarda işaretle</li>
            <li>Uygunsuz içerikleri “Bildir” ile yönetime ilet</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Devam etmek istersen</h2>
          <p className="mb-3">
            Özelliği tanıdıysan artık grup alanına geçebilirsin. Grup akışında üyelik,
            mesajlaşma, acil etiketleme ve yönetim kontrolleri bulunur.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/gruplar" className="btn-primary">
              Gruplara geç
            </Link>
            <Link href="/hakkinda" className="btn-secondary">
              Hakkında sayfası
            </Link>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
