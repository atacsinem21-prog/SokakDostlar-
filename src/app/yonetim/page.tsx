"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/ui/page-shell";
import type {
  AdminOverviewGroup,
  AdminOverviewMember,
  AdminOverviewReport,
  AdminOverviewUser,
} from "@/types/admin";

type Payload = {
  users?: AdminOverviewUser[];
  groups?: AdminOverviewGroup[];
  members?: AdminOverviewMember[];
  reports?: AdminOverviewReport[];
  error?: string;
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

export default function PlatformYonetimPage() {
  const [users, setUsers] = useState<AdminOverviewUser[]>([]);
  const [groups, setGroups] = useState<AdminOverviewGroup[]>([]);
  const [members, setMembers] = useState<AdminOverviewMember[]>([]);
  const [reports, setReports] = useState<AdminOverviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function loadOverview() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/overview", { cache: "no-store" });
    const json = (await res.json()) as Payload;
    if (!res.ok) {
      setError(json.error ?? "Yönetim verileri yüklenemedi.");
      setLoading(false);
      return;
    }
    setUsers(json.users ?? []);
    setGroups(json.groups ?? []);
    setMembers(json.members ?? []);
    setReports(json.reports ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  const membersByGroup = useMemo(() => {
    const map = new Map<string, AdminOverviewMember[]>();
    for (const m of members) {
      const arr = map.get(m.group_id) ?? [];
      arr.push(m);
      map.set(m.group_id, arr);
    }
    return map;
  }, [members]);

  async function callAction(
    key: string,
    input: RequestInfo | URL,
    init?: RequestInit,
    confirmText?: string,
  ) {
    if (confirmText && typeof window !== "undefined" && !window.confirm(confirmText)) return;
    setBusyKey(key);
    setError("");
    const res = await fetch(input, init);
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(json.error ?? "İşlem başarısız.");
      setBusyKey(null);
      return;
    }
    setBusyKey(null);
    await loadOverview();
  }

  return (
    <PageShell
      wide
      title="Platform yönetimi"
      lead="Tüm kullanıcılar, gruplar ve mesaj bildirimlerini tek yerden yönet."
    >
      <div className="space-y-4">
        <Link href="/" className="text-sm font-medium text-zinc-700 underline">
          ← Ana sayfaya dön
        </Link>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        {loading ? <p className="text-sm text-zinc-500">Yönetim verileri yükleniyor...</p> : null}

        {!loading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <section className="card-surface lg:col-span-1">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900">Kullanıcılar ({users.length})</h2>
              <div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
                {users.map((u) => (
                  <div key={u.id} className="rounded-lg border border-zinc-100 p-2 text-xs text-zinc-700">
                    <p className="font-medium">{u.profil_adi}</p>
                    <p>Puan: {u.toplam_iyilik_puani}</p>
                    <p>Kayıt: {formatTime(u.created_at)}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          void callAction(
                            `u-admin-${u.id}`,
                            `/api/admin/users/${u.id}/platform-admin`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ is_admin: !u.is_platform_admin }),
                            },
                            u.is_platform_admin
                              ? `${u.profil_adi} için admin yetkisini kaldır?`
                              : `${u.profil_adi} için admin yetkisi ver?`,
                          )
                        }
                        disabled={busyKey === `u-admin-${u.id}`}
                        className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] disabled:opacity-40"
                      >
                        {u.is_platform_admin ? "Admin kaldır" : "Admin yap"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void callAction(
                            `u-del-${u.id}`,
                            `/api/admin/users/${u.id}`,
                            { method: "DELETE" },
                            `${u.profil_adi} kullanıcısını silmek istediğine emin misin?`,
                          )
                        }
                        disabled={busyKey === `u-del-${u.id}`}
                        className="rounded border border-rose-200 px-1.5 py-0.5 text-[10px] text-rose-700 disabled:opacity-40"
                      >
                        Kullanıcı sil
                      </button>
                    </div>
                    {u.is_platform_admin ? (
                      <p className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                        Platform admin
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="card-surface lg:col-span-1">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900">Gruplar ({groups.length})</h2>
              <div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
                {groups.map((g) => (
                  <div key={g.id} className="rounded-lg border border-zinc-100 p-2 text-xs text-zinc-700">
                    <p className="font-medium">{g.name}</p>
                    <p>Kurucu: {g.owner_name}</p>
                    <p>Üye: {g.member_count}</p>
                    <p>Yarıçap: {g.radius_km} km</p>
                    <p>Açılış: {formatTime(g.created_at)}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          void callAction(
                            `g-del-${g.id}`,
                            `/api/admin/groups/${g.id}`,
                            { method: "DELETE" },
                            `${g.name} grubunu tamamen silmek istediğine emin misin?`,
                          )
                        }
                        disabled={busyKey === `g-del-${g.id}`}
                        className="rounded border border-rose-200 px-1.5 py-0.5 text-[10px] text-rose-700 disabled:opacity-40"
                      >
                        Grup sil
                      </button>
                    </div>
                    <div className="mt-2 space-y-1">
                      {(membersByGroup.get(g.id) ?? []).slice(0, 8).map((m) => (
                        <div
                          key={`${m.group_id}-${m.user_id}`}
                          className="flex items-center justify-between gap-2 rounded border border-zinc-100 px-1.5 py-1"
                        >
                          <span>
                            {m.user_name} {m.role === "owner" ? "(owner)" : ""}
                          </span>
                          {m.role === "owner" ? null : (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  void callAction(
                                    `m-rm-${m.group_id}-${m.user_id}`,
                                    `/api/admin/groups/${m.group_id}/members/${m.user_id}/remove`,
                                    { method: "POST" },
                                    `${m.user_name} üyeliğini kaldır?`,
                                  )
                                }
                                disabled={busyKey === `m-rm-${m.group_id}-${m.user_id}`}
                                className="rounded border border-zinc-200 px-1 py-0.5 text-[10px] disabled:opacity-40"
                              >
                                Çıkar
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  void callAction(
                                    `m-ban-${m.group_id}-${m.user_id}`,
                                    `/api/admin/groups/${m.group_id}/members/${m.user_id}/ban`,
                                    {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ reason: "Admin panel ban" }),
                                    },
                                    `${m.user_name} kullanıcısını bu gruptan banla?`,
                                  )
                                }
                                disabled={busyKey === `m-ban-${m.group_id}-${m.user_id}`}
                                className="rounded border border-rose-200 px-1 py-0.5 text-[10px] text-rose-700 disabled:opacity-40"
                              >
                                Ban
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-surface lg:col-span-1">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900">Raporlar ({reports.length})</h2>
              <div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
                {reports.length === 0 ? (
                  <p className="text-xs text-zinc-500">Rapor yok veya rapor tablosu henüz boş.</p>
                ) : (
                  reports.map((r) => (
                    <div key={r.id} className="rounded-lg border border-zinc-100 p-2 text-xs text-zinc-700">
                      <p className="font-medium">{r.group_name}</p>
                      <p>Bildiren: {r.reporter_name}</p>
                      <p>Neden: {r.reason}</p>
                      <p>Zaman: {formatTime(r.created_at)}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            void callAction(
                              `msg-del-${r.message_id}`,
                              `/api/admin/messages/${r.message_id}`,
                              { method: "DELETE" },
                              "Bu mesajı silmek istediğine emin misin?",
                            )
                          }
                          disabled={busyKey === `msg-del-${r.message_id}`}
                          className="rounded border border-rose-200 px-1.5 py-0.5 text-[10px] text-rose-700 disabled:opacity-40"
                        >
                          Mesaj sil
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void callAction(
                              `rep-del-${r.id}`,
                              `/api/admin/reports/${r.id}`,
                              { method: "DELETE" },
                              "Bu raporu kapatmak istediğine emin misin?",
                            )
                          }
                          disabled={busyKey === `rep-del-${r.id}`}
                          className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] disabled:opacity-40"
                        >
                          Rapor kapat
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
