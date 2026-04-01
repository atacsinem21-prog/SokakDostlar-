export type LeaderboardRow = {
  id: string;
  profil_adi: string;
  toplam_iyilik_puani: number;
};

export type QuestListRow = {
  id: string;
  gorev_tipi: string;
  odul_puani: number;
  aktif_mi: boolean;
  sponsor_adi: string | null;
  sponsor_logo_url: string | null;
  animal: {
    id: string;
    isim: string;
    tur: "kedi" | "kopek";
  } | null;
};
