"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import type { FlyToTarget } from "@/hooks/use-animals-map";
import type { MapBBox } from "@/lib/map-bbox";
import { pawMarkerIconUrl } from "@/lib/maps/paw-marker";
import type { AnimalMapRow } from "@/types/animal";

/** Turkiye — konum yokken */
const DEFAULT_CENTER: [number, number] = [39.0, 35.0];
const DEFAULT_ZOOM = 6;

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const iconCache = new Map<string, L.Icon>();

function pawIcon(tur: string): L.Icon {
  const key = tur === "kopek" ? "kopek" : "kedi";
  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      L.icon({
        iconUrl: pawMarkerIconUrl(key),
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      }),
    );
  }
  return iconCache.get(key)!;
}

type MarkerClusterGroupLayer = L.Layer & {
  addLayer: (layer: L.Layer) => unknown;
};

type LeafletWithCluster = typeof L & {
  markerClusterGroup: (options?: Record<string, unknown>) => MarkerClusterGroupLayer;
};

function MapResizeInvalidator({ tick }: { tick: number }) {
  const map = useMap();
  useEffect(() => {
    const run = () => map.invalidateSize({ animate: tick > 0 });
    run();
    const id1 = window.setTimeout(run, 16);
    const id2 = window.setTimeout(run, 280);
    const id3 = window.setTimeout(run, 900);
    const id4 = window.setTimeout(run, 1600);
    const onViewportResize = () => run();
    window.addEventListener("resize", onViewportResize);
    window.addEventListener("orientationchange", onViewportResize);
    return () => {
      window.clearTimeout(id1);
      window.clearTimeout(id2);
      window.clearTimeout(id3);
      window.clearTimeout(id4);
      window.removeEventListener("resize", onViewportResize);
      window.removeEventListener("orientationchange", onViewportResize);
    };
  }, [map, tick]);
  return null;
}

function FlyToUser({ target }: { target: FlyToTarget | null }) {
  const map = useMap();
  const flew = useRef(false);

  useEffect(() => {
    if (!target || flew.current) return;
    flew.current = true;
    map.flyTo([target.lat, target.lng], target.zoom, { duration: 0.85 });
  }, [map, target]);

  return null;
}

function ViewportReporter({
  onViewportChange,
  enabled,
}: {
  onViewportChange: (b: MapBBox, zoom: number) => void;
  enabled: boolean;
}) {
  const map = useMap();
  const cbRef = useRef(onViewportChange);
  cbRef.current = onViewportChange;

  useEffect(() => {
    if (!enabled) return;

    const report = () => {
      const bb = map.getBounds();
      cbRef.current(
        {
          west: bb.getWest(),
          south: bb.getSouth(),
          east: bb.getEast(),
          north: bb.getNorth(),
        },
        map.getZoom(),
      );
    };

    report();
    map.on("moveend", report);
    map.on("zoomend", report);
    return () => {
      map.off("moveend", report);
      map.off("zoomend", report);
    };
  }, [map, enabled]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => onMapClick(),
  });
  return null;
}

function ClusteredMarkers({
  animals,
  onMarkerClick,
}: {
  animals: AnimalMapRow[];
  onMarkerClick: (a: AnimalMapRow) => void;
}) {
  const map = useMap();
  const clickRef = useRef(onMarkerClick);
  clickRef.current = onMarkerClick;

  useEffect(() => {
    const Lc = L as LeafletWithCluster;
    let layer: L.Layer;

    const addMarkers = (container: L.Layer & { addLayer: (ly: L.Layer) => void }) => {
      animals.forEach((a) => {
        const m = L.marker([Number(a.lat), Number(a.lng)], {
          icon: pawIcon(a.tur),
        });
        m.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          clickRef.current(a);
        });
        container.addLayer(m);
      });
    };

    if (animals.length === 0) {
      return;
    }

    if (animals.length <= 55) {
      const group = L.layerGroup();
      addMarkers(group);
      layer = group;
    } else {
      const cluster = Lc.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 80,
        maxClusterRadius: 55,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
      });
      addMarkers(cluster);
      layer = cluster;
    }

    map.addLayer(layer);
    return () => {
      map.removeLayer(layer);
    };
  }, [animals, map]);

  return null;
}

type Props = {
  animals: AnimalMapRow[];
  onMarkerClick: (a: AnimalMapRow) => void;
  onMapClick: () => void;
  onViewportChange: (b: MapBBox, zoom: number) => void;
  viewportReportingEnabled: boolean;
  flyToUser: FlyToTarget | null;
  /** Kare ↔ tam ekran geçişinde Leaflet boyutunu yenile */
  resizeTick: number;
};

export default function AnimalMapLeaflet({
  animals,
  onMarkerClick,
  onMapClick,
  onViewportChange,
  viewportReportingEnabled,
  flyToUser,
  resizeTick,
}: Props) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="z-0 h-full w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <MapResizeInvalidator tick={resizeTick} />
      <TileLayer
        attribution={OSM_ATTRIBUTION}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToUser target={flyToUser} />
      <ViewportReporter
        onViewportChange={onViewportChange}
        enabled={viewportReportingEnabled}
      />
      <MapClickHandler onMapClick={onMapClick} />
      <ClusteredMarkers animals={animals} onMarkerClick={onMarkerClick} />
    </MapContainer>
  );
}
