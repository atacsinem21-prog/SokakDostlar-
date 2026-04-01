"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";

/** Giriş/kayıt tam ekran hero içinde footer gösterilir; çift footer olmasın */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/giris" || pathname === "/kayit") return null;
  return <SiteFooter />;
}
