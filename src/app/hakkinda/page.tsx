import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE, BRAND_TAGLINE } from "@/lib/brand";
import { SEO_KEYWORDS, SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const hakkindaUrl = `${getSiteUrl()}/hakkinda`;
const hakkindaTitle = `Hakkında — ${BRAND_SITE} | Sokak Hayvanları ve İyilik Haritası`;

const hakkindaDesc =
  "PATİSİD Sokak Dostları nedir? Türkiye’de sokak hayvanları için gönüllü iyilik haritası, harita üzerinde kayıt paylaşımı, görevler ve topluluk. Sokak kedisi ve köpeği için saygılı dijital dayanışma; misyon, özellikler ve ilkeler.";

const hakkindaKeywords = [
  ...SEO_KEYWORDS,
  "PATİSİD hakkında",
  "sokak hayvanları platformu",
  "hayvan refahı Türkiye",
  "gönüllü hayvan yardımı uygulaması",
];

export const metadata: Metadata = {
  title: hakkindaTitle,
  description: hakkindaDesc,
  keywords: hakkindaKeywords,
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
      lead={`${BRAND_SITE} — ${BRAND_TAGLINE}: Türkiye’de sokak hayvanları ve sokak dostları için tasarlanmış, gönüllülerin birbirini bulduğu bir iyilik haritası ve dijital dayanışma alanı. Aşağıda misyonumuzu, sunduğumuz araçları ve topluluk ilkelerimizi uzun soluklu ve şeffaf şekilde anlatıyoruz.`}
    >
      <article className="space-y-10 text-sm leading-relaxed text-zinc-700">
        <section aria-labelledby="hakkinda-giris">
          <h2 id="hakkinda-giris" className="mb-3 text-lg font-semibold text-zinc-900">
            Türkiye’de sokak hayvanları ve dijital dayanışma
          </h2>
          <p>
            <strong className="text-zinc-800">{BRAND_SITE}</strong> (
            <strong>{BRAND_TAGLINE}</strong>),{" "}
            <strong>sokak hayvanları</strong> refahına duyarlı gönüllülerin, mahalle
            ölçeğinden ülke çapına uzanan bir <strong>iyilik haritası</strong> üzerinde
            buluştuğu bir platformdur. <strong>Sokak kedisi</strong> ve{" "}
            <strong>sokak köpeği</strong> gibi canlıları “istemeden gördüğümüz detay”
            olmaktan çıkarıp, komşu ve sorumluluk alanı olarak görmeyi hedefleriz. Veriler
            resmi bir kurum kaydı değil; <strong>gönüllü sokak hayvanı yardımı</strong>{" "}
            kültürüyle paylaşılan bildirimlere dayanır — bu yüzden bilgiyi paylaşırken
            doğruluk, saygı ve güvenlik dilini birlikte taşımak önemlidir.
          </p>
          <p className="mt-4">
            <strong>Sokak dostları</strong> için yapılan her küçük adım — su bırakmak,
            kısırlaştırma kampanyasını duyurmak, yaralı bir canlıyı doğru hatta
            yönlendirmek — yalnız bırakılmadığında anlam kazanır. Bizim rolümüz, bu
            adımları tek bir harita ve görev akışında görünür kılarak{" "}
            <strong>Türkiye sokak hayvanları</strong> ekosistemine katkıda bulunmak;
            rekabeti değil, birlikte öğrenmeyi ve destek olmayı öne çıkarmaktır.
          </p>
        </section>

        <section aria-labelledby="hakkinda-misyon">
          <h2 id="hakkinda-misyon" className="mb-3 text-lg font-semibold text-zinc-900">
            Misyon ve yaklaşım
          </h2>
          <p>
            Amacımız, <strong>sokak hayvanlarına destek</strong> vermek isteyen insanların
            birbirinden haberdar olmasını kolaylaştırmak; kötüye kullanım riskini azaltacak
            şekilde hesap, istek sınırı ve topluluk normlarıyla denge kurmaktır. Uygulama
            içinde <strong>hayvan refahı</strong> ile uyumlu, insanları ve hayvanları
            riske atmayan bir dil kullanıyoruz. Fotoğraf zorunluluğu veya yapay zekâ ile
            görüntü doğrulaması yok; iyilik görevleri onur ve güven üzerine kuruludur.
          </p>
        </section>

        <section aria-labelledby="hakkinda-ozellikler">
          <h2 id="hakkinda-ozellikler" className="mb-3 text-lg font-semibold text-zinc-900">
            Neler sunuyoruz?
          </h2>
          <p className="mb-4">
            Aşağıdaki başlıklar, <strong>{BRAND_SITE} İyilik Haritası</strong> deneyiminin
            ana parçalarıdır. Hepsi, hesap açtıktan sonra tam özelliklerle kullanılabilir
            (bilgi sayfaları ve rehberler giriş gerektirmeden okunabilir).
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-zinc-800">Harita:</strong> Gönüllü bildirimlerine
              dayanan kayıtlar; tarayıcı konum izniyle yakın çevrene odaklanabilir,{" "}
              <strong>sokak hayvanları haritası</strong> üzerinden diğer katılımcıların
              paylaştığı bilgilere ulaşabilirsin. Harita, canlı veya toplumsal olaylarda
              yanlış veya kötü niyetli işaretlemelere karşı önlemler uygulanabilir.
            </li>
            <li>
              <strong className="text-zinc-800">Görevler:</strong> İyilik odaklı küçük
              adımlar; tamamladığında topluluk puanı eklenir. Rekabet değil, birlikte
              katkı fikriyle tasarlanmıştır.
            </li>
            <li>
              <strong className="text-zinc-800">Patili ekle:</strong> Yolda gördüğün bir{" "}
              <strong>sokak dostunu</strong> haritaya işaretleyerek diğer gönüllülere
              yol gösterebilirsin. Konum ve isim verisi, başkalarının hayvanı bulmasına
              yardımcı olmak için saklanır; kötüye kullanım riskine karşı teknik sınırlar
              uygulanabilir.
            </li>
            <li>
              <strong className="text-zinc-800">Liderlik:</strong> Topluluk puanlarının
              görünür olduğu bir özet; amaç sıralama baskısı yaratmak değil, birlikte
              destek olma kültürünü pekiştirmek.
            </li>
            <li>
              <strong className="text-zinc-800">Arama:</strong> Kayıtlar ve içeriklerle
              sınırlı arama deneyimi; zamanla geliştirilebilir.
            </li>
          </ul>
        </section>

        <section aria-labelledby="hakkinda-gruplar">
          <h2 id="hakkinda-gruplar" className="mb-3 text-lg font-semibold text-zinc-900">
            Mahalle grupları ve yerel koordinasyon
          </h2>
          <p>
            Platformun en kritik parçalarından biri <strong>mahalle grupları</strong> akışıdır.
            Bu alan, aynı bölgede yaşayan gönüllülerin acil ve rutin ihtiyaçları daha hızlı
            koordine etmesini sağlar. Grup özelliğinin nasıl çalıştığını, kimler için uygun
            olduğunu ve güvenli kullanım kurallarını ayrı sayfada detaylı anlattık:
          </p>
          <p className="mt-3">
            <Link href="/mahalle-gruplari" className="font-medium text-zinc-900 underline">
              Mahalle grupları nedir? Ne işe yarar?
            </Link>
          </p>
        </section>

        <section aria-labelledby="hakkinda-ilkeler">
          <h2 id="hakkinda-ilkeler" className="mb-3 text-lg font-semibold text-zinc-900">
            Topluluk ilkeleri ve dil
          </h2>
          <p>
            <strong>Sokak hayvanlarına saygılı yaklaşım</strong>, yalnızca mama vermek
            değil; gürültü, çöp, komşuluk ilişkileri ve kısırlaştırma bilincini de kapsar.
            Platformda paylaşılan içeriklerin hayvanın ve insanların güvenliğini
            tehlikeye atmaması, başkalarının mahremiyetini ihlal etmemesi beklenir.
            Şikâyet veya kötüye kullanım durumunda yönetim veya teknik önlemler devreye
            girebilir.
          </p>
        </section>

        <section aria-labelledby="hakkinda-rehber">
          <h2 id="hakkinda-rehber" className="mb-3 text-lg font-semibold text-zinc-900">
            Sokak hayvanları için rehber içerikler
          </h2>
          <p className="mb-3">
            Uzun kuyruk aramalara ve günlük pratiğe yönelik metinlerimizi{" "}
            <strong>sokak hayvanlarına destek vermek</strong> isteyen herkes için
            genişlettik; içerikler insan odaklıdır, anahtar kelime doldurma amacı taşımaz.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Link
                href="/rehber/sokak-hayvanlarina-destek"
                className="font-medium text-zinc-900 underline"
              >
                Sokak hayvanlarına destek rehberi
              </Link>
              : genel çerçeve, su, kısırlaştırma farkındalığı ve dijital harita fikri.
            </li>
            <li>
              <Link
                href="/rehber/sokak-hayvanlarina-mama-vermek"
                className="font-medium text-zinc-900 underline"
              >
                Sokak hayvanlarına mama verme rehberi
              </Link>
              : mama türleri, zamanlama, mahalle dinamikleri ve sık yapılan hatalar.
            </li>
          </ul>
        </section>

        <section aria-labelledby="hakkinda-kayit">
          <h2 id="hakkinda-kayit" className="mb-3 text-lg font-semibold text-zinc-900">
            Kayıt ve erişim
          </h2>
          <p>
            Bu sayfa, gizlilik ve çerez politikaları gibi bilgilendirme metinleri gibi
            giriş yapmadan okunabilir. <strong>Harita</strong>, <strong>görevler</strong>,{" "}
            <strong>patili ekle</strong> ve <strong>liderlik</strong> gibi etkileşimli
            özellikler için hesap gerekir; böylece topluluk güvenliği ve kötüye
            kullanımın önlenmesine katkı sağlanır. Kayıt olmadan önce{" "}
            <Link href="/gizlilik" className="font-medium text-zinc-900 underline">
              gizlilik
            </Link>{" "}
            sayfamıza göz atmanı öneririz.
          </p>
        </section>

        <section aria-labelledby="hakkinda-sorumluluk">
          <h2 id="hakkinda-sorumluluk" className="mb-3 text-lg font-semibold text-zinc-900">
            Sınırlar ve şeffaflık
          </h2>
          <p>
            {BRAND_SITE}, resmi bir belediye veya veteriner hizmeti değildir; acil tıbbi
            durumlarda her zaman yetkili kurum veya hekime başvurman gerekir. Haritadaki
            kayıtlar gönüllü bildirimlerine dayanır; güncelliği ve doğruluğu garanti
            edilmez. Uygulama “tek başına çözüm” vaat etmez —{" "}
            <strong>mahallede sokak hayvanları için mama</strong> düzeni, kısırlaştırma
            kampanyaları ve iş birlikleri gibi gerçek hayat adımlarıyla birlikte
            düşünülmelidir.
          </p>
        </section>

        <section aria-labelledby="hakkinda-iletisim">
          <h2 id="hakkinda-iletisim" className="mb-3 text-lg font-semibold text-zinc-900">
            Gizlilik ve yasal metinler
          </h2>
          <p>
            Kişisel verilerin işlenmesi ve çerezler hakkında ayrı sayfalarımız var.
            Veriler gönüllü bildirimlerine dayanır; yanlış veya kötü niyetli kullanım
            topluluğa zarar verir.
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
      </article>
    </PageShell>
  );
}
