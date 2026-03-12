import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import FeaturedAstrologers from '../sections/FeaturedAstrologers';
import InfiniteRemedyCarousel from '../components/infinite-remedy-carousel';
import TrustMarquee from '../components/trust-marquee';

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  const year = new Date().getFullYear();

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6">
      <Suspense fallback={<div className="h-[520px]" />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<div className="h-[260px]" />}>
        <FeaturedAstrologers />
      </Suspense>
      <InfiniteRemedyCarousel />
      <Services />
      <TrustMarquee />
      <div className="h-20" />
      <footer className="border-t border-white/10 py-8 text-center text-white/50 text-sm">
        <div className="flex justify-center gap-8 mb-4">
          <span>{t('home.footer.securePayments')}</span>
          <span>{t('home.footer.privateConfidential')}</span>
          <span>{t('home.footer.verifiedExperts')}</span>
        </div>
        <p>{t('home.footer.rights', { year })}</p>
      </footer>
    </main>
  );
}
