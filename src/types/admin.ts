export type AdminOverviewUser = {
  id: string;
  profil_adi: string;
  toplam_iyilik_puani: number;
  created_at: string;
  is_platform_admin: boolean;
};

export type AdminOverviewGroup = {
  id: string;
  name: string;
  created_at: string;
  radius_km: number;
  member_count: number;
  owner_name: string;
};

export type AdminOverviewReport = {
  id: string;
  group_id: string;
  message_id: string;
  created_at: string;
  group_name: string;
  reporter_name: string;
  reason: string;
};

export type AdminOverviewMember = {
  group_id: string;
  user_id: string;
  user_name: string;
  role: "owner" | "member" | string;
  banned: boolean;
};
