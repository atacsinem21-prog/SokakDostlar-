"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PageShell } from "@/components/ui/page-shell";
import { useAuthEmail } from "@/hooks/use-auth-email";
import type { QuestListRow } from "@/types/gamification";

export default function GorevlerPage() {
  const email = useAuthEmail();
  const [items, setItems] = useState<QuestListRow[]>([]);
  const [error, setError] = useState<string>("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/quests");
      const json = (await res.json()) as { quests?: QuestListRow[]; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Görevler alınamadı.");
        return;
      }
      setItems(json.quests ?? []);
    })();
  }, []);

  const completeQuest = useCallback(
    async (questId: string) => {
      setToast("");
      setBusyId(questId);
      try {
        const res = await fetch("/api/quests/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questId }),
        });
        const json = (await res.json()) as {
          error?: string;
          result?: {
            ok?: boolean;
            already_completed?: boolean;
            added_points?: number;
          };
        };
        if (!res.ok) {
          setToast(json.error ?? "Tamamlanamadı.");
          return;
        }
        const row = json.result as {
          ok?: boolean;
          already_completed?: boolean;
          added_points?: number;
        } | null;
        if (row?.already_completed) {
          setToast("Bu görevi zaten tamamlamıştın.");
        } else if (row?.ok) {
          setToast(`+${Number(row.added_points) || 0} iyilik puanı eklendi.`);
        } else {
          setToast("Görev kaydedildi.");
        }
      } catch {
        setToast("Ağ hatası.");
      } finally {
        setBusyId(null);
      }
    },
    [],
  );

  const loggedIn = Boolean(email);

  return (
    <PageShell
      wide
      title="İyilik görevleri"
      lead="Görevi yaptığını düşündüğünde tamamla; puan doğrudan eklenir. Fotoğraf veya admin onayı yok — topluluğa güven ve saygılı davranmak sende."
    >
      {error ? (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {toast ? (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {toast}
        </p>
      ) : null}

      {!loggedIn && !error ? (
        <p className="mb-4 text-sm text-zinc-600">
          Puan almak için{" "}
          <Link href="/giris" className="font-medium text-amber-900 underline">
            giriş yap
          </Link>
          .
        </p>
      ) : null}

      {!error && items.length === 0 ? (
        <p className="text-sm text-zinc-500">Henüz listelenecek görev yok.</p>
      ) : null}

      <div className="grid gap-3">
        {items.map((q) => (
          <article
            key={q.id}
            className="card-surface flex flex-col gap-2 p-4"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 className="font-semibold text-zinc-900">{q.gorev_tipi}</h2>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                +{q.odul_puani} puan
              </span>
            </div>

            <p className="text-sm text-zinc-600">
              Hayvan: {q.animal?.isim ?? "Bilinmiyor"} (
              {q.animal?.tur === "kopek" ? "Köpek" : "Kedi"})
            </p>

            <div className="mt-3 flex items-center gap-2">
              {q.sponsor_logo_url ? (
                <Image
                  src={q.sponsor_logo_url}
                  alt={`${q.sponsor_adi ?? "Sponsor"} logosu`}
                  width={28}
                  height={28}
                  unoptimized
                  className="h-7 w-7 rounded object-contain"
                />
              ) : (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-zinc-100 text-[10px] font-semibold text-zinc-600">
                  {q.sponsor_adi?.slice(0, 2).toUpperCase() ?? "SP"}
                </span>
              )}
              <span className="text-xs text-zinc-500">
                Sponsor: {q.sponsor_adi ?? "Destekçi kurum"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!loggedIn || busyId === q.id}
                onClick={() => void completeQuest(q.id)}
                className="btn-primary inline-flex px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyId === q.id ? "Kaydediliyor…" : "Görevi tamamla"}
              </button>
              <Link
                href="/harita"
                className="btn-secondary inline-flex px-3 py-1.5 text-xs"
              >
                Haritada gör
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
