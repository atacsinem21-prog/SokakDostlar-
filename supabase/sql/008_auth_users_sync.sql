-- Supabase Auth (auth.users) ile public.users senkronu
-- Yeni kayit olunca profil satiri olusturur. SQL Editor'da calistir.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'profil_adi'), ''),
    nullif(trim(split_part(coalesce(new.email, ''), '@', 1)), ''),
    'iyilikci'
  );
  if length(v_name) < 1 then
    v_name := 'iyilikci';
  end if;
  if length(v_name) > 50 then
    v_name := left(v_name, 50);
  end if;
  v_name := v_name || '_' || left(replace(new.id::text, '-', ''), 10);

  insert into public.users (id, profil_adi)
  values (new.id, v_name);
  return new;
exception
  when unique_violation then
    insert into public.users (id, profil_adi)
    values (new.id, 'kullanici_' || left(replace(new.id::text, '-', ''), 12));
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
