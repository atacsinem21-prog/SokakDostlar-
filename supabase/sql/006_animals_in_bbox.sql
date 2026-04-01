-- Harita: gorunur alan icin hayvan listesi (100k+ veride tam tablo cekilmez)
-- 001 sonrasi. PostgREST RPC ile anon okuma.

create or replace function public.animals_in_bbox(
  p_west double precision,
  p_south double precision,
  p_east double precision,
  p_north double precision,
  p_limit int default 25000
)
returns table (
  id uuid,
  isim text,
  tur text,
  aclik_durumu int,
  son_beslenme timestamptz,
  created_at timestamptz,
  lat double precision,
  lng double precision
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    a.id,
    a.isim,
    a.tur,
    a.aclik_durumu,
    a.son_beslenme,
    a.created_at,
    st_y(a.konum::geometry) as lat,
    st_x(a.konum::geometry) as lng
  from public.animals a
  where st_intersects(
    a.konum::geometry,
    st_makeenvelope(p_west, p_south, p_east, p_north, 4326)
  )
  order by a.created_at desc
  limit least(coalesce(nullif(p_limit, 0), 25000), 50000);
$$;

revoke all on function public.animals_in_bbox(double precision, double precision, double precision, double precision, int) from public;
grant execute on function public.animals_in_bbox(double precision, double precision, double precision, double precision, int) to anon, authenticated;
