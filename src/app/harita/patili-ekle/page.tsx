"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { PageShell } from "@/components/ui/page-shell";

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

export default function PatiliEklePage() {
  const [isim, setIsim] = useState("");
  const [tur, setTur] = useState<"kedi" | "kopek">("kedi");
  const [aclik, setAclik] = useState(55);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);

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
      const json = (await res.json()) as { ok?: boolean; id?: string; error?: string };
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

  return (
    <PageShell
      wide
      title="Patili dost ekle"
      lead="Yolda gördüğün sokak hayvanını işaretleyerek diğer gönüllülere yardımcı olursun. Konumu kara üzerinde ve gerçek konuma yakın seç; deniz veya boş su üzerine işaret koyma."
    >
      <p className="mb-4 text-sm text-zinc-600">
        Gereksiz veya yanlış bildirimler hayvanların ve insanların güvenliğini
        zorlaştırır.
      </p>
      <p className="mb-6">
        <Link
          href="/harita"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Harita
        </Link>
      </p>

      {doneId ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Kayıt alındı. Haritada diğer işaretlerle birlikte görünecek.
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/harita"
              className="inline-flex rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-900"
            >
              Haritaya dön
            </Link>
            <button
              type="button"
              className="inline-flex rounded-lg border border-emerald-700 px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-100"
              onClick={() => {
                setDoneId(null);
                setIsim("");
              }}
            >
              Başka bir tane ekle
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
            onChange={(e) =>
              setTur(e.target.value as "kedi" | "kopek")
            }
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
          <LocationPickerMap lat={lat} lng={lng} onChange={(la, ln) => {
            setLat(la);
            setLng(ln);
          }} />
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
    </PageShell>
  );
}
