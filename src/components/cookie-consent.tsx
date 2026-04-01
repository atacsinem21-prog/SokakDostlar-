"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { BRAND_SITE } from "@/lib/brand";

const STORAGE_KEY = "patisid_cookie_consent_v1";

type StoredCookieConsent = {
  v: 1;
  at: string;
  mode: "all" | "essential" | "custom";
  analytics: boolean;
  marketing: boolean;
};

function readStored(): StoredCookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCookieConsent;
    if (parsed?.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(c: StoredCookieConsent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = readStored();
    if (!existing) setOpen(true);
  }, []);

  const save = useCallback((next: StoredCookieConsent) => {
    writeStored(next);
    setOpen(false);
    setCustomizing(false);
  }, []);

  const allowAll = useCallback(() => {
    save({
      v: 1,
      at: new Date().toISOString(),
      mode: "all",
      analytics: true,
      marketing: true,
    });
  }, [save]);

  const reject = useCallback(() => {
    save({
      v: 1,
      at: new Date().toISOString(),
      mode: "essential",
      analytics: false,
      marketing: false,
    });
  }, [save]);

  const saveCustom = useCallback(() => {
    save({
      v: 1,
      at: new Date().toISOString(),
      mode: "custom",
      analytics,
      marketing,
    });
  }, [analytics, marketing, save]);

  if (!mounted || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-hidden
        role="presentation"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 text-zinc-100 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <h2 id="cookie-consent-title" className="text-base font-semibold">
            Çerez tercihleri
          </h2>
          <span className="shrink-0 text-[0.65rem] text-zinc-500">{BRAND_SITE}</span>
        </div>

        <div className="max-h-[min(70vh,28rem)] overflow-y-auto px-5 py-4 text-sm leading-relaxed text-zinc-300">
          <p>
            Web sitemiz, temel işlevler için zorunlu çerezler kullanır. İsteğe
            bağlı olarak içeriği geliştirmek, site kullanımını ölçmek ve
            deneyimi kişiselleştirmek için analitik veya pazarlama çerezleri
            ekleyebiliriz. Tercihlerini dilediğin zaman{" "}
            <Link
              href="/cerez-politikasi"
              className="font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              çerez politikası
            </Link>{" "}
            sayfasından veya tarayıcı ayarlarından güncelleyebilirsin.
          </p>

          {customizing ? (
            <ul className="mt-5 space-y-4 border-t border-zinc-800 pt-5">
              <li className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-100">Zorunlu</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Oturum ve güvenlik; site çalışması için gereklidir.
                  </p>
                </div>
                <span className="text-xs font-medium text-emerald-400/90">
                  Açık
                </span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <label className="flex-1 cursor-pointer" htmlFor="cc-analytics">
                  <span className="font-medium text-zinc-100">İstatistik</span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    Ziyaret sayıları ve kullanım — anonimleştirilmiş olabilir.
                  </span>
                </label>
                <input
                  id="cc-analytics"
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-amber-500 focus:ring-amber-500/40"
                />
              </li>
              <li className="flex items-start justify-between gap-3">
                <label className="flex-1 cursor-pointer" htmlFor="cc-marketing">
                  <span className="font-medium text-zinc-100">Pazarlama</span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    İlgi alanına uygun içerik veya kampanya (kullanılırsa).
                  </span>
                </label>
                <input
                  id="cc-marketing"
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-amber-500 focus:ring-amber-500/40"
                />
              </li>
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-zinc-800 bg-zinc-900/80 px-4 py-4">
          {!customizing ? (
            <>
              <button
                type="button"
                onClick={allowAll}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                <span aria-hidden>✓</span> Tümüne izin ver
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomizing(true);
                  setAnalytics(false);
                  setMarketing(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                <span aria-hidden>⚙</span> Özelleştir
              </button>
              <button
                type="button"
                onClick={reject}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-transparent px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800/80"
              >
                <span aria-hidden>✕</span> Reddet
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={saveCustom}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-500"
              >
                Seçimlerimi kaydet
              </button>
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="w-full rounded-xl py-2 text-sm text-zinc-400 hover:text-zinc-200"
              >
                Geri
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
