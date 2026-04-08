import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
  imageSrc: string;
}

export function CinematicIntro({ onComplete, imageSrc }: CinematicIntroProps) {
  const [stage, setStage] = useState<'initial' | 'dolly' | 'expand' | 'complete'>('initial');

  useEffect(() => {
    // Sequence of animation stages
    const timer1 = setTimeout(() => setStage('dolly'), 100);
    const timer2 = setTimeout(() => setStage('expand'), 2500);
    const timer3 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {stage !== 'complete' && (
          <motion.div 
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            {/* The Image scaling / dolly effect */}
            <motion.div
              className="relative overflow-hidden shadow-2xl"
              initial={{ 
                width: '60vw', 
                height: '70vh', 
                borderRadius: '2rem',
                scale: 1
              }}
              animate={
                stage === 'dolly' ? {
                  scale: 1.1,
                  transition: { duration: 2.5, ease: "easeOut" }
                } : stage === 'expand' ? {
                  width: '35%', 
                  height: 'calc(100vh - 4rem)',
                  left: 'calc(-50% + 17.5% + 2rem)', // Target absolute position roughly
                  top: '0',
                  borderRadius: '1.5rem',
                  scale: 1,
                  transition: { duration: 1.8, ease: [0.4, 0, 0.2, 1] }
                } : {}
              }
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute'
              }}
            >
              <div className="absolute inset-0 bg-black/10 transition-opacity duration-1000" />
            </motion.div>

            {/* Background Blur for right side focus */}
            <motion.div 
              className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm -z-10"
              initial={{ opacity: 0 }}
              animate={stage === 'expand' ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
