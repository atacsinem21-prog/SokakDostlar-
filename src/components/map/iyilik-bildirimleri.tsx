"use client";

import type { IyilikNot } from "@/hooks/use-animals-map";

type Props = {
  items: IyilikNot[];
  onDismiss: (id: string) => void;
};

function formatTime(at: number): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(at));
  } catch {
    return "";
  }
}

export function IyilikBildirimleri({ items, onDismiss }: Props) {
  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute right-3 top-14 z-[600] flex max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {items.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex items-start gap-2 rounded-lg border border-emerald-200 bg-white/95 px-3 py-2 text-xs text-zinc-800 shadow-lg backdrop-blur"
        >
          <span className="mt-0.5 text-base" aria-hidden>
            🐾
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium leading-snug">{n.text}</p>
            <p className="mt-0.5 text-[10px] text-zinc-500">{formatTime(n.at)}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(n.id)}
            className="shrink-0 rounded px-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Bildirimi kapat"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
