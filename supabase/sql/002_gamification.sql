-- Oyunlastirma: gorev tamamlama + puan log + leaderboard alanlari
-- 001_initial_schema.sql sonrasinda calistir.

alter table public.quests
  add column if not exists sponsor_adi text,
  add column if not exists sponsor_logo_url text;

create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  quest_id uuid not null references public.quests(id) on delete cascade,
  odul_puani int not null check (odul_puani >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, quest_id)
);

create table if not exists public.user_points_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  delta_puan int not null,
  neden text not null,
  ref_type text,
  ref_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_points_log_user_created
  on public.user_points_log(user_id, created_at desc);

alter table public.quest_completions enable row level security;
alter table public.user_points_log enable row level security;

drop policy if exists "quest_completions_select_public" on public.quest_completions;
create policy "quest_completions_select_public"
  on public.quest_completions for select
  to anon, authenticated
  using (true);

drop policy if exists "user_points_log_select_public" on public.user_points_log;
create policy "user_points_log_select_public"
  on public.user_points_log for select
  to anon, authenticated
  using (true);

create or replace function public.complete_quest(
  p_user_id uuid,
  p_quest_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reward int;
  v_user_exists boolean;
  v_quest_exists boolean;
begin
  select exists(select 1 from public.users u where u.id = p_user_id) into v_user_exists;
  if not v_user_exists then
    raise exception 'Kullanici bulunamadi';
  end if;

  select q.odul_puani
    into v_reward
  from public.quests q
  where q.id = p_quest_id and q.aktif_mi = true;

  v_quest_exists := v_reward is not null;
  if not v_quest_exists then
    raise exception 'Aktif gorev bulunamadi';
  end if;

  begin
    insert into public.quest_completions(user_id, quest_id, odul_puani)
    values (p_user_id, p_quest_id, v_reward);
  exception
    when unique_violation then
      return jsonb_build_object(
        'ok', false,
        'already_completed', true,
        'added_points', 0
      );
  end;

  update public.users
    set toplam_iyilik_puani = toplam_iyilik_puani + v_reward
  where id = p_user_id;

  insert into public.user_points_log(user_id, delta_puan, neden, ref_type, ref_id)
  values (p_user_id, v_reward, 'Gorev tamamlandi', 'quest', p_quest_id);

  return jsonb_build_object(
    'ok', true,
    'already_completed', false,
    'added_points', v_reward
  );
end;
$$;

revoke all on function public.complete_quest(uuid, uuid) from public;
grant execute on function public.complete_quest(uuid, uuid) to service_role;
