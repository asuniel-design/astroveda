'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function ChatSlideOver({ 
  expertName, 
  isOpen, 
  onClose,
  expertRate = 0.99
}: { 
  expertName: string;
  isOpen: boolean;
  onClose: () => void;
  expertRate?: number;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-[#0F172A]/90 backdrop-blur-2xl border-l border-[#BFA15C]/30 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-[#1E293B]/50 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#BFA15C] flex items-center justify-center text-[#F6CA35] font-serif uppercase">
                  {expertName.split(' ').map(n=>n[0]).join('').substring(0,2)}
                </div>
                <div>
                  <h3 className="text-white font-playfair tracking-wider">Chat with {expertName.split(' ')[0]}</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 uppercase tracking-widest mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Session
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="flex justify-center">
                <span className="text-[10px] uppercase tracking-widest text-[#BFA15C]/60 bg-[#BFA15C]/10 px-3 py-1 rounded-full">
                  End-to-End Encrypted Vedic Channel
                </span>
              </div>
              
              <div className="flex flex-col gap-1 items-start">
                <div className="bg-[#1E293B] text-slate-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-700/50 max-w-[85%]">
                  Namaste! I am analyzing your immediate planetary alignments based on the ephemeris calculations. How can I guide you today?
                </div>
                <span className="text-[9px] text-slate-500 pl-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-[#0F172A]">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your question..." 
                  className="w-full bg-[#1E293B] border border-slate-700 text-slate-200 text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-[#BFA15C]/50 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#BFA15C] text-white flex items-center justify-center hover:bg-[#a68a4a] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
              <div className="mt-3 flex justify-between items-center px-2">
                <span className="text-[10px] text-slate-500 font-mono">Current Rate: ${expertRate.toFixed(2)}/min</span>
                <span className="text-[10px] text-slate-500">Wallet Avg Balance: $45.00</span>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}