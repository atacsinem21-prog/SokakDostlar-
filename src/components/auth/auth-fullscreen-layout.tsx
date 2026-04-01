import type { ReactNode } from "react";

import { BrandWordmark } from "@/components/brand-wordmark";
import { SiteFooter } from "@/components/site-footer";
import { AUTH_POWDER_CARD, AUTH_POWDER_PAGE } from "@/lib/brand";
import { AUTH_HEADER_HEIGHT_REM } from "@/lib/auth-layout";

/**
 * Varsayılan tam ekran arka plan.
 * - `NEXT_PUBLIC_AUTH_HERO_IMAGE_URL` — masaüstü + mobil banner (mobil özel yoksa)
 * - `NEXT_PUBLIC_AUTH_HERO_IMAGE_MOBILE_URL` — sadece mobil üst banner’da kullanılır (isteğe bağlı)
 */
export const AUTH_HERO_IMAGE_DEFAULT =
  "https://i.hizliresim.com/5qtksgw.jpg";

function heroBgImageStyle(url: string): { backgroundImage: string } {
  return { backgroundImage: `url("${url}")` };
}

function resolveHeroUrl(): string {
  const env = process.env.NEXT_PUBLIC_AUTH_HERO_IMAGE_URL?.trim();
  if (env) return env;
  return AUTH_HERO_IMAGE_DEFAULT;
}

function resolveMobileHeroUrl(): string | null {
  const env = process.env.NEXT_PUBLIC_AUTH_HERO_IMAGE_MOBILE_URL?.trim();
  return env || null;
}

type Props = {
  children: ReactNode;
};

/**
 * Masaüstü: tam ekran görsel + sağda cam kart.
 * Mobil: üstte banner (cover), altında açık zemin + beyaz kart — koyu “simsiyah” tam ekran yok.
 */
export function AuthFullscreenLayout({ children }: Props) {
  const imageUrl = resolveHeroUrl();
  const mobileOnlyUrl = resolveMobileHeroUrl();
  const bannerUrl = mobileOnlyUrl ?? imageUrl;

  return (
    <div
      className={`relative isolate flex min-h-0 w-full flex-1 flex-col overflow-x-hidden max-md:min-h-screen md:overflow-hidden ${AUTH_POWDER_PAGE} md:bg-transparent`}
      style={{
        marginTop: `-${AUTH_HEADER_HEIGHT_REM}`,
        paddingTop: AUTH_HEADER_HEIGHT_REM,
      }}
    >
      {/* Masaüstü: tam ekran hero */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 md:block"
        aria-hidden
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={heroBgImageStyle(imageUrl)}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col md:min-h-0">
        {/* Mobil: üst banner — görsel net, cover ile doldurur */}
        <div
          className="relative z-10 h-[min(42vh,17rem)] min-h-[11rem] w-full shrink-0 overflow-hidden md:hidden"
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={heroBgImageStyle(bannerUrl)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15" />
        </div>

        <div className="mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-end md:overflow-visible md:bg-transparent md:px-10 md:py-10 lg:pr-14 xl:pr-20">
          <div
            className={`w-full min-w-0 max-w-md shrink-0 rounded-2xl border p-6 shadow-lg sm:p-8 md:rounded-2xl md:border-white/60 md:bg-white/35 md:p-9 md:shadow-2xl md:backdrop-blur-xl ${AUTH_POWDER_CARD}`}
          >
            <div className="mb-8 flex w-full justify-center sm:justify-start">
              <BrandWordmark surface="light" className="md:hidden" />
              <BrandWordmark surface="card" className="hidden md:flex" />
            </div>
            {children}
          </div>
        </div>

        <div className="shrink-0">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
