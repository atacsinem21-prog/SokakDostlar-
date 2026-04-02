"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";

import { useAuthEmail } from "@/hooks/use-auth-email";

import {
  IconAddPin,
  IconGroups,
  IconMap,
  IconTasks,
  IconTrophy,
} from "@/components/home/home-icons";

type Feature = {
  href: string;
  title: string;
  desc: string;
  highlight?: boolean;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const features: Feature[] = [
  {
    href: "/harita",
    title: "Harita",
    desc: "Yakınındaki patili dostları gör; küme ve detayları aç.",
    highlight: true,
    Icon: IconMap,
  },
  {
    href: "/gorevler",
    title: "Görevler",
    desc: "İyilik görevlerini seç, tamamla; puan anında eklenir (onur sistemi).",
    Icon: IconTasks,
  },
  {
    href: "/harita/patili-ekle",
    title: "Patili ekle",
    desc: "Yolda gördüğün hayvanı haritaya işaretle.",
    Icon: IconAddPin,
  },
  {
    href: "/liderlik",
    title: "Liderlik",
    desc: "Topluluğun iyilik puanları.",
    Icon: IconTrophy,
  },
  {
    href: "/mahalle-gruplari",
    title: "Mahalle Grupları",
    desc: "Önce grup modelini keşfet, sonra acil yardımlaşma alanına geç.",
    Icon: IconGroups,
  },
];

export function HomeFeatureGrid() {
  const email = useAuthEmail();
  const canNavigate = Boolean(email);

  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
      {features.map((item) => {
        const Icon = item.Icon;
        const cardClass = `group relative flex h-full min-h-[8.5rem] flex-col gap-3 overflow-hidden rounded-3xl border p-6 transition duration-300 ease-out sm:min-h-[9rem] ${
          item.highlight
            ? "border-amber-200/60 bg-gradient-to-br from-amber-50/95 via-white to-white shadow-[0_2px_8px_rgba(180,83,9,0.06),0_16px_40px_-8px_rgba(15,23,42,0.1)] ring-1 ring-amber-200/45 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-amber-400/90 before:via-amber-300/80 before:to-amber-500/90 hover:-translate-y-0.5 hover:border-amber-300/70 hover:shadow-[0_4px_16px_rgba(180,83,9,0.08),0_22px_48px_-10px_rgba(15,23,42,0.12)]"
            : "border-zinc-200/75 bg-white/95 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-8px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-zinc-300/85 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05),0_20px_44px_-10px_rgba(15,23,42,0.11)]"
        } `;

        const disabledClass =
          "cursor-not-allowed opacity-60 saturate-50 pointer-events-none";

        const inner = (
          <>
            <div className="flex items-start justify-between gap-3">
              <span
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner ring-1 ring-black/[0.04] transition group-hover:scale-[1.04] ${
                  item.highlight
                    ? "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-950"
                    : "bg-gradient-to-br from-zinc-100 to-zinc-50 text-zinc-700"
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span
                className="text-zinc-300 transition duration-300 group-hover:translate-x-0.5 group-hover:text-amber-600"
                aria-hidden
              >
                →
              </span>
            </div>
            <div>
              <span className="block text-[1.0625rem] font-semibold tracking-tight text-zinc-900">
                {item.title}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-zinc-600">
                {item.desc}
              </span>
            </div>
          </>
        );

        return (
          <li
            key={item.href}
            className={item.highlight ? "sm:col-span-2 lg:col-span-1" : ""}
          >
            {canNavigate || item.href === "/mahalle-gruplari" ? (
              <Link href={item.href} className={cardClass}>
                {inner}
              </Link>
            ) : (
              <div className={`${cardClass} ${disabledClass}`} aria-disabled="true">
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
