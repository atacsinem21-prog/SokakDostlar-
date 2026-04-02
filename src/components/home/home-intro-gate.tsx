"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BrandWordmark } from "@/components/brand-wordmark";
import { useAuthEmail } from "@/hooks/use-auth-email";

const introSteps = [
  {
    title: "Mahallende ihtiyacı gör",
    text: "Harita ile yakınındaki patili dostların ihtiyaç noktalarını keşfet. Mama, su ve güvenli destek gereken alanları tek bakışta görerek daha doğru yerde yardım edebilirsin.",
  },
  {
    title: "Toplulukla birlikte hareket et",
    text: "Mahalle gruplarında hızlıca iletişim kur, acil yardımlaşmayı güçlendir. Aynı bölgede yaşayan gönüllülerle koordineli hareket ederek desteği daha etkili hale getir.",
  },
  {
    title: "Küçük adımlarla büyük etki",
    text: "Görevleri tamamla, düzenli katkı sağla ve iyilik zincirini büyüt. Düzenli katkı, sokak hayvanları için sürdürülebilir bir destek ağı oluşturur.",
  },
] as const;

export function HomeIntroGate() {
  const email = useAuthEmail();
  const [step, setStep] = useState(0);

  const shouldShow = useMemo(() => email === null, [email]);

  if (!shouldShow) return null;

  const isLast = step === introSteps.length - 1;
  const current = introSteps[step];

  return (
    <div
      className="fixed inset-0 z-[70] text-white"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(18,18,22,0.45), rgba(18,18,22,0.28), rgba(18,18,22,0.68)), url('https://i.hizliresim.com/82yxuw3.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="flex h-full w-full flex-col px-4 pb-8 pt-5 sm:px-8">
        <div className="flex items-start justify-between">
          <div className="shrink-0">
            <BrandWordmark surface="hero" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/giris"
              className="rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-base font-semibold"
            >
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              className="rounded-xl bg-amber-400 px-4 py-2 text-base font-semibold text-zinc-950"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-start">
          <div className="mt-6 w-full max-w-3xl rounded-3xl border border-white/25 bg-black/35 p-7 shadow-2xl backdrop-blur-md sm:mt-8 sm:p-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/95">
              Adım {step + 1} / {introSteps.length}
            </p>
            <h2 className="text-balance text-4xl font-semibold leading-tight sm:text-6xl">{current.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-2xl">{current.text}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              PATİSİD, sokak hayvanları için mahalle bazlı dayanışmayı güçlendiren bir iyilik haritasıdır.
              Önce ihtiyacı gör, sonra toplulukla birlikte harekete geç.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {introSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-8 bg-amber-300" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="rounded-xl border border-white/35 bg-white/10 px-5 py-2.5 text-base font-semibold text-white"
                >
                  Geri
                </button>
              ) : null}
              {!isLast ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(introSteps.length - 1, s + 1))}
                  className="rounded-xl bg-amber-400 px-6 py-2.5 text-base font-semibold text-zinc-950"
                >
                  İleri
                </button>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="rounded-xl bg-amber-400 px-6 py-2.5 text-base font-semibold text-zinc-950"
                  >
                    Giriş yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="rounded-xl border border-white/35 bg-white/10 px-6 py-2.5 text-base font-semibold text-white"
                  >
                    Kayıt ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
