import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Box, Torus } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface LoadingOrbProps {
  position: [number, number, number];
  color: string;
  delay?: number;
}

const LoadingOrb: React.FC<LoadingOrbProps> = ({ position, color, delay = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + delay) * 0.5;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime + delay) * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.3;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1 + Math.sin(state.clock.elapsedTime * 3 + delay) * 0.1);
    }
  });

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[0.3, 32, 32]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.9}
      />
    </Sphere>
  );
};

const RotatingText: React.FC = () => {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={textRef}>
      <Text
        position={[0, 0, 0]}
        fontSize={1}
        color="#60A5FA"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        StudentHub
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color="#34D399"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        Educational Platform
      </Text>
    </group>
  );
};

const FloatingRings: React.FC = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.z = time * 0.3;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * 0.4;
      ring2Ref.current.rotation.x = time * 0.2;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.6;
      ring3Ref.current.rotation.y = time * 0.1;
    }
  });

  return (
    <>
      <Torus ref={ring1Ref} args={[3, 0.1, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3B82F6" transparent opacity={0.3} />
      </Torus>
      <Torus ref={ring2Ref} args={[3.5, 0.08, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#10B981" transparent opacity={0.25} />
      </Torus>
      <Torus ref={ring3Ref} args={[4, 0.06, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B5CF6" transparent opacity={0.2} />
      </Torus>
    </>
  );
};

interface Enhanced3DLoadingScreenProps {
  onLoadingComplete?: () => void;
}

export const Enhanced3DLoadingScreen: React.FC<Enhanced3DLoadingScreenProps> = ({ 
  onLoadingComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);

  const loadingStages = [
    'Initializing Platform...',
    'Loading Educational Resources...',
    'Setting up PDF Tools...',
    'Configuring Image Processing...',
    'Preparing AI Features...',
    'Optimizing Performance...',
    'Almost Ready...',
    'Welcome to StudentHub!'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        if (newProgress >= 100) {
          setIsComplete(true);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 1500);
          return 100;
        }
        
        // Update loading stage based on progress
        const stageIndex = Math.floor((newProgress / 100) * loadingStages.length);
        setLoadingStage(loadingStages[Math.min(stageIndex, loadingStages.length - 1)]);
        
        return newProgress;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#000000' }}
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-70"
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

          {/* 3D Scene */}
          <div className="w-full h-full absolute inset-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
              
              <FloatingRings />
              
              <LoadingOrb position={[-2, 1, 0]} color="#3B82F6" delay={0} />
              <LoadingOrb position={[2, -1, 0]} color="#10B981" delay={1} />
              <LoadingOrb position={[0, 2, 0]} color="#8B5CF6" delay={2} />
              <LoadingOrb position={[-1.5, -2, 0]} color="#F59E0B" delay={3} />
              <LoadingOrb position={[1.5, 0, 0]} color="#EF4444" delay={4} />
              
              <RotatingText />
              
              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate 
                autoRotateSpeed={1}
              />
            </Canvas>
          </div>

          {/* UI Overlay */}
          <div className="relative z-10 text-center px-8">
            {/* Progress Bar */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-80 max-w-full mx-auto">
                <div className="mb-4">
                  <motion.h1
                    key={loadingStage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    {loadingStage}
                  </motion.h1>
                  <p className="text-blue-300 text-sm">
                    Preparing your educational experience...
                  </p>
                </div>
                
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
                
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <motion.span
                    key={progress}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-blue-400"
                  >
                    {Math.round(progress)}%
                  </motion.span>
                  <span>100%</span>
                </div>
              </div>
            </motion.div>

            {/* Loading Stats */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 max-w-md mx-auto text-center"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <div className="text-blue-400 font-bold text-lg">50+</div>
                <div className="text-gray-300 text-xs">Tools</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <div className="text-green-400 font-bold text-lg">10K+</div>
                <div className="text-gray-300 text-xs">Resources</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <div className="text-purple-400 font-bold text-lg">24/7</div>
                <div className="text-gray-300 text-xs">Available</div>
              </div>
            </motion.div>
          </div>

          {/* Completion Animation */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="w-32 h-32 border-4 border-green-500 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-4xl text-green-500"
                  >
                    ✓
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Enhanced3DLoadingScreen;