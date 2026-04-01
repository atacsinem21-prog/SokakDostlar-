"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  DEFAULT_TURKEY_BBOX,
  LOCATION_WATCH_MIN_INTERVAL_MS,
  LOCATION_WATCH_MIN_MOVE_M,
  NEARBY_MAP_HALF_SPAN_DEG,
  NEARBY_MAP_PIN_LIMIT,
  bboxAroundPoint,
  distanceMeters,
  type MapBBox,
} from "@/lib/map-bbox";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { AnimalMapRow } from "@/types/animal";

export type RealtimeStatus = "idle" | "connecting" | "subscribed" | "error";

export type IyilikNot = { id: string; text: string; at: number };

/** prompt: izin bekleniyor | locating: aliniyor | denied: reddedildi | ready: konum alindi */
export type GeoMapState = "prompt" | "locating" | "denied" | "ready";

export type FlyToTarget = { lat: number; lng: number; zoom: number };

function bboxQuery(b: MapBBox, limit: number): string {
  const p = new URLSearchParams({
    west: String(b.west),
    south: String(b.south),
    east: String(b.east),
    north: String(b.north),
    limit: String(limit),
  });
  return p.toString();
}

export function useAnimalsMap() {
  const [animals, setAnimals] = useState<AnimalMapRow[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] =
    useState<RealtimeStatus>("idle");
  const [notifications, setNotifications] = useState<IyilikNot[]>([]);
  const [geoState, setGeoState] = useState<GeoMapState>("prompt");
  const [flyToUser, setFlyToUser] = useState<FlyToTarget | null>(null);
  const [wideAreaWarning, setWideAreaWarning] = useState(false);
  /** Ilk konum alindiginda watchPosition baslatilir */
  const [locationAnchor, setLocationAnchor] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mounted = useRef(true);
  const bboxRef = useRef<MapBBox>(DEFAULT_TURKEY_BBOX);
  const limitRef = useRef(NEARBY_MAP_PIN_LIMIT);
  /** Son yukleme merkezi + zaman — watch ile gereksiz refetch engeli */
  const watchAnchorRef = useRef<{
    lat: number;
    lng: number;
    lastFetchAt: number;
  } | null>(null);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const pushNot = useCallback(
    (text: string) => {
      const id =
        typeof globalThis.crypto?.randomUUID === "function"
          ? globalThis.crypto.randomUUID()
          : String(Date.now());
      setNotifications((prev) =>
        [{ id, text, at: Date.now() }, ...prev].slice(0, 5),
      );
      window.setTimeout(() => {
        if (mounted.current) dismissNotification(id);
      }, 8000);
    },
    [dismissNotification],
  );

  const refetch = useCallback(async () => {
    try {
      const b = bboxRef.current;
      const lim = limitRef.current;
      const res = await fetch(`/api/animals?${bboxQuery(b, lim)}`);
      const json = (await res.json()) as {
        animals?: AnimalMapRow[];
        error?: string;
      };
      if (!res.ok) {
        setFetchError(json.error ?? "Hayvanlar yüklenemedi.");
        return;
      }
      setAnimals(json.animals ?? []);
      setFetchError(null);
    } catch {
      setFetchError("Ağ hatası.");
    }
  }, []);

  const reportMapView = useCallback((b: MapBBox, zoom: number) => {
    const span = Math.max(b.east - b.west, b.north - b.south);
    setWideAreaWarning(zoom < 13 || span > 0.14);
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoState("denied");
      return;
    }
    setFetchError(null);
    setGeoState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mounted.current) return;
        const { latitude, longitude } = pos.coords;
        const near = bboxAroundPoint(
          latitude,
          longitude,
          NEARBY_MAP_HALF_SPAN_DEG,
        );
        bboxRef.current = near;
        limitRef.current = NEARBY_MAP_PIN_LIMIT;
        const now = Date.now();
        watchAnchorRef.current = {
          lat: latitude,
          lng: longitude,
          lastFetchAt: now,
        };
        setFlyToUser({ lat: latitude, lng: longitude, zoom: 14 });
        setGeoState("ready");
        setLocationAnchor({ lat: latitude, lng: longitude });
        void refetch();
      },
      () => {
        if (!mounted.current) return;
        setGeoState("denied");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20_000,
      },
    );
  }, [refetch]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (geoState !== "ready" || !locationAnchor) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    const w = watchAnchorRef.current;
    if (!w) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (!mounted.current) return;
        const anchor = watchAnchorRef.current;
        if (!anchor) return;

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const now = Date.now();
        if (now - anchor.lastFetchAt < LOCATION_WATCH_MIN_INTERVAL_MS) {
          return;
        }
        const moved = distanceMeters(anchor.lat, anchor.lng, lat, lng);
        if (moved < LOCATION_WATCH_MIN_MOVE_M) {
          return;
        }
        anchor.lat = lat;
        anchor.lng = lng;
        anchor.lastFetchAt = now;
        bboxRef.current = bboxAroundPoint(
          lat,
          lng,
          NEARBY_MAP_HALF_SPAN_DEG,
        );
        void refetch();
      },
      () => {
        /* sessizce yoksay; kullanici sabit kalabilir */
      },
      {
        enableHighAccuracy: false,
        maximumAge: 120_000,
        timeout: 25_000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [geoState, locationAnchor, refetch]);

  useEffect(() => {
    if (geoState !== "ready") {
      setRealtimeStatus("idle");
      return;
    }

    let supabase: ReturnType<typeof createBrowserSupabaseClient>;
    try {
      supabase = createBrowserSupabaseClient();
    } catch {
      setRealtimeStatus("error");
      return;
    }

    setRealtimeStatus("connecting");

    const channel = supabase
      .channel("public:animals")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "animals" },
        (payload) => {
          const row = payload.new as { isim?: string } | null;
          const oldRow = payload.old as { isim?: string } | null;
          let text = "Harita güncellendi";
          if (payload.eventType === "INSERT" && row?.isim) {
            text = `${row.isim} eklendi`;
          } else if (payload.eventType === "UPDATE" && row?.isim) {
            text = `${row.isim} güncellendi`;
          } else if (payload.eventType === "DELETE" && oldRow?.isim) {
            text = `${oldRow.isim} kaldırıldı`;
          }
          pushNot(text);
          void refetch();
        },
      )
      .subscribe((status) => {
        if (!mounted.current) return;
        if (status === "SUBSCRIBED") setRealtimeStatus("subscribed");
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setRealtimeStatus("error");
        }
        if (status === "CLOSED") setRealtimeStatus("idle");
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [geoState, refetch, pushNot]);

  return {
    animals,
    fetchError,
    realtimeStatus,
    notifications,
    dismissNotification,
    refetch,
    reportMapView,
    geoState,
    flyToUser,
    requestLocation,
    wideAreaWarning,
    mapInteractionEnabled: geoState === "ready",
  };
}
