import type { Metadata } from "next";

import { PageShell } from "@/components/ui/page-shell";
import { BRAND_SITE } from "@/lib/brand";
import { SEO_OG_IMAGE } from "@/lib/seo";
import { getServerRequestOrigin, getSiteUrl } from "@/lib/site-url";
import type { LeaderboardRow } from "@/types/gamification";

const liderlikUrl = `${getSiteUrl()}/liderlik`;
const liderlikTitle = `İyilik liderliği — ${BRAND_SITE}`;
const liderlikDesc =
  "Topluluk iyilik puanları ve liderlik tablosu — rekabet değil, birlikte destek; PATİSİD.";

export const metadata: Metadata = {
  title: liderlikTitle,
  description: liderlikDesc,
  alternates: { canonical: liderlikUrl },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: liderlikUrl,
    siteName: BRAND_SITE,
    title: liderlikTitle,
    description: liderlikDesc,
    images: [SEO_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: liderlikTitle,
    description: liderlikDesc,
    images: [SEO_OG_IMAGE.url],
  },
};

async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const base = await getServerRequestOrigin();
  const res = await fetch(`${base}/api/leaderboard`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = (await res.json()) as { leaderboard?: LeaderboardRow[] };
  return json.leaderboard ?? [];
}

export default async function LiderlikPage() {
  const items = await getLeaderboard();
  const displayName = "xxxx";

  return (
    <PageShell
      title="İyilik liderliği"
      lead="Topluluğun topladığı iyilik puanları. Rekabet değil, birlikte destek olma. İsimler güvenlik için gizlenmiştir."
    >
      <div className="card-surface overflow-hidden p-0">
        {items.length === 0 ? (
          <p className="px-4 py-5 text-sm text-zinc-500">Henüz puan verisi yok.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {items.map((row, idx) => (
              <li key={row.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-zinc-900">{displayName}</span>
                </div>
                <span className="text-sm font-semibold text-emerald-700">
                  {row.toplam_iyilik_puani} puan
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
