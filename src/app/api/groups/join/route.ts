import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type JoinBody = { group_id?: string };

export async function POST(req: Request) {
  try {
    const sb = await createServerSupabaseClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
    }

    const body = (await req.json()) as JoinBody;
    const groupId = String(body.group_id ?? "").trim();
    if (!groupId) {
      return NextResponse.json({ error: "group_id gerekli." }, { status: 400 });
    }

    const { data: ban, error: banErr } = await sb
      .from("group_bans")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (banErr) {
      return NextResponse.json({ error: banErr.message }, { status: 500 });
    }
    if (ban) {
      return NextResponse.json({ error: "Bu gruptan yasaklandın." }, { status: 403 });
    }

    const { error } = await sb.from("group_members").upsert(
      {
        group_id: groupId,
        user_id: user.id,
        role: "member",
      },
      { onConflict: "group_id,user_id", ignoreDuplicates: true },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

