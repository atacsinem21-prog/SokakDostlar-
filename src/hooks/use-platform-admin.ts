"use client";

import { useEffect, useState } from "react";

export function usePlatformAdmin(): boolean | undefined {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        const json = (await res.json()) as { is_admin?: boolean };
        if (!active) return;
        setIsAdmin(Boolean(json.is_admin));
      } catch {
        if (!active) return;
        setIsAdmin(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return isAdmin;
}
