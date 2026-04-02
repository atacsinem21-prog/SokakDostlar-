import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { GroupListItem, GroupRow } from "@/types/groups";

type CreateBody = {
  name?: string;
  center_lat?: number | null;
  center_lng?: number | null;
  radius_km?: number;
};

export async function GET() {
  try {
    const sb = await createServerSupabaseClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
    }

    const [{ data: groups, error: groupsError }, { data: mine, error: mineError }] =
      await Promise.all([
        sb
          .from("groups")
          .select("id,name,center_lat,center_lng,radius_km,created_by,created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        sb.from("group_members").select("group_id").eq("user_id", user.id),
      ]);

    if (groupsError) {
      return NextResponse.json({ error: groupsError.message }, { status: 500 });
    }
    if (mineError) {
      return NextResponse.json({ error: mineError.message }, { status: 500 });
    }

    const ids = ((groups ?? []) as GroupRow[]).map((g) => g.id);
    let countMap = new Map<string, number>();
    if (ids.length > 0) {
      const { data: counts, error: countError } = await sb
        .from("group_members")
        .select("group_id")
        .in("group_id", ids);
      if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 });
      }
      countMap = (counts ?? []).reduce((m, row) => {
        const k = row.group_id as string;
        m.set(k, (m.get(k) ?? 0) + 1);
        return m;
      }, new Map<string, number>());
    }

    const joinedSet = new Set((mine ?? []).map((r) => r.group_id as string));
    const items: GroupListItem[] = ((groups ?? []) as GroupRow[]).map((g) => ({
      ...g,
      member_count: countMap.get(g.id) ?? 0,
      joined: joinedSet.has(g.id),
    }));

    return NextResponse.json({ groups: items });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sb = await createServerSupabaseClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
    }

    const body = (await req.json()) as CreateBody;
    const name = String(body.name ?? "").trim();
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: "Grup adı 2-80 karakter olmalı." },
        { status: 400 },
      );
    }
    const radius_km = Math.max(1, Math.min(20, Number(body.radius_km ?? 2)));
    const center_lat =
      body.center_lat == null ? null : Number.isFinite(Number(body.center_lat)) ? Number(body.center_lat) : null;
    const center_lng =
      body.center_lng == null ? null : Number.isFinite(Number(body.center_lng)) ? Number(body.center_lng) : null;

    const { data: created, error: createError } = await sb
      .from("groups")
      .insert({
        name,
        center_lat,
        center_lng,
        radius_km,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (createError || !created) {
      return NextResponse.json(
        { error: createError?.message ?? "Grup oluşturulamadı." },
        { status: 500 },
      );
    }

    const { error: memberError } = await sb.from("group_members").insert({
      group_id: created.id,
      user_id: user.id,
      role: "owner",
    });
    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

