type UpstashEnv = {
  url?: string;
  token?: string;
};

function env(): UpstashEnv {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

async function cmd(path: string) {
  const { url, token } = env();
  if (!url || !token) throw new Error("Upstash env missing");
  const res = await fetch(`${url}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  return res.json();
}

export async function acquireLock(key: string, ttlMs: number) {
  // SET key "1" NX PX ttl
  const out = await cmd(`/set/${encodeURIComponent(key)}/1?nx=true&px=${ttlMs}`);
  return out?.result === "OK";
}

export async function releaseLock(key: string) {
  await cmd(`/del/${encodeURIComponent(key)}`);
}
