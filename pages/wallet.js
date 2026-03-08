import { useState } from 'react';
import Layout from '../components/Layout';
import { useWallet } from '../components/WalletContext';

const AMOUNTS = [
  { value: 100, label: '₹100', tag: 'Starter' },
  { value: 500, label: '₹500', tag: 'Popular', popular: true },
  { value: 1000, label: '₹1,000', tag: 'Best Value' },
  { value: 2000, label: '₹2,000', tag: 'Premium' },
];

export default function WalletPage() {
  const { balance, freeUsed } = useWallet();
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`₹${selectedAmount} added to wallet!`);
    }, 1500);
  };

  return (
    <Layout activePage="Wallet">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-saffron to-yellow-200 bg-clip-text text-transparent">
          Wallet
        </h1>
        <p className="text-white/60 mb-8">Add money to your AstroVeda wallet</p>

        {/* Balance Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <p className="text-white/50 text-sm mb-1">Current Balance</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold">₹{balance !== null ? balance : '—'}</span>
          </div>
          {freeUsed && (
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              Free Trial Used
            </span>
          )}
        </div>

        {/* Amount Selection */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Select Amount</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AMOUNTS.map((amt) => (
              <button
                key={amt.value}
                onClick={() => setSelectedAmount(amt.value)}
                className={`relative p-4 rounded-xl text-center transition-all ${
                  selectedAmount === amt.value 
                    ? 'bg-saffron/20 border-2 border-saffron' 
                    : 'bg-white/5 border border-white/10 hover:border-saffron/50'
                }`}
              >
                <span className={`block text-xl font-bold ${selectedAmount === amt.value ? 'text-saffron' : 'text-white'}`}>
                  {amt.label}
                </span>
                <span className="text-[10px] text-white/40">{amt.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-saffron to-yellow-500 text-black text-lg hover:shadow-[0_0_25px_rgba(246,202,53,0.4)] transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Add ₹${selectedAmount}`}
        </button>
      </div>
    </Layout>
  );
}