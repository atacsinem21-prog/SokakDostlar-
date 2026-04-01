import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "").trim();
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL bos.");
if (!anon) fail("NEXT_PUBLIC_SUPABASE_ANON_KEY bos.");

if (service && service === anon) {
  console.warn(
    "UYARI: SUPABASE_SERVICE_ROLE_KEY ile anon key ayni gorunuyor. Service role key'i Supabase > Project Settings > API > service_role (secret) ile degistir."
  );
}

const restUrl = `${url}/rest/v1/animals?select=id&limit=1`;
const res = await fetch(restUrl, {
  headers: {
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    Accept: "application/json",
  },
});

const bodyText = await res.text();
let body;
try {
  body = JSON.parse(bodyText);
} catch {
  body = bodyText;
}

if (res.status === 200 && Array.isArray(body)) {
  console.log("OK: Supabase baglantisi ve anon key calisiyor.");
  console.log("animals:", body.length ? "ornek satir var" : "tablo var, satir yok");
  process.exit(0);
}

const errMsg =
  typeof body === "object" && body?.message
    ? body.message
    : typeof body === "object" && body?.hint
      ? String(body.hint)
      : bodyText.slice(0, 200);

if (
  res.status === 404 ||
  /relation|does not exist|schema cache|Could not find the table/i.test(errMsg)
) {
  console.log("OK: Supabase baglantisi ve anon key calisiyor.");
  console.log("NOT: 'animals' tablosu henuz yok (normal, 1. asama SQL sonrasi olusur).");
  process.exit(0);
}

if (res.status === 401 || /Invalid API key|JWT expired/i.test(errMsg)) {
  fail("Anon key gecersiz veya yanlis projeye ait.");
}

fail(`Beklenmeyen yanit (${res.status}): ${errMsg}`);
