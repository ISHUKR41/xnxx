import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
import {
  BookOpen, Brain, Target, Users, Award, Shield,
  Zap, Globe, Heart, Rocket, Star, TrendingUp,
  Code, Database, Cloud, Smartphone, Monitor,
  FileText, Image, Wrench, Palette, Camera,
  Mic, Volume2, Calendar, MapPin, Mail,
  Phone, MessageSquare, Settings, Lock,
  Eye, Copy, RefreshCw, Scissors, Combine,
  Download, Upload, Edit, Type, ClipboardCheck,
  BarChart, PieChart, Activity, Lightbulb,
  Magic, Sparkles, ArrowRight, ChevronRight,
  CheckCircle, Timer, Infinity, Crown
} from 'lucide-react';

export const DetailedFeatures: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [activeCategory, setActiveCategory] = useState('educational');

  const featureCategories = {
    educational: {
      title: "Educational Excellence",
      subtitle: "Advanced Learning Tools",
      description: "Comprehensive educational resources designed to enhance your learning experience with AI-powered assistance and personalized content delivery.",
      gradient: "from-blue-600 to-cyan-600",
      features: [
        {
          icon: BookOpen,
          title: "Smart Study Materials",
          description: "Access thousands of curated study materials, textbooks, and research papers with AI-powered recommendations based on your learning style.",
          stats: "10,000+ Resources",
          premium: false,
          color: "text-blue-400"
        },
        {
          icon: Brain,
          title: "AI-Powered Tutoring",
          description: "Get personalized tutoring sessions with our advanced AI that adapts to your learning pace and identifies knowledge gaps.",
          stats: "24/7 Available",
          premium: true,
          color: "text-purple-400"
        },
        {
          icon: Target,
          title: "Adaptive Learning Paths",
          description: "Follow personalized learning journeys that adapt based on your progress, strengths, and areas needing improvement.",
          stats: "95% Success Rate",
          premium: false,
          color: "text-green-400"
        },
        {
          icon: Award,
          title: "Certification Programs",
          description: "Earn industry-recognized certificates and badges upon completion of courses and skill assessments.",
          stats: "500+ Certificates",
          premium: true,
          color: "text-yellow-400"
        },
        {
          icon: Users,
          title: "Collaborative Learning",
          description: "Join study groups, participate in discussions, and collaborate with peers from around the world.",
          stats: "50K+ Students",
          premium: false,
          color: "text-cyan-400"
        },
        {
          icon: TrendingUp,
          title: "Progress Analytics",
          description: "Track your learning progress with detailed analytics, performance metrics, and improvement suggestions.",
          stats: "Real-time Analytics",
          premium: false,
          color: "text-pink-400"
        }
      ]
    },
    tools: {
      title: "Professional Tools",
      subtitle: "All-in-One Utilities",
      description: "Comprehensive collection of professional-grade tools for PDF manipulation, image processing, text analysis, and AI-powered utilities.",
      gradient: "from-purple-600 to-pink-600",
      features: [
        {
          icon: FileText,
          title: "PDF Powerhouse",
          description: "Complete PDF toolkit including merge, split, compress, protect, convert, and OCR capabilities with high-quality output.",
          stats: "18 PDF Tools",
          premium: false,
          color: "text-red-400"
        },
        {
          icon: Image,
          title: "Image Processing Suite",
          description: "Professional image editing tools with resize, compress, crop, format conversion, and background removal.",
          stats: "10 Image Tools",
          premium: false,
          color: "text-green-400"
        },
        {
          icon: Type,
          title: "Text & AI Tools",
          description: "Advanced text processing with AI-powered summarization, grammar checking, and intelligent content generation.",
          stats: "15 AI Tools",
          premium: true,
          color: "text-blue-400"
        },
        {
          icon: Code,
          title: "Developer Utilities",
          description: "Essential tools for developers including QR code generators, formatters, validators, and API testing utilities.",
          stats: "25+ Dev Tools",
          premium: false,
          color: "text-purple-400"
        },
        {
          icon: Database,
          title: "Data Processing",
          description: "Powerful data manipulation tools for CSV processing, JSON formatting, and database query optimization.",
          stats: "Real-time Processing",
          premium: true,
          color: "text-yellow-400"
        },
        {
          icon: Cloud,
          title: "Cloud Integration",
          description: "Seamless integration with popular cloud services for file storage, synchronization, and collaborative workflows.",
          stats: "5 Cloud Services",
          premium: true,
          color: "text-cyan-400"
        }
      ]
    },
    technology: {
      title: "Advanced Technology",
      subtitle: "Cutting-Edge Innovation",
      description: "Built on modern technology stack with AI integration, cloud computing, and advanced security measures for optimal performance.",
      gradient: "from-green-600 to-blue-600",
      features: [
        {
          icon: Rocket,
          title: "Lightning Fast Performance",
          description: "Optimized architecture with CDN delivery, caching strategies, and efficient algorithms for instant response times.",
          stats: "<100ms Response",
          premium: false,
          color: "text-orange-400"
        },
        {
          icon: Shield,
          title: "Enterprise Security",
          description: "Bank-grade encryption, secure authentication, and compliance with international data protection standards.",
          stats: "256-bit Encryption",
          premium: false,
          color: "text-green-400"
        },
        {
          icon: Globe,
          title: "Global Infrastructure",
          description: "Worldwide server network ensuring optimal performance and availability from any location around the globe.",
          stats: "99.9% Uptime",
          premium: false,
          color: "text-blue-400"
        },
        {
          icon: Smartphone,
          title: "Cross-Platform Support",
          description: "Perfect compatibility across all devices and platforms with responsive design and native app performance.",
          stats: "All Platforms",
          premium: false,
          color: "text-purple-400"
        },
        {
          icon: Magic,
          title: "AI Integration",
          description: "Advanced machine learning algorithms providing intelligent recommendations, auto-completion, and predictive features.",
          stats: "ML Powered",
          premium: true,
          color: "text-pink-400"
        },
        {
          icon: Infinity,
          title: "Scalable Architecture",
          description: "Auto-scaling infrastructure that grows with your needs, handling millions of users and requests seamlessly.",
          stats: "Unlimited Scale",
          premium: false,
          color: "text-cyan-400"
        }
      ]
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(400, 300);
    renderer.setClearColor(0x000000, 0);

    // Create floating tech objects
    const techObjects: THREE.Mesh[] = [];
    const geometries = [
      new THREE.IcosahedronGeometry(0.5, 1),
      new THREE.OctahedronGeometry(0.4),
      new THREE.TetrahedronGeometry(0.3),
      new THREE.TorusGeometry(0.3, 0.1, 8, 16),
      new THREE.RingGeometry(0.2, 0.4, 8),
      new THREE.ConeGeometry(0.25, 0.5, 8)
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9 }),
      new THREE.MeshPhongMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 })
    ];

    for (let i = 0; i < 12; i++) {
      const geometry = geometries[i % geometries.length];
      const material = materials[i % materials.length];
      const object = new THREE.Mesh(geometry, material);
      
      object.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      );
      
      techObjects.push(object);
      scene.add(object);
    }

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(0, 0, 5);
    
    scene.add(ambientLight, pointLight);
    camera.position.z = 6;

    const animate = () => {
      const time = Date.now() * 0.001;
      
      techObjects.forEach((object, index) => {
        object.rotation.x += 0.01 + index * 0.002;
        object.rotation.y += 0.015 + index * 0.001;
        object.position.y += Math.sin(time + index) * 0.005;
      });

      pointLight.position.x = Math.sin(time) * 3;
      pointLight.position.y = Math.cos(time * 1.2) * 2;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, []);

  const currentCategory = featureCategories[activeCategory as keyof typeof featureCategories];

  return (
    <section ref={sectionRef} className="py-32 bg-gray-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-300 px-6 py-2 text-base font-semibold backdrop-blur-sm">
            <Sparkles className="w-5 h-5 mr-2" />
            Comprehensive Platform Features
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Discover our comprehensive suite of features designed to elevate your academic and professional journey with cutting-edge technology and innovative solutions.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(featureCategories).map(([key, category]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                onClick={() => setActiveCategory(key)}
                className={`${
                  activeCategory === key 
                    ? `bg-gradient-to-r ${category.gradient} text-white` 
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                } px-6 py-3 text-base font-semibold transition-all duration-300`}
              >
                {category.title}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Current Category Header */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <canvas ref={canvasRef} className="opacity-60" />
          </div>
          
          <h3 className={`text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r ${currentCategory.gradient} bg-clip-text text-transparent`}>
            {currentCategory.subtitle}
          </h3>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {currentCategory.description}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCategory.features.map((feature, index) => (
            <motion.div
              key={`${activeCategory}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50 backdrop-blur-sm transition-all duration-300 h-full">
                <CardContent className="p-8">
                  {/* Feature Icon & Title */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-xl bg-gray-800/50 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                          {feature.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {feature.stats}
                          </Badge>
                          {feature.premium && (
                            <Badge className="text-xs bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30 text-yellow-400">
                              <Crown className="w-3 h-3 mr-1" />
                              Pro
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Description */}
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Feature Actions */}
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 p-0"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <div className="flex items-center space-x-2 text-gray-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Button 
            size="lg"
            className={`bg-gradient-to-r ${currentCategory.gradient} hover:shadow-2xl hover:shadow-purple-500/25 text-white font-bold px-8 py-4 text-lg group transition-all duration-300`}
          >
            Explore All Features
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};