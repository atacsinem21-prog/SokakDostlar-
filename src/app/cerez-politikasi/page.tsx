import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: `Çerez politikası — ${BRAND_SITE}`,
  description:
    "Hangi çerezlerin kullanıldığı, amaçları ve tercihlerini nasıl yönetebileceğin — sokak hayvanları topluluğu için şeffaflık.",
  alternates: {
    canonical: `${getSiteUrl()}/cerez-politikasi`,
  },
};

export default function CerezPolitikasiPage() {
  return (
    <PageShell
      wide
      title="Çerez politikası"
      lead={`${BRAND_SITE} olarak zorunlu ve isteğe bağlı çerezleri nasıl kullandığımızın özeti.`}
    >
      <div className="space-y-5 text-sm leading-relaxed text-zinc-700">
        <p>
          Bu metin bilgilendirme amaçlıdır; hukuki danışmanlık yerine geçmez.
          Sokak hayvanlarına saygılı bir deneyim sunarken gizliliğine ve
          tercihlerine de önem veriyoruz.
        </p>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Çerez nedir?</h2>
          <p>
            Çerezler, siteyi ziyaret ettiğinde tarayıcına kaydedilen küçük
            metin dosyalarıdır. Oturumun, dil tercihin veya güvenlik ayarların
            gibi işlevleri mümkün kılarlar.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Kullandığımız türler</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-zinc-800">Zorunlu çerezler:</strong>{" "}
              Giriş oturumu (Supabase Auth), güvenlik ve temel site
              işleyişi için gereklidir; bunlar olmadan hizmet sunulamaz.
            </li>
            <li>
              <strong className="text-zinc-800">İstatistik (analitik):</strong>{" "}
              Hangi sayfaların kullanıldığını anlamamıza yardımcı olur; mümkün
              olduğunda anonim veya toplu veri olarak işlenir.
            </li>
            <li>
              <strong className="text-zinc-800">Pazarlama / kişiselleştirme:</strong>{" "}
              Yalnızca açıkça izin verirsen kullanılır; içerik veya bildirimleri
              ilgi alanına göre uyarlamak için (kullanılırsa).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Tercihlerin</h2>
          <p>
            İlk ziyarette gösterilen çerez bildiriminden &quot;Tümüne izin
            ver&quot;, &quot;Reddet&quot; veya &quot;Özelleştir&quot;
            seçeneklerinden birini kullanabilirsin. Tarayıcı ayarlarından
            çerezleri silmek veya engellemek de mümkündür; bu durumda bazı
            özellikler kısıtlanabilir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Saklama süresi</h2>
          <p>
            Oturum çerezleri çıkış yaptığında veya süre dolduğunda geçersiz
            olur. Tercih çerezleri genelde bir yıla kadar saklanabilir; güncel
            süreleri tarayıcı veya geliştirici araçlarından görebilirsin.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-zinc-900">Üçüncü taraflar</h2>
          <p>
            Harita (ör. harita döşemeleri), kimlik doğrulama veya analitik
            sağlayıcıları kendi çerezlerini kullanabilir. Bu sağlayıcıların
            politikalarını ilgili sitelerden inceleyebilirsin.
          </p>
        </section>

        <p className="text-xs text-zinc-500">
          Soruların için{" "}
          <Link href="/gizlilik" className="font-medium underline">
            Gizlilik
          </Link>{" "}
          sayfamıza da göz atabilirsin. Metin proje geliştikçe güncellenebilir.
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
