import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş — PATİSİD",
  description: "Hesabınla giriş yap, iyilik görevleri ve kanıt akışına katıl.",
};

export default function GirisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
