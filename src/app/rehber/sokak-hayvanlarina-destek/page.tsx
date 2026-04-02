import type { Metadata } from "next";
import Link from "next/link";

import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE, BRAND_TAGLINE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const PATH = "/rehber/sokak-hayvanlarina-destek";
const PUBLISHED = "2026-04-02";
const MODIFIED = "2026-04-02";

const PAGE_DESCRIPTION =
  "Sokak dostları ve sokak hayvanlarına destek vermek için pratik rehber: mama ve su, güvenli yaklaşım, kısırlaştırma bilinci ve Türkiye’de gönüllü sokak hayvanı yardımı. İnsan için yazıldı; harita ve topluluk önerileri dahil.";

const guideKeywords = [
  "sokak dostları",
  "sokak hayvanları",
  "sokak kedisi",
  "sokak köpeği",
  "sokak hayvanlarına destek",
  "sokak hayvanlarına destek vermek",
  "Türkiye sokak hayvanları",
  "gönüllü sokak hayvanı yardımı",
  "sokak hayvanları haritası",
  "iyilik haritası",
  "mahallede sokak hayvanları için mama",
  "sokak hayvanlarına saygılı yaklaşım",
  "sokak hayvanları kısırlaştırma farkındalığı",
  "dijital harita ile sokak hayvanlarını kaydetmek",
];

export const metadata: Metadata = {
  title: `Sokak Hayvanlarına Destek Rehberi — ${BRAND_SITE} | ${BRAND_TAGLINE}`,
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
    title: `Sokak Hayvanlarına Destek Rehberi — ${BRAND_SITE}`,
    description:
      "Sokak kedisi ve sokak köpeği için saygılı destek: pratik adımlar, güvenlik ve iyilik haritası ile gönüllü iş birliği.",
    publishedTime: `${PUBLISHED}T09:00:00+03:00`,
    modifiedTime: `${MODIFIED}T09:00:00+03:00`,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `Sokak Hayvanlarına Destek — ${BRAND_SITE}`,
    description:
      "Sokak hayvanlarına destek vermek isteyenler için uzun kuyruklu sorulara net, uygulanabilir yanıtlar.",
    images: [SEO_OG_IMAGE.url],
  },
};

