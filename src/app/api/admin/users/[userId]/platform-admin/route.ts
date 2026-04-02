import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";

type Params = { params: Promise<{ userId: string }> };
type Body = { is_admin?: boolean };

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { user, sb } = auth;

  const { userId } = await params;
  if (!userId) return NextResponse.json({ error: "userId gerekli." }, { status: 400 });
  if (userId === user.id) {
    return NextResponse.json({ error: "Kendi admin yetkini buradan değiştiremezsin." }, { status: 400 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const isAdmin = Boolean(body.is_admin);
  const { error } = await sb.from("users").update({ is_platform_admin: isAdmin }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
