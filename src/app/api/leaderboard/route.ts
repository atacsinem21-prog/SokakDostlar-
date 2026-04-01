import { NextResponse } from "next/server";

import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import type { LeaderboardRow } from "@/types/gamification";

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, profil_adi, toplam_iyilik_puani")
      .order("toplam_iyilik_puani", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ leaderboard: (data ?? []) as LeaderboardRow[] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
