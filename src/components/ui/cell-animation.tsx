"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Clock } from "lucide-react";

export type AnimationType = 'Birthday' | 'Anniversary' | 'Festival' | 'Holiday' | 'Meeting' | 'Reminder';

interface CellAnimationProps {
  type: AnimationType;
  isActive: boolean;
  isHovered?: boolean;
}

export function CellAnimation({ type, isActive, isHovered }: CellAnimationProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isActive) return null;

  switch (type) {
    case 'Birthday':
      return <BirthdayAnimation isHovered={isHovered} isMobile={isMobile} />;
    case 'Anniversary':
      return <AnniversaryAnimation isHovered={isHovered} isMobile={isMobile} />;
    case 'Meeting':
      return <MeetingAnimation />;
    case 'Festival':
      return <FestivalAnimation isHovered={isHovered} isMobile={isMobile} />;
    case 'Holiday':
      return <HolidayAnimation />;
    case 'Reminder':
      return <ReminderAnimation />;
    default:
      return null;
  }
}

function BirthdayAnimation({ isHovered, isMobile }: { isHovered?: boolean, isMobile?: boolean }) {
  const particleCount = isMobile ? 4 : (isHovered ? 12 : 6);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
      {/* Soft Glowing Ring */}
      <motion.div 
        className="absolute inset-0 border-2 border-primary/20 rounded-lg"
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `-10%` 
            }}
            animate={{ 
              y: ['0%', '110%'],
              x: [0, (Math.random() - 0.5) * 20],
              opacity: [0, 0.6, 0] 
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AnniversaryAnimation({ isHovered, isMobile }: { isHovered?: boolean, isMobile?: boolean }) {
  const heartCount = isMobile ? 1 : 3;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
      {/* Soft pink/red glow */}
      <motion.div 
        className="absolute inset-0 bg-red-400/5 blur-xl"
        animate={{ opacity: isHovered ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      {/* Glowing hearts */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        {Array.from({ length: heartCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{ 
              scale: [0.5, 0.8, 0.5],
              opacity: [0.1, 0.4, 0.1],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 4 + i, 
              repeat: Infinity, 
              delay: i * 1.5 
            }}
            style={{ 
              left: `${20 + (i * 30)}%`,
              top: `${30 + (i * 20)}%`
            }}
          >
            <Heart className="text-red-400 fill-red-400" size={10} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MeetingAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-inherit">
      {/* Thin animated border stroke */}
      <div className="absolute inset-0 border-[0.5px] border-sky-400/20 rounded-sm overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full h-[1px] bg-sky-400/40"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Subtle ticking icon or indicator */}
      <motion.div 
        className="absolute bottom-1 right-1 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Clock size={8} />
      </motion.div>
    </div>
  );
}

function FestivalAnimation({ isHovered, isMobile }: { isHovered?: boolean, isMobile?: boolean }) {
  const bokehCount = isMobile ? 2 : 4;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
      <motion.div 
        className="absolute inset-0 bg-amber-400/5 mix-blend-overlay"
        animate={{ opacity: isHovered ? [0.1, 0.3, 0.1] : [0.05, 0.2, 0.05] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      {/* Floating light particles (Bokeh) */}
      <div className="absolute inset-0">
        {Array.from({ length: bokehCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200/20 blur-[2px]"
            style={{ 
              width: '4px',
              height: '4px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 5 + Math.random() * 3, 
              repeat: Infinity,
              delay: i * 1.2
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HolidayAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
      <motion.div 
        className="absolute inset-0 bg-emerald-400/5 dark:bg-emerald-400/10"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function ReminderAnimation() {
  return (
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none">
      <motion.div 
        className="w-1 h-1 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3] 
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}
