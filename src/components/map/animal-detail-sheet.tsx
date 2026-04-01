"use client";

import type { AnimalMapRow } from "@/types/animal";

type Props = {
  animal: AnimalMapRow | null;
  open: boolean;
  onClose: () => void;
};

function turLabel(tur: string): string {
  if (tur === "kopek") return "Köpek";
  return "Kedi";
}

function formatDate(iso: string | null): string {
  if (!iso) return "Henüz kayıt yok";
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AnimalDetailSheet({ animal, open, onClose }: Props) {
  return (
    <>
      <button
        type="button"
        aria-label="Kapat"
        className={`fixed inset-0 z-[1100] bg-black/35 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-[1101] max-h-[85vh] rounded-t-2xl border border-zinc-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 pb-8 pt-3">
          <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-zinc-200" />

          {animal ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {animal.isim}
                  </h2>
                  <p className="text-sm text-zinc-500">{turLabel(animal.tur)}</p>
                  {animal.is_demo ? (
                    <p className="mt-1 text-xs text-amber-800">
                      Örnek veri — Supabase&apos;e kayıt eklenince gerçek kayıtlarla
                      değişir.
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                >
                  Kapat
                </button>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs text-zinc-500">
                  <span>Açlık durumu</span>
                  <span>{animal.aclik_durumu}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, animal.aclik_durumu))}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                <span className="text-zinc-500">Son beslenme: </span>
                {formatDate(animal.son_beslenme)}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
