import React from 'react';
import { motion } from 'framer-motion';

export function SpecialEffects({ type }: { type: string }) {
  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 20 : 50;

  const renderBirthday = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      <motion.div 
        className="absolute inset-0 bg-pink-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3 }}
      />
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
          animate={{ 
            y: window.innerHeight + 50, 
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 50}px)`,
            opacity: [0, 1, 1, 0], 
            rotate: Math.random() * 720 
          }}
          transition={{ 
            duration: 3 + Math.random() * 3, 
            repeat: Infinity, 
            delay: Math.random() * 2,
            ease: "linear"
          }}
          style={{ 
            position: 'absolute', 
            width: 12, height: 12, 
            background: ['#FFD700', '#FF69B4', '#00FFF0', '#7C4DFF', '#FF5252'][i % 5],
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        />
      ))}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50 pointer-events-auto"
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], rotate: [0, -5, 5, 0], opacity: 1 }}
        transition={{ duration: 1.2, ease: "backOut" }}
      >
        <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter bg-gradient-to-b from-yellow-300 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(236,72,153,0.5)] leading-tight">
          Happy<br/>Birthday!
        </h1>
        <motion.div 
          className="mt-4 text-white font-bold tracking-widest uppercase text-sm opacity-60 flex items-center justify-center gap-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>🎂</span> Magic is happening <span>🎂</span>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderAnniversary = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 bg-red-500/5" />
      {[...Array(particleCount - 10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: window.innerHeight + 50, x: Math.random() * window.innerWidth, opacity: 0 }}
          animate={{ 
            y: -100, 
            opacity: [0, 1, 0], 
            scale: [0.5, 1.5, 1],
            x: `calc(${Math.random() * 100}vw + ${Math.cos(i) * 100}px)`
          }}
          transition={{ 
            duration: 4 + Math.random() * 4, 
            repeat: Infinity, 
            delay: Math.random() * 3 
          }}
          style={{ position: 'absolute', color: '#ff4d4d', fontSize: '32px' }}
        >
          ❤
        </motion.div>
      ))}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-white text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        💖 Happy Anniversary!<br/>
        <span className="text-3xl">Forever Together</span>
      </motion.div>
    </div>
  );

  const renderFestival = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 bg-orange-600/10" />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0, 3, 0], rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <div className="w-96 h-96 rounded-full border-4 border-orange-400 opacity-20 blur-xl shadow-[0_0_100px_rgba(251,146,60,0.8)]" />
      </motion.div>
      {[...Array(particleCount + 10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: window.innerWidth/2, y: window.innerHeight/2 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0], 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight 
          }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          style={{ 
            position: 'absolute', 
            width: 8, height: 8, 
            background: '#FFD700', 
            borderRadius: '50%',
            boxShadow: '0 0 20px 5px rgba(255, 215, 0, 0.8)'
          }}
        />
      ))}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="text-5xl font-bold text-orange-100 drop-shadow-[0_0_20px_rgba(251,146,60,1)]">✨ Blessed Festival ✨</div>
      </motion.div>
    </div>
  );

  const renderHoliday = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/10" />
      {[...Array(particleCount * 2)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 0 }}
          animate={{ 
            y: window.innerHeight, 
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 40}px)`,
            opacity: [0, 1, 0.8, 0] 
          }}
          transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
          style={{ 
            position: 'absolute', 
            width: Math.random() * 4 + 2, 
            height: Math.random() * 4 + 2, 
            background: 'white', 
            borderRadius: '50%',
            boxShadow: '0 0 10px white'
          }}
        />
      ))}
      {/* Star bursts */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{ top: `${Math.random()*60}%`, left: `${Math.random()*100}%` }}
          animate={{ scale: [0, 10, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 1.5 }}
        />
      ))}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]">🎉 Happy Holidays!</div>
      </motion.div>
    </div>
  );

  const renderMeeting = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute inset-0 bg-cyan-900/5 mix-blend-color-dodge" />
      {/* Scanning Laser Line */}
      <motion.div 
        className="absolute w-[200%] h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] left-[-50%]"
        initial={{ y: -100 }}
        animate={{ y: window.innerHeight + 100 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Digital HUD Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-cyan-400/20"
          initial={{ opacity: 0, width: 0, height: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            width: [100, 300],
            height: [100, 300],
            rotate: [0, 90]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 1 }}
          style={{ 
            top: `${Math.random() * 80}%`, 
            left: `${Math.random() * 80}%`,
            borderStyle: 'dashed'
          }}
        />
      ))}
      <motion.div 
        className="absolute bottom-20 left-10 text-cyan-400 font-mono text-xl"
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      >
        [ STATUS: IN MEETING ]<br/>
        [ DATA_SYNC: ACTIVE ]
      </motion.div>
    </div>
  );

  const renderMap: Record<string, () => React.ReactNode> = {
    Birthday: renderBirthday,
    Anniversary: renderAnniversary,
    Festival: renderFestival,
    Holiday: renderHoliday,
    Meeting: renderMeeting,
  };

  const Renderer = renderMap[type] || renderHoliday;
  return <Renderer />;
}
