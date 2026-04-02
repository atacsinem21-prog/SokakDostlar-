import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ groupId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const { groupId } = await params;
  if (!groupId) return NextResponse.json({ error: "groupId gerekli." }, { status: 400 });

  const { error } = await sb.from("groups").delete().eq("id", groupId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
