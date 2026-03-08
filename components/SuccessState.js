import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Gold/saffron + emerald confetti palette
const CONFETTI_COLORS = [
  '#F6CA35', '#E8B80E', '#D49B08',
  '#FFE07F', '#FFF0BF',
  '#10b981', '#34d399',
  '#FAFAFA',
];

function ConfettiParticle({ index, total }) {
  const angle = (index / total) * 360;
  const distance = 70 + Math.random() * 90;
  const size = 4 + Math.random() * 6;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const rotation = Math.random() * 720 - 360;
  const isCircle = Math.random() > 0.5;

  const endX = Math.cos((angle * Math.PI) / 180) * distance;
  const endY = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: endX,
        y: endY,
        scale: [0, 1.4, 0.6],
        opacity: [1, 1, 0],
        rotate: rotation,
      }}
      transition={{
        duration: 1 + Math.random() * 0.5,
        delay: 0.35 + Math.random() * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        width: size,
        height: isCircle ? size : size * 2.5,
        borderRadius: isCircle ? '50%' : '2px',
        backgroundColor: color,
      }}
    />
  );
}

// Golden ring that expands outward with spring physics
function GoldenRingBurst() {
  return (
    <>
      {/* Primary golden ring — #F6CA35 to white gradient */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 2.8, opacity: [0, 0.9, 0] }}
        transition={{
          type: 'spring',
          stiffness: 80,
          damping: 12,
          mass: 0.8,
          delay: 0.2,
        }}
        style={{
          border: '3px solid transparent',
          borderImage: 'linear-gradient(135deg, #F6CA35 0%, #FFE07F 40%, #FFFFFF 100%) 1',
          borderRadius: '50%',
          // borderImage doesn't work with border-radius, so use box-shadow instead
          borderColor: 'transparent',
          boxShadow: `
            0 0 0 2px rgba(246, 202, 53, 0.6),
            0 0 16px 4px rgba(246, 202, 53, 0.25),
            0 0 32px 8px rgba(255, 255, 255, 0.08)
          `,
        }}
      />

      {/* Secondary softer ring — delayed, wider */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 3.5, opacity: [0, 0.5, 0] }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 14,
          mass: 1,
          delay: 0.35,
        }}
        style={{
          boxShadow: `
            0 0 0 1px rgba(246, 202, 53, 0.3),
            0 0 24px 6px rgba(255, 224, 127, 0.12),
            0 0 48px 12px rgba(255, 255, 255, 0.04)
          `,
        }}
      />

      {/* Golden radial glow flash */}
      <motion.div
        className="absolute -inset-8 rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: [0, 0.7, 0],
          scale: [0.4, 1.6, 2],
        }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(246,202,53,0.30) 0%, rgba(255,224,127,0.10) 40%, transparent 70%)',
        }}
      />
    </>
  );
}

function AnimatedCheckmark() {
  return (
    <motion.div
      className="relative w-28 h-28 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
    >
      {/* Golden ring burst — fires first */}
      <GoldenRingBurst />

      {/* Emerald glow (settles after ring passes) */}
      <motion.div
        className="absolute -inset-4 rounded-full"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: [0, 0, 0.4, 0.2],
          scale: [0.6, 0.8, 1.3, 1.2],
        }}
        transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Main circle — bounces in after ring */}
      <motion.div
        className="absolute inset-0 rounded-full
          bg-gradient-to-t from-emerald-500/20 to-transparent
          border border-emerald-500/50
          shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.12, 0.95, 1.02, 1], opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 15,
          delay: 0.3,
        }}
      />

      {/* Inner shimmer */}
      <motion.div
        className="absolute inset-1 rounded-full"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: [0, 0.5, 0.15], rotate: 180 }}
        transition={{ duration: 2, delay: 0.6 }}
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(246,202,53,0.15), transparent, rgba(16,185,129,0.10), transparent)',
        }}
      />

      {/* SVG checkmark — bounces up after circle settles */}
      <svg className="absolute inset-0 w-full h-full p-7" viewBox="0 0 52 52">
        <defs>
          <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* Draw the path */}
        <motion.path
          d="M14 27 l8 8 16-16"
          fill="none"
          stroke="url(#checkGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>

      {/* Checkmark bounce (entire SVG scales) */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.15, 0.97, 1.04, 1], opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 12,
          delay: 0.9,
        }}
      />

      {/* Confetti — fires at peak of checkmark bounce */}
      {Array.from({ length: 24 }).map((_, i) => (
        <ConfettiParticle key={i} index={i} total={24} />
      ))}
    </motion.div>
  );
}

export default function SuccessState({ added, newBalance, onDone }) {
  const [countUp, setCountUp] = useState(0);
  const targetAmount = parseFloat(added) || 0;

  useEffect(() => {
    if (!targetAmount) return;
    const steps = 24;
    const increment = targetAmount / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetAmount) {
        setCountUp(targetAmount);
        clearInterval(timer);
      } else {
        setCountUp(Math.floor(current));
      }
    }, 35);
    return () => clearInterval(timer);
  }, [targetAmount]);

  return (
    <motion.div
      className="text-center py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatedCheckmark />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.45 }}
      >
        <p className="text-white font-bold text-2xl mt-7 mb-1.5 tabular-nums tracking-tight">
          ₹{countUp.toLocaleString()} Added!
        </p>

        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mt-1 mb-7
            bg-gradient-to-t from-emerald-500/10 to-transparent
            border border-emerald-500/20
            shadow-[0_0_12px_rgba(16,185,129,0.1)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.35 }}
        >
          <span className="text-white/50 text-sm">Balance:</span>
          <motion.span
            className="text-saffron font-bold text-lg tabular-nums"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            ₹{newBalance}
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.35 }}
        onClick={onDone}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="wallet-cta px-10 py-3 rounded-2xl text-sm font-bold"
      >
        Continue ✨
      </motion.button>
    </motion.div>
  );
}
