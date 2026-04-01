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

const SIGNUP_TIMEOUT_MS = 60_000;
const OTP_TIMEOUT_MS = 45_000;

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
  /** E-posta onayı: kod girişi adımı */
  const [awaitingEmailOtp, setAwaitingEmailOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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
      const { data, error: err } = await withTimeout(
        sb.auth.signUp({
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
        }),
        SIGNUP_TIMEOUT_MS,
        "Sunucu yanıt vermedi (zaman aşımı). İnternetini kontrol et; SMTP yavaşsa bir süre sonra tekrar dene.",
      );
      if (err) {
        setError(formatSupabaseAuthError(err));
        return;
      }
      if (data.user && !data.session) {
        setAwaitingEmailOtp(true);
        setInfo(
          "E-postana gönderilen 6 haneli kodu aşağıya girerek hesabını doğrula.",
        );
        return;
      }
      router.push(nextAfter);
      router.refresh();
    } catch (e) {
      setError(formatUnknownAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    const code = otp.replace(/\D/g, "").slice(0, 8);
    if (code.length < 6) {
      setError("Lütfen e-postadaki 6 haneli kodu gir.");
      return;
    }
    setVerifyLoading(true);
    try {
      const sb = createBrowserSupabaseClient();
      const runVerify = async () => {
        let { error: err } = await sb.auth.verifyOtp({
          email: email.trim(),
          token: code,
          type: "signup",
        });
        if (err) {
          const second = await sb.auth.verifyOtp({
            email: email.trim(),
            token: code,
            type: "email",
          });
          err = second.error;
        }
        return { error: err };
      };
      const { error: err } = await withTimeout(
        runVerify(),
        OTP_TIMEOUT_MS,
        "Doğrulama zaman aşımı. Bağlantını kontrol edip tekrar dene.",
      );
      if (err) {
        setError(formatSupabaseAuthError(err));
        return;
      }
      router.push(nextAfter);
      router.refresh();
    } catch (e) {
      setError(formatUnknownAuthError(e));
    } finally {
      setVerifyLoading(false);
    }
  }

  async function onResendCode() {
    setError("");
    setResendLoading(true);
    try {
      const sb = createBrowserSupabaseClient();
      const { error: err } = await withTimeout(
        sb.auth.resend({
          type: "signup",
          email: email.trim(),
        }),
        OTP_TIMEOUT_MS,
        "Kod gönderimi zaman aşımı. Bağlantını kontrol et.",
      );
      if (err) {
        setError(formatSupabaseAuthError(err));
        return;
      }
      setInfo("Kod tekrar gönderildi. Gelen kutunu kontrol et.");
    } catch (e) {
      setError(formatUnknownAuthError(e));
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthFullscreenLayout>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-white">
        {awaitingEmailOtp ? "E-postanı doğrula" : "Kayıt ol"}
      </h1>
      <p className="mt-2 text-left text-sm leading-relaxed text-zinc-600 md:text-white/85">
        {awaitingEmailOtp
          ? "Gelen kutundaki doğrulama kodunu gir; ardından uygulamaya devam edebilirsin."
          : "Profil adın görev ve liderlikte görünebilir. Hayvanlara saygılı bir dil kullan."}
      </p>

      {awaitingEmailOtp ? (
        <form
          onSubmit={onVerifyOtp}
          className="mt-8 flex w-full flex-col gap-4 text-left"
        >
          <p className="text-sm text-zinc-600 md:text-white/80">
            <span className="font-medium text-zinc-800 md:text-white">
              {email}
            </span>
          </p>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Doğrulama kodu</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6 haneli kod"
              className={`${inputClass} text-center font-mono text-lg tracking-[0.35em]`}
              aria-describedby="otp-hint"
            />
            <span id="otp-hint" className="text-xs text-zinc-500 md:text-white/60">
              Kod genelde 6 rakamdır; e-postanın başlığında veya gövdesinde yazar.
            </span>
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
            disabled={verifyLoading}
            className="mt-1 w-full rounded-lg bg-[#1D7EDB] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#176fc4] disabled:opacity-60"
          >
            {verifyLoading ? "Doğrulanıyor…" : "Kodu doğrula"}
          </button>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <button
              type="button"
              onClick={() => void onResendCode()}
              disabled={resendLoading}
              className="font-medium text-[#1D7EDB] underline decoration-[#1D7EDB]/45 underline-offset-2 hover:decoration-[#1D7EDB] disabled:opacity-50 md:text-amber-200 md:decoration-amber-200/50 md:hover:decoration-amber-100"
            >
              {resendLoading ? "Gönderiliyor…" : "Kodu tekrar gönder"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAwaitingEmailOtp(false);
                setOtp("");
                setInfo("");
                setError("");
              }}
              className="text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 md:text-white/75 md:decoration-white/40"
            >
              Farklı e-posta ile kayıt
            </button>
          </div>
        </form>
      ) : (
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
      )}

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
