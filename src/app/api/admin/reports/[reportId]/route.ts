import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ reportId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const { reportId } = await params;
  if (!reportId) return NextResponse.json({ error: "reportId gerekli." }, { status: 400 });

  const { error } = await sb.from("group_message_reports").delete().eq("id", reportId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
