import { useState, useEffect } from 'react';
import SuccessState from './SuccessState';
import { trackWalletTierSelected, trackWalletTopUp } from '../lib/analytics';

const AMOUNTS = [
  { value: 100,  label: '₹100',  tag: 'Starter',  icon: '✦' },
  { value: 500,  label: '₹500',  tag: 'Popular',  icon: '◆', popular: true },
  { value: 1000, label: '₹1,000', tag: 'Best Value', icon: '★' },
];

export default function TopUpModal({ open, onClose, onSuccess, userId = 'user1', required, currentBalance }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setLoading(false);
      setError(null);
      setResult(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const addFunds = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/wallet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: selected }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to add funds');
      setResult(data);
      trackWalletTopUp(parseFloat(data.added), data.new_balance);
      // Don't auto-close — let user click "Continue" in SuccessState
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const deficit = required && currentBalance
    ? Math.max(0, parseFloat(required) - parseFloat(currentBalance))
    : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="wallet-modal w-full max-w-[420px] rounded-3xl animate-fade-in relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Golden inner glow — radial gradient overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(246,202,53,0.08) 0%, transparent 60%)',
            }}
          />
          {/* Bottom warm glow */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(246,202,53,0.04) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10 p-7">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-saffron text-lg">💰</span>
                  <h3 className="text-xl font-bold text-white tracking-tight">Premium Wallet</h3>
                </div>
                <p className="text-[0.75rem] text-white/35 leading-relaxed">
                  Add funds to unlock expert consultations
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center
                  text-white/30 hover:text-white/80 hover:bg-white/10
                  transition-all duration-200 -mt-1 -mr-1"
              >
                ✕
              </button>
            </div>

            {/* Balance card */}
            {(currentBalance !== undefined || required) && (
              <div className="rounded-2xl p-4 mb-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(246,202,53,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(246,202,53,0.12)',
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[0.65rem] text-white/35 uppercase tracking-widest font-medium mb-1">Balance</p>
                    <p className="text-2xl font-bold text-white tabular-nums">
                      ₹{currentBalance || '0.00'}
                    </p>
                  </div>
                  {required && (
                    <div className="text-right">
                      <p className="text-[0.65rem] text-white/35 uppercase tracking-widest font-medium mb-1">Need</p>
                      <p className="text-lg font-bold text-amber-400 tabular-nums">₹{required}</p>
                    </div>
                  )}
                </div>
                {deficit > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[0.7rem] text-amber-400/80">
                        Short by ₹{deficit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success state */}
            {result ? (
              <SuccessState
                added={result.added}
                newBalance={result.new_balance}
                onDone={() => onSuccess?.(result)}
              />
            ) : (
              <>
                {/* Amount selection — prestigious cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {AMOUNTS.map((amt) => {
                    const isSelected = selected === amt.value;
                    const covers = deficit > 0 && amt.value >= deficit;
                    return (
                      <button
                        key={amt.value}
                        onClick={() => { setSelected(amt.value); trackWalletTierSelected(amt.value); }}
                        className={`wallet-amount-btn relative flex flex-col items-center gap-1 py-5 rounded-2xl
                          font-bold transition-all duration-300 border
                          ${isSelected
                            ? 'wallet-amount-selected'
                            : 'wallet-amount-idle'
                          }`}
                      >
                        {/* Popular ribbon */}
                        {amt.popular && (
                          <span className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                            text-[0.55rem] font-bold uppercase tracking-wider
                            px-2.5 py-0.5 rounded-full
                            bg-saffron text-black">
                            Popular
                          </span>
                        )}

                        <span className="text-[0.65rem] opacity-50 mb-0.5">{amt.icon}</span>
                        <span className="text-xl tabular-nums">{amt.label}</span>
                        <span className="text-[0.6rem] opacity-40 font-medium">{amt.tag}</span>

                        {covers && (
                          <span className="text-[0.55rem] text-emerald-400/80 font-semibold mt-1">
                            ✓ covers
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-xs">
                    ⚠️ {error}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={addFunds}
                  disabled={!selected || loading}
                  className="wallet-cta w-full py-3.5 rounded-2xl text-sm font-bold
                    transition-all duration-300
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : selected ? (
                    `Add ${AMOUNTS.find(a => a.value === selected)?.label} to Wallet`
                  ) : (
                    'Select an amount'
                  )}
                </button>

                <p className="text-center text-[0.55rem] text-white/20 mt-3 tracking-wide">
                  DEMO MODE · SECURE · NO REAL CHARGES
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
