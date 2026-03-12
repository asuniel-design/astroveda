type TranslateResponse = {
  data?: {
    translations?: Array<{ translatedText: string; detectedSourceLanguage?: string }>;
  };
  error?: any;
};

function getApiKey() {
  return process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY;
}

// Lightweight in-memory cache (best-effort; serverless instances are ephemeral)
const CACHE = new Map<string, string>();
const CACHE_MAX = 5000;

function cacheGet(key: string) {
  return CACHE.get(key);
}
function cacheSet(key: string, val: string) {
  if (CACHE.size > CACHE_MAX) CACHE.clear();
  CACHE.set(key, val);
}

function makeKey(text: string, target: string, source?: string) {
  return `${source || "auto"}::${target}::${text}`;
}

export async function translateBatch(params: {
  texts: string[];
  target: string;
  source?: string;
}): Promise<string[]> {
  const { texts, target, source } = params;

  const API_KEY = getApiKey();

  // No key? Return originals (non-blocking MVP)
  if (!API_KEY) return texts;

  const qAll = texts.map((t) => (t ?? "").toString());

  const out = [...qAll];
  const misses: Array<{ idx: number; text: string }> = [];

  qAll.forEach((text, idx) => {
    const k = makeKey(text, target, source);
    const cached = cacheGet(k);
    if (cached != null) out[idx] = cached;
    else misses.push({ idx, text });
  });

  if (misses.length === 0) return out;

  // Google supports batching via `q: string[]`
  const q = misses.map((m) => m.text);

  const body: any = {
    q,
    target,
    format: "text"
  };
  if (source) body.source = source;

  const referer =
    process.env.TRANSLATE_REFERER ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost");

  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Some Google API keys are restricted by HTTP referrer.
      Referer: referer,
    },
    body: JSON.stringify(body)
  });

  const data = (await res.json()) as TranslateResponse;
  if (!res.ok) {
    // Fail open for MVP
    return texts;
  }

  const translations = data?.data?.translations || [];

  translations.forEach((tr, i) => {
    const translatedText = tr.translatedText || q[i];
    const { idx, text } = misses[i];
    out[idx] = translatedText;
    cacheSet(makeKey(text, target, source), translatedText);
  });

  // Fail open if counts mismatch
  return out.map((v, i) => v ?? qAll[i]);
}

export async function translateDeep(params: {
  value: any;
  target: string;
}): Promise<any> {
  const { value, target } = params;

  // Collect string leaves
  const strings: string[] = [];
  const paths: Array<(string | number)[]> = [];

  function walk(v: any, path: (string | number)[]) {
    if (typeof v === "string") {
      strings.push(v);
      paths.push(path);
      return;
    }
    if (Array.isArray(v)) {
      v.forEach((item, idx) => walk(item, [...path, idx]));
      return;
    }
    if (v && typeof v === "object") {
      Object.entries(v).forEach(([k, vv]) => walk(vv, [...path, k]));
    }
  }

  const clone = structuredClone(value);
  walk(clone, []);

  if (!strings.length) return clone;

  const translated = await translateBatch({ texts: strings, target });

  function setAt(obj: any, path: (string | number)[], val: any) {
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) {
      cur = cur[path[i] as any];
    }
    cur[path[path.length - 1] as any] = val;
  }

  translated.forEach((t, idx) => setAt(clone, paths[idx], t));
  return clone;
}
