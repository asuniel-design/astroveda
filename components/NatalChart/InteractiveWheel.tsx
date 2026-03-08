'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PlanetBase = {
  name: string;
  sign: string;
  house: number;
  dignity: string;
  angle: number;
  aspects: string[];
};

export default function InteractiveWheel({ planets = [] }: { planets: PlanetBase[] }) {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetBase | null>(null);

  // Layout geometry for the circular chart
  const SVG_SIZE = 500;
  const CENTER = SVG_SIZE / 2;
  const RADIUS = 200;

  // Path generator for a 30-degree zodiac/house wedge
  const createWedge = (index: number) => {
    const startAngle = (index * 30 - 15) * (Math.PI / 180);
    const endAngle = ((index + 1) * 30 - 15) * (Math.PI / 180);
    
    const x1 = CENTER + RADIUS * Math.cos(startAngle);
    const y1 = CENTER + RADIUS * Math.sin(startAngle);
    
    const x2 = CENTER + RADIUS * Math.cos(endAngle);
    const y2 = CENTER + RADIUS * Math.sin(endAngle);

    return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
      {/* SVG Wheel Background (Static Base) */}
      <svg 
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} 
        className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(191,161,92,0.15)] pointer-events-none"
      >
        <defs>
          <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(191,161,92,0.05)" />
            <stop offset="100%" stopColor="rgba(191,161,92,0.2)" />
          </radialGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={RADIUS + 10} fill="rgba(15, 23, 42, 0.6)" stroke="#BFA15C" strokeWidth="1" strokeOpacity="0.4" />
        
        {/* Draw 12 Houses */}
        {[...Array(12)].map((_, i) => (
          <path
            key={`house-${i}`}
            d={createWedge(i)}
            fill="url(#goldGlow)"
            stroke="#BFA15C"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            className="pointer-events-auto hover:fill-[#BFA15C] hover:fill-opacity-20 transition-all duration-500 cursor-crosshair"
          />
        ))}

        {/* Draw Zodiac/Signs Markers inside Wheel */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = CENTER + (RADIUS - 20) * Math.cos(angle);
          const y = CENTER + (RADIUS - 20) * Math.sin(angle);
          return (
            <text
              key={`degree-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="rgba(255,255,255,0.3)"
              className="text-[10px] font-serif font-light pointer-events-none"
            >
              {i + 1}
            </text>
          );
        })}

        {/* Inner Circle Cut-out */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS - 80} fill="#0b1120" stroke="#BFA15C" strokeWidth="0.5" strokeOpacity="0.5" />
        
        {/* Center Emblem/Lagna representation */}
        <circle cx={CENTER} cy={CENTER} r={30} fill="#BFA15C" fillOpacity="0.1" stroke="#BFA15C" strokeWidth="1" className="animate-pulse" />
      </svg>

      {/* Interactive/Animated Planet Overlay using Framer Motion HTML/SVG hybrid */}
      {/* We use an absolute container identical to the SVG viewBox so HTML/motion overlays map perfectly */}
      <div className="absolute inset-0 w-full h-full" style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          <AnimatePresence>
            {planets.map((planet) => {
              const radian = (planet.angle * Math.PI) / 180;
              const dist = RADIUS - 50; 
              
              // Map to percentages for responsive absolute positioning
              // Center is 50%, Radius is scaled based on %
              const pxPercent = 50 + (dist / SVG_SIZE) * Math.cos(radian) * 100;
              const pyPercent = 50 + (dist / SVG_SIZE) * Math.sin(radian) * 100;

              const isHovered = hoveredPlanet?.name === planet.name;

              return (
                <motion.div 
                  key={planet.name}
                  // Animate the snap when props (angles) change
                  initial={false}
                  animate={{ 
                    left: `${pxPercent}%`, 
                    top: `${pyPercent}%` 
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 100, 
                    damping: 20 
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  onMouseEnter={() => setHoveredPlanet(planet)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                >
                  <motion.div
                    animate={{ scale: isHovered ? 1.3 : 1 }}
                    className="relative flex items-center justify-center w-8 h-8"
                  >
                    <div className="absolute w-6 h-6 rounded-full bg-[#1E293B] border-[1.5px] border-[#BFA15C] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#F6CA35]">
                        {planet.name.substring(0, 2)}
                      </span>
                    </div>
                    {isHovered && (
                      <div className="absolute w-9 h-9 rounded-full border border-[#F6CA35] animate-ping opacity-75"></div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic HUD Overlay for Planet Info */}
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 bg-[#0F172A]/80 backdrop-blur-xl border border-[#BFA15C]/40 rounded-xl p-4 shadow-2xl z-20 pointer-events-none w-56"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[#F6CA35] font-serif text-lg">{hoveredPlanet.name}</h4>
              <span className="text-[10px] uppercase tracking-widest text-[#BFA15C]/70 border border-[#BFA15C]/30 px-2 py-0.5 rounded-full">
                House {hoveredPlanet.house}
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-300 font-light">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Sign:</span>
                <span className="text-white">{hoveredPlanet.sign}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Dignity:</span>
                <span className="text-emerald-400 font-medium">{hoveredPlanet.dignity}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Aspects:</span>
                <span className="text-white">{hoveredPlanet.aspects.length ? hoveredPlanet.aspects.join(', ') : 'None'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}