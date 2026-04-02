import type { Metadata } from "next";
import Link from "next/link";

import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE, BRAND_TAGLINE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const PATH = "/rehber/sokak-hayvanlarina-mama-vermek";
const PUBLISHED = "2026-04-02";
const MODIFIED = "2026-04-02";

const PAGE_DESCRIPTION =
  "Sokak hayvanlarına mama vermek için güvenli ve saygılı rehber: kuru ve yaş mama, sokak köpeği ve sokak kedisi farkları, mahalle düzeni ve Türkiye’de gönüllü beslenme ipuçları. Tıbbi tavsiye değildir; şüphede veteriner.";

const guideKeywords = [
  "mama",
  "sokak hayvanlarına mama vermek",
  "sokak hayvanları mama",
  "sokak köpeği mama",
  "sokak kedisi mama",
  "kuru mama",
  "sokak dostları",
  "sokak hayvanları",
  "mahallede sokak hayvanları için mama",
  "Türkiye sokak hayvanları",
  "gönüllü sokak hayvanı yardımı",
  "iyilik haritası",
];

export const metadata: Metadata = {
  title: `Sokak Hayvanlarına Mama Verme Rehberi — ${BRAND_SITE} | ${BRAND_TAGLINE}`,
  description: PAGE_DESCRIPTION,
  keywords: guideKeywords,
  alternates: {
    canonical: `${getSiteUrl()}${PATH}`,
  },
  openGraph: {
    type: "article",
    locale: "tr_TR",
    url: `${getSiteUrl()}${PATH}`,
    siteName: BRAND_SITE,
    title: `Sokak Hayvanlarına Mama Verme Rehberi — ${BRAND_SITE}`,
    description:
      "Sokak köpeği ve sokak kedisi için mama seçimi, zamanlama ve komşuluk ilişkileri — güvenli, uygulanabilir bilgiler.",
    publishedTime: `${PUBLISHED}T09:00:00+03:00`,
    modifiedTime: `${MODIFIED}T09:00:00+03:00`,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `Sokak Hayvanlarına Mama — ${BRAND_SITE}`,
    description:
      "Sokak hayvanlarına mama vermek isteyenler için uzun kuyruklu sorulara pratik yanıtlar.",
    images: [SEO_OG_IMAGE.url],
  },
};

