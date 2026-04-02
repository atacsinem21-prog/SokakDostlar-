"use client";

import Link from "next/link";

import { useAuthEmail } from "@/hooks/use-auth-email";

/**
 * Mobil: ana sayfada hızlı “patili ekle” — giriş yoksa girişe yönlendirir.
 */
export function HomeMobileAddFab() {
  const email = useAuthEmail();
  const loggedIn = Boolean(email);
  const nextPath = "/?add=patili-ekle";
  const href = loggedIn
    ? nextPath
    : `/giris?next=${encodeURIComponent(nextPath)}`;

  return (
    <Link
      href={href}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 min-w-[3.5rem] items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white shadow-lg shadow-zinc-900/25 ring-2 ring-white/90 transition hover:bg-zinc-800 active:scale-[0.98] md:hidden"
      aria-label={loggedIn ? "Patili ekle" : "Giriş yaparak patili ekle"}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg leading-none"
        aria-hidden
      >
        +
      </span>
      <span className="pr-0.5">Ekle</span>
    </Link>
  );
}
