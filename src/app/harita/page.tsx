import { AnimalMap } from "@/components/map/animal-map";

export default function HaritaPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col max-md:min-h-[calc(100dvh-5.5rem)] md:min-h-[calc(100dvh-10rem)]">
        <AnimalMap />
      </div>
    </div>
  );
}
