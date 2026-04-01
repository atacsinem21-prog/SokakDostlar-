-- tur: sadece kedi / kopek (diger kaldirilir)
-- Mevcut veritabaninda calistir.

update public.animals
set tur = 'kedi'
where tur = 'diger';

alter table public.animals
  drop constraint if exists animals_tur_check;

alter table public.animals
  add constraint animals_tur_check check (tur in ('kedi', 'kopek'));
