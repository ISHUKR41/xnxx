import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Globe, 
  Star, 
  Crown,
  Rocket,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Heart,
  Trophy,
  Sparkles,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  Lock,
  Database,
  Cloud,
  Code,
  Settings
} from 'lucide-react';

export const ComprehensiveBenefitsSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const benefitCategories = [
    {
      title: "Performance & Speed",
      subtitle: "Lightning-fast processing with enterprise infrastructure",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      benefits: [
        {
          icon: <Rocket className="w-6 h-6 text-yellow-400" />,
          title: "Sub-second Processing",
          description: "AI-optimized algorithms process files in under 1 second",
          metric: "< 1s",
          details: "Our proprietary compression algorithms are 300% faster than competitors"
        },
        {
          icon: <Cloud className="w-6 h-6 text-blue-400" />,
          title: "Global CDN Network",
          description: "99.9% uptime with servers in 15+ regions worldwide",
          metric: "99.9%",
          details: "Edge computing ensures minimal latency regardless of your location"
        },
        {
          icon: <Database className="w-6 h-6 text-green-400" />,
          title: "Unlimited Processing",
          description: "No file size limits or daily usage restrictions",
          metric: "∞",
          details: "Process files up to 2GB each with no monthly limits"
        }
      ]
    },
    {
      title: "Security & Privacy",
      subtitle: "Bank-level encryption with zero data retention",
      icon: <Shield className="w-8 h-8 text-green-400" />,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      benefits: [
        {
          icon: <Lock className="w-6 h-6 text-green-400" />,
          title: "AES-256 Encryption",
          description: "Military-grade encryption for all file transfers",
          metric: "AES-256",
          details: "Same encryption standard used by governments and banks worldwide"
        },
        {
          icon: <Clock className="w-6 h-6 text-red-400" />,
          title: "Auto File Deletion",
          description: "Files automatically deleted after 1 hour",
          metric: "1h",
          details: "Zero data retention policy ensures your privacy is protected"
        },
        {
          icon: <Settings className="w-6 h-6 text-purple-400" />,
          title: "GDPR Compliant",
          description: "Fully compliant with international privacy laws",
          metric: "100%",
          details: "Certified compliance with GDPR, CCPA, and other privacy regulations"
        }
      ]
    },
    {
      title: "Universal Access",
      subtitle: "Work anywhere, anytime, on any device",
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      benefits: [
        {
          icon: <Monitor className="w-6 h-6 text-blue-400" />,
          title: "Cross-Platform",
          description: "Works on Windows, Mac, Linux, and all browsers",
          metric: "All OS",
          details: "No installation required - access from any modern web browser"
        },
        {
          icon: <Smartphone className="w-6 h-6 text-green-400" />,
          title: "Mobile Optimized",
          description: "Full functionality on mobile devices and tablets",
          metric: "Mobile",
          details: "Responsive design optimized for touch interfaces and mobile workflows"
        },
        {
          icon: <Wifi className="w-6 h-6 text-yellow-400" />,
          title: "Offline Capable",
          description: "Progressive Web App works even without internet",
          metric: "PWA",
          details: "Service workers cache essential features for offline use"
        }
      ]
    },
    {
      title: "Professional Quality",
      subtitle: "Enterprise-grade tools for professional results",
      icon: <Star className="w-8 h-8 text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      benefits: [
        {
          icon: <Award className="w-6 h-6 text-purple-400" />,
          title: "Industry Leading",
          description: "Used by Fortune 500 companies and professionals",
          metric: "F500",
          details: "Trusted by companies like Google, Microsoft, and Amazon"
        },
        {
          icon: <Trophy className="w-6 h-6 text-yellow-400" />,
          title: "Quality Guarantee",
          description: "Lossless processing with pixel-perfect results",
          metric: "100%",
          details: "Advanced algorithms preserve quality while optimizing file sizes"
        },
        {
          icon: <Target className="w-6 h-6 text-red-400" />,
          title: "Precision Tools",
          description: "Professional-grade accuracy in every operation",
          metric: "0.001%",
          details: "Error rate lower than 0.001% across all processing operations"
        }
      ]
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

    renderer.setSize(400, 300);
    renderer.setClearColor(0x000000, 0);
    sceneRef.current = scene;

    // Create floating benefit icons
    const iconGeometries = [
      new THREE.SphereGeometry(0.3, 16, 16), // Performance
      new THREE.OctahedronGeometry(0.4), // Security
      new THREE.TorusGeometry(0.3, 0.1, 16, 32), // Universal
      new THREE.ConeGeometry(0.3, 0.6, 8) // Quality
    ];

    const iconColors = [0xF59E0B, 0x10B981, 0x3B82F6, 0x8B5CF6];
    const floatingIcons: THREE.Mesh[] = [];

    iconGeometries.forEach((geometry, index) => {
      const material = new THREE.MeshStandardMaterial({ 
        color: iconColors[index],
        metalness: 0.6,
        roughness: 0.2,
        emissive: iconColors[index],
        emissiveIntensity: 0.1
      });
      
      const icon = new THREE.Mesh(geometry, material);
      const angle = (index / iconGeometries.length) * Math.PI * 2;
      icon.position.x = Math.cos(angle) * 2;
      icon.position.z = Math.sin(angle) * 2;
      icon.position.y = Math.sin(angle) * 0.5;
      
      floatingIcons.push(icon);
      scene.add(icon);
    });

    // Create central benefit hub
    const hubGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const hubMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1F2937,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x0F172A,
      emissiveIntensity: 0.2
    });
    const benefitHub = new THREE.Mesh(hubGeometry, hubMaterial);
    scene.add(benefitHub);

    // Add connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x6366F1,
      transparent: true,
      opacity: 0.3
    });

    floatingIcons.forEach(icon => {
      const points = [
        new THREE.Vector3(0, 0, 0),
        icon.position
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
    });

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const pointLights = [
      { color: 0xF59E0B, position: [2, 2, 2] },
      { color: 0x10B981, position: [-2, 2, -2] },
      { color: 0x3B82F6, position: [2, -2, 2] },
      { color: 0x8B5CF6, position: [-2, -2, -2] }
    ];

    pointLights.forEach(light => {
      const pointLight = new THREE.PointLight(light.color, 0.3);
      pointLight.position.set(light.position[0], light.position[1], light.position[2]);
      scene.add(pointLight);
    });

    camera.position.set(3, 2, 3);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Rotate benefit hub
      benefitHub.rotation.y += 0.01;
      benefitHub.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Animate floating icons
      floatingIcons.forEach((icon, index) => {
        const angle = (index / floatingIcons.length) * Math.PI * 2 + time * 0.3;
        icon.position.x = Math.cos(angle) * 2;
        icon.position.z = Math.sin(angle) * 2;
        icon.position.y = Math.sin(angle + time) * 0.3;
        
        icon.rotation.x += 0.02;
        icon.rotation.y += 0.01;
        
        // Highlight active category
        if (index === activeCategory) {
          icon.scale.setScalar(1.3 + Math.sin(time * 4) * 0.1);
          if (icon.material instanceof THREE.MeshStandardMaterial) {
            icon.material.emissiveIntensity = 0.3 + Math.sin(time * 6) * 0.1;
          }
        } else {
          icon.scale.setScalar(1);
          if (icon.material instanceof THREE.MeshStandardMaterial) {
            icon.material.emissiveIntensity = 0.1;
          }
        }
      });

      // Smooth camera movement
      camera.position.x = 3 + Math.sin(time * 0.3) * 0.3;
      camera.position.z = 3 + Math.cos(time * 0.3) * 0.3;
      camera.lookAt(0, 0, 0);

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
  }, [activeCategory]);

  // Auto-cycle categories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % benefitCategories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [benefitCategories.length]);

  const currentCategory = benefitCategories[activeCategory];

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-green-500/25 to-yellow-500/25 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-base font-bold animate-pulse">
            <Crown className="w-4 h-4 mr-2" />
            Comprehensive Benefits
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Why Choose Our Platform?
          </h2>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Experience the ultimate combination of <span className="text-purple-400 font-semibold">performance</span>, 
            <span className="text-green-400 font-semibold"> security</span>, and 
            <span className="text-blue-400 font-semibold"> accessibility</span> in one comprehensive platform
          </p>
        </div>

        {/* Main Benefits Interface */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 3D Visualization */}
          <div className="relative">
            <div className="bg-gray-900/50 rounded-3xl p-8 border border-gray-700 backdrop-blur-sm">
              <canvas 
                ref={canvasRef}
                className="w-full rounded-xl"
                style={{ maxWidth: '400px', height: '300px' }}
              />
              
              {/* Category Navigation */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {benefitCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(index)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      index === activeCategory 
                        ? `bg-gradient-to-br ${category.color} border ${category.borderColor}` 
                        : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span className="font-semibold text-sm">{category.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Category Details */}
          <div className="space-y-6">
            {/* Category Header */}
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${currentCategory.color} border ${currentCategory.borderColor}`}>
              <div className="flex items-center space-x-4 mb-4">
                {currentCategory.icon}
                <div>
                  <h3 className="text-2xl font-black text-white">{currentCategory.title}</h3>
                  <p className="text-gray-300">{currentCategory.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {currentCategory.benefits.map((benefit, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${currentCategory.color} border ${currentCategory.borderColor}`}>
                        {benefit.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-white">{benefit.title}</h4>
                          <Badge className={`${currentCategory.color.replace('/20', '/30')} ${currentCategory.borderColor}`}>
                            {benefit.metric}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-3">{benefit.description}</p>
                        <p className="text-gray-400 text-sm">{benefit.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="mt-20 grid md:grid-cols-4 gap-6">
          {[
            { icon: <Users className="w-8 h-8 text-blue-400" />, value: "2M+", label: "Happy Users", description: "Trusted worldwide" },
            { icon: <TrendingUp className="w-8 h-8 text-green-400" />, value: "99.9%", label: "Satisfaction", description: "User approval rate" },
            { icon: <Clock className="w-8 h-8 text-yellow-400" />, value: "24/7", label: "Support", description: "Always available" },
            { icon: <Award className="w-8 h-8 text-purple-400" />, value: "50+", label: "Awards", description: "Industry recognition" }
          ].map((stat, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-300 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 text-lg transition-all duration-300 transform hover:scale-105">
            <Sparkles className="w-5 h-5 mr-2" />
            Experience All Benefits
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};