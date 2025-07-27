import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2,
  Maximize,
  Eye,
  MousePointer,
  Zap,
  Star,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Shield,
  BookOpen,
  FileText,
  Image,
  Settings
} from 'lucide-react';

export const Interactive3DTourSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const tourSteps = [
    {
      title: "Welcome to StudentHub",
      description: "Your comprehensive educational platform with AI-powered tools",
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      color: 0x3B82F6,
      highlights: ["500K+ Active Users", "2M+ Files Processed", "99.9% Uptime"]
    },
    {
      title: "Professional PDF Tools",
      description: "Advanced PDF manipulation with enterprise-grade processing",
      icon: <FileText className="w-8 h-8 text-red-400" />,
      color: 0xEF4444,
      highlights: ["Merge & Split", "Compress & Optimize", "Convert to Word/PPT"]
    },
    {
      title: "Intelligent Image Processing",
      description: "AI-powered image editing and optimization tools",
      icon: <Image className="w-8 h-8 text-green-400" />,
      color: 0x10B981,
      highlights: ["Smart Resize", "Format Conversion", "Lossless Compression"]
    },
    {
      title: "Advanced Text Tools",
      description: "Transform text into professional documents instantly",
      icon: <BookOpen className="w-8 h-8 text-purple-400" />,
      color: 0x8B5CF6,
      highlights: ["Text to PDF", "OCR Recognition", "Smart Formatting"]
    },
    {
      title: "Security & Privacy",
      description: "Bank-level encryption with automatic file deletion",
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      color: 0xF59E0B,
      highlights: ["Zero Data Retention", "SSL Encryption", "GDPR Compliant"]
    }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });

    renderer.setSize(600, 400);
    renderer.setClearColor(0x000000, 0);
    sceneRef.current = scene;

    // Create central platform
    const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1F2937,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x0F172A,
      emissiveIntensity: 0.1
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -0.5;
    scene.add(platform);

    // Create floating elements around the platform
    const floatingElements: THREE.Mesh[] = [];
    const elementTypes = [
      { geometry: new THREE.BoxGeometry(0.3, 0.4, 0.05), color: 0x3B82F6 }, // PDF
      { geometry: new THREE.SphereGeometry(0.2, 16, 16), color: 0x10B981 }, // Image
      { geometry: new THREE.ConeGeometry(0.15, 0.4, 8), color: 0x8B5CF6 }, // Text
      { geometry: new THREE.OctahedronGeometry(0.2), color: 0xF59E0B }, // Security
      { geometry: new THREE.TorusGeometry(0.15, 0.05, 16, 32), color: 0xEF4444 } // Tools
    ];

    elementTypes.forEach((type, index) => {
      const material = new THREE.MeshStandardMaterial({ 
        color: type.color,
        metalness: 0.5,
        roughness: 0.2,
        emissive: type.color,
        emissiveIntensity: 0.1
      });
      const element = new THREE.Mesh(type.geometry, material);
      
      const angle = (index / elementTypes.length) * Math.PI * 2;
      element.position.x = Math.cos(angle) * 3;
      element.position.z = Math.sin(angle) * 3;
      element.position.y = Math.sin(angle) * 0.5;
      
      floatingElements.push(element);
      scene.add(element);
    });

    // Create particle system
    const particleCount = 100;
    const particles = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particles[i] = (Math.random() - 0.5) * 10;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    
    const particleMaterial = new THREE.PointsMaterial({ 
      color: 0x6366F1, 
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Multiple colored point lights
    const pointLights = [
      { color: 0x3B82F6, position: [3, 3, 3] },
      { color: 0x10B981, position: [-3, 3, -3] },
      { color: 0x8B5CF6, position: [0, 5, 0] }
    ];

    pointLights.forEach(light => {
      const pointLight = new THREE.PointLight(light.color, 0.5);
      pointLight.position.set(light.position[0], light.position[1], light.position[2]);
      scene.add(pointLight);
    });

    camera.position.set(4, 3, 4);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      const step = tourSteps[currentTourStep];
      
      // Rotate platform
      platform.rotation.y += 0.01;

      // Animate floating elements
      floatingElements.forEach((element, index) => {
        const angle = (index / floatingElements.length) * Math.PI * 2 + time * 0.5;
        element.position.x = Math.cos(angle) * 3;
        element.position.z = Math.sin(angle) * 3;
        element.position.y = Math.sin(angle + time) * 0.5;
        
        element.rotation.x += 0.02;
        element.rotation.y += 0.01;
        
        // Highlight current step element
        if (index === currentTourStep) {
          element.scale.setScalar(1.2 + Math.sin(time * 3) * 0.1);
          if (element.material instanceof THREE.MeshStandardMaterial) {
            element.material.emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.1;
          }
        } else {
          element.scale.setScalar(1);
          if (element.material instanceof THREE.MeshStandardMaterial) {
            element.material.emissiveIntensity = 0.1;
          }
        }
      });

      // Animate particles
      particleSystem.rotation.y += 0.005;
      particleSystem.rotation.x += 0.002;

      // Interactive camera movement
      if (isHovered) {
        camera.position.x = 4 + Math.sin(time * 0.5) * 0.5;
        camera.position.z = 4 + Math.cos(time * 0.5) * 0.5;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [currentTourStep, isHovered]);

  // Auto-play tour
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTourStep((prev) => (prev + 1) % tourSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, tourSteps.length]);

  const currentStep = tourSteps[currentTourStep];

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-green-500/25 to-blue-500/25 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-base font-bold animate-pulse">
            <Eye className="w-4 h-4 mr-2" />
            Interactive 3D Tour
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Experience Our Platform
          </h2>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Take an interactive tour through our comprehensive toolkit and discover how we're revolutionizing digital workflows
          </p>
        </div>

        {/* Main Tour Interface */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Visualization */}
          <div className="relative">
            <div 
              className="bg-gray-900/50 rounded-3xl p-8 border border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <canvas 
                ref={canvasRef}
                className="w-full rounded-xl shadow-2xl"
                style={{ maxWidth: '600px', height: '400px' }}
              />
              
              {/* Tour Controls */}
              <div className="flex items-center justify-center mt-6 space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTourStep((prev) => (prev - 1 + tourSteps.length) % tourSteps.length)}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTourStep((prev) => (prev + 1) % tourSteps.length)}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {tourSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTourStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTourStep 
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tour Information */}
          <div className="space-y-8">
            {/* Current Step Info */}
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                    {currentStep.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white mb-2">
                      {currentStep.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {currentTourStep + 1}/{tourSteps.length}
                  </Badge>
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  {currentStep.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">5 Min</div>
                  <p className="text-gray-300 text-sm">Average Tour Time</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-black text-green-400 mb-2">50+</div>
                  <p className="text-gray-300 text-sm">Professional Tools</p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 text-lg">
                <MousePointer className="w-5 h-5 mr-2" />
                Start Using Tools Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/50">
                <Settings className="w-5 h-5 mr-2" />
                Explore All Features
              </Button>
            </div>
          </div>
        </div>

        {/* All Steps Overview */}
        <div className="mt-20">
          <h3 className="text-3xl font-black text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Complete Feature Overview
          </h3>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {tourSteps.map((step, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                  index === currentTourStep 
                    ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setCurrentTourStep(index)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};