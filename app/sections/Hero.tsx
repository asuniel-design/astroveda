import { Button } from '../components/ui/button';
import LanguageSwitcher from '../components/language-switcher';

export default function Hero() {
  return (
    <section className="text-center py-12 md:py-20">
      <div className="flex items-center justify-between mb-10">
        <div className="text-left">
          <div className="text-sm font-semibold text-white/90">AstroVeda</div>
          <div className="text-xs text-white/50">Premium Cosmic Guidance</div>
        </div>
        <div className="w-[180px]">
          <LanguageSwitcher compact />
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent leading-tight">
        Connect with India&apos;s<br/>Best Astrologers
      </h1>
      <p className="text-white/70 max-w-2xl mx-auto mb-8">
        Get instant guidance on love, career, health & more from verified Vedic experts.
      </p>
      <Button className="px-8 py-4 text-base">First Chat is FREE 🎁</Button>
    </section>
  );
}
