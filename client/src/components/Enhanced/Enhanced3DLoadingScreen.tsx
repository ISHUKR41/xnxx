import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
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
  Download,
  Layers,
  Code,
  Database,
  Shield,
  Globe
} from 'lucide-react';

interface LoadingMessage {
  text: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const loadingMessages: LoadingMessage[] = [
  { text: "Initializing StudentHub Platform...", icon: <Rocket className="w-6 h-6" />, color: "text-blue-400", bg: "from-blue-500/20 to-blue-600/20" },
  { text: "Loading Educational Resources...", icon: <BookOpen className="w-6 h-6" />, color: "text-green-400", bg: "from-green-500/20 to-green-600/20" },
  { text: "Preparing Advanced Tools...", icon: <Zap className="w-6 h-6" />, color: "text-yellow-400", bg: "from-yellow-500/20 to-yellow-600/20" },
  { text: "Activating AI Features...", icon: <Brain className="w-6 h-6" />, color: "text-purple-400", bg: "from-purple-500/20 to-purple-600/20" },
  { text: "Connecting Database...", icon: <Database className="w-6 h-6" />, color: "text-cyan-400", bg: "from-cyan-500/20 to-cyan-600/20" },
  { text: "Securing Platform...", icon: <Shield className="w-6 h-6" />, color: "text-red-400", bg: "from-red-500/20 to-red-600/20" },
  { text: "Optimizing Performance...", icon: <Target className="w-6 h-6" />, color: "text-orange-400", bg: "from-orange-500/20 to-orange-600/20" },
  { text: "Ready to Transform Learning!", icon: <Star className="w-6 h-6" />, color: "text-pink-400", bg: "from-pink-500/20 to-pink-600/20" }
];

export const Enhanced3DLoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create 3D scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create animated 3D objects
    const geometries = [
      new THREE.OctahedronGeometry(1),
      new THREE.TetrahedronGeometry(0.8),
      new THREE.IcosahedronGeometry(0.6),
      new THREE.DodecahedronGeometry(0.7),
      new THREE.TorusGeometry(0.6, 0.2, 16, 100),
      new THREE.SphereGeometry(0.5, 32, 32)
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.9 }),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.6 }),
      new THREE.MeshPhongMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.7 })
    ];

    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const geometry = geometries[i % geometries.length];
      const material = materials[i % materials.length];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      meshes.push(mesh);
      scene.add(mesh);
    }

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 100);
    const pointLight2 = new THREE.PointLight(0x10b981, 1, 100);
    const pointLight3 = new THREE.PointLight(0x8b5cf6, 1, 100);
    
    pointLight1.position.set(10, 10, 10);
    pointLight2.position.set(-10, -10, 10);
    pointLight3.position.set(0, 10, -10);
    
    scene.add(ambientLight, pointLight1, pointLight2, pointLight3);
    camera.position.z = 15;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 + index * 0.001;
        mesh.rotation.y += 0.015 + index * 0.002;
        mesh.rotation.z += 0.005 + index * 0.001;
        
        mesh.position.y += Math.sin(time + index) * 0.02;
        mesh.position.x += Math.cos(time + index * 0.5) * 0.01;
      });

      // Dynamic lighting
      pointLight1.position.x = Math.sin(time) * 10;
      pointLight1.position.y = Math.cos(time * 1.2) * 10;
      
      pointLight2.position.x = Math.cos(time * 0.8) * 10;
      pointLight2.position.z = Math.sin(time * 1.5) * 10;
      
      pointLight3.position.y = Math.sin(time * 0.6) * 10;
      pointLight3.position.z = Math.cos(time * 1.1) * 10;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const duration = 6000; // 6 seconds total
    const messageInterval = duration / loadingMessages.length;
    
    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIsComplete(true), 800);
          return 100;
        }
        return newProgress;
      });
    }, 100);

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
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-black"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Central Loading Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-2xl mx-auto">
          
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="relative mx-auto w-32 h-32 mb-8">
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              {/* Middle rotating ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 border-4 border-purple-500 border-r-transparent rounded-full"
              />
              {/* Inner rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 border-4 border-cyan-500 border-b-transparent rounded-full"
              />
              
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotateY: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4"
                >
                  <BookOpen className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            </div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-6xl md:text-7xl font-black mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                StudentHub
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-gray-300 text-2xl font-semibold mb-2"
            >
              Educational Excellence Platform
            </motion.p>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex justify-center space-x-2 mb-8"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Loading Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className={`flex items-center justify-center space-x-4 mb-6 p-6 rounded-2xl bg-gradient-to-r ${currentMessage.bg} backdrop-blur-sm border border-white/10`}>
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={`${currentMessage.color} flex-shrink-0`}
                >
                  {currentMessage.icon}
                </motion.div>
                <span className={`text-xl font-bold ${currentMessage.color}`}>
                  {currentMessage.text}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg text-gray-400 font-semibold">Loading Progress</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Animated shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                    animate={{ x: [-200, 400] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
              
              {/* Progress glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-lg"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="grid grid-cols-4 gap-6 text-center"
          >
            {[
              { icon: Download, label: "50K+ Papers", color: "text-blue-400", bg: "from-blue-500/20 to-blue-600/20" },
              { icon: Sparkles, label: "AI Tools", color: "text-green-400", bg: "from-green-500/20 to-green-600/20" },
              { icon: Award, label: "Premium Quality", color: "text-purple-400", bg: "from-purple-500/20 to-purple-600/20" },
              { icon: Globe, label: "Global Access", color: "text-cyan-400", bg: "from-cyan-500/20 to-cyan-600/20" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`bg-gradient-to-br ${feature.bg} backdrop-blur-sm rounded-2xl p-6 border border-white/10`}
              >
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color} mx-auto mb-3`} />
                </motion.div>
                <span className={`text-sm font-bold ${feature.color}`}>{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Loading Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex justify-center space-x-3 mt-12"
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Enhanced3DLoadingScreen;