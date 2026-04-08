import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMonthYear } from '../utils/dateUtils';
import type { CalendarEvent } from '../types';

interface HeroProps {
  currentDate: Date;
  events: CalendarEvent[];
}

type ThemeMode = 'sunny' | 'rainy' | 'night' | 'festival';

export function Hero({ currentDate, events }: HeroProps) {
  const [customMedia, setCustomMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dateKey = currentDate.toISOString().split('T')[0];

  useEffect(() => {
    const media = localStorage.getItem(`calendar_hero_media_${dateKey}`);
    const type = localStorage.getItem(`calendar_hero_type_${dateKey}`) || 'image';
    
    const globalMedia = localStorage.getItem('calendar_hero_media');
    const globalType = localStorage.getItem('calendar_hero_type') || 'image';
    
    if (media) {
      setCustomMedia(media);
      setMediaType(type as 'image' | 'video');
    } else if (globalMedia) {
      setCustomMedia(globalMedia);
      setMediaType(globalType as 'image' | 'video');
    } else {
      setCustomMedia(null);
      setMediaType('image');
    }
  }, [dateKey]);

  // Logic to determine Theme Mode
  const themeMode = useMemo((): ThemeMode => {
    // 1. Check for Festival events on this day
    const hasFestival = events.some(e => 
      e.dateStr === dateKey && e.type === 'Festival'
    );
    if (hasFestival) return 'festival';

    // 2. Time of Day
    const hours = new Date().getHours();
    if (hours >= 18 || hours < 6) return 'night';
    
    // 3. Seasonal "Rainy" (Simulated for September/October)
    const month = currentDate.getMonth();
    if (month === 8 || month === 9) return 'rainy';

    return 'sunny';
  }, [currentDate, events, dateKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large for LocalStorage. Please select a smaller file (max 2MB).");
      return;
    }

    const type = file.type.startsWith('video/') ? 'video' : 'image';
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      try {
        localStorage.setItem(`calendar_hero_media_${dateKey}`, dataUrl);
        localStorage.setItem(`calendar_hero_type_${dateKey}`, type);
        setCustomMedia(dataUrl);
        setMediaType(type);
      } catch (err) {
        alert("Could not save to LocalStorage (possibly too large).");
      }
    };
    reader.readAsDataURL(file);
  };

  const monthIdx = currentDate.getMonth();
  const defaultImageIndex = (monthIdx % 2) + 1;
  const defaultImageSrc = `/images/hero_${defaultImageIndex}.png`;

  const displayMedia = customMedia || defaultImageSrc;
  const isVideo = mediaType === 'video';

  return (
    <div className="hero-section" onClick={() => fileInputRef.current?.click()}>
      <input 
        type="file" 
        accept="image/*,video/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      
      {/* Dynamic Adaptive Background */}
      <AdaptiveAura mode={themeMode} />

      <div className="hero-image-container relative z-10 flex items-center justify-center p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isVideo ? (
            <div className="relative group w-full h-full flex items-center justify-center">
              {/* Soft Blur Backdrop (Bleed Effect) */}
              <motion.img
                key={`blur-${displayMedia}`}
                src={displayMedia}
                className="absolute w-[80%] h-[80%] object-contain blur-[60px] opacity-40 scale-110 select-none pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
              
              {/* Main Image */}
              <motion.img
                key={displayMedia}
                src={displayMedia}
                alt="Calendar Hero"
                className="relative z-10 max-w-full max-h-full object-contain rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          ) : (
            <motion.video
              key="video"
              src={displayMedia}
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 max-w-full max-h-full object-contain rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="hero-media-hint">Click to update cover image</div>
      <div className="hero-content">
        <div className="hero-month">{formatMonthYear(currentDate)}</div>
        <div className="hero-year font-light tracking-wide opacity-80 uppercase text-[10px]">Premium Workspace • {themeMode}</div>
      </div>
    </div>
  );
}

function AdaptiveAura({ mode }: { mode: ThemeMode }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const variants = {
    sunny: {
      bg: 'linear-gradient(180deg, #FDFCF0 0%, #F5E6CC 100%)',
      accent: '#FFD700',
    },
    rainy: {
      bg: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
      accent: '#94A3B8',
    },
    night: {
      bg: 'linear-gradient(180deg, #020617 0%, #1E1B4B 100%)',
      accent: '#818CF8',
    },
    festival: {
      bg: 'linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)',
      accent: '#F43F5E',
    }
  };

  const current = variants[mode];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
      {/* Master Gradient Layer */}
      <motion.div 
        className="absolute inset-0"
        animate={{ background: current.bg }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Sunny Mode: Sunlight Rays & Dust Particles */}
      {mode === 'sunny' && (
        <>
          {/* Subtle Rays */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`ray-${i}`}
                className="absolute top-0 left-1/2 w-[200%] h-full origin-top"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 0%, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%)',
                  rotate: -30 + i * 30,
                  x: '-50%'
                }}
                animate={{ rotate: [-30 + i * 30 - 2, -30 + i * 30 + 2] }}
                transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          {/* Dust Particles */}
          {!isMobile && Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute w-1 h-1 bg-white/40 rounded-full blur-[1px]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, 10, 0],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </>
      )}

      {/* Rainy Mode: Subtle Vertical Motion & Mist */}
      {mode === 'rainy' && (
        <>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          {!isMobile && Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              className="absolute w-[1px] h-12 bg-white/10"
              style={{ left: `${Math.random() * 100}%`, top: '-10%' }}
              animate={{ y: ['0vh', '110vh'] }}
              transition={{
                duration: 0.6 + Math.random() * 0.4,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </>
      )}

      {/* Night Mode: Twinkling Stars */}
      {mode === 'night' && (
        <>
          {!isMobile && Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full blur-[0.5px]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                opacity: [0.1, 0.8, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </>
      )}

      {/* Special Day / Festival Mode: Shimmer & Ambient Shimmer */}
      {mode === 'festival' && (
        <>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-pink-400/10 via-amber-200/5 to-transparent"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          {!isMobile && Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`shimmer-${i}`}
              className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </>
      )}

      {/* Depth: Soft Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
    </div>
  );
}
