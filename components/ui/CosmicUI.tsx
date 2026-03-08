'use client';

import { motion } from 'framer-motion';

export function GlowingCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      {/* Background glow that expands on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/0 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      {/* Actual card content */}
      <div className="relative bg-[#0B0E14]/80 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden h-full">
        {children}
      </div>
    </div>
  );
}

export function NeonButton({ 
  children, 
  onClick, 
  disabled = false, 
  fullWidth = false 
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  disabled?: boolean,
  fullWidth?: boolean 
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-full text-sm uppercase tracking-widest font-semibold overflow-hidden transition-all
        ${fullWidth ? 'w-full' : ''}
        ${disabled 
          ? 'border border-slate-800 text-slate-600 cursor-not-allowed' 
          : 'border border-[#D4AF37] text-[#D4AF37] hover:text-[#0B0E14] hover:bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'}
      `}
    >
      {/* Shimmer effect inside button */}
      {!disabled && (
        <span className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite]"></span>
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
