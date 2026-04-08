import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

type Season = 'summer' | 'monsoon' | 'autumn' | 'winter';

const getSeason = (month: number): Season => {
  if (month >= 2 && month <= 5) return 'summer'; // March - June
  if (month >= 6 && month <= 8) return 'monsoon'; // July - September
  if (month >= 9 && month <= 10) return 'autumn'; // October - November
  return 'winter'; // December - February
};

export const SeasonalBehindGlass: React.FC<{ month: number }> = React.memo(({ month }) => {
  const season = getSeason(month);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`behind-${season}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {season === 'summer' && (
            <>
              {/* Warm sunrise gradient behind */}
              <div 
                className="absolute inset-0" 
                style={{ background: 'radial-gradient(circle at top right, rgba(255, 200, 50, 0.25), rgba(255, 100, 0, 0.05), transparent 70%)' }} 
              />
              {/* Sunlight diffusing */}
              <motion.div
                className="absolute top-[-20%] right-[-10%] w-[120%] h-[80%] blur-[100px] rounded-full"
                style={{ background: 'rgba(255, 180, 40, 0.2)' }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 0.8, 0.6] 
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}

          {season === 'monsoon' && (
            <>
              <div 
                className="absolute inset-0 opacity-80" 
                style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9))' }} 
              />
              {/* Fog banks behind glass */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[60%] blur-[80px]"
                style={{ background: 'linear-gradient(to top, rgba(100, 116, 139, 0.3), transparent)' }}
                animate={{ opacity: [0.3, 0.5, 0.3], y: [0, -20, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}

          {season === 'autumn' && (
            <div 
              className="absolute inset-0 opacity-60" 
              style={{ background: 'radial-gradient(ellipse at bottom, rgba(184, 112, 74, 0.15), rgba(63, 98, 18, 0.05), transparent)' }} 
            />
          )}

          {season === 'winter' && (
            <>
              <div 
                className="absolute inset-0 opacity-70" 
                style={{ background: 'linear-gradient(to bottom, rgba(226, 232, 240, 0.1), rgba(148, 163, 184, 0.2))' }} 
              />
              <motion.div
                className="absolute top-[20%] left-[10%] w-[80%] h-[60%] blur-[120px]"
                style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export const SeasonalOnGlass: React.FC<{ month: number }> = React.memo(({ month }) => {
  const season = getSeason(month);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[15]">
      <AnimatePresence mode="wait">
        {season === 'monsoon' && (
          <motion.div
            key="on-glass-monsoon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {/* Rain droplets on glass */}
            {Array.from({ length: 20 }).map((_, i) => {
              const leftPos = Math.random() * 100;
              const delay = Math.random() * 8;
              const duration = Math.random() * 4 + 4;
              const size = Math.random() * 3 + 2; // 2px to 5px
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${leftPos}%`,
                    top: `-10px`,
                    width: size,
                    height: size * 1.5,
                    background: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: 'inset 0 -2px 2px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(2px)', // Distort behind it slightly
                  }}
                  animate={{
                    y: [0, 800],
                    opacity: [0, 1, 1, 0],
                    height: [size * 1.5, size * 2.5, size * 1.5] // stretches while falling
                  }}
                  transition={{
                    y: { duration, repeat: Infinity, delay, ease: [0.32, 0, 0.67, 0] },
                    opacity: { duration, repeat: Infinity, delay, times: [0, 0.1, 0.8, 1] },
                    height: { duration, repeat: Infinity, delay, ease: 'easeInOut' }
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export const SeasonalFrontGlass: React.FC<{ month: number }> = React.memo(({ month }) => {
  const season = getSeason(month);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[30]">
      <AnimatePresence mode="wait">
        {season === 'winter' && (
          <motion.div
            key="front-winter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {/* Light Snow in front */}
            {Array.from({ length: isMobile ? 5 : 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/60 blur-[0.5px]"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                }}
                animate={{
                  y: [0, 800],
                  x: [0, Math.random() * 40 - 20],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 8 + 8,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: 'linear',
                }}
              />
            ))}
            {/* Occasional snowflake touching glass and fading */}
            {Array.from({ length: isMobile ? 2 : 5 }).map((_, i) => (
              <motion.div
                key={`touch-${i}`}
                className="absolute rounded-full bg-white/80 blur-[1px]"
                style={{
                  width: 5,
                  height: 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60 + 20}%`, // middle area
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}

        {season === 'autumn' && (
          <motion.div
            key="front-autumn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {/* Minimal falling leaves */}
            {Array.from({ length: isMobile ? 2 : 6 }).map((_, i) => {
              const colors = ['#B8704A', '#84CC16', '#EAB308'];
              return (
                <motion.div
                  key={i}
                  className="absolute opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    width: Math.random() * 4 + 8,
                    height: Math.random() * 6 + 10,
                    borderRadius: '0 8px 0 8px', // precise leaf shape
                    backgroundColor: colors[i % colors.length],
                    boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.2)',
                  }}
                  animate={{
                    y: [0, 900],
                    x: [0, Math.sin(i) * 120 + 50],
                    rotateX: [0, 360],
                    rotateY: [0, 180],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 12 + 12,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                    ease: 'linear',
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
