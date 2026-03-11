import Hero from '../sections/Hero';
import Services from '../sections/Services';
import FeaturedAstrologers from '../sections/FeaturedAstrologers';
import Testimonials from '../sections/Testimonials';
import InfiniteRemedyCarousel from '../components/infinite-remedy-carousel';

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6">
      <Hero />
      <Services />
      <FeaturedAstrologers />
      <InfiniteRemedyCarousel />
      <Testimonials />
      <div className="h-20" />
      <footer className="border-t border-white/10 py-8 text-center text-white/50 text-sm">
        <div className="flex justify-center gap-8 mb-4">
          <span>🔒 Secure Payments</span>
          <span>🛡️ Private & Confidential</span>
          <span>✓ Verified Experts</span>
        </div>
        <p>© {new Date().getFullYear()} AstroVeda Connect. All rights reserved.</p>
      </footer>
    </main>
  );
}
