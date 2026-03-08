import { Button } from '../components/ui/button';

export default function Hero() {
  return (
    <section className="text-center py-14 md:py-20">
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
