import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const gizlilikUrl = `${getSiteUrl()}/gizlilik`;
const gizlilikTitle = "Gizlilik ve veri — PATİSİD";
const gizlilikDesc =
  "Konum, hesap ve görev verilerinin kullanımı hakkında özet — PATİSİD.";

export const metadata: Metadata = {
  title: gizlilikTitle,
  description: gizlilikDesc,
  alternates: { canonical: gizlilikUrl },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: gizlilikUrl,
    siteName: BRAND_SITE,
    title: gizlilikTitle,
    description: gizlilikDesc,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: gizlilikTitle,
    description: gizlilikDesc,
    images: [SEO_OG_IMAGE.url],
  },
};

export default function GizlilikPage() {
  return (
    <PageShell
      wide
      title="Gizlilik ve kişisel veriler"
      lead="Hangi verilerin neden işlendiğinin özeti. Hukuki danışmanlık yerine geçmez."
    >
      <div className="space-y-5 text-sm leading-relaxed text-zinc-700">
        <p>
          Bu sayfa, uygulamanın hangi verileri işlediğini ve hayvan refahına
          duyarlı bir dil ile nasıl kullandığını özetler. Hukuki danışmanlık
          yerine geçmez; detay için gerekirse bir uzmana başvurabilirsin.
        </p>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Hesap ve kimlik</h2>
          <p>
            Kayıt olduğunda e-posta ve şifre Supabase Auth altyapısında
            saklanır. Profil adın görev ve liderlik görünümlerinde kullanılabilir.
            Çıkış yaptığında oturum çerezleri temizlenir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Konum</h2>
          <p>
            Haritada yakınındaki kayıtları göstermek için tarayıcı konum izni
            istenir. Konum yalnızca cihazında işlenir ve sunucuya tam cihaz
            izleme amacıyla gönderilmez; harita görünür alanı (kutu) ile sınırlı
            hayvan listesi istenir. İzni reddedersen daha geniş bir alan ve daha
            düşük yoğunlukta veri yüklenir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Patili ekle</h2>
          <p>
            İşaretlediğin konum ve verdiğin isim, diğer kullanıcıların hayvanı
            bulmasına yardımcı olmak için veritabanında saklanır. Kötüye
            kullanımı azaltmak için istek sınırları uygulanabilir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Görevler ve iyilik puanı</h2>
          <p>
            İyilik puanı, görevleri uygulama içinde tamamladığında eklenir;{" "}
            <strong className="text-zinc-800">fotoğraf yükleme veya yapay zekâ ile
            görüntü doğrulaması yapılmaz.</strong> Eski “fotoğraflı kanıt” akışı
            kapatılmıştır. Yanlış veya kötüye kullanım topluluğa zarar verir;
            görevleri yalnızca gerçekten yerine getirdiğinde tamamlamanı rica
            ederiz. Özet bilgi için{" "}
            <Link href="/kanit" className="font-medium text-zinc-900 underline">
              İyilik kanıtı
            </Link>{" "}
            sayfasına bakabilirsin.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Hakların</h2>
          <p>
            KVKK kapsamında erişim, düzeltme, silme ve itiraz hakların
            olabilir. Taleplerini Supabase projesinin veri sorumlusuna veya
            uygulama yöneticisine iletebilirsin.
          </p>
        </section>

        <p className="text-xs text-zinc-500">
          Son güncelleme: bilgilendirme metni proje geliştikçe güncellenebilir.
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
