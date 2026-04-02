import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ groupId: string; userId: string }> };
type Body = { reason?: string };

export async function POST(req: Request, { params }: Params) {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb, user } = auth;

  const { groupId, userId } = await params;
  if (!groupId || !userId) {
    return NextResponse.json({ error: "groupId ve userId gerekli." }, { status: 400 });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {}

  const reason = String(body.reason ?? "").trim();

  const { error: banErr } = await sb.from("group_bans").upsert(
    {
      group_id: groupId,
      user_id: userId,
      banned_by: user.id,
      reason: reason || null,
    },
    { onConflict: "group_id,user_id" },
  );
  if (banErr) return NextResponse.json({ error: banErr.message }, { status: 500 });

  const { error: removeErr } = await sb
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .neq("role", "owner");
  if (removeErr) return NextResponse.json({ error: removeErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
