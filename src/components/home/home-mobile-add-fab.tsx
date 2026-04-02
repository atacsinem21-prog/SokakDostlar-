"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

/**
 * Mobil: "Ana ekrana ekle" (PWA install) kısayolu.
 * - Android/Chrome: beforeinstallprompt ile gerçek kurulum penceresi.
 * - iOS/Safari: otomatik prompt yok; kullanıcıya kısa yönerge gösterilir.
 */
export function HomeMobileAddFab() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  const isIOS = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    const navWithStandalone = navigator as Navigator & {
      standalone?: boolean;
    };
    const navStandalone =
      typeof navigator !== "undefined" &&
      "standalone" in navigator &&
      Boolean(navWithStandalone.standalone);
    const mediaStandalone = window.matchMedia?.("(display-mode: standalone)").matches;
    return Boolean(navStandalone || mediaStandalone);
  }, []);

  useEffect(() => {
    if (isStandalone) {
      setHidden(true);
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, [isStandalone]);

  async function onClick() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setHidden(true);
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIOS) {
      window.alert(
        "iPhone'da ana ekrana eklemek için Safari menüsünden Paylaş -> Ana Ekrana Ekle adımlarını kullan.",
      );
      return;
    }

    window.alert("Bu cihaz/tarayıcı şu an otomatik kurulum penceresi sunmuyor.");
  }

  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 min-w-[3.5rem] items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white shadow-lg shadow-zinc-900/25 ring-2 ring-white/90 transition hover:bg-zinc-800 active:scale-[0.98] md:hidden"
      aria-label="Ana ekrana ekle"
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg leading-none"
        aria-hidden
      >
        +
      </span>
      <span className="pr-0.5">Ana ekrana ekle</span>
    </button>
  );
}
