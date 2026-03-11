type TranslateResponse = {
  data?: {
    translations?: Array<{ translatedText: string; detectedSourceLanguage?: string }>;
  };
  error?: any;
};

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY;

export async function translateBatch(params: {
  texts: string[];
  target: string;
  source?: string;
}): Promise<string[]> {
  const { texts, target, source } = params;

  // No key? Return originals (non-blocking MVP)
  if (!API_KEY) return texts;

  const q = texts.map((t) => (t ?? "").toString());

  const body: any = {
    q,
    target,
    format: "text"
  };
  if (source) body.source = source;

  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = (await res.json()) as TranslateResponse;
  if (!res.ok) {
    // Fail open for MVP
    return texts;
  }

  const translations = data?.data?.translations || [];
  return translations.map((t, i) => t.translatedText || texts[i]);
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
