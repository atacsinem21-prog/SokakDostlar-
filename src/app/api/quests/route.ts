import { NextResponse } from "next/server";

import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import type { QuestListRow } from "@/types/gamification";

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("quests")
      .select(
        "id, gorev_tipi, odul_puani, aktif_mi, sponsor_adi, sponsor_logo_url, animal:animals(id, isim, tur)",
      )
      .eq("aktif_mi", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const quests: QuestListRow[] = (data ?? []).map((q) => ({
      id: q.id,
      gorev_tipi: q.gorev_tipi,
      odul_puani: q.odul_puani,
      aktif_mi: q.aktif_mi,
      sponsor_adi: q.sponsor_adi,
      sponsor_logo_url: q.sponsor_logo_url,
      animal: Array.isArray(q.animal) ? (q.animal[0] ?? null) : q.animal,
    })) as QuestListRow[];

    return NextResponse.json({ quests });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
