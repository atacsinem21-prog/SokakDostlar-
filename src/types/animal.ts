export type AnimalMapRow = {
  id: string;
  isim: string;
  tur: "kedi" | "kopek";
  aclik_durumu: number;
  son_beslenme: string | null;
  created_at: string;
  lat: number;
  lng: number;
  /** API boşken gösterilen örnek harita satırları (kullanımdan kalktı; geriye dönük) */
  is_demo?: boolean;
};
