import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, CheckCircle2, Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';

interface AuthModalProps {
  onSuccess: (email: string) => void;
  onGuest: () => void;
}

export function AuthModal({ onSuccess, onGuest }: AuthModalProps) {
  const [step, setStep] = useState<'email' | 'password' | 'confirm' | 'loading' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isValidEmail = email.includes('@') && email.includes('.');
  const isValidPassword = password.length >= 8;
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleNext = () => {
    if (step === 'email' && !isValidEmail) {
        triggerShake();
        return;
    }
    if (step === 'password' && !isValidPassword) {
        triggerShake();
        return;
    }
    if (step === 'confirm' && !isPasswordMatch) {
        triggerShake();
        return;
    }

    if (step === 'email') setStep('password');
    else if (step === 'password') setStep('confirm');
    else if (step === 'confirm') handleComplete();
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleComplete = () => {
    setStep('loading');
    setLoadingText('Authenticating...');
    setTimeout(() => {
      setLoadingText('Synchronizing your calendar...');
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onSuccess(email);
        }, 3000);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 bg-[#fdfcfb] transition-colors duration-1000" />
      
      {/* Animated Light Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-100/30 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, -20, 0] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-50/40 rounded-full blur-[100px] pointer-events-none" 
      />

      {step === 'success' && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} gravity={0.15} colors={['#dc2626', '#ef4444', '#f87171', '#fee2e2']} />}

      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm mx-4"
      >
        {/* Soft Outer Glow behind card */}
        <div className="absolute inset-0 bg-red-500/5 blur-[60px] rounded-[40px] pointer-events-none" />

        <motion.div
           layout
           className="relative p-10 bg-white/60 backdrop-blur-[24px] rounded-[40px] border border-white/50 shadow-[0_32px_80px_-20px_rgba(220,38,38,0.12)]"
           initial={{ opacity: 0, y: 40, scale: 0.98 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {step !== 'loading' && step !== 'success' && (
              <motion.div
                key="auth-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-10 text-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(220,38,38,0.3)]"
                  >
                    <Sparkles className="text-white" size={32} strokeWidth={1.5} />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">
                    Premium Access
                  </h1>
                  <p className="text-zinc-500 font-medium">
                    {step === 'email' ? 'Enter your email to get started.' : 
                     step === 'password' ? 'Security check. Create a password.' : 
                     'Confirm your identity.'}
                  </p>
                </div>

                <div className="space-y-5">
                  <AnimatePresence mode="wait">
                    {step === 'email' && (
                      <motion.div
                        key="email-input"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="relative group"
                      >
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input
                          type="email"
                          placeholder="Your professional email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          className="w-full bg-zinc-50/80 border border-zinc-100 rounded-[24px] px-14 py-5 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/20 active:scale-[0.99] transition-all"
                          autoFocus
                        />
                      </motion.div>
                    )}

                    {step === 'password' && (
                      <motion.div
                        key="password-input"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="relative group"
                      >
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create password (8+ chars)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          className="w-full bg-zinc-50/80 border border-zinc-100 rounded-[24px] px-14 py-5 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/20 active:scale-[0.99] transition-all font-medium"
                          autoFocus
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </motion.div>
                    )}

                    {step === 'confirm' && (
                      <motion.div
                        key="confirm-input"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="relative group"
                      >
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          className="w-full bg-zinc-50/80 border border-zinc-100 rounded-[24px] px-14 py-5 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/20 active:scale-[0.99] transition-all font-medium"
                          autoFocus
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-10">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-[24px] py-5 font-bold flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)] hover:shadow-[0_24px_50px_-10px_rgba(220,38,38,0.5)] transition-all group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10">
                      {step === 'confirm' ? 'Create Account' : 'Continue'}
                    </span>
                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} strokeWidth={2.5} />
                  </motion.button>
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={onGuest}
                    className="text-sm font-semibold text-zinc-400 hover:text-red-600 transition-colors"
                  >
                    Experience as Guest
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-red-100 rounded-full" />
                  <Loader2 className="animate-spin text-red-600 absolute inset-0 m-auto" size={48} strokeWidth={2} />
                </div>
                <div>
                  <motion.p 
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-zinc-600 font-bold text-lg tracking-tight"
                  >
                    {loadingText}
                  </motion.p>
                  <p className="text-zinc-400 text-sm mt-2">Personalizing your experience...</p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center shadow-inner"
                >
                  <CheckCircle2 className="text-red-600" size={48} strokeWidth={2} />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-2 tracking-tight">Welcome Aboard</h2>
                  <p className="text-zinc-500 font-medium">Your premium calendar is ready.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

