import Link from "next/link";

import { PageShell } from "@/components/ui/page-shell";

/**
 * Eski fotoğraflı AI kanıt akışı kapatıldı; görevler /gorevler üzerinden tamamlanıyor.
 */
export default function KanitPage() {
  return (
    <PageShell
      title="İyilik kanıtı"
      lead="Artık fotoğraf yükleme veya yapay zekâ doğrulaması yok. Puan, görevleri tamamladığında doğrudan eklenir."
    >
      <div className="card-surface space-y-4 p-5 text-sm text-zinc-700">
        <p>
          PATİSİD, iyiliği <strong>onur ve merhamete</strong> dayandırır: fotoğraf
          zorunluluğu ve admin onayı yok. Lütfen gerçekten yardım ettiğinde görevi
          tamamla; sokak hayvanlarına zarar verecek veya topluluğu aldatacak
          davranışlardan kaçın.
        </p>
        <p>
          <Link
            href="/gorevler"
            className="font-medium text-amber-900 underline"
          >
            Görevler
          </Link>{" "}
          sayfasından ilgili görevde &quot;Görevi tamamla&quot; düğmesine
          basman yeterli.
        </p>
      </div>
    </PageShell>
  );
}
