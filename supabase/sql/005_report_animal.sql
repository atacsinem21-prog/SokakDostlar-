-- Haritaya kullanici bildirimi (API, service role) — geography insert guvenli tek nokta
-- 004 veya onceki seedlerden sonra calistir.

create or replace function public.report_animal(
  p_isim text,
  p_tur text,
  p_lng double precision,
  p_lat double precision,
  p_aclik int default 50
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_aclik int;
begin
  if length(trim(p_isim)) < 1 or length(trim(p_isim)) > 80 then
    raise exception 'Isim 1-80 karakter olmali';
  end if;
  if p_tur not in ('kedi', 'kopek') then
    raise exception 'Tur kedi veya kopek olmali';
  end if;
  if p_lng < 25.5 or p_lng > 45.5 or p_lat < 35.5 or p_lat > 42.5 then
    raise exception 'Konum Turkiye sinirlari icinde olmali';
  end if;

  v_aclik := greatest(0, least(100, coalesce(p_aclik, 50)));

  insert into public.animals (isim, tur, konum, aclik_durumu)
  values (
    trim(p_isim),
    p_tur,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    v_aclik
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.report_animal(text, text, double precision, double precision, int) from public;
grant execute on function public.report_animal(text, text, double precision, double precision, int) to service_role;
