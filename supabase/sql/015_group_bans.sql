-- Grup ban listesi (admin/owner moderasyonu)
-- 014_platform_admin.sql sonrasinda calistir.

create table if not exists public.group_bans (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  reason text null,
  banned_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create index if not exists idx_group_bans_group_user
  on public.group_bans(group_id, user_id);

alter table public.group_bans enable row level security;

drop policy if exists "group_bans_select_admin_only" on public.group_bans;
create policy "group_bans_select_admin_only"
  on public.group_bans for select
  to authenticated
  using (false);

drop policy if exists "group_bans_insert_admin_only" on public.group_bans;
create policy "group_bans_insert_admin_only"
  on public.group_bans for insert
  to authenticated
  with check (false);
