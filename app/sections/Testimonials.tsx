"use client";
import useSWR from 'swr';
import { api } from '@/lib/api';

export default function Testimonials() {
  const { data } = useSWR('testimonials', api.testimonials);
  const items = data?.testimonials || [];
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((t: any) => (
          <div key={t.id} className="card p-6">
            <div className="text-yellow-300 mb-3">{'★★★★★'.slice(0, t.rating || 5)}</div>
            <p className="text-white/80 text-sm mb-3">“{t.review}”</p>
            <p className="text-white/40 text-xs">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
