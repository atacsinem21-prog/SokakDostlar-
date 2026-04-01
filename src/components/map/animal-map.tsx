"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAnimalsMap } from "@/hooks/use-animals-map";
import type { AnimalMapRow } from "@/types/animal";

import { AnimalDetailSheet } from "./animal-detail-sheet";
import { IyilikBildirimleri } from "./iyilik-bildirimleri";
import { RealtimeStatusPill } from "./realtime-status-pill";

const AnimalMapLeaflet = dynamic(() => import("./animal-map-leaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 bg-gradient-to-b from-zinc-100 to-zinc-50 text-sm text-zinc-600">
      <span
        className="inline-block h-8 w-8 animate-pulse rounded-full bg-amber-200/60"
        aria-hidden
      />
      Harita yükleniyor…
    </div>
  ),
});

export function AnimalMap() {
  const {
    animals,
    fetchError,
    realtimeStatus,
    notifications,
    dismissNotification,
    reportMapView,
    geoState,
    flyToUser,
    requestLocation,
    wideAreaWarning,
    mapInteractionEnabled,
  } = useAnimalsMap();

  const [selected, setSelected] = useState<AnimalMapRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  /** Mobil: konum hazırken varsayılan kare; tam ekran açılır */
  const [mobileMapExpanded, setMobileMapExpanded] = useState(false);
  const [resizeTick, setResizeTick] = useState(0);

  useEffect(() => {
    setSelected((prev) => {
      if (!prev) return prev;
      const u = animals.find((a) => a.id === prev.id);
      return u ?? null;
    });
  }, [animals]);

  const openSheet = (a: AnimalMapRow) => {
    setSelected(a);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
  };

  const bumpResize = () => setResizeTick((n) => n + 1);

  const toggleMobileExpand = () => {
    setMobileMapExpanded((v) => !v);
    bumpResize();
  };

  const showLocationGate = geoState === "prompt" || geoState === "locating";
  const showDenied = geoState === "denied";
  const ready = geoState === "ready";
  const squareMobile = ready && !mobileMapExpanded;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      {showLocationGate ? (
        <div className="absolute inset-0 z-[600] flex flex-col items-center justify-center gap-4 bg-zinc-900/75 px-6 text-center backdrop-blur-sm">
          {geoState === "locating" ? (
            <>
              <span
                className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
              <p className="max-w-sm text-sm text-white/95">
                Konumun alınıyor…
              </p>
            </>
          ) : (
            <>
              <p className="max-w-md text-base font-semibold text-white">
                Yakınındaki patili dostlarını görebilmek için konum izni gerekli
              </p>
              <p className="max-w-md text-sm leading-relaxed text-white/85">
                Harita yalnızca bulunduğun çevredeki kayıtları (yaklaşık 50
                adede kadar) gösterir; böylece hem gizlilik korunur hem harita
                akıcı kalır.
              </p>
              <button
                type="button"
                onClick={() => requestLocation()}
                className="rounded-xl bg-[#1D7EDB] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#176fc4]"
              >
                Konumu paylaş
              </button>
            </>
          )}
        </div>
      ) : null}

      {showDenied ? (
        <div className="absolute inset-0 z-[600] flex flex-col items-center justify-center gap-4 bg-zinc-900/80 px-6 text-center backdrop-blur-sm">
          <p className="max-w-md text-base font-semibold text-white">
            Konum izni olmadan harita açılamıyor
          </p>
          <p className="max-w-md text-sm leading-relaxed text-white/85">
            Yakınındaki patili dostlarını listelemek için tarayıcı veya sistem
            ayarlarından bu siteye konum erişimine izin ver, ardından tekrar
            dene.
          </p>
          <button
            type="button"
            onClick={() => requestLocation()}
            className="rounded-xl bg-[#1D7EDB] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#176fc4]"
          >
            Tekrar dene
          </button>
        </div>
      ) : null}

      {ready && wideAreaWarning ? (
        <div className="pointer-events-none absolute bottom-12 left-3 right-3 z-[500] max-md:bottom-28 rounded-xl border border-amber-200/80 bg-amber-50/95 px-3 py-2.5 text-center text-xs text-amber-950 shadow-md backdrop-blur sm:bottom-14">
          <span className="font-medium">Yakın çevre modu:</span> Haritada
          yalnızca bulunduğun konumun çevresindeki patili dostlar
          gösterilmektedir; uzaklaştırdığında başka bölgelerdeki tüm kayıtlar
          görünmez.
        </div>
      ) : null}

      <div
        className={`relative flex min-h-0 flex-1 flex-col md:block ${
          ready && mobileMapExpanded
            ? "max-md:fixed max-md:inset-0 max-md:z-[530] max-md:bg-white"
            : squareMobile
              ? "max-md:items-center max-md:justify-center max-md:py-3"
              : ""
        }`}
      >
        {ready && mobileMapExpanded ? (
          <button
            type="button"
            onClick={toggleMobileExpand}
            className="absolute left-3 top-3 z-[560] rounded-full border border-zinc-200/90 bg-white/95 px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-md backdrop-blur md:hidden"
          >
            Kare görünüm
          </button>
        ) : null}

        <div
          className={
            !ready
              ? "relative h-full min-h-[50vh] w-full overflow-hidden bg-zinc-100 md:min-h-0"
              : mobileMapExpanded
                ? "relative h-full min-h-0 w-full flex-1 overflow-hidden bg-zinc-100"
                : "relative w-full overflow-hidden bg-zinc-100 max-md:aspect-square max-md:w-[min(85vw,380px)] max-md:max-w-full max-md:rounded-2xl max-md:border max-md:border-zinc-200/80 max-md:shadow-xl md:h-full md:rounded-none md:border-0 md:shadow-none"
          }
        >
          <Link
            href="/harita/patili-ekle"
            className="absolute right-3 top-3 z-[560] rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-lg transition hover:bg-zinc-800 sm:text-sm"
          >
            Patili ekle
          </Link>

          {fetchError ? (
            <div className="absolute left-3 right-3 top-14 z-[500] rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow sm:top-16">
              {fetchError}
            </div>
          ) : null}

          <IyilikBildirimleri
            items={notifications}
            onDismiss={dismissNotification}
          />
          {ready ? (
            <RealtimeStatusPill status={realtimeStatus} />
          ) : null}

          <AnimalMapLeaflet
            animals={ready ? animals : []}
            onMarkerClick={openSheet}
            onMapClick={closeSheet}
            onViewportChange={reportMapView}
            viewportReportingEnabled={mapInteractionEnabled}
            flyToUser={flyToUser}
            resizeTick={resizeTick}
          />
        </div>

        {ready && !mobileMapExpanded ? (
          <button
            type="button"
            onClick={toggleMobileExpand}
            className="mt-3 w-full max-w-[min(85vw,380px)] self-center rounded-full border border-zinc-200/90 bg-white/95 px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-md backdrop-blur transition hover:bg-zinc-50 md:hidden"
          >
            Tam ekran harita
          </button>
        ) : null}
      </div>

      <AnimalDetailSheet
        animal={selected}
        open={sheetOpen && selected !== null}
        onClose={closeSheet}
      />
    </div>
  );
}
