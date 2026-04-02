"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthEmail } from "@/hooks/use-auth-email";
import { AUTH_POWDER_PAGE, BRAND_SITE } from "@/lib/brand";

const nav = [
  { href: "/harita", label: "Harita" },
  { href: "/gorevler", label: "Görevler" },
  { href: "/liderlik", label: "Liderlik" },
  { href: "/rehber/sokak-hayvanlarina-destek", label: "Yardım rehberi" },
  { href: "/rehber/sokak-hayvanlarina-mama-vermek", label: "Mama rehberi" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/gizlilik", label: "Gizlilik" },
  { href: "/cerez-politikasi", label: "Çerez politikası" },
] as const;

function isAuthHeroPath(pathname: string | null): boolean {
  return pathname === "/giris" || pathname === "/kayit";
}

export function SiteFooter() {
  const pathname = usePathname();
  const email = useAuthEmail();
  const onAuthHero = isAuthHeroPath(pathname);
  const canNavigateApp = Boolean(email);

  const footerClass = onAuthHero
    ? `border-t py-8 max-md:border-rose-200/50 max-md:text-sm max-md:text-zinc-700 md:border-white/15 md:bg-transparent md:text-base md:text-white/95 ${AUTH_POWDER_PAGE} md:bg-transparent sm:text-lg`
    : "border-t border-zinc-200 bg-white py-8 text-sm text-zinc-600";

  const muted = onAuthHero
    ? "text-zinc-400 max-md:text-zinc-500 md:text-white/55"
    : "text-zinc-400";
  const linkActive = onAuthHero
    ? "font-medium text-zinc-700 transition hover:text-amber-900 max-md:hover:underline md:text-white md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:hover:text-white md:hover:no-underline"
    : "text-zinc-600 transition hover:text-amber-900";

  return (
    <footer className={footerClass}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p
            className={
              onAuthHero
                ? "max-w-md text-balance font-semibold leading-snug text-zinc-800 max-md:drop-shadow-none sm:max-w-lg md:text-white md:drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                : "max-w-sm font-medium text-zinc-800"
            }
          >
            {BRAND_SITE} — Sokak hayvanlarına saygı ve sorumlulukla yaklaşan bir
            topluluk haritası.
          </p>
          <p
            className={
              onAuthHero
                ? "mt-3 text-sm leading-relaxed text-zinc-600 max-md:drop-shadow-none sm:text-base md:text-white/85 md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                : "mt-2 text-xs text-zinc-500"
            }
          >
            Veriler gönüllü bildirimlerine dayanır; yanlış veya kötüye kullanım
            topluluğa zarar verir.
          </p>
        </div>
        <nav
          className={`flex flex-wrap gap-x-5 gap-y-3 sm:gap-x-7 ${onAuthHero ? "gap-y-2.5" : ""}`}
          aria-label="Alt bilgi"
        >
          {nav.map((item) => {
            if (
              item.href === "/gizlilik" ||
              item.href === "/cerez-politikasi" ||
              item.href === "/hakkinda" ||
              item.href === "/rehber/sokak-hayvanlarina-destek" ||
              item.href === "/rehber/sokak-hayvanlarina-mama-vermek"
            ) {
              return (
                <Link key={item.href} href={item.href} className={linkActive}>
                  {item.label}
                </Link>
              );
            }
            if (canNavigateApp) {
              return (
                <Link key={item.href} href={item.href} className={linkActive}>
                  {item.label}
                </Link>
              );
            }
            return (
              <span
                key={item.href}
                className={`cursor-not-allowed font-medium ${muted}`}
                aria-disabled="true"
              >
                {item.label}
              </span>
            );
          })}
          {canNavigateApp ? (
            <Link href="/" className={linkActive}>
              Ana sayfa
            </Link>
          ) : (
            <span className={`cursor-not-allowed font-medium ${muted}`} aria-disabled="true">
              Ana sayfa
            </span>
          )}
        </nav>
      </div>
    </footer>
  );
}
