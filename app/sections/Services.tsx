import Link from 'next/link';

const items = [
  { icon: '🌟', title: 'Daily Horoscope', desc: 'Know what stars say today', href: '/horoscope' },
  { icon: '📜', title: 'Free Kundli', desc: 'Get your birth chart', href: '/kundli' },
  { icon: '💑', title: 'Compatibility Match', desc: 'Find your perfect match', href: '/matching' },
  { icon: '🎴', title: 'Tarot Reading', desc: 'Unlock hidden answers', href: '/tarot' },
];

export default function Services() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((s) => (
        <Link key={s.title} href={s.href} className="card p-6 text-center hover:bg-white/10 hover:border-gold/30 transition">
          <div className="text-3xl mb-3">{s.icon}</div>
          <h3 className="font-semibold text-white mb-1">{s.title}</h3>
          <p className="text-sm text-white/60">{s.desc}</p>
        </Link>
      ))}
    </section>
  );
}
