import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface FuturisticToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const toastVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.5,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const glowVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: [0.5, 0.25],
    scale: [1, 1.2],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

export default function FuturisticToast({
  message,
  type,
  onClose,
  duration = 3000,
}: FuturisticToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/20';
      case 'error':
        return 'from-rose-500/20 to-rose-500/10 border-rose-500/20';
      case 'info':
        return 'from-blue-500/20 to-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative flex items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-xl bg-gradient-to-r ${getColors()} border shadow-lg`}
    >
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getColors()} filter blur-xl`}
      />
      <div className="relative flex items-center gap-3">
        {getIcon()}
        <p className="text-white text-sm font-medium">{message}</p>
      </div>
    </motion.div>
  );
} 