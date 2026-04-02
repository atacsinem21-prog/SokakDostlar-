import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string; messageId: string }> };
type Body = { reason?: string };

export async function POST(req: Request, { params }: Params) {
  const { id: groupId, messageId } = await params;
  if (!groupId || !messageId) {
    return NextResponse.json({ error: "Grup ve mesaj ID gerekli." }, { status: 400 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`group-message-report:${ip}`, { max: 20, windowMs: 86_400_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Çok fazla bildirim. ${rl.retryAfterSec} saniye sonra tekrar dene.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const reason = String(body.reason ?? "").trim();
  if (reason.length < 3 || reason.length > 300) {
    return NextResponse.json({ error: "Bildirim nedeni 3-300 karakter olmalı." }, { status: 400 });
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
    return NextResponse.json({ error: "Bu grubun üyesi değilsin." }, { status: 403 });
  }

  const { data: target, error: targetErr } = await sb
    .from("group_messages")
    .select("id,user_id")
    .eq("id", messageId)
    .eq("group_id", groupId)
    .maybeSingle();
  if (targetErr) {
    return NextResponse.json({ error: targetErr.message }, { status: 500 });
  }
  if (!target) {
    return NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
  }
  if ((target.user_id as string) === user.id) {
    return NextResponse.json({ error: "Kendi mesajını bildiremezsin." }, { status: 400 });
  }

  const { error: insertErr } = await sb.from("group_message_reports").upsert(
    {
      group_id: groupId,
      message_id: messageId,
      reporter_id: user.id,
      reason,
    },
    { onConflict: "message_id,reporter_id" },
  );
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
