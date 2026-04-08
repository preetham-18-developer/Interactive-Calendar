import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PremiumBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#F7F4EF] dark:bg-[#0A0A0A]">
      {/* Base Layer Gradient Shift */}
      <motion.div
        className="absolute inset-0 opacity-40 dark:opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, #F7E7CE 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, #F5F5DC 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, #EAE0C8 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, #F7E7CE 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Mid Layer: Soft Floating Blobs */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] bg-amber-100/30 dark:bg-amber-900/10"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] bg-slate-200/40 dark:bg-slate-800/10"
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Top Layer: Subtle Light "Breathing" */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
        }}
      />

      {/* Center focus glow behind UI */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80vw] h-[80vh] bg-white/10 dark:bg-white/5 rounded-[4rem] blur-[150px]" />
      </div>

      {/* Very soft noise texture for materiality */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }} />
    </div>
  );
}
