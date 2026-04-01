-- Sokak hayvanlari haritasi: PostGIS + tablolar + RLS + Realtime
-- Supabase SQL Editor'da tek seferde calistir.

-- Extensions
create extension if not exists postgis;

-- Tablolar
create table if not exists public.animals (
  id uuid primary key default gen_random_uuid(),
  isim text not null,
  tur text not null check (tur in ('kedi', 'kopek')),
  konum geography(point, 4326) not null,
  aclik_durumu int not null default 50 check (aclik_durumu between 0 and 100),
  son_beslenme timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  profil_adi text not null unique,
  toplam_iyilik_puani int not null default 0 check (toplam_iyilik_puani >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals (id) on delete cascade,
  gorev_tipi text not null,
  odul_puani int not null default 10 check (odul_puani >= 0),
  aktif_mi boolean not null default true,
  created_at timestamptz not null default now()
);

-- Harita / API icin lat/lng (PostgREST geography'yi dogrudan kolay parse etmez)
create or replace view public.animals_map as
select
  a.id,
  a.isim,
  a.tur,
  a.aclik_durumu,
  a.son_beslenme,
  a.created_at,
  st_y(a.konum::geometry) as lat,
  st_x(a.konum::geometry) as lng
from public.animals a;

-- Spatial index
create index if not exists animals_konum_gix on public.animals using gist (konum);

-- Realtime (guncelleme/silme eski satirlari da gonderebilsin)
alter table public.animals replica identity full;

-- Realtime (ikinci kez calistirirsan bu satir hata verebilir; o zaman atla)
alter publication supabase_realtime add table public.animals;

-- RLS
alter table public.animals enable row level security;
alter table public.quests enable row level security;
alter table public.users enable row level security;

-- Anon okuma (harita + liderlik icin; uygulama anon key ile okur)
-- Ileride auth ile INSERT/UPDATE policy'leri eklenecek.
drop policy if exists "animals_select_public" on public.animals;
create policy "animals_select_public"
  on public.animals for select
  to anon, authenticated
  using (true);

drop policy if exists "quests_select_public" on public.quests;
create policy "quests_select_public"
  on public.quests for select
  to anon, authenticated
  using (true);

drop policy if exists "users_select_public" on public.users;
create policy "users_select_public"
  on public.users for select
  to anon, authenticated
  using (true);

-- View (animals_map) icin: anon'a grant
grant select on public.animals_map to anon, authenticated;
