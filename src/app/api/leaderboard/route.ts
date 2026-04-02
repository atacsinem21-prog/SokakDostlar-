import { NextResponse } from "next/server";

import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import type { LeaderboardRow } from "@/types/gamification";

const FAKE_TOP_ROWS: LeaderboardRow[] = [
  { id: "fake-1", profil_adi: "xxxx", toplam_iyilik_puani: 25000 },
  { id: "fake-2", profil_adi: "xxxx", toplam_iyilik_puani: 22000 },
  { id: "fake-3", profil_adi: "xxxx", toplam_iyilik_puani: 19500 },
  { id: "fake-4", profil_adi: "xxxx", toplam_iyilik_puani: 17000 },
  { id: "fake-5", profil_adi: "xxxx", toplam_iyilik_puani: 15000 },
];

export async function GET() {
  // Demo/staging için: tamamı fake liderlik.
  const isDemo = process.env.NODE_ENV !== "production";
  if (isDemo) {
    const leaderboard = Array.from({ length: 20 }, (_, i) => ({
      id: `demo-${i + 1}`,
      profil_adi: "xxxx",
      toplam_iyilik_puani: 10_000 - i * 420 + (i % 3) * 35,
    }));
    return NextResponse.json({ leaderboard });
  }

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
    const realRows = ((data ?? []) as LeaderboardRow[]).map((row) => ({
      ...row,
      profil_adi: "xxxx",
    }));
    const leaderboard = [...FAKE_TOP_ROWS, ...realRows].slice(0, 20);
    return NextResponse.json({ leaderboard });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
