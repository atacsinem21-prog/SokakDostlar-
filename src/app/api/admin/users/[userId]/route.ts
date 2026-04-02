import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ userId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb, user } = auth;

  const { userId } = await params;
  if (!userId) return NextResponse.json({ error: "userId gerekli." }, { status: 400 });
  if (userId === user.id) {
    return NextResponse.json({ error: "Kendi hesabını silemezsin." }, { status: 400 });
  }

  const { error } = await sb.from("users").delete().eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
