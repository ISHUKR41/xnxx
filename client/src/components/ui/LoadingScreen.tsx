import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete,
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            onComplete?.();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          style={{ backgroundColor: '#000000' }}
        >
          {/* Animated Background Patterns */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Particles */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: Math.random() * 10 + 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
            
            {/* Rotating Rings */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-96 h-96 border border-blue-500/20 rounded-full"
              style={{ marginLeft: '-12rem', marginTop: '-12rem' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-72 h-72 border border-purple-500/20 rounded-full"
              style={{ marginLeft: '-9rem', marginTop: '-9rem' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Main Loading Content */}
          <div className="relative z-10 text-center">
            {/* 3D Animated Logo */}
            <motion.div
              className="mb-8 perspective-1000"
              initial={{ rotateY: 0, scale: 0.8 }}
              animate={{ 
                rotateY: [0, 180, 360],
                scale: [0.8, 1.2, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                {/* 3D Book Icon */}
                <motion.div
                  className="w-24 h-24 mx-auto mb-4 relative"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                    borderRadius: '12px',
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(15deg) rotateY(-15deg)'
                  }}
                  animate={{
                    rotateX: [15, -15, 15],
                    rotateY: [-15, 15, -15]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Book Pages */}
                  <div className="absolute inset-2 bg-white/90 rounded-lg transform translate-z-2">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                  </div>
                  
                  {/* 3D Depth Effect */}
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, #1e40af, #7c3aed, #0891b2)',
                      transform: 'translateZ(-4px)'
                    }}
                  />
                </motion.div>

                {/* Glowing Text */}
                <motion.h1
                  className="text-4xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  STUDENTHUB.COM
                </motion.h1>

                <motion.p
                  className="text-gray-300 text-lg font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Your Gateway to Academic Excellence
                </motion.p>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-80 mx-auto mb-6">
              <div className="relative">
                {/* Background Bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  {/* Progress Fill */}
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                      width: `${progress}%`
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  
                  {/* Glowing Effect */}
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full opacity-60"
                    style={{
                      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                      width: `${progress}%`,
                      filter: 'blur(4px)'
                    }}
                  />
                </div>

                {/* Progress Percentage */}
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-white font-bold text-sm bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700">
                    {Math.round(progress)}%
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Loading Text Animation */}
            <motion.div
              className="text-gray-400 text-sm font-medium"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {progress < 30 && "Initializing Educational Platform..."}
              {progress >= 30 && progress < 60 && "Loading Study Materials..."}
              {progress >= 60 && progress < 90 && "Preparing Tools & Resources..."}
              {progress >= 90 && "Almost Ready! Welcome to StudentHub..."}
            </motion.div>

            {/* Floating Icons */}
            <div className="absolute inset-0 pointer-events-none">
              {['📖', '✏️', '🎓', '💡', '📊', '🔬'].map((icon, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl opacity-20"
                  style={{
                    left: `${20 + (i * 15)}%`,
                    top: `${30 + Math.sin(i) * 20}%`
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    rotate: [0, 360],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                >
                  {icon}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};