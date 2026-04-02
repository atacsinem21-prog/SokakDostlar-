import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { GroupMemberLite, GroupMessage } from "@/types/groups";

type Params = { params: Promise<{ id: string }> };
type PostBody = { content?: string; is_acil?: boolean };

async function assertMembership(groupId: string) {
  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    return { sb, user: null, ok: false as const, reason: "Oturum gerekli." };
  }

  const { data, error } = await sb
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return { sb, user, ok: false as const, reason: error.message };
  }
  if (!data) {
    return {
      sb,
      user,
      ok: false as const,
      reason: "Bu grubun üyesi değilsin.",
    };
  }

  const { data: ban, error: banErr } = await sb
    .from("group_bans")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (banErr) {
    return { sb, user, ok: false as const, reason: banErr.message };
  }
  if (ban) {
    return { sb, user, ok: false as const, reason: "Bu gruptan yasaklandın." };
  }

  return { sb, user, ok: true as const };
}

export async function GET(_req: Request, { params }: Params) {
  const { id: groupId } = await params;
  if (!groupId) {
    return NextResponse.json({ error: "Grup ID gerekli." }, { status: 400 });
  }

  const guard = await assertMembership(groupId);
  if (!guard.ok) {
    return NextResponse.json(
      { error: guard.reason },
      { status: guard.user ? 403 : 401 },
    );
  }

  const { sb, user } = guard;
  const { data, error } = await sb
    .from("group_messages")
    .select("id,group_id,user_id,content,created_at,is_acil")
    .eq("group_id", groupId)
    .order("is_acil", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Omit<GroupMessage, "profil_adi">[];
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const { data: memberRows, error: memberError } = await sb
    .from("group_members")
    .select("user_id,role")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });
  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }
  for (const m of memberRows ?? []) {
    const uid = m.user_id as string;
    if (uid && !userIds.includes(uid)) userIds.push(uid);
  }
  let nameMap = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: users, error: usersError } = await sb
      .from("users")
      .select("id,profil_adi")
      .in("id", userIds);
    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }
    nameMap = (users ?? []).reduce((m, u) => {
      m.set(u.id as string, (u.profil_adi as string) ?? "Gönüllü");
      return m;
    }, new Map<string, string>());
  }

  const messages: GroupMessage[] = rows.map((r) => ({
    ...r,
    is_acil: Boolean(r.is_acil),
    profil_adi: nameMap.get(r.user_id) ?? "Gönüllü",
    is_mine: r.user_id === user.id,
  }));

  const members: GroupMemberLite[] = (memberRows ?? []).map((m) => ({
    user_id: m.user_id as string,
    profil_adi: nameMap.get(m.user_id as string) ?? "Gönüllü",
    role: (m.role as string) ?? "member",
  }));

  const myRole =
    (memberRows ?? []).find((m) => (m.user_id as string) === user.id)?.role ?? "member";

  return NextResponse.json({ messages, members, my_role: myRole });
}

export async function POST(req: Request, { params }: Params) {
  const { id: groupId } = await params;
  if (!groupId) {
    return NextResponse.json({ error: "Grup ID gerekli." }, { status: 400 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`group-message:${ip}`, { max: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Çok fazla mesaj. ${rl.retryAfterSec} saniye sonra tekrar dene.`,
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const guard = await assertMembership(groupId);
  if (!guard.ok) {
    return NextResponse.json(
      { error: guard.reason },
      { status: guard.user ? 403 : 401 },
    );
  }

  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const content = String(body.content ?? "").trim();
  if (content.length < 1 || content.length > 500) {
    return NextResponse.json(
      { error: "Mesaj 1-500 karakter olmalı." },
      { status: 400 },
    );
  }

  const is_acil = Boolean(body.is_acil);

  const { sb, user } = guard;

  if (is_acil) {
    const rlAcil = checkRateLimit(`group-acil:${groupId}:${user.id}`, {
      max: 5,
      windowMs: 86_400_000,
    });
    if (!rlAcil.ok) {
      return NextResponse.json(
        {
          error: `Acil mesaj limiti doldu (grup başına günde en fazla 5). ${rlAcil.retryAfterSec} saniye sonra tekrar dene.`,
        },
        { status: 429, headers: { "Retry-After": String(rlAcil.retryAfterSec) } },
      );
    }
  }

  const { data, error } = await sb
    .from("group_messages")
    .insert({
      group_id: groupId,
      user_id: user.id,
      content,
      is_acil,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}

