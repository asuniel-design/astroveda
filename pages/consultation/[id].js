import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '../../components/WalletContext';
import { getAura } from '../../lib/utils/aura';

export default function ConsultationRoom({ params }) {
  const id = params?.id || '';
  const router = useRouter();
  const { balance } = useWallet();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [aura] = useState(getAura('user1'));
  const [isTyping, setIsTyping] = useState(false);
  
  // Get astrologer from URL query or use default
  const astrologerName = router.query.name || 'Acharya Gupta';
  const astrologerStatus = router.query.status || 'ONLINE';

  useEffect(() => {
    const initialMessage = {
      role: 'ai',
      text: "Namaste! How can I help you today?"
    };
    setMessages([initialMessage]);
  }, [id]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const resp = await fetch('/api/v1/prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, consultationId: id }),
      });
      
      if (resp.ok) {
        const data = await resp.json();
        setTimeout(() => {
          const aiMsg = { role: 'ai', text: data.response || "The stars are aligning..." };
          setMessages(prev => [...prev, aiMsg]);
          setIsTyping(false);
        }, 1500);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      setTimeout(() => {
        const aiMsg = { 
          role: 'ai', 
          text: "The stars suggest a massive shift in your 10th house. How do you feel about taking a leadership role this month?"
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 relative overflow-hidden flex flex-col">
      <div className={`absolute inset-0 bg-gradient-radial ${aura.color} to-transparent opacity-20 blur-[120px] pointer-events-none`} />

      {/* Header with Astrologer Info */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center mb-4 md:mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-white/60 hover:text-white text-xl">←</button>
          
          <div className="flex items-center gap-3">
            {/* Astrologer Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-yellow-600 flex items-center justify-center text-sm font-bold text-black">
              {astrologerName.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">{astrologerName}</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${astrologerStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className={`text-[10px] font-medium uppercase tracking-widest ${astrologerStatus === 'ONLINE' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {astrologerStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Balance</p>
            <p className="text-sm font-bold text-saffron">₹{balance || '—'}</p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-2xl overflow-y-auto mb-4 md:mb-6 relative z-10 space-y-4 md:space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] ${m.role === 'user' 
              ? 'bg-gradient-to-r from-saffron to-yellow-500 text-slate-950 font-bold' 
              : 'bg-slate-800/50 border border-white/10 text-slate-200'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-amber-500/50 text-[10px] font-bold animate-pulse uppercase tracking-[0.3em] ml-2">
            The Oracle is deciphering your transit...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="relative group">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask the stars anything..." 
            className="w-full bg-slate-900 border border-white/10 rounded-3xl p-4 md:p-6 pr-16 md:pr-20 focus:outline-none focus:border-amber-500/50 transition-all text-base md:text-lg"
          />
          <button 
            onClick={sendMessage}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 px-4 md:px-6 py-2 rounded-2xl font-black uppercase text-xs hover:bg-amber-400 transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-4 bg-[#0f0c29]/80 backdrop-blur-2xl border-t border-white/10">
        <a className="flex flex-col items-center gap-0.5 text-xs text-saffron" href="/">
          <span className="text-xl">💬</span>Chat
        </a>
        <a className="flex flex-col items-center gap-0.5 text-xs text-white/50" href="/kundli">
          <span className="text-xl">📜</span>Kundli
        </a>
        <a className="flex flex-col items-center gap-0.5 text-xs text-white/50" href="/wallet">
          <span className="text-xl">💰</span>Wallet
        </a>
        <a className="flex flex-col items-center gap-0.5 text-xs text-white/50" href="/profile">
          <span className="text-xl">👤</span>Profile
        </a>
      </div>
    </div>
  );
}