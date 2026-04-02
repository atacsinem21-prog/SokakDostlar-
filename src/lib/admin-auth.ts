import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requirePlatformAdmin() {
  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return { ok: false as const, status: 401, error: "Oturum gerekli.", sb, user: null };
  }

  const { data: me, error } = await sb
    .from("users")
    .select("is_platform_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (error) {
    return { ok: false as const, status: 500, error: error.message, sb, user };
  }
  if (!me?.is_platform_admin) {
    return {
      ok: false as const,
      status: 403,
      error: "Bu alana erişim yetkin yok.",
      sb,
      user,
    };
  }

  return { ok: true as const, sb, user };
}
