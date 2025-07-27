import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as THREE from 'three';
import {
  Sparkles, BookOpen, Users, Trophy, Target, Zap,
  ArrowRight, Play, GraduationCap, Brain, Rocket,
  Star, TrendingUp, Award, Shield, Globe, Heart
} from 'lucide-react';

export const EnhancedHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const heroSlides = [
    {
      title: "Transform Your Learning",
      subtitle: "Journey with StudentHub",
      description: "Experience revolutionary education with AI-powered tools, personalized learning paths, and comprehensive study materials designed for academic excellence.",
      stats: [
        { value: "50K+", label: "Students Enrolled", icon: Users },
        { value: "1000+", label: "Study Resources", icon: BookOpen },
        { value: "95%", label: "Success Rate", icon: Trophy },
        { value: "24/7", label: "Support Available", icon: Shield }
      ],
      gradient: "from-blue-600 via-purple-600 to-cyan-600",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Master Every Subject",
      subtitle: "With Advanced AI Tools",
      description: "Leverage cutting-edge artificial intelligence for personalized tutoring, instant doubt resolution, and adaptive learning that grows with your progress.",
      stats: [
        { value: "15+", label: "AI Tools", icon: Brain },
        { value: "99.9%", label: "Accuracy Rate", icon: Target },
        { value: "Instant", label: "Response Time", icon: Zap },
        { value: "Smart", label: "Learning Path", icon: Rocket }
      ],
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Excel in Academics",
      subtitle: "Build Your Future Today",
      description: "Join thousands of successful students who achieved their dreams through our comprehensive platform. Your academic success story starts here.",
      stats: [
        { value: "100+", label: "Universities", icon: GraduationCap },
        { value: "85%", label: "Scholarship Rate", icon: Award },
        { value: "Global", label: "Recognition", icon: Globe },
        { value: "Lifetime", label: "Access", icon: Heart }
      ],
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      bgColor: "bg-purple-500/10"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [isPlaying, heroSlides.length]);

  useEffect(() => {
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

    // Create educational-themed floating objects
    const educationalObjects: THREE.Mesh[] = [];
    const geometries = [
      new THREE.BoxGeometry(0.5, 0.7, 0.1), // Books
      new THREE.ConeGeometry(0.3, 0.8, 8), // Graduation caps
      new THREE.SphereGeometry(0.3, 16, 16), // Atoms/molecules
      new THREE.CylinderGeometry(0.2, 0.2, 0.6, 8), // Pencils
      new THREE.TorusGeometry(0.4, 0.1, 8, 16), // Rings
      new THREE.OctahedronGeometry(0.4), // Crystals
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8, emissive: 0x0a1a3a }),
      new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.7, emissive: 0x0a2a1a }),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9, emissive: 0x2a1a0a }),
      new THREE.MeshPhongMaterial({ color: 0xef4444, transparent: true, opacity: 0.8, emissive: 0x2a0a0a }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.7, emissive: 0x1a0a2a }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6, emissive: 0x0a1a2a })
    ];

    // Create floating educational objects
    for (let i = 0; i < 25; i++) {
      const geometry = geometries[i % geometries.length];
      const material = materials[i % materials.length];
      const object = new THREE.Mesh(geometry, material);
      
      object.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      
      object.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      educationalObjects.push(object);
      scene.add(object);
    }

    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 2, 100);
    pointLight1.position.set(-8, 8, 8);
    
    const pointLight2 = new THREE.PointLight(0x10b981, 2, 100);
    pointLight2.position.set(8, -8, 8);
    
    const pointLight3 = new THREE.PointLight(0xf59e0b, 1.5, 100);
    pointLight3.position.set(0, 0, -8);
    
    scene.add(ambientLight, directionalLight, pointLight1, pointLight2, pointLight3);
    camera.position.z = 15;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      educationalObjects.forEach((object, index) => {
        // Rotation animation
        object.rotation.x += 0.01 + index * 0.001;
        object.rotation.y += 0.015 + index * 0.001;
        object.rotation.z += 0.008 + index * 0.0005;
        
        // Floating animation
        object.position.y += Math.sin(time * 1.5 + index) * 0.01;
        object.position.x += Math.cos(time * 1.2 + index) * 0.008;
        object.position.z += Math.sin(time * 1.8 + index) * 0.012;
        
        // Scale animation
        const scale = 1 + Math.sin(time * 2 + index) * 0.1;
        object.scale.setScalar(scale);
      });

      // Dynamic lighting
      pointLight1.position.x = Math.sin(time * 0.7) * 10;
      pointLight1.position.y = Math.cos(time * 0.9) * 8;
      
      pointLight2.position.x = Math.cos(time * 0.8) * 8;
      pointLight2.position.z = Math.sin(time * 0.6) * 10;
      
      pointLight3.position.y = Math.sin(time * 1.2) * 6;

      // Gentle camera movement
      camera.position.x += (Math.sin(time * 0.3) * 1 - camera.position.x) * 0.02;
      camera.position.y += (Math.cos(time * 0.2) * 0.5 - camera.position.y) * 0.02;

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
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ zIndex: 1 }}
      />
      
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-10 transition-all duration-1000`} />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:100px_100px] animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-300 px-6 py-2 text-base font-semibold backdrop-blur-sm">
                <Sparkles className="w-5 h-5 mr-2" />
                {currentSlideData.subtitle}
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={`text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent leading-tight`}
            >
              {currentSlideData.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              {currentSlideData.description}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {currentSlideData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`${currentSlideData.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center group`}
                >
                  <div className="flex justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg"
                className={`bg-gradient-to-r ${currentSlideData.gradient} hover:shadow-2xl hover:shadow-blue-500/25 text-white font-bold px-8 py-4 text-lg group transition-all duration-300`}
              >
                Start Learning Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-semibold px-8 py-4 text-lg group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/60 hover:text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

function Pause(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}