export default function SokakHayvanlarinaMamaRehberiPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Sokak Hayvanlarına Mama Verme Rehberi: Güvenli ve Saygılı Yaklaşım"
        description={PAGE_DESCRIPTION}
        path={PATH}
        datePublished={`${PUBLISHED}T09:00:00+03:00`}
        dateModified={`${MODIFIED}T09:00:00+03:00`}
      />
      <PageShell
        wide
        title="Sokak Hayvanlarına Mama Verme Rehberi: Güvenli ve Saygılı Yaklaşım"
        lead={`Bu metin, “mama” kelimesinden “sokak hayvanlarına mama vermek nasıl olmalı?” sorusuna uzanan uzun kuyruk niyetlere cevap verecek şekilde yazıldı. ${BRAND_SITE} ${BRAND_TAGLINE} topluluğu için beslenme tek başına her şey değildir; su, kısırlaştırma bilinci ve komşuluk ilişkileri de aynı tabloda yer alır. Tıbbi teşhis veya reçete yerine geçmez — şüphede mutlaka veteriner hekime danışın.`}
      >
        <article className="space-y-10 text-sm leading-relaxed text-zinc-700">
          <section aria-labelledby="neden-onemli">
            <h2 id="neden-onemli" className="mb-3 text-lg font-semibold text-zinc-900">
              Neden sadece “mama attım” yetmiyor?
            </h2>
            <p>
              <strong>Sokak hayvanlarına mama vermek</strong>, çoğu zaman iyi niyetin en görünür
              biçimidir; fakat <strong>sokak dostları</strong> için sürdürülebilir refah, yalnızca kaba
              enerji miktarıyla ölçülmez. <strong>Türkiye sokak hayvanları</strong> bağlamında mama,
              bazen kışın hayatta kalmayı kolaylaştırır, bazen de yanlış ürün veya yanlış sıklıkla
              ishal, obezite veya diş taşı riskini artırır. Bu yüzden <strong>sokak hayvanları
              mama</strong> konusunda “ne verdim?”den çok “nasıl ve ne sıklıkla verdim?” sorusunu
              sormak gerekir.
            </p>
            <p className="mt-4">
              Aynı mahallede biri “her gün tonla <strong>kuru mama</strong>” bırakırken, diğeri
              “hiç vermeyelim” diyorsa gerilim büyür. Orta yol: <strong>
                mahallede sokak hayvanları için mama
              </strong>{" "}
              noktasını konuşarak belirlemek, kabı ve çevreyi temiz tutmak, gürültü ve çöp şikâyetini
              azaltmak. Böylece <strong>gönüllü sokak hayvanı yardımı</strong> hem hayvanlar hem
              insanlar için daha güvenli hale gelir.
            </p>
          </section>

          <section aria-labelledby="kedi-kopek">
            <h2 id="kedi-kopek" className="mb-3 text-lg font-semibold text-zinc-900">
              Sokak kedisi mama ve sokak köpeği mama: kısa karşılaştırma
            </h2>
            <p>
              <strong>Sokak kedisi mama</strong> genelde yüksek proteinli, küçük tanecikli kuru
              mamalarla veya yaş mamayla daha kontrollü verilebilir; kediler sığınak arar, mama
              istasyonunu “sahiplenir”. <strong>Sokak köpeği mama</strong> tarafında ise sürü
              dinamikleri, bölgesel agresyon ve trafik riski devreye girer; aynı noktada sürekli
              yüksek kalori, köpeklerin bölgeyi daha sıkı sahiplenmesine ve çatışmaya yol açabilir.
              Bu nedenle “tek kap” fikri her zaman işe yaramaz — bazen farklı saatlerde, farklı
              güzergâhlarda, daha küçük porsiyonlarla ilerlemek gerekir.
            </p>
            <h3 className="mb-2 mt-6 text-base font-semibold text-zinc-900">Kuru ve yaş mama</h3>
            <p>
              <strong>Kuru mama</strong> pratik ve uzun ömürlüdür; ancak her marka ve her yaş grubu
              için uygun değildir. Yaş mama nem taşır, yazın bozulur; açıkta bırakılan yaş mama
              sinek ve koku sorununu büyütür. Hangi ürünün seçileceği, bütçe, bölgedeki klinik
              öykü ve veteriner önerisiyle şekillenmelidir. İnsan yemeği (özellikle tuzlu, baharatlı,
              kemikli artıklar) çoğu zaman uygun değildir; “acıktı” diye verilen bir tabak, uzun
              vadede pankreas veya böbrek yükü yaratabilir.
            </p>
          </section>

          <section aria-labelledby="zamanlama">
            <h2 id="zamanlama" className="mb-3 text-lg font-semibold text-zinc-900">
              Zamanlama, su ve mevsim
            </h2>
            <p>
              Düzenli saatlerde <strong>sokak hayvanlarına mama vermek</strong>, çöp ve gürültü
              şikâyetini azaltmaya yardım eder; çünkü komşular “ne zaman biteceğini” bilir. Yazın
              su, kışın donmayan kap ve rüzgârdan daha korunaklı köşe, mamadan önce gelir. Yazın
              yaş mama bırakacaksanız, uzun süre güneşte bekletmeyin; kısa sürede kaldırılmazsa
              sağlık ve hijyen riski doğar.
            </p>
          </section>

          <section aria-labelledby="mahalle">
            <h2 id="mahalle" className="mb-3 text-lg font-semibold text-zinc-900">
              Sokak hayvanlarına mama verirken komşuluk ve güvenlik
            </h2>
            <p>
              Mama, çocukların veya hayvanların korkuyla karşılaştığı noktalarda bırakılmamalıdır.
              Köpekleri elinizle zorla beslemeye çalışmayın; ısırık riski ve stres artar. İnsanlarla
              çatışma durumunda önce sakinlik, sonra belediye veya deneyimli STK hattı — sosyal
              medyada adres ve kişilik ifşası çoğu zaman sorunu büyütür. İyi niyet, şeffaf iletişimle
              birleştiğinde <strong>mahallede sokak hayvanları için mama</strong> düzeni sürdürülebilir
              olur.
            </p>
          </section>

          <section aria-labelledby="yanlislar">
            <h2 id="yanlislar" className="mb-3 text-lg font-semibold text-zinc-900">
              Sık yapılan hatalar
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Çikolata, üzüm, soğan, süt ürünleri gibi riskli gıdaları “ödül” diye vermek.
              </li>
              <li>
                Mama poşetlerini çöp kutusuna değil sokağa bırakmak; rüzgâr ve hayvanlar çöpü
                dağıtır.
              </li>
              <li>
                Aynı bölgede aşırı kaloriyle “besleyip” obezite veya saldırganlık hissini artırmak.
              </li>
              <li>
                Yavruya şartsız mama verip anneden ayırmaya zemin hazırlamak (çoğu yavru, annesinin
                yanında kalmalıdır).
              </li>
            </ul>
          </section>

          <section aria-labelledby="daha-genis">
            <h2 id="daha-genis" className="mb-3 text-lg font-semibold text-zinc-900">
              Daha geniş destek: sadece mama değil
            </h2>
            <p>
              Mama, <strong>sokak hayvanları</strong> refahının tek parçasıdır. Su, kısırlaştırma
              kampanyaları, yaralı hayvan için doğru yönlendirme ve — {BRAND_SITE} topluluğunda
              olduğu gibi — <strong>iyilik haritası</strong> üzerinden bilgi paylaşımı, uzun vadede
              daha fazla cana yardım eder. Genel çerçeve için{" "}
              <Link
                href="/rehber/sokak-hayvanlarina-destek"
                className="font-medium text-zinc-900 underline"
              >
                sokak hayvanlarına destek rehberi
              </Link>
              ’ne de göz atabilirsiniz.
            </p>
          </section>

          <section
            className="card-surface rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 sm:p-6"
            aria-labelledby="sonraki-adimlar-mama"
          >
            <h2 id="sonraki-adimlar-mama" className="mb-3 text-lg font-semibold text-zinc-900">
              Uygulama ve harita
            </h2>
            <p className="mb-4">
              Hangi sokakta düzenli su veya mama ihtiyacı olduğunu paylaşmak, diğer gönüllülerin
              işini kolaylaştırır — {BRAND_SITE} haritasında bunu kötüye kullanıma karşı dikkatli ve
              kurallara uygun şekilde yapın.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/harita" className="btn-primary">
                Haritayı aç
              </Link>
              <Link href="/rehber/sokak-hayvanlarina-destek" className="btn-secondary">
                Genel destek rehberi
              </Link>
              <Link href="/" className="btn-secondary">
                Ana sayfa
              </Link>
            </div>
          </section>
        </article>
      </PageShell>
    </>
  );
}
