import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { GroupMessageReportItem } from "@/types/groups";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id: groupId } = await params;
  if (!groupId) {
    return NextResponse.json({ error: "Grup ID gerekli." }, { status: 400 });
  }

  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  const { data: me, error: meErr } = await sb
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (meErr) {
    return NextResponse.json({ error: meErr.message }, { status: 500 });
  }
  const role = (me?.role as string | undefined) ?? "member";
  if (role !== "owner" && role !== "moderator") {
    return NextResponse.json({ error: "Yalnızca yönetici erişebilir." }, { status: 403 });
  }

  const { data: reports, error: repErr } = await sb
    .from("group_message_reports")
    .select("id,message_id,reporter_id,reason,created_at")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (repErr) {
    return NextResponse.json({ error: repErr.message }, { status: 500 });
  }

  const rows = reports ?? [];
  const messageIds = [...new Set(rows.map((r) => r.message_id as string))];
  const reporterIds = [...new Set(rows.map((r) => r.reporter_id as string))];

  const { data: messages, error: msgErr } = await sb
    .from("group_messages")
    .select("id,user_id,content")
    .in("id", messageIds.length > 0 ? messageIds : ["00000000-0000-0000-0000-000000000000"]);
  if (msgErr) {
    return NextResponse.json({ error: msgErr.message }, { status: 500 });
  }

  const authorIds = [...new Set((messages ?? []).map((m) => m.user_id as string))];
  const allUserIds = [...new Set([...reporterIds, ...authorIds])];
  const { data: users, error: usrErr } = await sb
    .from("users")
    .select("id,profil_adi")
    .in("id", allUserIds.length > 0 ? allUserIds : ["00000000-0000-0000-0000-000000000000"]);
  if (usrErr) {
    return NextResponse.json({ error: usrErr.message }, { status: 500 });
  }

  const messageMap = new Map((messages ?? []).map((m) => [m.id as string, m]));
  const userMap = new Map((users ?? []).map((u) => [u.id as string, (u.profil_adi as string) ?? "Gönüllü"]));

  const items: GroupMessageReportItem[] = rows.map((r) => {
    const msg = messageMap.get(r.message_id as string);
    return {
      id: r.id as string,
      message_id: r.message_id as string,
      reason: (r.reason as string) ?? "-",
      created_at: r.created_at as string,
      reporter_name: userMap.get(r.reporter_id as string) ?? "Gönüllü",
      message_author_name: userMap.get((msg?.user_id as string) ?? "") ?? "Gönüllü",
      message_content: (msg?.content as string) ?? "(Mesaj silinmiş)",
    };
  });

  return NextResponse.json({ reports: items, role });
}
