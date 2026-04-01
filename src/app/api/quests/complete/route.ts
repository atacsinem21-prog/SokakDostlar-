import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-server";

type Body = {
  questId?: string;
};

/**
 * Oturum açmış kullanıcı kendi adına görevi tamamlar (fotoğraf / AI yok — onur sistemi).
 */
export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user?.id) {
      return NextResponse.json(
        { error: "Görev tamamlamak için giriş yapmalısın." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as Body;
    const questId = body.questId?.trim();
    if (!questId) {
      return NextResponse.json(
        { error: "questId zorunlu." },
        { status: 400 },
      );
    }

    const service = createServiceSupabaseClient();
    const { data, error } = await service.rpc("complete_quest", {
      p_user_id: user.id,
      p_quest_id: questId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ result: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        { error: "Sunucu yapılandırması eksik (service role)." },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
