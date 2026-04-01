/** Site alan adı ve marka adı — tek kaynak */
export const BRAND_SITE = "PATİSİD";

/** Canlı domain — SEO, canonical, env yokken varsayılan site adresi */
export const SITE_DOMAIN = "patisid.app";
export const SITE_URL_DEFAULT = `https://${SITE_DOMAIN}`;

/** Ürün / uygulama adı */
export const BRAND_PRODUCT = "İyilik Haritası";

/** Alt satır / yanı metin */
export const BRAND_TAGLINE = "Sokak Dostları";

/** Erişilebilirlik — ekran okuyucu */
export const BRAND_LOGO_TEXT = `PATİ SİD ${BRAND_TAGLINE}`;

/** Kuruluş yılı — structured data (foundingDate) */
export const SITE_FOUNDING_YEAR = "2024";

/** Genel iletişim — JSON-LD ContactPoint (görünür e-posta) */
export const SITE_CONTACT_EMAIL = "info@patisid.app";

/**
 * Sosyal profil URL’leri (tam adres). Boş bırakılabilir; doluysa JSON-LD `sameAs` dolar.
 * İstersen `.env` içinde `NEXT_PUBLIC_SOCIAL_PROFILES` (virgülle ayrılmış URL listesi) kullan.
 */
export const SITE_SAME_AS_DEFAULT: readonly string[] = [];

/** Arama sonuçları ve SearchAction hedef yolu */
export const SITE_SEARCH_PATH = "/ara";

/**
 * Giriş/kayıt mobil — pudra (rose). Açık hex’ler beyaza yakın görünüyordu;
 * `rose-50` / `rose-100` Tailwind paletinde net ayrışır.
 */
export const AUTH_POWDER_PAGE = "max-md:bg-rose-50";
export const AUTH_POWDER_HEADER =
  "max-md:bg-rose-50 max-md:border-b-rose-200/50";
export const AUTH_POWDER_CARD = "max-md:border-rose-200/60 max-md:bg-rose-100";
export const AUTH_POWDER_INPUT = "max-md:bg-rose-50";
