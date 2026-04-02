import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string; messageId: string }> };

export async function DELETE(req: Request, { params }: Params) {
  const { id: groupId, messageId } = await params;
  if (!groupId || !messageId) {
    return NextResponse.json({ error: "Grup ve mesaj ID gerekli." }, { status: 400 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`group-message-del:${ip}`, { max: 40, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Çok fazla istek. ${rl.retryAfterSec} saniye sonra tekrar dene.`,
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  const { data: mem, error: memErr } = await sb
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (memErr) {
    return NextResponse.json({ error: memErr.message }, { status: 500 });
  }
  if (!mem) {
    return NextResponse.json(
      { error: "Bu grubun üyesi değilsin." },
      { status: 403 },
    );
  }

  const { data: deleted, error } = await sb
    .from("group_messages")
    .delete()
    .eq("id", messageId)
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!deleted?.length) {
    return NextResponse.json({ error: "Mesaj bulunamadı veya silinemez." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
