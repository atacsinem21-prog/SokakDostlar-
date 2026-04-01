import { AnimalMap } from "@/components/map/animal-map";

export default function HaritaPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-[min(75vh,calc(100dvh-9rem))] flex-1 md:min-h-[calc(100dvh-10rem)]">
        <AnimalMap />
      </div>
    </div>
  );
}
