-- Grup mesaji raporlama tablosu
-- 012_group_messages_acil.sql sonrasinda calistir.

create table if not exists public.group_message_reports (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  message_id uuid not null references public.group_messages(id) on delete cascade,
  reporter_id uuid not null references public.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 300),
  created_at timestamptz not null default now(),
  unique (message_id, reporter_id)
);

create index if not exists idx_group_message_reports_group_created
  on public.group_message_reports(group_id, created_at desc);

alter table public.group_message_reports enable row level security;

drop policy if exists "group_message_reports_insert_member" on public.group_message_reports;
create policy "group_message_reports_insert_member"
  on public.group_message_reports for insert
  to authenticated
  with check (
    reporter_id = auth.uid()
    and exists (
      select 1
      from public.group_members gm
      where gm.group_id = group_message_reports.group_id
        and gm.user_id = auth.uid()
    )
    and exists (
      select 1
      from public.group_messages msg
      where msg.id = group_message_reports.message_id
        and msg.group_id = group_message_reports.group_id
    )
  );
