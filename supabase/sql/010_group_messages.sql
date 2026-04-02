-- Grup ici paylasim alani (mesaj/feed) temel tablo ve policy'ler
-- 009_groups_membership.sql sonrasinda calistir.

create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists idx_group_messages_group_created
  on public.group_messages(group_id, created_at desc);

alter table public.group_messages enable row level security;
alter table public.group_messages replica identity full;

drop policy if exists "group_messages_select_members" on public.group_messages;
create policy "group_messages_select_members"
  on public.group_messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.group_members gm
      where gm.group_id = group_messages.group_id
        and gm.user_id = auth.uid()
    )
  );

drop policy if exists "group_messages_insert_members" on public.group_messages;
create policy "group_messages_insert_members"
  on public.group_messages for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.group_members gm
      where gm.group_id = group_messages.group_id
        and gm.user_id = auth.uid()
    )
  );

-- Realtime (ikinci kez calistirirsan bu satir hata verebilir; o zaman atla)
alter publication supabase_realtime add table public.group_messages;

