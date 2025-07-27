import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Zap, 
  Star, 
  Trophy,
  Sparkles,
  Brain,
  Rocket,
  Target,
  Award,
  Download
} from 'lucide-react';

interface LoadingMessage {
  text: string;
  icon: React.ReactNode;
  color: string;
}

const loadingMessages: LoadingMessage[] = [
  { text: "Initializing StudentHub Platform...", icon: <Rocket className="w-5 h-5" />, color: "text-blue-400" },
  { text: "Loading Educational Resources...", icon: <BookOpen className="w-5 h-5" />, color: "text-green-400" },
  { text: "Preparing Advanced Tools...", icon: <Zap className="w-5 h-5" />, color: "text-yellow-400" },
  { text: "Activating AI Features...", icon: <Brain className="w-5 h-5" />, color: "text-purple-400" },
  { text: "Optimizing Performance...", icon: <Target className="w-5 h-5" />, color: "text-orange-400" },
  { text: "Finalizing Setup...", icon: <Trophy className="w-5 h-5" />, color: "text-pink-400" },
  { text: "Ready to Transform Learning!", icon: <Star className="w-5 h-5" />, color: "text-cyan-400" }
];

export const EnhancedLoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 4000; // 4 seconds total
    const messageInterval = duration / loadingMessages.length;
    
    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 50));
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIsComplete(true), 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Message cycling
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= loadingMessages.length) {
          clearInterval(messageTimer);
          return prev;
        }
        return nextIndex;
      });
    }, messageInterval);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  const currentMessage = loadingMessages[currentMessageIndex];

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Central Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              StudentHub
            </span>
          </h1>
          <p className="text-gray-300 text-lg font-medium">
            Educational Excellence Platform
          </p>
        </motion.div>

        {/* Loading Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={currentMessage.color}
              >
                {currentMessage.icon}
              </motion.div>
              <span className={`text-lg font-semibold ${currentMessage.color}`}>
                {currentMessage.text}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Loading Progress</span>
            <span className="text-sm font-bold text-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-3 gap-4 text-center"
        >
          <div className="text-center">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 mb-2">
              <Download className="w-6 h-6 text-blue-400 mx-auto" />
            </div>
            <span className="text-xs text-gray-400">10K+ Papers</span>
          </div>
          <div className="text-center">
            <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 mb-2">
              <Sparkles className="w-6 h-6 text-green-400 mx-auto" />
            </div>
            <span className="text-xs text-gray-400">AI Tools</span>
          </div>
          <div className="text-center">
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl p-4 mb-2">
              <Award className="w-6 h-6 text-purple-400 mx-auto" />
            </div>
            <span className="text-xs text-gray-400">Premium Quality</span>
          </div>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center space-x-2 mt-8"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedLoadingScreen;