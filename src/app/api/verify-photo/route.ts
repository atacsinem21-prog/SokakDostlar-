import OpenAI, { APIError, RateLimitError } from "openai";
import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createServiceSupabaseClient } from "@/lib/supabase/service-server";

export const runtime = "nodejs";

type VisionCheckResult = {
  kedi_veya_kopek_var_mi: boolean;
  mama_veya_su_kabi_var_mi: boolean;
  guven: number;
  aciklama: string;
};

type VisionProvider = "openai" | "ollama" | "mock";

type QuestRewardPayload =
  | { skipped: true }
  | { ok: false; error: string }
  | {
      ok: true;
      already_completed: boolean;
      added_points: number;
    };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(s: string): boolean {
  return UUID_RE.test(s.trim());
}

function toDataUrl(buffer: ArrayBuffer, mimeType: string): string {
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

function toBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

function normalizeResult(raw: VisionCheckResult): VisionCheckResult {
  return {
    kedi_veya_kopek_var_mi: Boolean(raw.kedi_veya_kopek_var_mi),
    mama_veya_su_kabi_var_mi: Boolean(raw.mama_veya_su_kabi_var_mi),
    guven: Math.max(0, Math.min(100, Number(raw.guven) || 0)),
    aciklama: String(raw.aciklama ?? "").trim(),
  };
}

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

function resolveProvider(): VisionProvider {
  const raw = process.env.VISION_PROVIDER?.trim().toLowerCase();
  if (raw === "openai" || raw === "ollama" || raw === "mock") return raw;
  if (process.env.OPENAI_API_KEY?.trim()) return "openai";
  return "mock";
}

function parseOptionalId(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

async function tryQuestReward(
  userId: string | null,
  questId: string | null,
  dogrulandi: boolean,
): Promise<QuestRewardPayload | undefined> {
  if (!dogrulandi) return undefined;
  if (!userId && !questId) return { skipped: true };
  if (!userId || !questId) {
    return {
      ok: false,
      error: "Gorev puanı için hem user_id hem quest_id gerekli (ikisi de UUID).",
    };
  }
  if (!isUuid(userId) || !isUuid(questId)) {
    return { ok: false, error: "user_id veya quest_id gecerli UUID degil." };
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.rpc("complete_quest", {
      p_user_id: userId,
      p_quest_id: questId,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const row = data as {
      ok?: boolean;
      already_completed?: boolean;
      added_points?: number;
    } | null;

    if (!row) {
      return { ok: false, error: "complete_quest bos yanit dondu." };
    }

    if (row.already_completed) {
      return {
        ok: true,
        already_completed: true,
        added_points: Number(row.added_points) || 0,
      };
    }

    if (row.ok === true) {
      return {
        ok: true,
        already_completed: false,
        added_points: Number(row.added_points) || 0,
      };
    }

    return { ok: false, error: "Gorev tamamlanamadi." };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
    if (msg.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return {
        ok: false,
        error:
          "Sunucuda SUPABASE_SERVICE_ROLE_KEY tanimli degil; gorev tamamlanamadi.",
      };
    }
    return { ok: false, error: msg };
  }
}

async function verifyWithOpenAI(
  dataUrl: string,
): Promise<{ result: VisionCheckResult }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY gerekli (VISION_PROVIDER=openai).");
  }
  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text:
              "Bu fotoğrafta (1) kedi veya köpek var mı ve (2) mama ya da su kabı var mı kontrol et. " +
              "Yalnızca JSON döndür. Şema: " +
              '{"kedi_veya_kopek_var_mi": boolean, "mama_veya_su_kabi_var_mi": boolean, "guven": number, "aciklama": string}. ' +
              "guven 0-100 arası olsun, aciklama tek cümle olsun.",
          },
          {
            type: "input_image",
            image_url: dataUrl,
            detail: "auto",
          },
        ],
      },
    ],
    temperature: 0,
  });

  const raw = response.output_text?.trim();
  if (!raw) {
    throw new Error("Model bos yanit dondu.");
  }
  let parsed: VisionCheckResult;
  try {
    parsed = JSON.parse(raw) as VisionCheckResult;
  } catch {
    throw new Error("Model JSON disi yanit dondu.");
  }
  return { result: normalizeResult(parsed) };
}

async function verifyWithOllama(
  base64: string,
): Promise<{ result: VisionCheckResult }> {
  const base =
    process.env.OLLAMA_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL?.trim() || "llava";

  const prompt =
    "Bu fotografta (1) kedi veya kopek var mi ve (2) mama veya su kabı var mi? " +
    "Sadece JSON cevap ver, baska metin yok. Semasi: " +
    '{"kedi_veya_kopek_var_mi": boolean, "mama_veya_su_kabi_var_mi": boolean, "guven": number, "aciklama": string}';

  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
          images: [base64],
        },
      ],
      stream: false,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(
      `Ollama hata (${res.status}): ${t.slice(0, 200) || res.statusText}`,
    );
  }

  const body = (await res.json()) as {
    message?: { content?: string };
  };
  const text = body.message?.content?.trim() ?? "";
  if (!text) {
    throw new Error("Ollama bos yanit dondu.");
  }

  const jsonStr = extractJsonObject(text);
  if (!jsonStr) {
    throw new Error("Ollama yanitinda JSON bulunamadi.");
  }
  let parsed: VisionCheckResult;
  try {
    parsed = JSON.parse(jsonStr) as VisionCheckResult;
  } catch {
    throw new Error("Ollama JSON parse edilemedi.");
  }
  return { result: normalizeResult(parsed) };
}

function verifyMock(): {
  result: VisionCheckResult;
  uyari: string;
} {
  return {
    result: {
      kedi_veya_kopek_var_mi: false,
      mama_veya_su_kabi_var_mi: false,
      guven: 0,
      aciklama:
        "Mock modu: gercek analiz yapilmadi. Ucretsiz test icin VISION_PROVIDER=ollama veya yerel Ollama kullan.",
    },
    uyari:
      "Mock modu aktif. OpenAI kotasi yok veya anahtar yok; gercek dogrulama icin Ollama (ucretsiz, yerel) veya OpenAI kullan.",
  };
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`verify-photo:${ip}`, { max: 12, windowMs: 60_000 });
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

    const provider = resolveProvider();

    const form = await req.formData();
    const image = form.get("image");
    const userId = parseOptionalId(form.get("user_id"));
    const questId = parseOptionalId(form.get("quest_id"));

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "image alaninda dosya gondermelisin." },
        { status: 400 },
      );
    }

    if (image.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya 8MB ustunde. Daha kucuk bir gorsel dene." },
        { status: 400 },
      );
    }

    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowed.has(image.type)) {
      return NextResponse.json(
        { error: "Sadece JPG, PNG veya WEBP destekleniyor." },
        { status: 400 },
      );
    }

    const buffer = await image.arrayBuffer();
    const dataUrl = toDataUrl(buffer, image.type);
    const base64 = toBase64(buffer);

    if (provider === "openai" && !process.env.OPENAI_API_KEY?.trim()) {
      return NextResponse.json(
        {
          error:
            "VISION_PROVIDER=openai secildi ama OPENAI_API_KEY yok. VISION_PROVIDER=mock veya ollama kullan.",
        },
        { status: 400 },
      );
    }

    let result: VisionCheckResult;
    let providerTag: VisionProvider;
    let uyari: string | undefined;

    if (provider === "mock") {
      const m = verifyMock();
      result = m.result;
      uyari = m.uyari;
      providerTag = "mock";
    } else if (provider === "ollama") {
      const { result: r } = await verifyWithOllama(base64);
      result = r;
      providerTag = "ollama";
    } else {
      try {
        const { result: r } = await verifyWithOpenAI(dataUrl);
        result = r;
        providerTag = "openai";
      } catch (err) {
        if (err instanceof RateLimitError || err instanceof APIError) {
          const status = err.status ?? 429;
          if (status === 429) {
            return NextResponse.json(
              {
                error:
                  "OpenAI kotasi doldu (429). Billing veya VISION_PROVIDER=mock / ollama kullan.",
              },
              { status: 429 },
            );
          }
        }
        throw err;
      }
    }

    const dogrulandi =
      result.kedi_veya_kopek_var_mi && result.mama_veya_su_kabi_var_mi;

    const quest_reward = await tryQuestReward(userId, questId, dogrulandi);

    return NextResponse.json({
      dogrulandi,
      result,
      provider: providerTag,
      uyari,
      quest_reward,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
