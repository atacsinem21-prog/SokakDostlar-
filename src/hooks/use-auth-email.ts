"use client";

import { useEffect, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

/** `undefined` yükleniyor; `null` oturum yok */
export function useAuthEmail(): string | null | undefined {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const sb = createBrowserSupabaseClient();
      void sb.auth.getSession().then(({ data }) => {
        setEmail(data.session?.user.email ?? null);
      });
      const {
        data: { subscription: sub },
      } = sb.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user.email ?? null);
      });
      subscription = sub;
    } catch {
      setEmail(null);
    }
    return () => subscription?.unsubscribe();
  }, []);

  return email;
}
