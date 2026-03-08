import { useState, useEffect } from 'react';

export default function ServicesGrid() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
      // Fallback services
      setServices([
        {
          id: 'fallback-1',
          name: 'Daily Horoscope',
          icon: '🌟',
          description: 'Get your daily horoscope based on your sun sign',
          route: '/horoscope',
        },
        {
          id: 'fallback-2',
          name: 'Free Kundli',
          icon: '📜',
          description: 'Generate your free birth chart with detailed analysis',
          route: '/kundli',
        },
        {
          id: 'fallback-3',
          name: 'Compatibility Match',
          icon: '💑',
          description: 'Check compatibility with your partner for marriage or relationship',
          route: '/compatibility',
        },
        {
          id: 'fallback-4',
          name: 'Tarot Reading',
          icon: '🎴',
          description: 'Get insights through tarot card reading',
          route: '/tarot',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.04] rounded-xl p-6 animate-pulse">
            <div className="w-12 h-12 rounded-lg bg-white/10 mb-4" />
            <div className="h-4 bg-white/10 rounded mb-2" />
            <div className="h-3 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Our Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map((service) => (
          <a
            key={service.id}
            href={service.route}
            className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.08] transition-all group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              {service.name}
            </h3>
            <p className="text-white/60 text-sm">
              {service.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}