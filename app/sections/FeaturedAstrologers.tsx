"use client";
import useSWR from 'swr';
import { api } from '@/lib/api';
import AstrologerCard from '@/components/astrologer-card';

export default function FeaturedAstrologers() {
  const { data, isLoading, error } = useSWR('astrologers', api.astrologers);
  const list = data?.astrologers || [];
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">Talk to Our Expert Astrologers</h2>
      {isLoading && (
        <div className="text-center py-12 text-white/50">Loading astrologers…</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-400">Server error. Please try again later.</div>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.slice(0,6).map((a: any) => (
            <AstrologerCard key={a.id} astro={a} />
          ))}
        </div>
      )}
    </section>
  );
}
