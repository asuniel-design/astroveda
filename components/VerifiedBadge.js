// Emerald-to-gold gradient verified badge with backdrop blur

export default function VerifiedBadge({ size = 'sm' }) {
  const sizes = {
    xs: 'w-4 h-4 text-[0.5rem]',
    sm: 'w-5 h-5 text-[0.6rem]',
    md: 'w-6 h-6 text-[0.7rem]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full shrink-0 ${sizes[size]}`}
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #F6CA35 100%)',
        boxShadow: '0 2px 8px rgba(16,185,129,0.3), 0 0 12px rgba(246,202,53,0.2)',
      }}
      title="Verified Astrologer"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: '#0F172A' }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

// Star rating display
export function StarRating({ rating, reviewCount, size = 'sm' }) {
  const sizes = {
    xs: 'text-[0.6rem]',
    sm: 'text-xs',
    md: 'text-sm',
  };

  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : '—';
  const displayCount = reviewCount ? (reviewCount >= 1000 ? `${(reviewCount/1000).toFixed(1)}k+` : `${reviewCount}+`) : '';

  return (
    <span className={`inline-flex items-center gap-1 ${sizes[size]}`}>
      <span className="text-amber-400">★</span>
      <span className="font-semibold text-white/90">{displayRating}</span>
      {displayCount && <span className="text-white/40">{displayCount}</span>}
    </span>
  );
}
