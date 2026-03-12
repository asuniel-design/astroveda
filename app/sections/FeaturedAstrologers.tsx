"use client";
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import AstrologerCard from '@/components/astrologer-card';

export default function FeaturedAstrologers() {
  const t = useTranslations();
  const { data, isLoading, error } = useSWR('astrologers', api.astrologers);
  const list = data?.astrologers || [];
  return (
    <section className="py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left text-white">{t('home.featuredAstrologersTitle')}</h2>
      {isLoading && (
        <div className="text-center py-12 text-white/50">{t('home.loadingAstrologers')}</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-400">{t('home.serverError')}</div>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
          {list.slice(0,3).map((a: any) => (
            <AstrologerCard key={a.id} astro={a} />
          ))}
        </div>
      )}
    </section>
  );
}
