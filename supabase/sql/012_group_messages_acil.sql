-- Acil mesaj isareti (filtre / siralama icin)
-- 011_group_messages_delete_policy.sql sonrasinda calistir.

alter table public.group_messages
  add column if not exists is_acil boolean not null default false;

create index if not exists idx_group_messages_group_acil_created
  on public.group_messages(group_id, is_acil desc, created_at asc);