export default function SokakHayvanlarinaDestekRehberiPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Sokak Hayvanlarına Destek Rehberi: Pratik ve Saygılı Yaklaşımlar"
        description={PAGE_DESCRIPTION}
        path={PATH}
        datePublished={`${PUBLISHED}T09:00:00+03:00`}
        dateModified={`${MODIFIED}T09:00:00+03:00`}
      />
      <PageShell
        wide
        title="Sokak Hayvanlarına Destek Rehberi: Pratik ve Saygılı Yaklaşımlar"
        lead={`${BRAND_SITE} ${BRAND_TAGLINE} olarak, Türkiye’de sokak hayvanlarına yardım etmek isteyen gönüllülere yönelik okunabilir bir kaynak hazırladık. Aşağıdaki metin, kısa ifadeden uzun ifadeye doğru doğal biçimde ilerleyen anahtar kavramları (örneğin sokak dostlarından “sokak hayvanlarına destek vermek”e) gömülü şekilde kullanır; amaç arama motoru doldurmak değil, gerçekten işinize yarayacak netlik sağlamaktır.`}
      >
        <article className="space-y-10 text-sm leading-relaxed text-zinc-700">
          <section aria-labelledby="sokak-dostlari">
            <h2 id="sokak-dostlari" className="mb-3 text-lg font-semibold text-zinc-900">
              Sokak dostları: kısa tanım, geniş anlam
            </h2>
            <p>
              Türkiye’nin her mahallesinde gördüğümüz <strong>sokak dostları</strong>, aslında aynı
              ekosistemin parçası olan <strong>sokak hayvanları</strong>dır. Bir <strong>sokak kedisi</strong>{" "}
              veya <strong>sokak köpeği</strong> etiketi, onları “sahipsiz” diye küçültmemeli; aksine,
              yaşam alanlarını paylaştığımız komşularımız olduklarını hatırlatmalıdır. Bu yüzden{" "}
              <strong>sokak hayvanlarına destek</strong> dendiğinde yalnızca mama vermek değil, gürültüyü
              azaltma, kısırlaştırmayı normalleştirme ve güvenli mesafe kültürünü yayma gibi katmanlar da
              devreye girer. Kısacası <strong>sokak hayvanlarına destek vermek</strong>, tek seferlik bir
              jestten çok, sürdürülebilir bir duyarlılık biçimidir.
            </p>
            <p className="mt-4">
              <strong>Türkiye sokak hayvanları</strong> bağlamında en sık duyduğumuz ihtiyaçlar: düzenli
              beslenme, temiz su, kışa hazırlık, yaralanma veya enfeksiyon durumunda yetkili mercilere
              yönlendirme ve — uzun vadede en etkili müdahalelerden biri olan — kısırlaştırma
              farkındalığıdır. <strong>Gönüllü sokak hayvanı yardımı</strong> yapan biri olarak kendinizi
              yalnız hissetmemeniz önemli; mahalle WhatsApp grubundan belediye hattına, veteriner
              gönüllülük ağlarından dijital platformlara kadar pek çok köprü kurulabilir.
            </p>
          </section>

          <section aria-labelledby="gunluk-destek">
            <h2 id="gunluk-destek" className="mb-3 text-lg font-semibold text-zinc-900">
              Günlük hayatta sokak hayvanlarına destek vermek
            </h2>
            <p>
              Pratik tarafta işe en çok yarayan şey, küçük ama tekrarlanabilir alışkanlıklardır. Örneğin{" "}
              <strong>mahallede sokak hayvanları için mama</strong> bırakırken aynı noktayı seçmek,
              çevreyi kirletmemek ve ambalajları geri toplamak hem komşuluk ilişkilerini korur hem de
              hayvanların güvenli bir “hatırlanan” alan bulmasını sağlar. Mama türü, bölgedeki klinik
              öyküye göre değişebilir; şüphede kaldığınızda yerel bir hekim veya deneyimli gönüllüden
              görüş almak en doğru adımdır.
            </p>

            <h3 className="mb-2 mt-6 text-base font-semibold text-zinc-900">Su, sığınak ve mevsim</h3>
            <p>
              Yazın gölgede, kışın rüzgârdan daha korunaklı yerlere su kapları koymak hayat kurtarır.
              Sığınak inşa etmek cazip gelse de malzeme seçimi, temizlik ve yangın riski gibi konularda
              dikkat ister; bazen belediye veya sivil toplum örgütlerinin önerdiği standart modelleri
              kopyalamak daha güvenlidir. <strong>Sokak hayvanlarına saygılı yaklaşım</strong> demek,
              onları fotoğraflamak için zorlamamak, yavruları annesinden ayırmamak ve “sahiplenme” baskısı
              kurmadan bilgi paylaşmaktır.
            </p>

            <h3 className="mb-2 mt-6 text-base font-semibold text-zinc-900">
              Kısırlaştırma ve sağlık bilinci
            </h3>
            <p>
              <strong>Sokak hayvanları kısırlaştırma farkındalığı</strong>, popülasyon yönetiminde en
              sürdürülebilir araçtır. Bir hayvanı yakalayıp kliniğe götürmek tek başına zor olabilir;
              belediye programları, TNR (yakala-kısırlaştır-bırak) gönüllüleri veya bölgesel kampanyalar
              ile eşleşmek iş yükünü paylaştırır. Yaralı bir canlı gördüğünüzde önce kendi güvenliğiniz,
              sonra profesyonel yardım hattı veya 153/182 gibi resmi yönlendirmeler devreye girmelidir.
              Amatör müdahale, hem size hem hayvana zarar verebilir.
            </p>
          </section>

          <section aria-labelledby="dijital-harita">
            <h2 id="dijital-harita" className="mb-3 text-lg font-semibold text-zinc-900">
              Dijital harita ve topluluk: sokak hayvanları haritası fikri
            </h2>
            <p>
              Gönüllülerin en büyük problemi “bilgi dağınıklığı”dır: Aynı köşe için üç farklı kişi üç
              farklı hikâye anlatır. İşte burada <strong>sokak hayvanları haritası</strong> veya bir{" "}
              <strong>iyilik haritası</strong> devreye girer. Harita, “şu sokakta düzenli su var”, “bu
              bölgede kısırlaştırma kampanyası planlanıyor” gibi tekrar kullanılabilir bilgileri tek
              zeminde toplar. <strong>Dijital harita ile sokak hayvanlarını kaydetmek</strong> ifadesi,
              konum paylaşımını kötüye kullanıma açmadan, topluluk kuralları ve moderasyonla yapıldığında
              gerçek bir koordinasyon aracına dönüşür.
            </p>
            <p className="mt-4">
              {BRAND_SITE} olarak sunduğumuz uygulamada amaç tam da budur: yakınınızdaki kayıtları görmek,
              görevlerle küçük iyilik adımlarını oyunlaştırmadan motive etmek ve patili ekleyerek diğer
              gönüllülere ışık tutmak. Haritaya eklemeden önce{" "}
              <Link href="/hakkinda" className="font-medium text-zinc-900 underline">
                Hakkında
              </Link>{" "}
              sayfasındaki ilkeleri okumanız, hem hayvanların hem mahallenin güvenliği için kritiktir.
            </p>
          </section>

          <section aria-labelledby="arama-niyeti">
            <h2 id="arama-niyeti" className="mb-3 text-lg font-semibold text-zinc-900">
              Uzun kuyruklu sorulara kısa cevaplar
            </h2>
            <p>
              İnsanlar artık tek kelime yerine niyet dolu aramalar yapıyor: “komşuluk için sokak
              hayvanlarına nasıl yardım edilir”, “sokak köpeği ile güvenli mesafe nasıl korunur”, “sokak
              kedisi yavrusuna dokunmadan ne yapmalıyım” gibi. Bu rehberi yazarken o uzun sorulara
              paragraflar halinde yanıt vermeyi hedefledik. Unutmayın: içerik ne kadar doğal ve faydalı
              olursa, hem okuyucu sitede kalır hem de arama motorları sayfayı daha iyi anlamlandırır.
              Kaliteli tek kaynak, yüzeysel on sayfadan daha değerlidir — tıpkı{" "}
              <strong>gönüllü sokak hayvanı yardımı</strong>nda tek güvenilir iş birliği ağının on dağınık
              gruptan iyi olması gibi.
            </p>
          </section>

          <section aria-labelledby="otorite-backlink">
            <h2 id="otorite-backlink" className="mb-3 text-lg font-semibold text-zinc-900">
              Otorite ve güven: neden tek kaliteli bağlantı önemlidir?
            </h2>
            <p>
              Web’de görünürlük için dışarıdan gelen referanslar (backlink) hâlâ güçlü sinyallerdendir;
              fakat spam sitelerden yüzlerce link, güvenilir bir haber sitesinden veya üniversite blogundan
              gelen <em>tek doğal bağlantıya</em> yenilir. Siz de bu metni kendi sitenizde veya gönüllü
              projenizde özetleyip kaynak olarak gösterebilirsiniz; önemli olan anchor metninin abartılı
              anahtar kelime yığını değil, okuyucuya fayda vaadi olmasıdır. Sosyal medyada paylaşırken
              açıklayıcı bir cümle, forumda tek satırlık “tıkla” mesajından çok daha fazla güven üretir.
            </p>
          </section>

          <section aria-labelledby="kullanici-deneyimi">
            <h2 id="kullanici-deneyimi" className="mb-3 text-lg font-semibold text-zinc-900">
              Kullanıcı deneyimi: hız, sade tasarım, net başlıklar
            </h2>
            <p>
              Teknik tarafta da içerik tarafta da aynı ilke geçerli: sayfa mobilde hızlı açılmalı,
              başlıklar taranabilir olmalı, göz yormayan tipografi ve boşluk kullanılmalıdır. Okuyucu
              ne aradığını bir bakışta bulabildiğinde hem sitede kalma süresi uzar hem de paylaşım
              ihtimali artar. Bu rehber sayfasını bilinçli olarak kısa paragraflara böldük; tek bir H1,
              anlamlı H2 ve H3 hiyerarşisi ve iç bağlantılar (örneğin{" "}
              <Link href="/harita" className="font-medium text-zinc-900 underline">
                harita
              </Link>
              ,{" "}
              <Link href="/hakkinda" className="font-medium text-zinc-900 underline">
                hakkında
              </Link>
              ) hem kullanıcı deneyimini hem de yapısal netliği güçlendirir. Kendi dernek siteniz veya
              mahalle blogunuz için de aynı düzeni öneririz.
            </p>
          </section>

          <section aria-labelledby="isbirligi-yanlislar">
            <h2 id="isbirligi-yanlislar" className="mb-3 text-lg font-semibold text-zinc-900">
              Belediye, STK ve mahalle: iş birliği ve sık yapılan hatalar
            </h2>
            <p>
              <strong>Sokak hayvanlarına destek</strong> konusunda en verimli sonuçlar, genellikle
              kutuplaşmayı değil köprü kurmayı seçen mahallelerde çıkar. Belediye hatlarına hakaret
              yerine talep netliği, STK gönüllüsüne “sen yap” demek yerine görev paylaşımı, komşuya
              baskı yerine şeffaf bilgi akışı — hepsi uzun vadede daha az gürültü ve daha çok çözüm
              demektir. Örneğin aynı sokakta iki ayrı mama istasyonu kurmak yerine tek noktada ortak
              rota belirlemek, temizlik ve stok yönetimini kolaylaştırır. Yine de yerel dinamik her
              ilçede farklıdır; resmi kanallardan gelen yönergeleri takip etmek, hukuki ve hayvan
              refahı açısından en güvenli yoldur.
            </p>
            <p className="mt-4">
              Sık görülen hatalar arasında: yabancı cisimle oynatma, yavruyu annesinden erken ayırma,
              sosyal medyada tam adres paylaşarak hayvanı veya gönüllüyü riske atma, aşırı işlenmiş
              insan gıdasını düzenli mama sanma. Bunların yerine, veteriner veya deneyimli gönüllü
              onayıyla hareket etmek, <strong>sokak kedisi</strong> ve <strong>sokak köpeği</strong>{" "}
              davranışlarını genellemeden tek tek gözlemlemek ve <strong>Türkiye sokak hayvanları</strong>{" "}
              gerçeğine uygun, mevsimsel ve mekânsal farkları hesaba katmak gerekir. Unutmayın:{" "}
              <strong>sokak dostları</strong> için en iyi iyilik, bazen en görünmez olanıdır — düzenli
              su, doğru yönlendirme, sabırlı kısırlaştırma takibi.
            </p>
          </section>

          <section aria-labelledby="ozet-checklist">
            <h2 id="ozet-checklist" className="mb-3 text-lg font-semibold text-zinc-900">
              Bugün yapabileceklerin: kısa bir özet
            </h2>
            <p className="mb-4">
              Aşağıdaki maddeler, bu sayfayı baştan sona okumaya vaktin yoksa bile yön verir. Hepsi{" "}
              <strong>sokak hayvanlarına destek vermek</strong> isteyen biri için uygulanabilir ve
              kademeli olarak derinleştirilebilir.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Yakın çevrende sabit bir su noktası belirle; kabı düzenli temizle ve gölgeyi unutma.
              </li>
              <li>
                Mama konusunda yerel gönüllü veya hekim önerisini esas al; aynı noktada biriken
                ambalajları topla ki <strong>mahallede sokak hayvanları için mama</strong> düzeni
                komşuluk ilişkisini zedelemesin.
              </li>
              <li>
                Yavru gördüğünde panik yapma; annesinin gelmesini beklemek çoğu zaman en doğru
                müdahaledir. Şüphede veteriner veya deneyimli STK hattını ara.
              </li>
              <li>
                <strong>Sokak hayvanları haritası</strong> veya benzeri bir araç kullanıyorsan, konum
                ve kişisel verileri kötüye kullanıma karşı dikkatli paylaş; topluluk kurallarına uy.
              </li>
              <li>
                Kısırlaştırma kampanyalarını belediye ve STK duyurularından takip et; tek başına
                çözmek zorundasın diye düşünme — <strong>gönüllü sokak hayvanı yardımı</strong> paylaşılan
                bir iştir.
              </li>
            </ul>
          </section>

          <section
            className="card-surface rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 sm:p-6"
            aria-labelledby="sonraki-adimlar"
          >
            <h2 id="sonraki-adimlar" className="mb-3 text-lg font-semibold text-zinc-900">
              Sonraki adımlar
            </h2>
            <p className="mb-4">
              <strong>Sokak hayvanlarına destek vermek</strong> yolculuğunuzda bir sonraki adım, küçük ve
              ölçülebilir olsun: bugün bir su kabı, bu hafta bir kısırlaştırma bilgisi paylaşımı, bu ay
              haritada tek doğru kayıt. {BRAND_SITE} ile devam etmek isterseniz doğrudan uygulama
              akışına geçebilirsiniz.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/harita" className="btn-primary">
                Haritayı aç
              </Link>
              <Link href="/harita/patili-ekle" className="btn-secondary">
                Patili ekle
              </Link>
              <Link href="/rehber/sokak-hayvanlarina-mama-vermek" className="btn-secondary">
                Mama rehberi
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
