'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSlideOver } from '../Chat/ChatSlideOver';

export type ExpertMatrixData = {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  rate: number; 
  is_online: boolean;
  is_busy: boolean;
  last_active: string | null;
  waitTimeMins?: number; 
};

export default function LiveMatrix({ experts }: { experts: ExpertMatrixData[] }) {
  const [selectedExpert, setSelectedExpert] = useState<ExpertMatrixData | null>(null);

  const getSignalVisual = (isOnline: boolean, isBusy: boolean) => {
    if (!isOnline) {
      return (
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          <span className="text-[10px] text-slate-500 tracking-wider">OFFLINE</span>
        </span>
      );
    }
    if (isBusy) {
      return (
        <span className="flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
          <span className="text-[10px] text-amber-500 tracking-wider">BUSY</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] text-emerald-500 tracking-wider">LIVE</span>
      </span>
    );
  };

  return (
    <>
      <div className="bg-[#0F172A]/40 backdrop-blur-md rounded-2xl border border-[#BFA15C]/20 p-6 flex-grow">
        <h3 className="text-lg font-playfair text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
          Live Consultation Network
        </h3>
        
        <div className="space-y-4">
          {experts.map((expert) => (
            <div key={expert.id} className="group relative bg-[#1E293B]/50 hover:bg-[#1E293B]/80 transition-colors border border-white/5 hover:border-[#BFA15C]/30 rounded-xl p-4 flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#0F172A] border-[1.5px] border-slate-700 flex items-center justify-center overflow-hidden">
                    <span className="text-[#F6CA35] text-sm font-serif">{expert.name.split(' ').map(n=>n[0]).join('')}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 bg-[#1E293B] rounded-full border border-slate-700">
                    {expert.is_online ? (expert.is_busy ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )) : (
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium flex items-center gap-3 hover:text-[#BFA15C] transition-colors">
                    <a href={`/expert/${expert.id}`}>{expert.name}</a>
                    {getSignalVisual(expert.is_online, expert.is_busy)}
                  </h4>
                  <p className="text-xs text-[#BFA15C] mt-0.5">{expert.specialty} • {expert.experience_years} Yrs</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-mono text-slate-200">${expert.rate.toFixed(2)} / min</span>
                
                {expert.is_busy && expert.waitTimeMins ? (
                  <span className="text-[10px] text-amber-500/80 uppercase tracking-widest font-mono">
                    ~{expert.waitTimeMins}m Wait
                  </span>
                ) : (
                  <button 
                    onClick={() => setSelectedExpert(expert)}
                    disabled={!expert.is_online || expert.is_busy}
                    className={`text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all ${
                      expert.is_online && !expert.is_busy
                        ? 'border-[#BFA15C] text-[#BFA15C] hover:bg-[#BFA15C] hover:text-[#0F172A] shadow-[0_0_10px_rgba(191,161,92,0.1)] hover:shadow-[0_0_20px_rgba(191,161,92,0.4)] shimmer-gold' 
                        : 'border-slate-700 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Consult Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ChatSlideOver 
        isOpen={!!selectedExpert}
        onClose={() => setSelectedExpert(null)}
        expertName={selectedExpert?.name || ''}
        expertRate={selectedExpert?.rate || 0.99}
      />
    </>
  );
}