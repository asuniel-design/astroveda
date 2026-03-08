import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TopUpModal from './TopUpModal';
import { useWallet } from './WalletContext';
import { trackChatInitiate } from '../lib/analytics';
import VerifiedBadge, { StarRating } from './VerifiedBadge';

const statusMeta = {
  ONLINE: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', pulse: true },
  BUSY:   { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400',   pulse: false },
  OFFLINE:{ bg: 'bg-gray-500/15',     text: 'text-gray-500',    dot: 'bg-gray-500',     pulse: false },
};

function StatusBadge({ status = 'OFFLINE', waitTime }) {
  const safeStatus = typeof status === 'string' ? status.toUpperCase() : 'OFFLINE';
  const m = statusMeta[safeStatus] || statusMeta.OFFLINE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold tracking-wide uppercase ${m.bg} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot} ${m.pulse ? 'animate-pulse' : ''}`} />
      {safeStatus === 'BUSY' && waitTime ? `${waitTime}m wait` : safeStatus}
    </span>
  );
}

function ConsultantCard({ astro, onChat, loading, success }) {
  // Safe defaults with optional chaining
  const safeAstro = astro || {};
  const name = safeAstro.name || 'Astrologer';
  const availability = safeAstro.availability || safeAstro.status || 'OFFLINE';
  // Map availability to status for UI badge
  let status = 'OFFLINE';
  let isOnline = false;
  if (availability === 'ONLINE_AVAILABLE') {
    status = 'ONLINE';
    isOnline = true;
  } else if (availability === 'ONLINE_BUSY') {
    status = 'BUSY';
    isOnline = true;
  } else if (availability === 'OFFLINE') {
    status = 'OFFLINE';
    isOnline = false;
  } else {
    // Fallback to old status field
    status = availability.toUpperCase();
    isOnline = safeAstro.is_online || false;
  }
  const isVerified = safeAstro.is_verified || false;
  const rating = safeAstro.rating || 0;
  const totalRatings = safeAstro.total_ratings || 0;
  const expertise = safeAstro.expertise || ['Vedic Astrology'];
  const languages = safeAstro.languages || ['English'];
  const waitTime = safeAstro.waitTime || null;
  const id = safeAstro.id || '';

  return (
    <div className="astro-card relative animate-fade-in" data-status={status}>
      {/* Row 1: Avatar · Name/Rating · Status */}
      <div className="flex items-start gap-3 mb-3.5">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400/25 to-saffron-400/5
            flex items-center justify-center text-lg font-bold text-saffron
            border border-saffron/15">
            {name.charAt(0)}
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-[2px] border-cosmic1" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-sm text-white/90 truncate leading-tight">{name}</h4>
            {isVerified && <VerifiedBadge size="xs" />}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <StarRating rating={rating} reviewCount={totalRatings} size="xs" />
            <span className="text-white/30 text-[0.65rem]">·</span>
            <span className="text-white/35 text-[0.65rem]">{(totalRatings || 0).toLocaleString()} ratings</span>
          </div>
        </div>

        <StatusBadge status={status} waitTime={waitTime} />
      </div>

      {/* Row 2: Expertise pills */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {expertise.map((exp, i) => (
          <span key={i} className="expertise-pill">{exp}</span>
        ))}
      </div>

      {/* Row 3: Languages */}
      <p className="text-[0.7rem] text-white/40 mb-4 leading-relaxed">
        🌐 {languages.join(' · ')}
      </p>

      <div className="mt-auto" />

      {/* Row 4: Action buttons */}
      <div className="flex gap-2">
        {isOnline ? (
          <button
            onClick={() => onChat(id, name, isOnline)}
            disabled={loading}
            className="btn-cta flex-1 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Connecting…
              </span>
            ) : success ? (
              '✓ Connected'
            ) : (
              '💬 Chat Now'
            )}
          </button>
        ) : status === 'BUSY' ? (
          <button disabled className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400/70 cursor-not-allowed">
            ⏳ Wait {waitTime || '?'} min
          </button>
        ) : (
          <button disabled className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/[0.03] text-white/30 cursor-not-allowed">
            Offline
          </button>
        )}
        <button className="btn-ghost px-3 text-sm">📞</button>
      </div>
    </div>
  );
}

export default function ConsultantGrid({ consultants }) {
  // Ensure consultants is always an array
  const safeConsultants = Array.isArray(consultants) ? consultants : [];
  
  // Hooks must be called unconditionally at the top level
  const router = useRouter();
  const { refreshBalance } = useWallet();
  const [loadingId, setLoadingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [error, setError] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('[ConsultantGrid] Received consultants:', safeConsultants.length);
    console.log('[ConsultantGrid] First consultant:', safeConsultants[0]);
  }, [safeConsultants]);

  // TopUp modal state
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpInfo, setTopUpInfo] = useState({ required: null, balance: null });
  const [pendingChat, setPendingChat] = useState(null);
  
  // Demo user ID for this session (in production, get from auth)
  const [demoUserId] = useState('demo_user_' + Date.now());

  const startChat = async (astrologerId, astrologerName, isOnline = true) => {
    setError(null);
    setSuccessId(null);
    setLoadingId(astrologerId);
    
    try {
      // Safe analytics tracking
      try {
        trackChatInitiate(astrologerId, astrologerName, isOnline ? 'ONLINE' : 'OFFLINE');
      } catch (analyticsError) {
        console.warn('[ConsultantGrid] Analytics error (non-fatal):', analyticsError);
      }
      const resp = await fetch('/api/consultation/v2/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: demoUserId, 
          astrologerId, 
          type: 'CHAT' 
        }),
      });
      const data = await resp.json();

      // --- 402: Insufficient balance → open TopUp modal ---
      if (resp.status === 402) {
        setTopUpInfo({
          required: data.required || '25.00',
          balance: data.balance || '0.00',
        });
        setPendingChat({ astrologerId, astrologerName });
        setTopUpOpen(true);
        setLoadingId(null);
        return;
      }

      if (!resp.ok) throw new Error(data.error || 'Unknown error');

      setSuccessId(astrologerId);
      setTimeout(() => {
        // Redirect to consultation page with the consultation ID
        router.push(`/consultation/${data.consultation_id}`);
      }, 800);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleTopUpSuccess = (result) => {
    setTopUpOpen(false);
    setTopUpInfo({ required: null, balance: result.new_balance });

    // Refresh sidebar/global wallet balance immediately
    refreshBalance(result.new_balance);

    // Auto-retry the chat that triggered the 402
    if (pendingChat) {
      const { astrologerId, astrologerName } = pendingChat;
      setPendingChat(null);
      startChat(astrologerId, astrologerName);
    }
  };

  const [filter, setFilter] = useState('all');

  // Apply filters with safe property access
  const filteredConsultants = safeConsultants.filter((astro) => {
    const safeAstro = astro || {};
    const rating = safeAstro.rating || 0;
    const isVerified = safeAstro.is_verified || false;
    const isOnline = safeAstro.is_online || false;
    
    if (filter === 'top-rated') return rating >= 4.7;
    if (filter === 'verified') return isVerified;
    if (filter === 'online') return isOnline === true;
    return true;
  });

  return (
    <div>
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'top-rated', label: '⭐ Top Rated' },
          { key: 'verified', label: '✓ Verified' },
          { key: 'online', label: '🟢 Online' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all
              ${filter === f.key
                ? 'bg-saffron/15 text-saffron border border-saffron/30'
                : 'bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.06]'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Uniform grid */}
      {filteredConsultants.length === 0 ? (
        <div className="text-center py-12 text-white/30">No astrologers match this filter</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {filteredConsultants
            .filter(astro => astro && astro.id) // Safety filter
            .map((astro) => (
              <ConsultantCard
                key={astro.id}
                astro={astro}
                onChat={startChat}
                loading={loadingId === astro.id}
                success={successId === astro.id}
              />
            ))}
        </div>
      )}

      {/* TopUp Modal */}
      <TopUpModal
        open={topUpOpen}
        onClose={() => { setTopUpOpen(false); setPendingChat(null); }}
        onSuccess={handleTopUpSuccess}
        userId={demoUserId}
        required={topUpInfo.required}
        currentBalance={topUpInfo.balance}
      />
    </div>
  );
}
