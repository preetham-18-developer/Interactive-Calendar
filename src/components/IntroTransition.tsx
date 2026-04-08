import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LampContainer } from './ui/lamp';

interface IntroTransitionProps {
  onComplete: () => void;
}

export function IntroTransition({ onComplete }: IntroTransitionProps) {
  const [stage, setStage] = useState<'reveal' | 'done'>('reveal');

  useEffect(() => {
    const t = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 4000);

    return () => clearTimeout(t);
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <LampContainer className="min-h-screen">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Welcome to Memorable calendar
        </motion.h1>
      </LampContainer>
    </motion.div>
  );
}
