-- Ornek sokak hayvanlari + gorevler (Turkiye — farkli illerde kara noktalari)
-- 001 + 002 sonrasi calistir. Tekrar calistirmak guvenli (id uzerinden upsert).

-- Opsiyonel: kanit / puan testi icin demo kullanici
insert into public.users (id, profil_adi, toplam_iyilik_puani)
values (
  'c3333333-3333-4333-8333-333333333301'::uuid,
  'DemoIyilikci_Seed',
  0
)
on conflict (id) do update set
  profil_adi = excluded.profil_adi;

insert into public.animals (id, isim, tur, konum, aclik_durumu, son_beslenme)
values
  (
    'a1111111-1111-4111-8111-111111111101'::uuid,
    'Pamuk',
    'kedi',
    ST_SetSRID(ST_MakePoint(32.8597, 39.9334), 4326)::geography,
    68,
    '2026-04-01T08:30:00+00'::timestamptz
  ),
  (
    'a1111111-1111-4111-8111-111111111102'::uuid,
    'Duman',
    'kopek',
    ST_SetSRID(ST_MakePoint(27.1428, 38.4237), 4326)::geography,
    42,
    '2026-04-01T05:00:00+00'::timestamptz
  ),
  (
    'a1111111-1111-4111-8111-111111111103'::uuid,
    'Minnoş',
    'kedi',
    ST_SetSRID(ST_MakePoint(30.7133, 36.8969), 4326)::geography,
    55,
    null
  ),
  (
    'a1111111-1111-4111-8111-111111111104'::uuid,
    'Çapkın',
    'kopek',
    ST_SetSRID(ST_MakePoint(39.7168, 41.0027), 4326)::geography,
    33,
    '2026-03-31T18:00:00+00'::timestamptz
  ),
  (
    'a1111111-1111-4111-8111-111111111105'::uuid,
    'Zeytin',
    'kedi',
    ST_SetSRID(ST_MakePoint(43.3831, 38.4891), 4326)::geography,
    71,
    '2026-04-01T08:00:00+00'::timestamptz
  )
on conflict (id) do update set
  isim = excluded.isim,
  tur = excluded.tur,
  konum = excluded.konum,
  aclik_durumu = excluded.aclik_durumu,
  son_beslenme = excluded.son_beslenme;

insert into public.quests (
  id,
  animal_id,
  gorev_tipi,
  odul_puani,
  aktif_mi,
  sponsor_adi,
  sponsor_logo_url
)
values
  (
    'b2222222-2222-4222-8222-222222222201'::uuid,
    'a1111111-1111-4111-8111-111111111101'::uuid,
    'Sokaktaki patili dostunu besle; mama veya su kabı olduğunu kanıtla',
    25,
    true,
    'Mahalle hayvanseverleri',
    null
  ),
  (
    'b2222222-2222-4222-8222-222222222202'::uuid,
    'a1111111-1111-4111-8111-111111111102'::uuid,
    'Köpek dostuna mama bırak veya besle — fotoğrafla paylaş',
    30,
    true,
    'Patili Dostlar İzmir',
    null
  ),
  (
    'b2222222-2222-4222-8222-222222222203'::uuid,
    'a1111111-1111-4111-8111-111111111103'::uuid,
    'Soğuk havada sıcak mama noktasına su/mama desteği ver',
    20,
    true,
    'Kış Konvoyu',
    null
  ),
  (
    'b2222222-2222-4222-8222-222222222204'::uuid,
    'a1111111-1111-4111-8111-111111111104'::uuid,
    'Barınak önü veya sokak beslemesi yap; mama kabı görüntüsü yükle',
    28,
    true,
    'Sokak Hayvanları Dayanışma Ağı',
    null
  ),
  (
    'b2222222-2222-4222-8222-222222222205'::uuid,
    'a1111111-1111-4111-8111-111111111105'::uuid,
    'Kedi dostuna mama ve temiz su sağla; iyilik kanıtını gönder',
    22,
    true,
    'Vegan Mama Destek',
    null
  )
on conflict (id) do update set
  animal_id = excluded.animal_id,
  gorev_tipi = excluded.gorev_tipi,
  odul_puani = excluded.odul_puani,
  aktif_mi = excluded.aktif_mi,
  sponsor_adi = excluded.sponsor_adi,
  sponsor_logo_url = excluded.sponsor_logo_url;
