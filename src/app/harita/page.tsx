import { AnimalMap } from "@/components/map/animal-map";

export default function HaritaPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/** flex-1 + min-h: Leaflet için kesin yükseklik zinciri (üretimde boş beyaz harita önlenir) */}
      <div className="relative flex min-h-[calc(100dvh-5.5rem)] flex-1 flex-col md:min-h-[calc(100dvh-10rem)]">
        <AnimalMap />
      </div>
    </div>
  );
}
