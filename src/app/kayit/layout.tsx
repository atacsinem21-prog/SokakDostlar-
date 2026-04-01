import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt ol — PATİSİD",
  description: "Hesap oluştur, iyilik görevleri ve topluluk özelliklerine katıl.",
};

export default function KayitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
