/** Turkiye yaklasik sinirlari — konum yoksa */
export type MapBBox = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export const DEFAULT_TURKEY_BBOX: MapBBox = {
  west: 26,
  south: 36,
  east: 45,
  north: 42,
};

/** Haritada yalnizca bu yaricap icindeki pinler (~4-5 km yaricap kutu) */
export const NEARBY_MAP_HALF_SPAN_DEG = 0.042;

export const NEARBY_MAP_PIN_LIMIT = 50;

/** watchPosition: bu kadar metre kayinca liste yenilenir (pil + ag dostu) */
export const LOCATION_WATCH_MIN_MOVE_M = 280;

/** watchPosition: iki yukleme arasi minimum sure (ms) */
export const LOCATION_WATCH_MIN_INTERVAL_MS = 45_000;

/**
 * Iki WGS84 nokta arasi yaklasik mesafe (metre).
 */
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Kullanicinin cevresinde ~yarıçap derece (yaklasik km: 1° ~ 111 km enlemde) */
export function bboxAroundPoint(
  lat: number,
  lng: number,
  halfSpanDeg = 0.12,
): MapBBox {
  return {
    west: lng - halfSpanDeg,
    east: lng + halfSpanDeg,
    south: lat - halfSpanDeg,
    north: lat + halfSpanDeg,
  };
}

/**
 * Gorunur alan ne kadar buyukse o kadar az pin (tarayici kilitlenmesin).
 */
export function limitForBBoxArea(b: MapBBox): number {
  const w = b.east - b.west;
  const h = b.north - b.south;
  const area = w * h;
  if (area > 80) return 2200;
  if (area > 40) return 2800;
  if (area > 15) return 3500;
  if (area > 4) return 5000;
  if (area > 0.5) return 6500;
  return 8000;
}

export function isValidBBox(b: MapBBox): boolean {
  return (
    Number.isFinite(b.west) &&
    Number.isFinite(b.south) &&
    Number.isFinite(b.east) &&
    Number.isFinite(b.north) &&
    b.west < b.east &&
    b.south < b.north &&
    b.east - b.west <= 40 &&
    b.north - b.south <= 25
  );
}
