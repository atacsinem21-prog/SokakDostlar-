"use client";

import Link from "next/link";

import { AUTH_POWDER_CARD } from "@/lib/brand";
import { useAuthEmail } from "@/hooks/use-auth-email";
import { usePlatformAdmin } from "@/hooks/use-platform-admin";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type AuthNavVariant = "default" | "hero";

export function AuthNav({ variant = "default" }: { variant?: AuthNavVariant }) {
  const email = useAuthEmail();
  const isPlatformAdmin = usePlatformAdmin();

  async function handleLogout() {
    try {
      const sb = createBrowserSupabaseClient();
      await sb.auth.signOut();
    } finally {
      window.location.href = "/";
    }
  }

  const isHero = variant === "hero";

  if (email === undefined) {
    return (
      <div
        className={`h-5 w-24 animate-pulse rounded ${isHero ? "bg-zinc-200/80 md:bg-white/25" : "bg-zinc-100"}`}
        aria-hidden
      />
    );
  }

  if (email) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        {isPlatformAdmin ? (
          <Link
            href="/yonetim"
            className={
              isHero
                ? "rounded-lg border border-white/40 bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/25 sm:text-sm"
                : "rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 sm:text-sm"
            }
          >
            Yönetim
          </Link>
        ) : null}
        <span
          className={`max-w-[10rem] truncate text-xs sm:max-w-[14rem] sm:text-sm ${
            isHero ? "text-white/90 drop-shadow" : "text-zinc-500"
          }`}
          title={email}
        >
          {email}
        </span>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className={
            isHero
              ? "rounded-lg border border-white/40 bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/25 sm:text-sm"
              : "rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 sm:text-sm"
          }
        >
          Çıkış
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/giris"
        className={
          isHero
            ? "text-sm font-medium text-zinc-700 hover:text-zinc-900 md:text-white md:drop-shadow md:hover:text-white/90"
            : "text-sm font-medium text-zinc-600 hover:text-zinc-900"
        }
      >
        Giriş
      </Link>
      <Link
        href="/kayit"
        className={
          isHero
            ? `rounded-lg border border-rose-200/45 px-2.5 py-1 text-sm font-medium text-zinc-900 shadow-sm hover:brightness-[0.98] md:border-transparent md:bg-white md:shadow-md md:hover:bg-white/95 ${AUTH_POWDER_CARD}`
            : "rounded-lg bg-zinc-900 px-2.5 py-1 text-sm font-medium text-white hover:bg-zinc-800"
        }
      >
        Kayıt ol
      </Link>
    </div>
  );
}
