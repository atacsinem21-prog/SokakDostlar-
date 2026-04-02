-- Kendi mesajini silme (RLS)
-- 010_group_messages.sql sonrasinda calistir.

drop policy if exists "group_messages_delete_own" on public.group_messages;
create policy "group_messages_delete_own"
  on public.group_messages for delete
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.group_members gm
      where gm.group_id = group_messages.group_id
        and gm.user_id = auth.uid()
    )
  );
