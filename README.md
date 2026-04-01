# Sokak Hayvanlari Iyilik Haritasi

Bu dokuman, projeyi adim adim hayata gecirmek icin bir yol haritasi ve takip listesi olarak hazirlandi.  
Her gorev tamamlandikca kutucuklari isaretleyerek ilerleyecegiz.

---

## Proje Teknoloji Yigini

- Next.js (App Router, TypeScript)
- Supabase (PostgreSQL + PostGIS + Realtime)
- Tailwind CSS
- OpenAI Vision (GPT-4o-mini)
- Harita: **Leaflet + OpenStreetMap** (ucretsiz, anahtar yok); ileride istege bagli Google Maps
- Deployment: **en son** (domain + canli sunucu); Vercel simdilik kullanilmiyor.

---

## Calisma sirasi (guncel)

1. **Kalan ozellikler** — temel **auth (giris/kayit)**, **rate limit**, **gizlilik sayfasi** eklendi; **SQL `008`** ile `public.users` senkronu; moderasyon / ileri guvenlik sirada.
2. **Tasarim** — gorsel tutarlilik, tipografi, renk, mobil ince ayar, bos/hata durumlari.
3. **En son** — **domain baglama**, **canli sunucu / hosting** kurulumu, ortam degiskenleri; istege bagli repo (GitHub). **Vercel atlaniyor** (veya cok sonra istege bagli degerlendirilir).

---

## Ilerleme Panosu

### 1) Altyapi ve Veritabani Kurulumu (Supabase)

- [x] Supabase projesi olusturuldu
- [x] Ilk sema SQL dosyasi repoda: `supabase/sql/001_initial_schema.sql` (PostGIS, `animals`, `users`, `quests`, RLS, `animals_map` view, Realtime)
- [x] Supabase SQL Editor'da sema calistirildi
- [x] `animals` tablosu olusturuldu (`id, isim, tur, konum, aclik_durumu, son_beslenme`)
- [x] `quests` tablosu olusturuldu (`id, animal_id, gorev_tipi, odul_puani, aktif_mi`)
- [x] `users` tablosu olusturuldu (`id, profil_adi, toplam_iyilik_puani`)
- [x] PostGIS aktif edildi ve `konum` alani `geography(Point, 4326)` olarak ayarlandi
- [x] Tablolar arasi iliskiler (FK) tanimlandi

**Cursor Komutu**
> "Supabase icin hayvanlarin konumunu (PostGIS), aclik durumunu ve gorevleri tutan PostgreSQL tablo shemasini olustur."

---

### 2) Backend ve API Katmani (Node.js / Next.js)

