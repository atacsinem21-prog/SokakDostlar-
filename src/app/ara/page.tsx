import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const araUrl = `${baseUrl}/ara`;
const araTitle = `Arama — ${BRAND_SITE}`;
const araDesc =
  "Sokak hayvanları kayıtları ve harita üzerinde arama; PATİSİD İyilik Haritası.";

export const metadata: Metadata = {
  title: araTitle,
  description: araDesc,
  alternates: { canonical: araUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: araUrl,
    siteName: BRAND_SITE,
    title: araTitle,
    description: araDesc,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: araTitle,
    description: araDesc,
    images: [SEO_OG_IMAGE.url],
  },
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AraPage({ searchParams }: Props) {
  const q = (await searchParams).q?.trim() ?? "";

  return (
    <PageShell
      wide
      title="Arama"
      lead="Harita ve topluluk kayıtlarında arama; geliştirmeye açık bir başlangıç noktası."
    >
      <form
        method="get"
        action="/ara"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        role="search"
      >
        <label htmlFor="site-search" className="sr-only">
          Site içi arama
        </label>
        <input
          id="site-search"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Örn. mahalle, il veya anahtar kelime"
          className="min-h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-900/5 placeholder:text-zinc-400 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/25"
          autoComplete="off"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Ara
        </button>
      </form>

      {q ? (
        <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-5 text-sm text-zinc-700">
          <p className="font-medium text-zinc-900">
            “{q}” için sonuçlar yakında harita ve liste ile birleştirilecek.
          </p>
          <p className="mt-2 text-zinc-600">
            Şimdilik yakınındaki kayıtları görmek için haritayı kullanabilirsin.
          </p>
          <Link
            href="/harita"
            className="mt-4 inline-block text-sm font-semibold text-amber-900 underline decoration-amber-300 underline-offset-2 hover:text-amber-950"
          >
            Haritaya git
          </Link>
        </div>
      ) : (
        <p className="mt-6 text-sm text-zinc-600">
          Arama kutusu Google’ın anlayacağı{" "}
          <strong className="font-medium text-zinc-800">SearchAction</strong>{" "}
          hedefidir; içerik ve indeks büyüdükçe sonuçlar zenginleşir.
        </p>
      )}

      <p className="mt-10 text-sm">
        <Link href="/" className="font-medium text-zinc-900 underline">
          Ana sayfaya dön
        </Link>
      </p>
    </PageShell>
  );
}
