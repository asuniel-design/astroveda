import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../lib/currency';
import { formatPerMinute } from '../lib/pricing';
import MarketingTicker from '../components/MarketingTicker';

export default function AstroVedaHome() {
  const [birthData, setBirthData] = useState({ date: '', time: '', city: '' });
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch('/api/experts/list');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setExperts(data.experts || []);
      } catch (err) {
        console.error('Failed to fetch experts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center">
      <MarketingTicker />
      {/* Premium Header */}
      <header className="w-full max-w-6xl mx-auto py-8 px-6 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Placeholder for Task 2.1 Logo */}
          <div className="w-10 h-10 border border-[#BFA15C] rounded flex items-center justify-center text-[#BFA15C] font-serif text-xl italic">A</div>
          <span className="font-serif text-2xl tracking-wide text-gray-900">AstroVeda <span className="text-[#BFA15C] italic">Connect</span></span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase text-gray-500">
          <Link href="#horoscope" className="hover:text-[#BFA15C] transition">Daily Horoscope</Link>
          <Link href="#consult" className="hover:text-[#BFA15C] transition">Experts</Link>
          <Link href="/dashboard" className="text-[#BFA15C]">Partner Login</Link>
        </nav>
      </header>

      {/* Hero Section (Task 2.2 Hero Asset Placeholder) */}
      <main className="w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-serif leading-tight text-gray-900">
            Ancient Wisdom for the <br/>
            <span className="text-[#BFA15C] italic">Modern Journey.</span>
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-md leading-relaxed">
            Discover your path with real-time Vedic astrology. Generate your precise natal chart and connect with verified experts instantly.
          </p>
          
          {/* User Onboarding Flow: Birth Details */}
          <div className="bg-white/40 backdrop-blur-lg p-8 rounded-xl shadow-sm border border-gold/20 space-y-4 max-w-md">
            <h3 className="font-serif text-xl text-gray-800 border-b border-[#BFA15C]/30 pb-2 inline-block">Generate Your Chart</h3>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <input type="date" className="p-3 border border-gray-200 rounded text-sm outline-none focus:border-[#BFA15C] transition" />
              <input type="time" className="p-3 border border-gray-200 rounded text-sm outline-none focus:border-[#BFA15C] transition" />
            </div>
            <input type="text" placeholder="City & Country of Birth" className="w-full p-3 border border-gray-200 rounded text-sm outline-none focus:border-[#BFA15C] transition" />
            <button className="w-full bg-[#BFA15C] text-white py-3 rounded tracking-widest uppercase text-xs font-semibold hover:bg-[#a68a4a] transition shimmer-gold">
              Reveal Ephemeris Data
            </button>
          </div>
        </div>

        {/* Hero Visual Asset */}
        <div className="relative h-[500px] w-full bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
          {/* Placeholder for Task 2.2 Mandala */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
             <div className="w-96 h-96 border-[0.5px] border-[#BFA15C] rounded-full flex items-center justify-center">
                <div className="w-64 h-64 border-[0.5px] border-[#BFA15C] rotate-45"></div>
             </div>
          </div>
          <p className="text-gray-400 font-serif italic relative z-10">[ Hero Mandala Asset: workspace/assets/ ]</p>
        </div>
      </main>

      {/* Connect with Astrologer Section */}
      <section id="consult" className="w-full bg-white py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-3xl font-serif text-gray-900">Connect with an Expert</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading astrologers...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load astrologers: {error}</p>
          ) : experts.length === 0 ? (
            <p className="text-gray-500">No astrologers available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ExpertCard({ expert }) {
  const { name, specialty, image, isVerified, metrics, isLive, raw } = expert;
  const { experience_years, rating, reviews } = metrics;
  
  return (
    <div className="flex flex-col bg-white/40 backdrop-blur-lg rounded-xl overflow-hidden border border-gold/20 text-left hover:shadow-md transition group">
      {/* Image & Status */}
      <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Online Pulse Indicator */}
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center">
            <div className="relative">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="ml-2 text-xs text-green-800 font-medium">Live</span>
          </div>
        )}
        {/* Experience Badge */}
        {experience_years > 0 && (
          <div className="absolute bottom-3 left-3 bg-[#BFA15C] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            {experience_years} years
          </div>
        )}
        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            Verified
          </div>
        )}
      </div>
      
      {/* Details */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-serif text-xl text-gray-900 pr-2">{name}</h4>
          {/* Rating */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-[#BFA15C] font-bold">{rating}</span>
            <span className="text-gray-400 ml-1">({reviews})</span>
          </div>
        </div>
        
        <p className="text-xs text-[#BFA15C] uppercase tracking-widest mb-3">{specialty}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {expert.bio || 'Expert astrologer with deep knowledge in Vedic astrology.'}
        </p>
        
        <div className="mt-auto">
          {/* Dynamic Pricing */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-serif text-gray-900">
              {formatPerMinute(raw.baseINR, raw.currency)}
            </span>
            <span className="text-xs text-gray-500">per minute</span>
          </div>
          
          <button className="w-full text-xs font-semibold tracking-widest border border-gray-300 text-gray-800 py-2 rounded hover:border-[#BFA15C] hover:text-[#BFA15C] transition shimmer-gold">
            Start Consultation
          </button>
        </div>
      </div>
    </div>
  );
}