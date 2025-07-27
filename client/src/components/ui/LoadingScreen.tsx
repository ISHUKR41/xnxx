import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing...');

  const loadingTexts = [
    'Initializing StudentHub...',
    'Loading 3D Environment...',
    'Preparing Tools Collection...',
    'Setting up AI Services...',
    'Loading Educational Content...',
    'Finalizing Experience...'
  ];

  useEffect(() => {
    if (!isLoading) return;

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // Text rotation
    const textInterval = setInterval(() => {
      setCurrentText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 800);

    // 3D Animation Setup
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create multiple animated geometries
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(0.6),
      new THREE.DodecahedronGeometry(0.7),
      new THREE.ConeGeometry(0.5, 1.2, 8),
      new THREE.CylinderGeometry(0.3, 0.5, 1, 8),
      new THREE.TorusGeometry(0.6, 0.2, 8, 16),
      new THREE.SphereGeometry(0.5, 16, 16)
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6, 
        transparent: true, 
        opacity: 0.8,
        emissive: 0x0f1f3f,
        shininess: 100
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x22d3ee, 
        transparent: true, 
        opacity: 0.7,
        emissive: 0x0f2f2f,
        shininess: 100
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0xfbbf24, 
        transparent: true, 
        opacity: 0.9,
        emissive: 0x2f2f0f,
        shininess: 100
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0xf59e0b, 
        transparent: true, 
        opacity: 0.8,
        emissive: 0x2f1f0f,
        shininess: 100
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6, 
        transparent: true, 
        opacity: 0.7,
        emissive: 0x1f0f2f,
        shininess: 100
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x06b6d4, 
        transparent: true, 
        opacity: 0.6,
        emissive: 0x0f1f2f,
        shininess: 100
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0xef4444, 
        transparent: true, 
        opacity: 0.8,
        emissive: 0x2f0f0f,
        shininess: 100
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x10b981, 
        transparent: true, 
        opacity: 0.7,
        emissive: 0x0f2f0f,
        shininess: 100
      })
    ];

    const meshes: THREE.Mesh[] = [];
    const particles: THREE.Points[] = [];

    // Create main floating objects
    for (let i = 0; i < 12; i++) {
      const geometry = geometries[i % geometries.length];
      const material = materials[i % materials.length];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      meshes.push(mesh);
      scene.add(mesh);
    }

    // Create particle systems
    for (let p = 0; p < 3; p++) {
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 25;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 15;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: [0x3b82f6, 0x22d3ee, 0xfbbf24][p],
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      
      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      particles.push(particleSystem);
      scene.add(particleSystem);
    }

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 2, 100);
    pointLight1.position.set(-5, 5, 5);
    
    const pointLight2 = new THREE.PointLight(0x22d3ee, 2, 100);
    pointLight2.position.set(5, -5, 5);
    
    const pointLight3 = new THREE.PointLight(0xfbbf24, 1.5, 100);
    pointLight3.position.set(0, 0, -5);
    
    scene.add(ambientLight, directionalLight, pointLight1, pointLight2, pointLight3);
    camera.position.z = 12;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Animate main objects
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.02 + index * 0.003;
        mesh.rotation.y += 0.015 + index * 0.002;
        mesh.rotation.z += 0.01 + index * 0.001;
        
        mesh.position.y += Math.sin(time * 2 + index) * 0.02;
        mesh.position.x += Math.cos(time * 1.5 + index) * 0.01;
        mesh.position.z += Math.sin(time * 1.8 + index) * 0.015;
        
        // Scale animation
        const scale = 1 + Math.sin(time * 3 + index) * 0.2;
        mesh.scale.setScalar(scale);
      });

      // Animate particles
      particles.forEach((particle, index) => {
        particle.rotation.y += 0.005 + index * 0.002;
        particle.rotation.x += 0.003 + index * 0.001;
      });

      // Animate lights
      pointLight1.position.x = Math.sin(time) * 5;
      pointLight1.position.y = Math.cos(time * 1.2) * 3;
      
      pointLight2.position.x = Math.cos(time * 1.5) * 4;
      pointLight2.position.z = Math.sin(time * 0.8) * 6;
      
      pointLight3.position.y = Math.sin(time * 2) * 4;

      // Camera movement
      camera.position.x += (Math.sin(time * 0.5) * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (Math.cos(time * 0.3) * 0.3 - camera.position.y) * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
    };
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          {/* 3D Canvas Background */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />
          
          {/* Loading Content */}
          <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="relative"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="text-3xl font-black text-white relative z-10">SH</span>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-4"
              >
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  StudentHub
                </h1>
                <p className="text-gray-400 text-sm mt-1">Educational Excellence Platform</p>
              </motion.div>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <motion.span
                    key={currentText}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-gray-300"
                  >
                    {currentText}
                  </motion.span>
                  
                  <motion.span
                    className="text-blue-400 font-mono"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {Math.round(progress)}%
                  </motion.span>
                </div>
              </div>

              {/* Loading Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="grid grid-cols-3 gap-4 text-center"
              >
                {[
                  { icon: '📚', label: 'Study Tools', delay: 0 },
                  { icon: '🔧', label: 'Utilities', delay: 0.1 },
                  { icon: '🤖', label: 'AI Powered', delay: 0.2 }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + item.delay, duration: 0.5 }}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
                  >
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="text-2xl mb-1"
                    >
                      {item.icon}
                    </motion.div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Loading Dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="flex justify-center space-x-2"
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};