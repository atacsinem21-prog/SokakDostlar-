export type GroupRow = {
  id: string;
  name: string;
  center_lat: number | null;
  center_lng: number | null;
  radius_km: number;
  created_by: string;
  created_at: string;
};

export type GroupListItem = GroupRow & {
  member_count: number;
  joined: boolean;
};

export type GroupMessage = {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profil_adi: string | null;
  is_acil: boolean;
  /** Sunucu tarafindan doldurulur */
  is_mine?: boolean;
};

export type GroupMemberLite = {
  user_id: string;
  profil_adi: string;
  role: "owner" | "moderator" | "member" | string;
};

export type GroupMessageReportItem = {
  id: string;
  message_id: string;
  reason: string;
  created_at: string;
  reporter_name: string;
  message_author_name: string;
  message_content: string;
};

