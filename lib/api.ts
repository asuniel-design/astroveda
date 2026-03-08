import { env } from './env';

export async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// Build an origin from known services
function withOrigin(path: string, origin?: string) {
  if (!origin) return path; // local proxy
  return `${origin.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export const api = {
  astrologers: () => fetchJSON('/api/astrologers'),
  services: () => fetchJSON('/api/services'),
  testimonials: () => fetchJSON('/api/testimonials'),
  horoscope: (sign: string) => fetchJSON(withOrigin(`/horoscope/${sign}`, env.ASTROLOGY_ENGINE)),
};
