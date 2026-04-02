"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { HomePatiliEkleSheet } from "./home-patili-ekle-sheet";

const ADD_PARAM_VALUE = "patili-ekle";

export function HomePatiliEkleSheetGate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const addValue = searchParams.get("add");
  const open = addValue === ADD_PARAM_VALUE;

  const close = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("add");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return <HomePatiliEkleSheet open={open} onClose={close} />;
}

