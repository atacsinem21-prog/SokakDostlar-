"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandWordmark } from "@/components/brand-wordmark";
import { AuthNav } from "@/components/auth-nav";
import { AUTH_POWDER_HEADER } from "@/lib/brand";
import { useAuthEmail } from "@/hooks/use-auth-email";

function isAuthHeroPath(pathname: string | null): boolean {
  return pathname === "/giris" || pathname === "/kayit";
}

export function SiteHeader() {
  const pathname = usePathname();
  const email = useAuthEmail();
  const onAuthHero = isAuthHeroPath(pathname);
  const logoToHome = Boolean(email) && !onAuthHero;

  return (
    <header
      className={
        onAuthHero
          ? `sticky top-0 z-50 flex h-[5.5rem] w-full shrink-0 items-center border-b pl-2 pr-4 backdrop-blur-md sm:pl-3 md:border-white/15 md:bg-transparent md:backdrop-blur-none ${AUTH_POWDER_HEADER}`
          : "sticky top-0 z-50 border-b border-zinc-200/90 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-md"
      }
    >
      <div
        className={
          onAuthHero
            ? "flex h-full w-full min-w-0 items-center justify-between gap-2"
            : "mx-auto flex w-full max-w-5xl items-center justify-between gap-4"
        }
      >
        {logoToHome ? (
          <Link
            href="/"
            className="inline-flex min-w-0 shrink items-center self-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2"
          >
            <BrandWordmark surface="light" />
          </Link>
        ) : (
          <span className="inline-flex min-w-0 shrink items-center self-center">
            {onAuthHero ? (
              <>
                <span className="md:hidden">
                  <BrandWordmark surface="light" />
                </span>
                <span className="hidden drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:inline-flex">
                  <BrandWordmark surface="hero" />
                </span>
              </>
            ) : (
              <BrandWordmark surface="light" />
            )}
          </span>
        )}
        <div className={onAuthHero ? "shrink-0 pl-1" : undefined}>
          <AuthNav variant={onAuthHero ? "hero" : "default"} />
        </div>
      </div>
    </header>
  );
}
