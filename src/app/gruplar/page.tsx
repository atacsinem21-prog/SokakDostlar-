"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { PageShell } from "@/components/ui/page-shell";
import type { GroupListItem } from "@/types/groups";

export default function GruplarPage() {
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [radiusKm, setRadiusKm] = useState(2);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [info, setInfo] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    setNeedsAuth(false);
    const res = await fetch("/api/groups", { cache: "no-store" });
    const json = (await res.json()) as { groups?: GroupListItem[]; error?: string };
    if (res.status === 401) {
      setNeedsAuth(true);
      setGroups([]);
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setError(json.error ?? "Gruplar yüklenemedi.");
      setLoading(false);
      return;
    }
    setGroups(json.groups ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const joinId = params.get("katil");
    if (!joinId) return;
    void (async () => {
      await join(joinId);
      params.delete("katil");
      const qs = params.toString();
      window.history.replaceState({}, "", qs ? `/gruplar?${qs}` : "/gruplar");
    })();
    // Sadece ilk açılışta query ile auto-join denensin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createGroup(e: FormEvent) {
    e.preventDefault();
    setBusyId("create");
    setError("");
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), radius_km: radiusKm }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Grup oluşturulamadı.");
      setBusyId(null);
      return;
    }
    setName("");
    await load();
    setBusyId(null);
  }

  async function join(groupId: string) {
    setBusyId(groupId);
    setError("");
    setInfo("");
    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_id: groupId }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Gruba katılım başarısız.");
      setBusyId(null);
      return;
    }
    setInfo("Gruba katıldın.");
    await load();
    setBusyId(null);
  }

  async function shareGroup(groupId: string) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/gruplar?katil=${encodeURIComponent(groupId)}`
        : `/gruplar?katil=${encodeURIComponent(groupId)}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "PATİSİD Mahalle Grubu",
          text: "Bu mahalle grubuna katıl:",
          url,
        });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setInfo("Grup linki panoya kopyalandı.");
        return;
      }
      setInfo(url);
    } catch {
      setError("Grup linki paylaşılamadı.");
    }
  }

  return (
    <PageShell
      wide
      title="Mahalle grupları"
      lead="Mahalle gönüllü grupları oluştur, katıl ve grup içinde anlık paylaşım yap."
    >
      <div className="space-y-6">
        {needsAuth ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <p className="mb-3">
              Grupları listelemek, oluşturmak veya katılmak için giriş yapman gerekir.
            </p>
            <Link href="/giris" className="btn-primary inline-block">
              Giriş yap
            </Link>
          </div>
        ) : null}

        {!needsAuth ? (
        <form onSubmit={createGroup} className="card-surface space-y-4 p-4">
          <h2 className="text-base font-semibold text-zinc-900">Yeni grup oluştur</h2>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-700">Grup adı</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              placeholder="Örn. Kadıköy Gönüllüleri"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-700">Yarıçap (km)</span>
            <input
              type="number"
              value={radiusKm}
              min={1}
              max={20}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-28 rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
            />
          </label>
          <button
            type="submit"
            disabled={busyId === "create"}
            className="btn-primary disabled:opacity-60"
          >
            {busyId === "create" ? "Oluşturuluyor..." : "Grup oluştur"}
          </button>
        </form>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {info}
          </p>
        ) : null}

        <div className="card-surface overflow-hidden p-0">
          {needsAuth ? (
            <p className="px-4 py-5 text-sm text-zinc-500">Giriş yaptıktan sonra gruplar burada listelenir.</p>
          ) : loading ? (
            <p className="px-4 py-5 text-sm text-zinc-500">Gruplar yükleniyor...</p>
          ) : groups.length === 0 ? (
            <p className="px-4 py-5 text-sm text-zinc-500">Henüz grup yok.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {groups.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="font-medium text-zinc-900">{g.name}</p>
                    <p className="text-xs text-zinc-500">
                      {g.member_count} üye · {g.radius_km} km
                    </p>
                  </div>
                  {g.joined ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                        Katıldın
                      </span>
                      <Link href={`/gruplar/${g.id}`} className="btn-secondary text-xs">
                        Gruba git
                      </Link>
                      <button
                        type="button"
                        onClick={() => void shareGroup(g.id)}
                        className="btn-secondary text-xs"
                      >
                        Paylaş
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void join(g.id)}
                      disabled={busyId === g.id}
                      className="btn-secondary text-xs disabled:opacity-60"
                    >
                      {busyId === g.id ? "Katılıyor..." : "Katıl"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}

