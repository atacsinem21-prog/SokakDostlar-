"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import { AuthFullscreenLayout } from "@/components/auth/auth-fullscreen-layout";
import { AUTH_POWDER_INPUT } from "@/lib/brand";
import {
  formatSupabaseAuthError,
  formatUnknownAuthError,
} from "@/lib/auth-errors";
import { safeInternalPath } from "@/lib/auth/safe-redirect";
import { withTimeout } from "@/lib/promise-timeout";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const AUTH_TIMEOUT_MS = 60_000;

const inputClass = `w-full rounded-lg border border-zinc-300/90 px-3 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-amber-400/80 focus:outline-none focus:ring-2 focus:ring-amber-500/25 md:bg-white ${AUTH_POWDER_INPUT}`;

function GirisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAfterLogin = safeInternalPath(searchParams.get("next"), "/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const sb = createBrowserSupabaseClient();
      const { error: err } = await withTimeout(
        sb.auth.signInWithPassword({
          email: email.trim(),
          password,
        }),
        AUTH_TIMEOUT_MS,
        "Sunucu yanıt vermedi. Bağlantını kontrol edip tekrar dene.",
      );
      if (err) {
        setError(formatSupabaseAuthError(err));
        return;
      }
      router.push(nextAfterLogin);
      router.refresh();
    } catch (e) {
      setError(formatUnknownAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  const kayitHref =
    nextAfterLogin !== "/"
      ? `/kayit?next=${encodeURIComponent(nextAfterLogin)}`
      : "/kayit";

  return (
    <AuthFullscreenLayout>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-white">
        Giriş
      </h1>
      <p className="mt-2 text-left text-sm leading-relaxed text-zinc-600 md:text-white/85">
        İyilik puanı ve kanıt akışı için oturum aç.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 flex w-full flex-col gap-4 text-left"
      >
        <label className="sr-only" htmlFor="giris-email">
          E-posta
        </label>
        <input
          id="giris-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          className={inputClass}
        />

        <label className="sr-only" htmlFor="giris-sifre">
          Şifre
        </label>
        <input
          id="giris-sifre"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          className={inputClass}
        />

        {error ? (
          <p
            className="rounded-lg border border-rose-400/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-100"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-lg bg-[#1D7EDB] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#176fc4] disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>

      <p className="mt-8 text-left text-sm text-zinc-600 md:text-white/85">
        Hesabın yok mu?{" "}
        <Link
          href={kayitHref}
          className="font-semibold text-[#1D7EDB] underline decoration-[#1D7EDB]/45 underline-offset-2 hover:decoration-[#1D7EDB] md:text-white md:decoration-white/50 md:hover:decoration-white"
        >
          Kayıt ol
        </Link>
      </p>
      <p className="mt-4 text-left text-xs leading-relaxed text-zinc-500 md:text-white/65">
        Giriş yapmadan{" "}
        <Link
          href="/hakkinda"
          className="font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-900 md:text-white/90 md:decoration-white/50"
        >
          Hakkında
        </Link>{" "}
        sayfasında projeyi okuyabilirsin.
      </p>
    </AuthFullscreenLayout>
  );
}

function GirisFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-zinc-900 px-6 text-sm text-white/70">
      Yükleniyor…
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={<GirisFallback />}>
      <GirisForm />
    </Suspense>
  );
}
