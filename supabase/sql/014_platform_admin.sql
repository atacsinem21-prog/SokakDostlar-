-- Platform admin yetkisi
-- 013_group_message_reports.sql sonrasinda calistir.

alter table public.users
  add column if not exists is_platform_admin boolean not null default false;

create index if not exists idx_users_platform_admin
  on public.users(is_platform_admin)
  where is_platform_admin = true;

-- Ilk admin atama (ornek):
-- update public.users set is_platform_admin = true where profil_adi = 'senin_profil_adin';
