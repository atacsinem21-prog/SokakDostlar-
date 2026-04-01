"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import { AuthFullscreenLayout } from "@/components/auth/auth-fullscreen-layout";
import { AUTH_POWDER_INPUT } from "@/lib/brand";
import { safeInternalPath } from "@/lib/auth/safe-redirect";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const inputClass = `w-full rounded-lg border border-zinc-300/90 px-3 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-amber-400/80 focus:outline-none focus:ring-2 focus:ring-amber-500/25 md:bg-white ${AUTH_POWDER_INPUT}`;

const labelClass =
  "text-sm font-medium text-zinc-700 md:text-white/90";

function KayitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAfter = safeInternalPath(searchParams.get("next"), "/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilAdi, setProfilAdi] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const girisHref =
    nextAfter !== "/"
      ? `/giris?next=${encodeURIComponent(nextAfter)}`
      : "/giris";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    setLoading(true);
    try {
      const sb = createBrowserSupabaseClient();
      const { data, error: err } = await sb.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            profil_adi: profilAdi.trim() || undefined,
          },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data.user && !data.session) {
        setInfo(
          "Kayıt alındı. E-postanı doğrulaman gerekiyorsa gelen kutunu kontrol et.",
        );
        return;
      }
      router.push(nextAfter);
      router.refresh();
    } catch {
      setError("Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFullscreenLayout>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-white">
        Kayıt ol
      </h1>
      <p className="mt-2 text-left text-sm leading-relaxed text-zinc-600 md:text-white/85">
        Profil adın görev ve liderlikte görünebilir. Hayvanlara saygılı bir dil
        kullan.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 flex w-full flex-col gap-4 text-left"
      >
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Görünen ad (opsiyonel)</span>
          <input
            type="text"
            maxLength={50}
            value={profilAdi}
            onChange={(e) => setProfilAdi(e.target.value)}
            placeholder="Örn. Ayşe"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>E-posta</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Şifre (en az 6 karakter)</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        {error ? (
          <p className="rounded-lg border border-rose-400/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-lg border border-emerald-400/35 bg-emerald-950/35 px-3 py-2 text-sm text-emerald-100">
            {info}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-lg bg-[#1D7EDB] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#176fc4] disabled:opacity-60"
        >
          {loading ? "Kaydediliyor…" : "Hesap oluştur"}
        </button>
      </form>

      <p className="mt-8 text-left text-sm text-zinc-600 md:text-white/85">
        Zaten hesabın var mı?{" "}
        <Link
          href={girisHref}
          className="font-semibold text-[#1D7EDB] underline decoration-[#1D7EDB]/45 underline-offset-2 hover:decoration-[#1D7EDB] md:text-white md:decoration-white/50 md:hover:decoration-white"
        >
          Giriş yap
        </Link>
      </p>
    </AuthFullscreenLayout>
  );
}

function KayitFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-zinc-900 px-6 text-sm text-white/70">
      Yükleniyor…
    </div>
  );
}

export default function KayitPage() {
  return (
    <Suspense fallback={<KayitFallback />}>
      <KayitForm />
    </Suspense>
  );
}
