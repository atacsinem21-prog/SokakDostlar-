"use client";

import type { RealtimeStatus } from "@/hooks/use-animals-map";

type Props = {
  status: RealtimeStatus;
};

export function RealtimeStatusPill({ status }: Props) {
  const label =
    status === "subscribed"
      ? "Canlı"
      : status === "connecting"
        ? "Bağlanıyor…"
        : status === "error"
          ? "Bağlantı sorunu"
          : "Hazır";

  const color =
    status === "subscribed"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : status === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-zinc-200 bg-white/90 text-zinc-700";

  return (
    <div
      className={`pointer-events-none absolute bottom-3 left-3 z-[600] rounded-full border px-2 py-1 text-[10px] font-medium shadow-sm backdrop-blur ${color}`}
      title="Supabase Realtime: animals tablosu"
    >
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </div>
  );
}
