/** Kedi / köpek için pati izi benzeri SVG marker (data URL). */

const COLORS = {
  kedi: "#c2410c",
  kopek: "#92400e",
} as const;

function svgDataUrl(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
  <circle cx="12" cy="15" r="4.2" fill="${color}" stroke="#fff" stroke-width="1.2"/>
  <circle cx="7" cy="9.5" r="2.4" fill="${color}" stroke="#fff" stroke-width="1"/>
  <circle cx="11.5" cy="7.5" r="2.4" fill="${color}" stroke="#fff" stroke-width="1"/>
  <circle cx="16" cy="9.5" r="2.4" fill="${color}" stroke="#fff" stroke-width="1"/>
  <circle cx="17.5" cy="14" r="2.1" fill="${color}" stroke="#fff" stroke-width="1"/>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function pawMarkerIconUrl(tur: string): string {
  const key = tur === "kopek" ? "kopek" : "kedi";
  return svgDataUrl(COLORS[key]);
}