- [x] Next.js (App Router) projesi baslatildi
- [x] Supabase client baglantisi kuruldu (`src/lib/supabase/public-server.ts`, `src/lib/supabase/browser.ts`)
- [x] Hayvan listesi API: `GET /api/animals` (bbox + `animals_in_bbox` RPC, limit; harita icin)
- [x] Ortam degiskenleri (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — `.env.local`
- [x] API hata yonetimi ve tip guvenligi (`src/types/animal.ts`)

**Cursor Komutu**
> "Next.js projemde Supabase client baglantisini yap ve 'animals' tablosundan verileri ceken bir API route olustur."

**Yerel test:** `npm run dev` sonra tarayicida `http://localhost:3000/api/animals` (SQL calismadan once 500 veya bos liste normal.)

---

### 3) Harita ve Arayuz Tasarimi

- [x] Harita kutuphanesi entegre edildi (`leaflet` + `react-leaflet`, OSM fayanslari)
- [x] Hayvanlar harita uzerinde tur bazli pati SVG ikonlariyla gosterildi
- [x] Marker tiklamasinda alttan acilan "Hayvan Karti" (sheet) tasarlandi
- [x] Hayvan kartinda temel alanlar gosterildi (isim, tur, aclik bar, son beslenme)
- [x] Mobil uyumlu harita ve kart deneyimi (tam ekran `/harita`, alt sheet)

**Harita:** Ekstra API anahtari gerekmez; OSM kullanim politikasina uy (cok yuksek trafikte kendi fayans sunucun veya Mapbox/Google dusunulur).

**Cursor Komutu**
> "React-google-maps kullanarak harita uzerinde veritabanindaki hayvanlari gosteren ve tiklandiginda detay acan bir arayuz kodla."

---

### 4) AI ile Fotograf Dogrulama (Iyilik Kaniti)

- [x] OpenAI entegrasyonu yapildi (`GPT-4o-mini`, `openai` SDK)
- [x] Kullanici fotograf yukleme akisi eklendi (`/kanit` sayfasi)
- [x] Fotografta "kedi/kopek" ve "mama/su kabi" kontrolu yapan API yazildi (`POST /api/verify-photo`)
- [x] Sonuc basariliysa gorev ilerletme tetiklendi (`complete_quest`, `/kanit` + `user_id` / `quest_id`)
- [x] Hatali/eksik kanit durumlari icin net geri bildirim eklendi

**Ucretsiz kullanim:**
- **Mock (varsayilan):** `OPENAI_API_KEY` yoksa otomatik mock; veya `.env.local` icine `VISION_PROVIDER=mock` yaz.
- **Ollama (ucretsiz, yerel, gercek analiz):** [ollama.com](https://ollama.com) kur, `ollama pull llava`, sonra `VISION_PROVIDER=ollama` ve istege bagli `OLLAMA_BASE_URL`, `OLLAMA_MODEL`.
- **OpenAI:** `OPENAI_API_KEY` + (istege bagli) `VISION_PROVIDER=openai`. Kota (429) alirsan mock veya Ollama kullan.

**Cursor Komutu**
> "OpenAI Vision API kullanarak gonderilen fotografta kedi ve mama olup olmadigini analiz eden bir Node.js fonksiyonu yaz."

---

### 5) Real-Time Iyilik Akisi

- [x] Supabase Realtime aboneligi kuruldu (`animals` tablo degisiklikleri — `useAnimalsMap` + `postgres_changes`)
- [x] Tablo degisince `/api/animals` yeniden cekiliyor; harita ve aclik bar (sheet) guncelleniyor
- [x] Global "Iyilik Bildirimleri" paneli eklendi (`IyilikBildirimleri`)
- [x] Realtime durum gostergesi (`RealtimeStatusPill`: baglandi / hata)

**Not:** Realtime calismazsa Supabase Dashboard > **Database > Publications** veya **Project Settings > API > Realtime** ile `animals` tablosunun yayinda oldugunu dogrula (SQL'de `supabase_realtime` ekleme yapildi).

**Cursor Komutu**
> "Supabase Real-time kullanarak 'animals' tablosundaki bir degisiklikte haritadaki ikonu anlik olarak guncelleyen kodu yaz."

---

### 6) Oyunlastirma ve Puan Sistemi

- [x] SQL migration eklendi: `supabase/sql/002_gamification.sql`
- [x] Gorev tamamlaninca puan artirma RPC'si: `complete_quest(p_user_id, p_quest_id)`
- [x] Liderlik tablosu API + sayfa: `GET /api/leaderboard`, `/liderlik`
- [x] Sponsor alanlari gorevlerde: `sponsor_adi`, `sponsor_logo_url` + `/gorevler` kartlari
- [x] Puan hareket logu tablosu: `user_points_log`

**Senin adim:** Supabase SQL Editor'da `supabase/sql/002_gamification.sql` dosyasini calistir.  
Ornek gorevler ve harita verisi icin `003_seed_demo.sql` dosyasini da calistir (bes hayvan, bes gorev, demo kullanici `DemoIyilikci_Seed`).

---

### 7) Yayinlama — **en sona birakildi**

Simdi yapilmiyor: asagidakiler tasarim ve ozellik isleri bittikten sonra.

- [ ] Canli sunucu / hosting (ortam degiskenleri, HTTPS, Supabase URL)
- [ ] Domain baglandi
- [ ] (Istege bagli) Proje GitHub'a yuklendi
- [ ] Ilk sokak hayvani veya canli veri dogrulamasi (Final)

**Not:** **Vercel kullanilmiyor** (atlandi). Domain ve sunucu en son adim.

### 8) Tasarim iyilestirmeleri

- [x] Genel UI tutarliligi (`PageShell`, `card-surface`, `btn-*`, ana sayfa, harita, gorevler, kanit, liderlik, gizlilik, giris/kayit, patili ekle)
- [x] Mobil deneyim ve erisilebilirlik ince ayari (odak halkasi, sticky ust bar, harita yuksekligi)
- [x] Bos yukleme / hata durumlari (gorevler bos liste; harita/kanit yukleme metinleri)

---

## Supabase SQL

Calistirilacak dosyalar:
- **`supabase/sql/001_initial_schema.sql`**
- **`supabase/sql/002_gamification.sql`**
- **`supabase/sql/003_seed_demo.sql`** (ornek hayvanlar + gorevler + demo kullanici; istege bagli)
- **`supabase/sql/004_bulk_animals.sql`** (100 000 ornek pin; sadece kedi/kopek; 81 il merkezi + kara jitter; uzun surebilir; istege bagli)
- **`supabase/sql/005_report_animal.sql`** (`POST /api/animals` ve `/harita/patili-ekle` icin zorunlu)
- **`supabase/sql/006_animals_in_bbox.sql`** (harita: gorunur alan sorgusu; 100k+ veride zorunlu)
- **`supabase/sql/007_tur_kedi_kopek.sql`** (mevcut DB: `diger` -> kedi, tur kisitlamasi; yeni kurulumda `001` zaten sadece kedi/kopek)
- **`supabase/sql/008_auth_users_sync.sql`** (kayit olunca `auth.users` -> `public.users` satiri; giris/kayit kullaniliyorsa calistir)

Supabase Dashboard > SQL > New query > dosya iceriklerini sirayla yapistir > Run.

**Auth:** Dashboard > Authentication > URL Configuration: **Site URL** canlıda `https://patisid.app`; yerel test için `http://localhost:3000`. **Redirect URLs** içine hem `https://patisid.app/auth/callback` hem `http://localhost:3000/auth/callback` eklenmeli.

**Harita API:** `GET /api/animals?west=&south=&east=&north=&limit=` gorunur alan + limit (400–12000). Tarayici ilk acilista **konum izni** ister; izin verilirse yalnizca **yakin cevre** kutusu yuklenir (harita kilitlenmesin diye). Izin yoksa Turkiye kutusu + dusuk limit. **HTTPS** veya `localhost` gerekir (Geolocation API).

**Toplu ornekleri silmek (dikkat):** yalnizca `004` ile uretilen satirlar `isim` alani `Pati 123` bicimindeyse:
`DELETE FROM public.animals WHERE isim ~ '^Pati [0-9]+$';`

---

## Cursor Icin Pro Tip

Proje kokundeki `.cursorrules` dosyasini kullan.

---

## Calisma Sekli

- Her asama basinda ilgili bolumdeki gorevleri seciyoruz.
- Tamamlanan maddeleri `[x]` olarak isaretliyoruz.
- Her asama sonunda kisa bir demo/test yapip sonraki asamaya geciyoruz.
- **Yayin / domain / sunucu** en sona; once ozellik backlog, sonra **Faz 8 tasarim**.

Bu README, proje boyunca tek "kaynak plan" dokumani olarak kullanilacak.
