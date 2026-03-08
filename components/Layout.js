import Link from 'next/link';
import { useWallet } from './WalletContext';

const navItems = [
  { href: '/marketplace', icon: '🔮', label: 'Marketplace' },
  { href: '/', icon: '🏠', label: 'Home' },
  { href: '/calculators', icon: '🔢', label: 'Calculators' },
  { href: '/kundli', icon: '📜', label: 'Kundli' },
  { href: '/profile', icon: '🌟', label: 'Daily Insight' },
  { href: '/profile', icon: '👤', label: 'Profile' },
  { href: '/wallet', icon: '💰', label: 'Wallet' },
  { href: '/notifications', icon: '🔔', label: 'Notifications' },
  { href: '/login', icon: '🔐', label: 'Login' },
  { href: '/signup', icon: '📝', label: 'Sign Up' },
];

function FreeTrialBadge() {
  const { freeUsed } = useWallet();

  // Only show when we know the user hasn't used free chat yet
  if (freeUsed !== false) return null;

  return (
    <Link href="/" className="block mx-6 mb-3">
      <div className="free-trial-badge rounded-xl p-3 relative overflow-hidden cursor-pointer
        transition-all duration-300 hover:scale-[1.02]">
        {/* Animated glow background */}
        <div className="absolute inset-0 rounded-xl animate-glow-pulse" />
        <div className="relative flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-400">Free Trial Active</p>
            <p className="text-[0.6rem] text-emerald-400/50 mt-0.5">
              Your first chat is on us! 🎁
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function WalletBadge() {
  const { balance } = useWallet();

  return (
    <div className="mx-6 mb-3 rounded-xl p-3 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(246,202,53,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(246,202,53,0.12)',
      }}
    >
      <p className="text-[0.6rem] text-white/35 uppercase tracking-widest font-medium mb-0.5">Wallet</p>
      <p className="text-lg font-bold text-white tabular-nums">
        ₹{balance ?? '—'}
      </p>
    </div>
  );
}

function Sidebar({ active }) {
  const { freeUsed, userName } = useWallet();

  // Determine user display
  const displayName = userName || 'Guest User';
  const initial = displayName.charAt(0).toUpperCase();

  // Status line
  let statusText = 'Welcome';
  if (freeUsed === false) statusText = 'Free Trial Active ✨';
  else if (freeUsed === true) statusText = 'Premium Member';

  return (
    <aside className="hidden md:flex flex-col w-[280px] sticky top-0 h-screen bg-white/[0.04] backdrop-blur-xl border-r border-white/10">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-10 bg-gradient-to-r from-saffron to-yellow-200 bg-clip-text text-transparent">
          AstroVeda<br />Connect
        </h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${active === item.label
                  ? 'bg-saffron/20 text-saffron shadow-lg shadow-saffron/10'
                  : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="mt-auto">
        <FreeTrialBadge />
        <WalletBadge />

        {/* User info */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-yellow-600 flex items-center justify-center text-sm font-bold text-black">
              {initial}
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">{displayName}</p>
              <p className="text-xs text-white/50">{statusText}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileTabBar({ active }) {
  const { balance, freeUsed } = useWallet();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-4 bg-cosmic1/80 backdrop-blur-2xl border-t border-white/10">
      {[
        { icon: '💬', label: 'Chat', href: '/' },
        { icon: '📜', label: 'Kundli', href: '/kundli' },
        { icon: '💰', label: 'Wallet', href: '/wallet' },
        { icon: '👤', label: 'Profile', href: '/profile' },
        { icon: '🔔', label: 'Notifications', href: '/notifications' },
      ].map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`flex flex-col items-center gap-0.5 text-xs transition-colors
            ${active === tab.label ? 'text-saffron' : 'text-white/50 hover:text-white/70'}`}
        >
          <span className="text-xl">{tab.icon}</span>
          {tab.label}
        </Link>
      ))}
      {/* Wallet or free trial indicator */}
      {freeUsed === false ? (
        <Link href="/" className="flex flex-col items-center gap-0.5 text-xs text-emerald-400">
          <span className="text-xl relative">
            🎁
            <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </span>
          Free
        </Link>
      ) : balance !== null ? (
        <div className="flex flex-col items-center gap-0.5 text-xs text-saffron">
          <span className="text-xl">💰</span>
          ₹{balance}
        </div>
      ) : null}
    </div>
  );
}

export default function Layout({ children, activePage = 'Chat' }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <Sidebar active={activePage} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        {children}
      </main>
      <MobileTabBar active={activePage} />
    </div>
  );
}
