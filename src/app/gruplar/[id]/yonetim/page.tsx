"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/ui/page-shell";
import type { GroupMessageReportItem } from "@/types/groups";

type Props = {
  params: Promise<{ id: string }>;
};

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GrupYonetimPage({ params }: Props) {
  const [groupId, setGroupId] = useState("");
  const [reports, setReports] = useState<GroupMessageReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void params.then((p) => setGroupId(p.id));
  }, [params]);

  useEffect(() => {
    if (!groupId) return;
    void (async () => {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/groups/${groupId}/reports`, { cache: "no-store" });
      const json = (await res.json()) as { reports?: GroupMessageReportItem[]; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Raporlar yüklenemedi.");
        setReports([]);
        setLoading(false);
        return;
      }
      setReports(json.reports ?? []);
      setLoading(false);
    })();
  }, [groupId]);

  return (
    <PageShell
      wide
      title="Grup yönetimi"
      lead="Sadece owner/moderator erişebilir. Bildirilen mesajları buradan görürsün."
    >
      <div className="space-y-4">
        <Link href={`/gruplar/${groupId}`} className="text-sm font-medium text-zinc-700 underline">
          ← Sohbete dön
        </Link>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        <div className="card-surface p-0">
          {loading ? (
            <p className="px-4 py-4 text-sm text-zinc-500">Raporlar yükleniyor...</p>
          ) : reports.length === 0 ? (
            <p className="px-4 py-4 text-sm text-zinc-500">Henüz rapor yok.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {reports.map((r) => (
                <li key={r.id} className="space-y-2 px-4 py-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span>
                      Bildiren: <strong>{r.reporter_name}</strong> · Mesaj sahibi:{" "}
                      <strong>{r.message_author_name}</strong>
                    </span>
                    <span>{formatTime(r.created_at)}</span>
                  </div>
                  <p className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-800">
                    {r.message_content}
                  </p>
                  <p className="text-xs text-zinc-700">
                    Neden: <span className="font-medium">{r.reason}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}
