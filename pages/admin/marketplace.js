import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';

export default function AdminMarketplace() {
  const { isConnected, emitAstrologerStatus } = useSocket();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickerMessages, setTickerMessages] = useState([
    'Mercury Retrograde begins in 2 hours',
    'New astrologer joining tomorrow: Dr. Nair',
    'Special offer: 20% off first consultation',
  ]);
  const [newTicker, setNewTicker] = useState('');
  const [banner, setBanner] = useState({
    title: 'Unlock Your Cosmic Blueprint',
    subtitle: 'Connect with verified astrologers for personalized guidance',
    cta: 'Start Your Journey',
  });

  // Fetch experts from API
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch('/api/experts/list');
        const data = await res.json();
        setExperts(data.experts || []);
      } catch (error) {
        console.error('Failed to fetch experts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const toggleExpertStatus = (expert) => {
    const newOnline = !expert.isLive;
    // Update local state optimistically
    setExperts(experts.map(e => 
      e.id === expert.id ? { ...e, isLive: newOnline } : e
    ));
    // Emit socket event
    emitAstrologerStatus(expert.id, newOnline);
    // TODO: Also update in database via API
  };

  const addTickerMessage = () => {
    if (!newTicker.trim()) return;
    setTickerMessages([...tickerMessages, newTicker]);
    setNewTicker('');
    // TODO: Broadcast to all clients via Socket.io
  };

  const removeTickerMessage = (index) => {
    setTickerMessages(tickerMessages.filter((_, i) => i !== index));
  };

  const updateBanner = (field, value) => {
    setBanner({ ...banner, [field]: value });
    // TODO: Save to database
  };

  const saveBanner = async () => {
    // TODO: Implement API call to save banner
    alert('Banner updated (backend integration pending)');
  };

  return (
    <div className="min-h-screen bg-parchment text-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 border-b border-gold/30 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif italic text-gray-900">Marketplace Admin</h1>
              <p className="text-gold text-sm uppercase tracking-widest mt-2">Real‑Time Control Panel</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Socket: {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <button className="bg-gold text-white px-6 py-2 rounded-lg uppercase tracking-widest text-sm font-semibold hover:bg-gold/80 transition shimmer-gold">
                Publish Changes
              </button>
            </div>
          </div>
        </header>

        {/* Live Pulse Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif mb-6 text-gray-800">Expert Availability</h2>
          {loading ? (
            <div className="text-center py-12">Loading experts...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map(expert => (
                <div key={expert.id} className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-gold/20 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-xl">{expert.name}</h3>
                      <p className="text-sm text-gold uppercase tracking-widest">{expert.specialty}</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => toggleExpertStatus(expert)}
                        className={`w-12 h-6 rounded-full transition ${expert.isLive ? 'bg-green-500' : 'bg-gray-300'}`}
                        aria-label={expert.isLive ? 'Set offline' : 'Set online'}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition ${expert.isLive ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                      {expert.isLive && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                          <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 right-0" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-serif">${expert.rate}</span>
                      <span className="text-xs text-gray-500">per minute</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {expert.metrics?.rating} ★ ({expert.metrics?.reviews} reviews)
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {expert.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Marketing Ticker Manager */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif mb-6 text-gray-800">Marketing Ticker</h2>
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-gold/20">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                placeholder="Enter new ticker message (e.g., 'Mercury Retrograde begins in 2 hours')"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-gold focus:ring-gold"
              />
              <button
                onClick={addTickerMessage}
                className="bg-gold text-white px-6 py-3 rounded-lg uppercase tracking-widest text-sm font-semibold hover:bg-gold/80 transition shimmer-gold whitespace-nowrap"
              >
                Add Message
              </button>
            </div>
            <div className="space-y-3">
              {tickerMessages.map((msg, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                  <span className="text-gray-800">{msg}</span>
                  <button
                    onClick={() => removeTickerMessage(idx)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Banner Editor */}
        <section>
          <h2 className="text-2xl font-serif mb-6 text-gray-800">Homepage Banner</h2>
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-gold/20">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => updateBanner('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-gold focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                <textarea
                  value={banner.subtitle}
                  onChange={(e) => updateBanner('subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-gold focus:ring-gold"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Call‑to‑Action Text</label>
                <input
                  type="text"
                  value={banner.cta}
                  onChange={(e) => updateBanner('cta', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-gold focus:ring-gold"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveBanner}
                  className="bg-gold text-white px-8 py-3 rounded-lg uppercase tracking-widest text-sm font-semibold hover:bg-gold/80 transition shimmer-gold"
                >
                  Update Banner
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}