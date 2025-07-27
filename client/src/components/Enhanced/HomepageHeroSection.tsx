import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Box, Float, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight, Play, Download, Users, Star, Trophy,
  Zap, Shield, Globe, BookOpen, Target, TrendingUp,
  CheckCircle, Sparkles, Brain, Rocket, Award
} from 'lucide-react';

interface FloatingElementProps {
  position: [number, number, number];
  color: string;
  delay?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ position, color, delay = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + delay) * 0.3;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime + delay) * 0.4;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} args={[0.4, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const AnimatedCounter: React.FC<{ target: number; suffix?: string; prefix?: string }> = ({ 
  target, 
  suffix = '', 
  prefix = '' 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev + step >= target) {
          clearInterval(timer);
          return target;
        }
        return prev + step;
      });
    }, 16);
    
    return () => clearInterval(timer);
  }, [target]);
  
  return (
    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
      {prefix}{Math.round(count)}{suffix}
    </span>
  );
};

export const HomepageHeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const heroStats = [
    { icon: Users, value: 500000, suffix: '+', label: 'Active Students' },
    { icon: BookOpen, value: 10000, suffix: '+', label: 'Question Papers' },
    { icon: Trophy, value: 50, suffix: '+', label: 'Tools Available' },
    { icon: Award, value: 99, suffix: '%', label: 'Success Rate' }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Learning',
      description: 'Advanced AI algorithms help personalize your learning experience',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Tools',
      description: 'Process PDFs, images, and documents in seconds with our optimized tools',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Access Anywhere',
      description: 'Use our platform from any device, anywhere in the world',
      gradient: 'from-blue-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      text: "StudentHub transformed my study routine. The AI tools are incredible!",
      author: "Priya Sharma",
      role: "Engineering Student",
      avatar: "👩‍🎓"
    },
    {
      text: "Best platform for question papers and study materials. Highly recommended!",
      author: "Arjun Patel",
      role: "Medical Student", 
      avatar: "👨‍⚕️"
    },
    {
      text: "The PDF tools saved me hours of work. Amazing platform!",
      author: "Sneha Gupta",
      role: "CA Student",
      avatar: "👩‍💼"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D Scene Background */}
      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
          
          <FloatingElement position={[-4, 2, 0]} color="#3B82F6" delay={0} />
          <FloatingElement position={[4, -2, 0]} color="#10B981" delay={1} />
          <FloatingElement position={[0, 3, -2]} color="#8B5CF6" delay={2} />
          <FloatingElement position={[-3, -3, 1]} color="#F59E0B" delay={3} />
          <FloatingElement position={[3, 1, -1]} color="#EF4444" delay={4} />
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-lg font-bold">
                <Sparkles className="w-5 h-5 mr-2" />
                India's #1 Educational Platform
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="text-white">Master Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400">
                  Education
                </span>
                <br />
                <span className="text-white">Journey</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Access <span className="text-blue-400 font-bold">10,000+ question papers</span>, 
                professional <span className="text-green-400 font-bold">PDF/Image tools</span>, 
                and <span className="text-purple-400 font-bold">AI-powered study assistance</span> 
                all in one comprehensive platform.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 text-lg shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <Rocket className="w-6 h-6 mr-2" />
                Start Learning Now
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-gray-600 text-white hover:bg-gray-800/50 font-bold py-4 px-8 text-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
            >
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group-hover:bg-gray-800/70">
                      <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl font-black">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Feature Cards */}
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group cursor-pointer"
                >
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Testimonial Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="relative"
            >
              <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50 overflow-hidden">
                <CardContent className="p-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="p-8 text-center"
                    >
                      <div className="text-6xl mb-4">
                        {testimonials[currentSlide].avatar}
                      </div>
                      <blockquote className="text-lg text-gray-300 mb-4 italic">
                        "{testimonials[currentSlide].text}"
                      </blockquote>
                      <div className="text-white font-semibold">
                        {testimonials[currentSlide].author}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonials[currentSlide].role}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Testimonial Indicators */}
                  <div className="flex justify-center space-x-2 pb-6">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-blue-500 scale-125' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Join over 500,000 students who are already using StudentHub to achieve their academic goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
                <CheckCircle className="w-4 h-4 mr-2" />
                Free to Start
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400 bg-blue-400/10">
                <Star className="w-4 h-4 mr-2" />
                4.9/5 Rating
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400 bg-purple-400/10">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trusted by 500K+
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Platform Demo</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVideoPlaying(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p>Demo video will be integrated here</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomepageHeroSection;