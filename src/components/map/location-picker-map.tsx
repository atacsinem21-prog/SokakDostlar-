"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import { pawMarkerIconUrl } from "@/lib/maps/paw-marker";

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const pickerIcon = L.icon({
  iconUrl: pawMarkerIconUrl("kedi"),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function ClickToPick({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  className?: string;
};

export default function LocationPickerMap({
  lat,
  lng,
  onChange,
  className,
}: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom
      className={className ?? "h-72 w-full rounded-xl border border-zinc-200"}
    >
      <TileLayer
        attribution={OSM_ATTRIBUTION}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToPick onPick={onChange} />
      <Marker position={[lat, lng]} icon={pickerIcon} />
    </MapContainer>
  );
}
