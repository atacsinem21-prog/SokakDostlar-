import { PageShell } from "@/components/ui/page-shell";
import type { LeaderboardRow } from "@/types/gamification";

async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/leaderboard`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = (await res.json()) as { leaderboard?: LeaderboardRow[] };
  return json.leaderboard ?? [];
}

export default async function LiderlikPage() {
  const items = await getLeaderboard();

  return (
    <PageShell
      title="İyilik liderliği"
      lead="Topluluğun topladığı iyilik puanları. Rekabet değil, birlikte destek olma."
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
                  <span className="font-medium text-zinc-900">{row.profil_adi}</span>
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
