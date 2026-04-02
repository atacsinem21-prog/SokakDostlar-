-- Grup + uyelik temel tablolari (hibrit model ilk adim)
-- 001 ve 008 sonrasinda calistir.

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  center_lat double precision,
  center_lng double precision,
  radius_km int not null default 2 check (radius_km between 1 and 20),
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_groups_created_at
  on public.groups(created_at desc);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create index if not exists idx_group_members_group
  on public.group_members(group_id);

create index if not exists idx_group_members_user
  on public.group_members(user_id);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

drop policy if exists "groups_select_public" on public.groups;
create policy "groups_select_public"
  on public.groups for select
  to anon, authenticated
  using (true);

drop policy if exists "groups_insert_authenticated" on public.groups;
create policy "groups_insert_authenticated"
  on public.groups for insert
  to authenticated
  with check (created_by = auth.uid());

drop policy if exists "group_members_select_public" on public.group_members;
create policy "group_members_select_public"
  on public.group_members for select
  to anon, authenticated
  using (true);

drop policy if exists "group_members_insert_self" on public.group_members;
create policy "group_members_insert_self"
  on public.group_members for insert
  to authenticated
  with check (user_id = auth.uid());

