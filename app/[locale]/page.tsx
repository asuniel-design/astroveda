import { getTranslations } from 'next-intl/server';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import FeaturedAstrologers from '../sections/FeaturedAstrologers';
import InfiniteRemedyCarousel from '../components/infinite-remedy-carousel';
import TrustMarquee from '../components/trust-marquee';

export default async function Page() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6">
      <Hero />
      <FeaturedAstrologers />
      <TrustMarquee />
      <Services />
      <InfiniteRemedyCarousel />
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
