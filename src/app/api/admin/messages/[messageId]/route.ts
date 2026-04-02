import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ messageId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const { messageId } = await params;
  if (!messageId) return NextResponse.json({ error: "messageId gerekli." }, { status: 400 });

  const { error } = await sb.from("group_messages").delete().eq("id", messageId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
