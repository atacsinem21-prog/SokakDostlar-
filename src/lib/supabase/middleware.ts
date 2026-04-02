import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { safeInternalPath } from "@/lib/auth/safe-redirect";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
}

/** Sifre / OAuth akisi — giris zorunlulugu disinda */
function isPublicAuthPath(pathname: string): boolean {
  if (pathname === "/giris" || pathname === "/kayit") return true;
  if (
    pathname === "/auth/callback" ||
    pathname.startsWith("/auth/callback/")
  ) {
    return true;
  }
  return false;
}

/**
 * Oturum olmadan görülebilen sayfalar (SEO, bilgilendirme, ana sayfa).
 * Harita, görevler, liderlik ve patili ekle burada yok — giriş gerekir.
 */
function isPublicPath(pathname: string): boolean {
  if (isPublicAuthPath(pathname)) return true;
  if (pathname === "/") return true;
  if (
    pathname === "/hakkinda" ||
    pathname === "/gizlilik" ||
    pathname === "/cerez-politikasi"
  ) {
    return true;
  }
  if (pathname === "/ara" || pathname === "/kanit") return true;
  if (pathname.startsWith("/rehber/")) return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  if (pathname === "/opengraph-image" || pathname.startsWith("/opengraph-image")) {
    return true;
  }
  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user: User | null = null;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }
  /* env yokken oturum okunamaz; user=null — public olmayan rotalar /giris'e yönlendirilir */

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    return supabaseResponse;
  }

  const nextParam = request.nextUrl.searchParams.get("next");
  const destinationAfterLogin = safeInternalPath(nextParam, "/");

  if (user && (pathname === "/giris" || pathname === "/kayit")) {
    const redirectUrl = new URL(destinationAfterLogin, request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (!user && !isPublicPath(pathname)) {
    const returnTo = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/giris";
    loginUrl.searchParams.set("next", returnTo || "/");
    const redirectResponse = NextResponse.redirect(loginUrl);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  return supabaseResponse;
}
