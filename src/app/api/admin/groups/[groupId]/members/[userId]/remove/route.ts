import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ groupId: string; userId: string }> };

export async function POST(_req: Request, { params }: Params) {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const { groupId, userId } = await params;
  if (!groupId || !userId) {
    return NextResponse.json({ error: "groupId ve userId gerekli." }, { status: 400 });
  }

  const { error } = await sb
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .neq("role", "owner");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
