import Link from "next/link";

import { HomeFeatureGrid } from "@/components/home/home-feature-grid";
import { BRAND_PRODUCT, BRAND_SITE } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100dvh-8rem)] overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-100/90">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_70%_at_50%_-15%,rgba(251,191,36,0.14),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_0%_50%,rgba(254,243,199,0.35),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 top-1/3 -z-10 bg-[radial-gradient(circle_at_85%_75%,rgba(120,113,108,0.05),transparent_42%)]"
        aria-hidden
      />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div className="relative mx-auto rounded-[2rem] border border-white/90 bg-white/55 px-6 py-9 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.04),0_24px_48px_-12px_rgba(15,23,42,0.1)] ring-1 ring-zinc-900/[0.04] backdrop-blur-xl sm:px-10 sm:py-11">
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent sm:inset-x-12"
              aria-hidden
            />
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-950/85 sm:text-[0.8125rem]">
              {BRAND_SITE}
            </p>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-amber-900/75 sm:text-xs">
              Sokak hayvanları için
            </p>
            <h1 className="text-balance bg-gradient-to-br from-zinc-950 via-zinc-800 to-zinc-600 bg-clip-text text-4xl font-semibold tracking-[-0.03em] text-transparent [font-feature-settings:'ss01'] sm:text-5xl sm:leading-[1.08]">
              {BRAND_PRODUCT}
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-[0.9375rem] leading-relaxed text-zinc-600 sm:text-lg">
              Konumuna yakın kayıtları gör, görevleri tamamla, topluluğa katıl.
              Hayvanlara saygılı ve güvenli bir dil kullanıyoruz.
            </p>
          </div>
        </header>

        <HomeFeatureGrid />

        <footer className="mt-16 border-t border-zinc-200/60 bg-gradient-to-b from-transparent to-zinc-50/50 pt-10 text-center sm:text-left">
          <p className="text-xs leading-relaxed text-zinc-500 sm:text-sm">
            <Link
              href="/gizlilik"
              className="font-medium text-zinc-700 underline decoration-zinc-300/90 underline-offset-[3px] transition hover:text-zinc-900 hover:decoration-zinc-500"
            >
              Gizlilik ve veri
            </Link>
            <span className="mx-2 text-zinc-300">·</span>
            Kayıt olarak görev ve puan akışına katılabilirsin.
          </p>
        </footer>
      </main>
    </div>
  );
}
