import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ConsultantGrid from '../components/ConsultantGrid';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

export default function Home() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    
    const loadAstrologers = async () => {
      try {
        const res = await fetch('/api/astrologers');
        if (!res.ok) throw new Error(`API failed: ${res.status}`);
        
        const data = await res.json();
        let filtered = data.astrologers || [];
        
        if (filter === 'online') filtered = filtered.filter(a => a.is_online === true);
        else if (filter === 'verified') filtered = filtered.filter(a => a.is_verified === true);
        else if (filter === 'toprated') filtered = filtered.sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0,10);
        
        if (isMounted) setAstrologers(filtered.slice(0,6));
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAstrologers();
    return () => { isMounted = false; };
  }, [filter]);

  return (
    <Layout activePage="Chat">
      {/* Hero */}
      <section className="text-center py-12 md:py-16 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-saffron via-yellow-200 to-saffron bg-clip-text text-transparent leading-tight">
          Connect with India's<br />Best Astrologers
        </h1>
        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
          Get instant guidance on love, career, health & more from verified Vedic experts
        </p>
        <button className="px-8 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-saffron to-yellow-500 text-black shadow-lg shadow-saffron/25 hover:shadow-xl hover:shadow-saffron/40 transition-all duration-300 hover:scale-105 active:scale-[0.98]">
          First Chat is FREE 🎁
        </button>
      </section>

      {/* Services */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: '🌟', title: 'Daily Horoscope', desc: 'Know what stars say today', href: '/horoscope' },
          { icon: '📜', title: 'Free Kundli', desc: 'Get your birth chart', href: '/kundli' },
          { icon: '💑', title: 'Compatibility Match', desc: 'Find your perfect match', href: '/kundli' },
          { icon: '🎴', title: 'Tarot Reading', desc: 'Unlock hidden answers', href: '/tarot' },
        ].map((s, i) => (
          <a key={i} href={s.href} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.08] hover:border-saffron/30 transition-all group cursor-pointer">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{s.icon}</div>
            <h3 className="text-white font-semibold mb-1">{s.title}</h3>
            <p className="text-white/50 text-sm">{s.desc}</p>
          </a>
        ))}
      </section>

      {/* Experts */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">Talk to Our Expert Astrologers</h2>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
          {['all', 'toprated', 'verified', 'online'].map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter===f?'bg-saffron/20 text-saffron border border-saffron/50':'bg-white/[0.03] text-white/50 border border-white/[0.06]'}`}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        {loading ? <div className="text-center py-12"><div className="w-8 h-8 border-2 border-saffron/20 border-t-saffron rounded-full animate-spin mx-auto mb-3"/><p className="text-white/40">Loading...</p></div> : error ? <p className="text-center text-red-400">Server error. Please try again later.</p> : <ConsultantGrid consultants={astrologers}/>}
      </section>

      <TestimonialsCarousel />

      <footer className="mt-16 pt-8 border-t border-white/10 text-center">
        <div className="flex justify-center gap-8 flex-wrap mb-6">
          {[{icon:'🔒',l:'Secure Payments'},{icon:'🛡️',l:'Private & Confidential'},{icon:'✓',l:'Verified Experts'}].map((b,i)=>(
            <div key={i} className="flex items-center gap-2 text-white/70"><span className="text-xl">{b.icon}</span><span className="text-sm font-medium">{b.l}</span></div>
          ))}
        </div>
        <p className="text-xs text-white/40">© 2025 AstroVeda Connect. All rights reserved.</p>
      </footer>
    </Layout>
  );
}