import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WarningAnimationProps {
  show: boolean;
  message: string;
  onClose?: () => void;
}

export default function WarningAnimation({ show, message, onClose }: WarningAnimationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="fixed top-4 right-4 z-50 max-w-md"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="bg-red-500 text-white rounded-lg shadow-2xl p-4 flex items-center space-x-3"
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="text-3xl"
        >
          ⚠️
        </motion.div>
        <div className="flex-1">
          <p className="font-bold text-lg">Warning!</p>
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

