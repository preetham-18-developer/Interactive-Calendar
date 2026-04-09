import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeasonalBehindGlass, SeasonalOnGlass, SeasonalFrontGlass } from './SeasonalBackground';

interface ImagePanelProps {
  imageSrc: string;
  monthLabel: string;
  year: number;
  currentDate: Date;
  season?: string;
}

export const ImagePanel = React.memo(function ImagePanel({ imageSrc, monthLabel, year, currentDate, season }: ImagePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displaySrc, setDisplaySrc] = useState(imageSrc);
  const [ambientColor, setAmbientColor] = useState('rgba(200, 180, 160, 0.1)');

  const dateKey = currentDate.toISOString().split('T')[0];

  useEffect(() => {
    setDisplaySrc(imageSrc);
  }, [imageSrc]);

  // Extract ambient color from image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          setAmbientColor(`rgba(${r}, ${g}, ${b}, 0.15)`);
        }
      } catch {
        // CORS or other error, use fallback
      }
    };
    img.src = displaySrc;
  }, [displaySrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please select a file under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      try {
        localStorage.setItem(`calendar_hero_media_${dateKey}`, dataUrl);
        setDisplaySrc(dataUrl);
      } catch {
        alert('Could not save — file may be too large for local storage.');
      }
    };
    reader.readAsDataURL(file);
  };

  const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div
      className="image-panel"
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Click to update cover image"
    >
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* LAYER 1: Ambient base */}
      <motion.div
        className="image-panel__ambient"
        animate={{ background: ambientColor }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{ opacity: 0.5 }}
      />

      {/* LAYER 2: Seasonal atmospheric effects BEHIND the glass */}
      <SeasonalBehindGlass month={currentDate.getMonth()} />

      {/* Glass Frost / Blur */}
      <div className="image-panel__ambient-blur">
        <img
          src={displaySrc}
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
          }}
        />
      </div>

      {/* Image Content inside the glass */}
      <div className="image-panel__content">
        <div className="image-panel__image-wrapper">
          <AnimatePresence mode="wait">
            <motion.img
              key={displaySrc}
              src={displaySrc}
              alt="Calendar hero"
              className="image-panel__image"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Glass Glare & Reflection Highlights */}
      <div className="image-panel__glass-glare" />

      {/* LAYER 3: Seasonal effects ON the glass surface (Rain droplets, condensation) */}
      <SeasonalOnGlass month={currentDate.getMonth()} />

      {/* LAYER 4: Seasonal effects IN FRONT of the glass (Snow, Leaves) */}
      <SeasonalFrontGlass month={currentDate.getMonth()} />

      {/* Overlay info */}
      <div className="image-panel__overlay" style={{ zIndex: 40 }}>
        <motion.div
          className="image-panel__month"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {monthLabel}
        </motion.div>
        <motion.div
          className="image-panel__subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {dayOfWeek} · {year} {season && `· ${season}`}
        </motion.div>
      </div>

      {/* Hint */}
      <div className="image-panel__hint">
        Update cover
      </div>
    </div>
  );
});
