import { NextResponse } from "next/server";

import { requirePlatformAdmin } from "@/lib/admin-auth";
import type {
  AdminOverviewGroup,
  AdminOverviewMember,
  AdminOverviewReport,
  AdminOverviewUser,
} from "@/types/admin";

export async function GET() {
  const auth = await requirePlatformAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { sb } = auth;

  const [
    { data: users, error: userErr },
    { data: groups, error: grpErr },
    { data: members, error: memErr },
    { data: bans, error: banErr },
  ] = await Promise.all([
      sb
        .from("users")
        .select("id,profil_adi,toplam_iyilik_puani,created_at,is_platform_admin")
        .order("created_at", { ascending: false })
        .limit(300),
      sb
        .from("groups")
        .select("id,name,created_at,radius_km")
        .order("created_at", { ascending: false })
        .limit(300),
      sb.from("group_members").select("group_id,user_id,role"),
      sb.from("group_bans").select("group_id,user_id"),
    ]);
  if (userErr || grpErr || memErr || banErr) {
    return NextResponse.json(
      { error: userErr?.message ?? grpErr?.message ?? memErr?.message ?? banErr?.message ?? "Veri hatası." },
      { status: 500 },
    );
  }

  const usersList = (users ?? []) as AdminOverviewUser[];
  const userName = new Map(usersList.map((u) => [u.id, u.profil_adi]));
  const memberRows = members ?? [];
  const bannedSet = new Set((bans ?? []).map((b) => `${b.group_id as string}:${b.user_id as string}`));

  const countMap = memberRows.reduce((m, row) => {
    const gid = row.group_id as string;
    m.set(gid, (m.get(gid) ?? 0) + 1);
    return m;
  }, new Map<string, number>());
  const ownerMap = memberRows.reduce((m, row) => {
    if ((row.role as string) === "owner") {
      m.set(row.group_id as string, row.user_id as string);
    }
    return m;
  }, new Map<string, string>());

  const groupsList: AdminOverviewGroup[] = ((groups ?? []) as Array<{
    id: string;
    name: string;
    created_at: string;
    radius_km: number;
  }>).map((g) => ({
    id: g.id,
    name: g.name,
    created_at: g.created_at,
    radius_km: g.radius_km,
    member_count: countMap.get(g.id) ?? 0,
    owner_name: userName.get(ownerMap.get(g.id) ?? "") ?? "Bilinmiyor",
  }));

  const membersList: AdminOverviewMember[] = memberRows.map((m) => ({
    group_id: m.group_id as string,
    user_id: m.user_id as string,
    user_name: userName.get(m.user_id as string) ?? "Gönüllü",
    role: (m.role as string) ?? "member",
    banned: bannedSet.has(`${m.group_id as string}:${m.user_id as string}`),
  }));

  let reportsList: AdminOverviewReport[] = [];
  const { data: reports, error: repErr } = await sb
    .from("group_message_reports")
    .select("id,group_id,message_id,reporter_id,reason,created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (!repErr) {
    const groupName = new Map(groupsList.map((g) => [g.id, g.name]));
    reportsList = (reports ?? []).map((r) => ({
      id: r.id as string,
      group_id: r.group_id as string,
      message_id: r.message_id as string,
      created_at: r.created_at as string,
      group_name: groupName.get(r.group_id as string) ?? "Silinmiş grup",
      reporter_name: userName.get(r.reporter_id as string) ?? "Gönüllü",
      reason: (r.reason as string) ?? "-",
    }));
  }

  return NextResponse.json({
    users: usersList,
    groups: groupsList,
    members: membersList,
    reports: reportsList,
  });
}
