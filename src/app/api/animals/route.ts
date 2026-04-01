import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-server";
import {
  DEFAULT_TURKEY_BBOX,
  isValidBBox,
  type MapBBox,
} from "@/lib/map-bbox";
import type { AnimalMapRow } from "@/types/animal";

const DEFAULT_LIMIT = 3500;
/** Harita yakin cevre modu 50 pin; alt sinir dusuk tutuldu */
const MIN_LIMIT = 50;
const MAX_LIMIT = 12_000;

function parseBBox(searchParams: URLSearchParams): MapBBox {
  const west = Number(searchParams.get("west"));
  const south = Number(searchParams.get("south"));
  const east = Number(searchParams.get("east"));
  const north = Number(searchParams.get("north"));
  const b: MapBBox = { west, south, east, north };
  if (isValidBBox(b)) return b;
  return DEFAULT_TURKEY_BBOX;
}

function parseLimit(searchParams: URLSearchParams): number {
  const raw = searchParams.get("limit");
  if (raw === null || raw === "") return DEFAULT_LIMIT;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, Math.floor(n)));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bbox = parseBBox(searchParams);
    const p_limit = parseLimit(searchParams);

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.rpc("animals_in_bbox", {
      p_west: bbox.west,
      p_south: bbox.south,
      p_east: bbox.east,
      p_north: bbox.north,
      p_limit,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 },
      );
    }

    return NextResponse.json({
      animals: (data ?? []) as AnimalMapRow[],
      bbox,
      limit: p_limit,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type ReportBody = {
  isim?: string;
  tur?: string;
  lat?: number;
  lng?: number;
  aclik_durumu?: number;
};

function parseTur(v: unknown): v is "kedi" | "kopek" {
  return v === "kedi" || v === "kopek";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`report-animal:${ip}`, { max: 24, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: `Çok fazla istek. ${rl.retryAfterSec} saniye sonra tekrar dene.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSec) },
        },
      );
    }

    let body: ReportBody;
    try {
      body = (await req.json()) as ReportBody;
    } catch {
      return NextResponse.json({ error: "Gecersiz JSON." }, { status: 400 });
    }

    const isim = String(body.isim ?? "").trim();
    if (isim.length < 1 || isim.length > 80) {
      return NextResponse.json(
        { error: "Isim 1-80 karakter olmali." },
        { status: 400 },
      );
    }

    const turRaw = body.tur;
    if (!parseTur(turRaw)) {
      return NextResponse.json(
        { error: "Tur kedi veya kopek olmali." },
        { status: 400 },
      );
    }

    const lat = Number(body.lat);
    const lng = Number(body.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { error: "Gecerli enlem ve boylam gerekli." },
        { status: 400 },
      );
    }

    const aclik =
      body.aclik_durumu === undefined
        ? 50
        : Math.floor(Number(body.aclik_durumu));
    if (!Number.isFinite(aclik) || aclik < 0 || aclik > 100) {
      return NextResponse.json(
        { error: "Aclik 0-100 arasinda olmali." },
        { status: 400 },
      );
    }

    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.rpc("report_animal", {
      p_isim: isim,
      p_tur: turRaw,
      p_lng: lng,
      p_lat: lat,
      p_aclik: aclik,
    });

    if (error) {
      const msg = error.message || "Kayit eklenemedi.";
      const lower = msg.toLowerCase();
      if (lower.includes("konum") || lower.includes("turkiye")) {
        return NextResponse.json({ error: msg }, { status: 400 });
      }
      if (lower.includes("isim")) {
        return NextResponse.json({ error: msg }, { status: 400 });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const id = typeof data === "string" ? data : null;
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        {
          error:
            "Sunucu yapilandirmasi eksik (SUPABASE_SERVICE_ROLE_KEY). Yonetici ile iletisime gec.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
