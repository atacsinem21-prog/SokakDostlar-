"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { PageShell } from "@/components/ui/page-shell";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { GroupMemberLite, GroupMessage } from "@/types/groups";

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

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function GrupDetayPage({ params }: Props) {
  const [groupId, setGroupId] = useState<string>("");
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState<GroupMemberLite[]>([]);
  const [myRole, setMyRole] = useState<string>("member");
  const [messageQuery, setMessageQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [memberQuery, setMemberQuery] = useState("");
  const [content, setContent] = useState("");
  const [isAcil, setIsAcil] = useState(false);
  const [showOnlyAcil, setShowOnlyAcil] = useState(false);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<"loading" | "ok" | "login" | "forbidden">("loading");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void params.then((p) => setGroupId(p.id));
  }, [params]);

  async function load() {
    if (!groupId) return;
    setLoading(true);
    setError("");
    setInfo("");
    const res = await fetch(`/api/groups/${groupId}/messages`, {
      cache: "no-store",
    });
    const json = (await res.json()) as {
      messages?: GroupMessage[];
      members?: GroupMemberLite[];
      my_role?: string;
      error?: string;
    };
    if (res.status === 401) {
      setAccess("login");
      setMessages([]);
      setMembers([]);
      setMyRole("member");
      setLoading(false);
      return;
    }
    if (res.status === 403) {
      setAccess("forbidden");
      setMessages([]);
      setMembers([]);
      setMyRole("member");
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setAccess("ok");
      setMessages([]);
      setMembers([]);
      setMyRole("member");
      setError(json.error ?? "Mesajlar yüklenemedi.");
      setLoading(false);
      return;
    }
    setAccess("ok");
    setMessages(json.messages ?? []);
    setMembers(json.members ?? []);
    setMyRole(json.my_role ?? "member");
    setLoading(false);
  }

  useEffect(() => {
    if (!groupId) return;
    setAccess("loading");
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    if (!groupId || access !== "ok") return;
    let sb: ReturnType<typeof createBrowserSupabaseClient>;
    try {
      sb = createBrowserSupabaseClient();
    } catch {
      return;
    }

    const channel = sb
      .channel(`group_messages:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          void load();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, access]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text || !groupId) return;
    setSending(true);
    setError("");
    setInfo("");

    const res = await fetch(`/api/groups/${groupId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, is_acil: isAcil }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Mesaj gönderilemedi.");
      setSending(false);
      return;
    }
    setContent("");
    setIsAcil(false);
    setSending(false);
    await load();
  }

  async function removeMessage(messageId: string) {
    if (!groupId) return;
    setDeletingId(messageId);
    setError("");
    setInfo("");
    const res = await fetch(`/api/groups/${groupId}/messages/${messageId}`, {
      method: "DELETE",
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Mesaj silinemedi.");
      setDeletingId(null);
      return;
    }
    setDeletingId(null);
    await load();
  }

  async function reportMessage(messageId: string) {
    if (!groupId) return;
    const reason = window.prompt("Neden bildiriyorsun? (3-300 karakter)");
    if (!reason) return;
    setReportingId(messageId);
    setError("");
    setInfo("");
    const res = await fetch(`/api/groups/${groupId}/messages/${messageId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Mesaj bildirilemedi.");
      setReportingId(null);
      return;
    }
    setReportingId(null);
    setInfo("Mesaj bildirildi. Teşekkürler.");
  }

  const title = useMemo(() => "Grup içi paylaşım", []);
  const visibleMessages = useMemo(() => {
    const base = showOnlyAcil ? messages.filter((m) => m.is_acil) : messages;
    const q = messageQuery.trim().toLocaleLowerCase("tr-TR");
    if (!q) return base;
    return base.filter((m) => m.content.toLocaleLowerCase("tr-TR").includes(q));
  }, [messages, showOnlyAcil, messageQuery]);
  const visibleMembers = useMemo(() => {
    const q = memberQuery.trim().toLocaleLowerCase("tr-TR");
    if (!q) return members;
    return members.filter((m) => m.profil_adi.toLocaleLowerCase("tr-TR").includes(q));
  }, [members, memberQuery]);
  const messageHighlightRegex = useMemo(() => {
    const q = messageQuery.trim();
    if (!q) return null;
    return new RegExp(`(${escapeRegExp(q)})`, "gi");
  }, [messageQuery]);
  const messageQueryLower = messageQuery.trim().toLocaleLowerCase("tr-TR");
  const matchingMessageIds = useMemo(() => {
    if (!messageQueryLower) return [];
    return visibleMessages
      .filter((m) => m.content.toLocaleLowerCase("tr-TR").includes(messageQueryLower))
      .map((m) => m.id);
  }, [visibleMessages, messageQueryLower]);

  useEffect(() => {
    setActiveMatchIndex(0);
  }, [messageQueryLower, showOnlyAcil]);

  useEffect(() => {
    if (matchingMessageIds.length === 0) return;
    if (activeMatchIndex >= matchingMessageIds.length) {
      setActiveMatchIndex(0);
    }
  }, [activeMatchIndex, matchingMessageIds]);

  useEffect(() => {
    if (matchingMessageIds.length === 0) return;
    const id = matchingMessageIds[activeMatchIndex];
    const el = document.getElementById(`msg-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeMatchIndex, matchingMessageIds]);

  return (
    <PageShell
      wide
      title={title}
      lead="Mahalle grubu içinde hızlı paylaşım. Acil işaretli mesajlar üstte sıralanır."
    >
      <div className="space-y-4">
        <div>
          <Link href="/gruplar" className="text-sm font-medium text-zinc-700 underline">
            ← Gruplara dön
          </Link>
          {myRole === "owner" || myRole === "moderator" ? (
            <Link
              href={`/gruplar/${groupId}/yonetim`}
              className="ml-4 text-sm font-medium text-zinc-700 underline"
            >
              Yönetim
            </Link>
          ) : null}
        </div>

        {access === "login" ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <p className="mb-3">Grup mesajlarını görmek için giriş yap.</p>
            <Link href="/giris" className="btn-primary inline-block">
              Giriş yap
            </Link>
          </div>
        ) : null}

        {access === "forbidden" ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-900">
            <p className="mb-3">Bu grubun üyesi değilsin veya erişimin yok.</p>
            <Link href="/gruplar" className="btn-secondary inline-block">
              Gruplara dön
            </Link>
          </div>
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

        <div className="card-surface h-[50vh] overflow-y-auto p-0">
          <div className="space-y-2 border-b border-zinc-100 px-4 py-2 text-xs text-zinc-600">
            <div className="flex items-center justify-between">
              <span>{messages.length} mesaj</span>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlyAcil}
                  onChange={(e) => setShowOnlyAcil(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span>Sadece acil</span>
              </label>
            </div>
            <input
              value={messageQuery}
              onChange={(e) => setMessageQuery(e.target.value)}
              placeholder="Mesaj ara..."
              className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-900"
            />
            {messageQueryLower ? (
              <div className="flex items-center justify-end gap-2">
                <span className="text-[11px] text-zinc-500">
                  {matchingMessageIds.length === 0
                    ? "0 eşleşme"
                    : `${activeMatchIndex + 1}/${matchingMessageIds.length}`}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMatchIndex((prev) =>
                      matchingMessageIds.length === 0
                        ? 0
                        : (prev - 1 + matchingMessageIds.length) % matchingMessageIds.length,
                    )
                  }
                  disabled={matchingMessageIds.length === 0}
                  className="rounded border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-700 disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMatchIndex((prev) =>
                      matchingMessageIds.length === 0 ? 0 : (prev + 1) % matchingMessageIds.length,
                    )
                  }
                  disabled={matchingMessageIds.length === 0}
                  className="rounded border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-700 disabled:opacity-40"
                >
                  ↓
                </button>
              </div>
            ) : null}
          </div>
          {access !== "ok" && access !== "loading" ? null : loading ? (
            <p className="px-4 py-5 text-sm text-zinc-500">Mesajlar yükleniyor...</p>
          ) : visibleMessages.length === 0 ? (
            <p className="px-4 py-5 text-sm text-zinc-500">
              {messages.length === 0
                ? "Henüz mesaj yok. İlk paylaşımı sen yap."
                : "Filtreye uygun mesaj bulunamadı."}
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {visibleMessages.map((m) => (
                <li
                  key={m.id}
                  id={`msg-${m.id}`}
                  className={
                    m.is_acil
                      ? `border-l-4 px-4 py-3 ${
                          matchingMessageIds[activeMatchIndex] === m.id
                            ? "border-sky-400 bg-sky-50/60"
                            : "border-amber-400 bg-amber-50/50"
                        }`
                      : matchingMessageIds[activeMatchIndex] === m.id
                        ? "border-l-4 border-sky-400 bg-sky-50/60 px-4 py-3"
                        : "px-4 py-3"
                  }
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {m.is_acil ? (
                        <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                          Acil
                        </span>
                      ) : null}
                      <span className="text-xs font-semibold text-zinc-700">
                        {m.profil_adi ?? "Gönüllü"}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] text-zinc-500">
                        {formatTime(m.created_at)}
                      </span>
                      {m.is_mine ? (
                        <button
                          type="button"
                          onClick={() => void removeMessage(m.id)}
                          disabled={deletingId === m.id}
                          className="text-[11px] font-medium text-rose-600 underline decoration-rose-300 underline-offset-2 hover:text-rose-800 disabled:opacity-50"
                        >
                          {deletingId === m.id ? "…" : "Sil"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void reportMessage(m.id)}
                          disabled={reportingId === m.id}
                          className="text-[11px] font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-800 disabled:opacity-50"
                        >
                          {reportingId === m.id ? "…" : "Bildir"}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-800">
                    {messageHighlightRegex
                      ? m.content.split(messageHighlightRegex).map((part, i) =>
                          part.toLocaleLowerCase("tr-TR") === messageQueryLower ? (
                            <mark key={`${m.id}-${i}`} className="rounded bg-amber-200 px-0.5">
                              {part}
                            </mark>
                          ) : (
                            <span key={`${m.id}-${i}`}>{part}</span>
                          ),
                        )
                      : m.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div ref={bottomRef} />
        </div>

        {access === "ok" ? (
          <div className="card-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">Üyeler</h3>
              <span className="text-xs text-zinc-500">{members.length} kişi</span>
            </div>
            <input
              value={memberQuery}
              onChange={(e) => setMemberQuery(e.target.value)}
              placeholder="Üye ara..."
              className="mb-3 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
            />
            {visibleMembers.length === 0 ? (
              <p className="text-xs text-zinc-500">
                {members.length === 0 ? "Üye listesi henüz yok." : "Aramaya uygun üye bulunamadı."}
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {visibleMembers.slice(0, 18).map((m) => (
                  <li
                    key={m.user_id}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700"
                  >
                    {m.profil_adi}
                    {m.role === "owner" ? " (kurucu)" : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {access === "ok" ? (
        <form onSubmit={send} className="card-surface space-y-3 p-4">
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-700">Mesaj</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Örn. Ben 20 dk içinde mama bırakacağım."
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
            />
          </label>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isAcil}
              onChange={(e) => setIsAcil(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300"
            />
            <span>
              <span className="font-medium text-amber-900">Acil</span> — hemen dikkat gerektiren
              durum (yaralı hayvan, tehlike vb.). Bu grupta günde en fazla 5 acil mesaj gönderebilirsin.
            </span>
          </label>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">{content.trim().length}/500</span>
            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="btn-primary disabled:opacity-60"
            >
              {sending ? "Gönderiliyor..." : "Paylaş"}
            </button>
          </div>
        </form>
        ) : null}
      </div>
    </PageShell>
  );
}

