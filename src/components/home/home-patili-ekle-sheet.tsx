"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const LocationPickerMap = dynamic(
  () => import("@/components/map/location-picker-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-500">
        Harita yükleniyor…
      </div>
    ),
  },
);

const DEFAULT_LAT = 39.0;
const DEFAULT_LNG = 35.0;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HomePatiliEkleSheet({ open, onClose }: Props) {
  const [isim, setIsim] = useState("");
  const [tur, setTur] = useState<"kedi" | "kopek">("kedi");
  const [aclik, setAclik] = useState(55);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setError("");
    setDoneId(null);
    setLoading(false);
    setIsim("");
    setTur("kedi");
    setAclik(55);
    setLat(DEFAULT_LAT);
    setLng(DEFAULT_LNG);
  }, [open]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setDoneId(null);
    setLoading(true);

    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isim: isim.trim(),
          tur,
          lat,
          lng,
          aclik_durumu: aclik,
        }),
      });

      const json = (await res.json()) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(json.error ?? "Kayıt eklenemedi.");
        return;
      }

      setDoneId(json.id ?? "");
    } catch {
      setError("Ağ hatası.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white shadow-xl max-h-[85dvh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-5 sm:px-6">
          <div className="mb-4 border-b border-zinc-200/90 pb-4">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Patili dost ekle
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Yolda gördüğün sokak hayvanını işaretleyerek diğer
              gönüllülere yardımcı olursun. Konumu kara üzerinde seç.
            </p>
          </div>

          <div className="pb-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-500">PATİSİD — Mobil ekleme</p>
              <button
                type="button"
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                onClick={onClose}
              >
                Kapat
              </button>
            </div>

            {doneId ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Kayıt alındı. Haritada diğer işaretlerle birlikte görünecek.
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/harita"
                    className="inline-flex rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-900"
                  >
                    Haritayı aç
                  </Link>
                  <button
                    type="button"
                    className="inline-flex rounded-lg border border-emerald-700 px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
                    onClick={() => {
                      setDoneId(null);
                      setIsim("");
                      setError("");
                    }}
                  >
                    Başka bir tane ekle
                  </button>
                </div>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-700">İsim veya tanım</span>
                <input
                  required
                  maxLength={80}
                  value={isim}
                  onChange={(e) => setIsim(e.target.value)}
                  placeholder="Örn. Sarı kedi, park köşesi"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-700">Tür</span>
                <select
                  value={tur}
                  onChange={(e) => setTur(e.target.value as "kedi" | "kopek")}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
                >
                  <option value="kedi">Kedi</option>
                  <option value="kopek">Köpek</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-700">Tahmini açlık (0–100)</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={aclik}
                  onChange={(e) => setAclik(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-zinc-500">{aclik}/100</span>
              </label>

              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Konum — haritaya tıkla
                </p>
                <LocationPickerMap
                  lat={lat}
                  lng={lng}
                  onChange={(la, ln) => {
                    setLat(la);
                    setLng(ln);
                  }}
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Enlem {lat.toFixed(5)}, boylam {lng.toFixed(5)}
                </p>
              </div>

              {error ? (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading || !isim.trim()}
                className="btn-primary w-full max-w-xs disabled:opacity-50"
              >
                {loading ? "Gönderiliyor…" : "Haritaya ekle"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

