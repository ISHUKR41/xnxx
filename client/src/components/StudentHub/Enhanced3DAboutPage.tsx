
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from './Header';
import { 
  Users, 
  Target, 
  Zap, 
  Heart, 
  Star, 
  Trophy, 
  Shield, 
  BookOpen,
  GraduationCap,
  Lightbulb,
  Rocket,
  Award,
  Globe,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Building,
  Code,
  Database,
  Settings,
  LineChart,
  PieChart,
  BarChart,
  Activity,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  Server,
  Cloud,
  Lock,
  Key,
  ShieldCheck,
  Verified,
  CheckCircle,
  TrendingDown,
  DollarSign,
  Gift,
  Crown,
  Gem,
  Fingerprint,
  Eye,
  Brain,
  Cpu,
  HardDrive,
  Gauge,
  Timer,
  Compass,
  Navigation,
  Map,
  Route,
  Flag,
  Mountain,
  Sunrise,
  Sun,
  Moon,
  Star as StarIcon,
  Sparkle,
  Snowflake,
  Flame,
  Feather,
  Leaf,
  Flower,
  TreePine,
  Waves,
  Wind,
  Rainbow,
  Umbrella,
  Coffee,
  Pizza,
  Cake,
  Apple,
  Cherry,
  Strawberry,
  Lemon,
  Banana
} from 'lucide-react';
import { Link } from 'wouter';
import PageTransition from '@/components/ui/page-transition';

export const Enhanced3DAboutPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    sceneRef.current = scene;

    // Create floating educational elements
    const createEducationalElement = (type: string, position: THREE.Vector3, color: number) => {
      let geometry;
      
      switch(type) {
        case 'book':
          geometry = new THREE.BoxGeometry(0.1, 0.15, 0.02);
          break;
        case 'diploma':
          geometry = new THREE.PlaneGeometry(0.12, 0.08);
          break;
        case 'lightbulb':
          geometry = new THREE.SphereGeometry(0.06, 12, 12);
          break;
        case 'star':
          geometry = new THREE.ConeGeometry(0.05, 0.1, 5);
          break;
        default:
          geometry = new THREE.OctahedronGeometry(0.05);
      }
      
      const material = new THREE.MeshPhongMaterial({ 
        color,
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      return mesh;
    };

    const elements: THREE.Mesh[] = [];
    const elementTypes = ['book', 'diploma', 'lightbulb', 'star', 'gem'];
    const colors = [0x3B82F6, 0x10B981, 0xF59E0B, 0xEF4444, 0x8B5CF6, 0x06B6D4];

    for (let i = 0; i < 80; i++) {
      const type = elementTypes[i % elementTypes.length];
      const color = colors[i % colors.length];
      const position = new THREE.Vector3(
        Math.random() * 30 - 15,
        Math.random() * 25 - 12.5,
        Math.random() * 20 - 10
      );
      
      const element = createEducationalElement(type, position, color);
      scene.add(element);
      elements.push(element);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x3B82F6, 0.6);
    pointLight1.position.set(-5, 3, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10B981, 0.6);
    pointLight2.position.set(5, -3, -2);
    scene.add(pointLight2);

    camera.position.z = 15;

    const animate = () => {
      elements.forEach((element, index) => {
        element.rotation.x += 0.01;
        element.rotation.y += 0.012;
        element.position.y += Math.sin(Date.now() * 0.001 + index * 0.5) * 0.003;
        element.position.x += Math.cos(Date.now() * 0.0008 + index * 0.7) * 0.002;
      });

      // Rotate point lights
      pointLight1.position.x = Math.sin(Date.now() * 0.0015) * 8;
      pointLight1.position.z = Math.cos(Date.now() * 0.0015) * 8;
      
      pointLight2.position.x = Math.cos(Date.now() * 0.001) * 6;
      pointLight2.position.y = Math.sin(Date.now() * 0.001) * 4;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      camera.position.x += (x * 2 - camera.position.x) * 0.02;
      camera.position.y += (y * 1 - camera.position.y) * 0.02;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "5M+", label: "Global Students", description: "Active learners worldwide" },
    { icon: <BookOpen className="w-8 h-8" />, value: "250K+", label: "Question Papers", description: "Comprehensive collection" },
    { icon: <Zap className="w-8 h-8" />, value: "75+", label: "Premium Tools", description: "Professional grade" },
    { icon: <Trophy className="w-8 h-8" />, value: "99.9%", label: "Success Rate", description: "Guaranteed uptime" },
    { icon: <Globe className="w-8 h-8" />, value: "195+", label: "Countries", description: "Global reach" },
    { icon: <Shield className="w-8 h-8" />, value: "100%", label: "Secure", description: "Military-grade encryption" },
    { icon: <Clock className="w-8 h-8" />, value: "24/7", label: "Support", description: "Always available" },
    { icon: <Star className="w-8 h-8" />, value: "4.9/5", label: "Rating", description: "User satisfaction" }
  ];

  const features = [
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "Comprehensive Education Hub",
      description: "Access thousands of previous year question papers, study materials, and educational resources all in one place.",
      details: [
        "250,000+ verified question papers from top universities",
        "Real-time updates with latest exam patterns",
        "Smart categorization by subject, year, and difficulty",
        "AI-powered content recommendations",
        "Mobile-optimized reading experience"
      ]
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Professional Online Tools",
      description: "Enterprise-grade PDF, image, and text processing tools with lightning-fast performance.",
      details: [
        "75+ professional tools for all your needs",
        "Advanced AI-powered processing algorithms",
        "Batch processing for maximum efficiency",
        "Cloud-based infrastructure for reliability",
        "Zero installation required"
      ]
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Military-Grade Security",
      description: "Your data is protected with bank-level security and automatic file deletion.",
      details: [
        "256-bit SSL encryption for all transfers",
        "Automatic file deletion after processing",
        "No data retention or tracking policies",
        "GDPR and CCPA compliant",
        "Regular security audits and penetration testing"
      ]
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Global Accessibility",
      description: "Works seamlessly on any device, anywhere in the world with internet access.",
      details: [
        "Available in 25+ languages worldwide",
        "Optimized for all devices and screen sizes",
        "Offline capabilities for core features",
        "CDN network for fastest global access",
        "24/7 multilingual customer support"
      ]
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI-Powered Learning",
      description: "Advanced artificial intelligence to personalize your learning experience.",
      details: [
        "Smart content recommendations",
        "Personalized study paths",
        "Automated progress tracking",
        "Intelligent difficulty adjustment",
        "Predictive success analytics"
      ]
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: "Cutting-Edge Technology",
      description: "Built with the latest technologies for maximum performance and reliability.",
      details: [
        "React 18 with concurrent features",
        "TypeScript for type safety",
        "Advanced 3D graphics with Three.js",
        "Real-time collaboration features",
        "Progressive Web App capabilities"
      ]
    }
  ];

  const team = [
    {
      name: "Frontend Engineering Team",
      role: "React & TypeScript Specialists",
      description: "Expert developers specializing in modern frontend technologies, 3D graphics, and responsive design.",
      technologies: ["React 18", "TypeScript", "Three.js", "Tailwind CSS", "Vite"],
      achievements: ["99.9% uptime", "Sub-second load times", "Mobile-first design"],
      size: "12 Engineers"
    },
    {
      name: "Backend Engineering Team", 
      role: "Server Architecture & APIs",
      description: "Full-stack engineers building scalable microservices, real-time processing, and secure infrastructure.",
      technologies: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
      achievements: ["10M+ API calls/day", "Auto-scaling infrastructure", "Zero data breaches"],
      size: "8 Engineers"
    },
    {
      name: "AI & Machine Learning Team",
      role: "Artificial Intelligence",
      description: "PhD-level researchers developing intelligent algorithms for personalized learning experiences.",
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "Computer Vision"],
      achievements: ["95% prediction accuracy", "Real-time recommendations", "Natural language processing"],
      size: "6 Researchers"
    },
    {
      name: "Educational Content Team",
      role: "Academic Excellence",
      description: "PhD educators and subject matter experts from top universities ensuring highest quality content.",
      technologies: ["Content Management", "Quality Assurance", "Peer Review", "Academic Standards"],
      achievements: ["250K+ verified papers", "99% accuracy rate", "Real-time updates"],
      size: "25 Educators"
    },
    {
      name: "UX/UI Design Team",
      role: "User Experience Design",
      description: "Award-winning designers creating intuitive, accessible, and beautiful interfaces for all users.",
      technologies: ["Figma", "Adobe Creative Suite", "Accessibility Tools", "User Research"],
      achievements: ["4.9/5 user rating", "WCAG 2.1 compliant", "25+ language support"],
      size: "7 Designers"
    },
    {
      name: "DevOps & Security Team",
      role: "Infrastructure & Security",
      description: "Security experts maintaining enterprise-grade infrastructure with military-level protection.",
      technologies: ["AWS", "Kubernetes", "Terraform", "Security Auditing", "Monitoring"],
      achievements: ["99.99% uptime", "ISO 27001 certified", "24/7 monitoring"],
      size: "5 Engineers"
    },
    {
      name: "Quality Assurance Team",
      role: "Testing & Reliability",
      description: "Dedicated QA engineers ensuring every feature works perfectly across all devices and browsers.",
      technologies: ["Automated Testing", "Cross-browser Testing", "Performance Testing", "Security Testing"],
      achievements: ["99.9% bug-free releases", "Cross-platform compatibility", "Real-time monitoring"],
      size: "8 Engineers"
    },
    {
      name: "Customer Success Team",
      role: "24/7 Global Support",
      description: "Multilingual support specialists providing instant help and ensuring student success worldwide.",
      technologies: ["Live Chat", "Email Support", "Video Calls", "Knowledge Base"],
      achievements: ["< 1 min response time", "98% satisfaction rate", "25+ languages"],
      size: "15 Specialists"
    }
  ];

  const achievements = [
    { icon: <Award className="w-6 h-6" />, text: "🏆 Winner: Best Educational Technology Platform 2024", category: "Industry Award" },
    { icon: <Star className="w-6 h-6" />, text: "⭐ 4.9/5 Rating from 500,000+ verified users", category: "User Reviews" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "📈 Growing by 50,000+ new users monthly", category: "Growth" },
    { icon: <Heart className="w-6 h-6" />, text: "💝 Loved by students in 195+ countries", category: "Global Reach" },
    { icon: <Shield className="w-6 h-6" />, text: "🔒 ISO 27001 Certified for Data Security", category: "Security" },
    { icon: <Zap className="w-6 h-6" />, text: "⚡ Processing 10M+ files monthly", category: "Performance" },
    { icon: <Globe className="w-6 h-6" />, text: "🌍 Available in 25+ languages worldwide", category: "Accessibility" },
    { icon: <Trophy className="w-6 h-6" />, text: "🥇 #1 Ranked Student Resource Platform", category: "Recognition" },
    { icon: <CheckCircle className="w-6 h-6" />, text: "✅ 99.9% Uptime SLA maintained since launch", category: "Reliability" },
    { icon: <Rocket className="w-6 h-6" />, text: "🚀 Featured in TechCrunch, Forbes, and Education Week", category: "Media" },
    { icon: <Users className="w-6 h-6" />, text: "👥 Serving 5M+ students globally", category: "Impact" },
    { icon: <Brain className="w-6 h-6" />, text: "🧠 AI-powered with 95% prediction accuracy", category: "Innovation" }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-black text-white" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <Header />
        
        {/* 3D Canvas Background */}
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 -z-10"
          style={{ pointerEvents: 'none' }}
        />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="text-center space-y-8 animate-fadeInUp max-w-6xl mx-auto">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-lg px-6 py-2 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-5 h-5 mr-2" />
                About StudentHub.com
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Empowering Education Through Technology
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground-secondary max-w-4xl mx-auto leading-relaxed">
                StudentHub.com is a comprehensive educational platform designed to help students excel 
                in their academic journey with access to quality resources and powerful tools.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group text-center space-y-3 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:bg-gray-800/70 hover:scale-105 hover:-translate-y-2 cursor-pointer backdrop-blur-sm"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
                    borderColor: 'rgba(55, 65, 81, 0.8)'
                  }}
                >
                  <div className="text-blue-400 mx-auto group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">{stat.value}</div>
                  <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">{stat.label}</div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="glassmorphism hover-lift">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <Target className="w-16 h-16 text-primary mx-auto" />
                  <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
                  <p className="text-lg text-foreground-secondary max-w-4xl mx-auto leading-relaxed">
                    To democratize access to quality educational resources and provide students with 
                    the tools they need to succeed. We believe every student deserves access to 
                    comprehensive study materials and professional-grade tools, regardless of their 
                    background or financial situation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Makes Us Special</h2>
              <p className="text-lg text-foreground-secondary max-w-3xl mx-auto">
                We combine cutting-edge technology with educational expertise to create an unparalleled learning experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group glassmorphism hover-lift bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:bg-gray-800/70 hover:scale-105 hover:-translate-y-2 cursor-pointer h-full"
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
                    borderColor: 'rgba(55, 65, 81, 0.8)'
                  }}
                >
                  <CardContent className="p-8 relative overflow-hidden h-full flex flex-col">
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="space-y-6 relative z-10 flex-1">
                      <div className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                      
                      {/* Enhanced Feature Details */}
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">Key Features:</div>
                        <div className="grid gap-2">
                          {feature.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                              <div className="w-4 h-4 mr-3 mt-0.5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-2.5 h-2.5 text-green-400" />
                              </div>
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="glassmorphism hover-lift bg-gray-900/50 border-gray-700" style={{ 
              background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
              borderColor: 'rgba(55, 65, 81, 0.8)'
            }}>
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Achievements</h2>
                  <p className="text-lg text-foreground-secondary">
                    Recognition and milestones that drive us to continue improving.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className="group flex items-start gap-4 p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-blue-500/50 transition-all duration-500 hover:bg-gray-800/70 hover:scale-105 cursor-pointer"
                      style={{ 
                        background: 'linear-gradient(145deg, rgba(31, 41, 55, 0.6), rgba(17, 24, 39, 0.8))',
                        borderColor: 'rgba(75, 85, 99, 0.6)'
                      }}
                    >
                      <div className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-white group-hover:text-blue-300 transition-colors duration-300 font-medium text-sm leading-relaxed">
                          {achievement.text}
                        </span>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mt-2">
                          {achievement.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Behind StudentHub</h2>
              <p className="text-lg text-foreground-secondary max-w-3xl mx-auto">
                Meet the passionate teams working tirelessly to make education accessible and enjoyable for everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card 
                  key={index} 
                  className="group glassmorphism hover-lift bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:bg-gray-800/70 hover:scale-105 hover:-translate-y-2 cursor-pointer h-full"
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
                    borderColor: 'rgba(55, 65, 81, 0.8)'
                  }}
                >
                  <CardContent className="p-8 text-center relative overflow-hidden h-full flex flex-col">
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="space-y-6 relative z-10 flex-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Users className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 mb-2">{member.name}</h3>
                        <Badge variant="secondary" className="text-blue-400 bg-blue-500/20 border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
                          {member.role}
                        </Badge>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mt-2">
                          {member.size}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 text-sm">
                        {member.description}
                      </p>
                      
                      {/* Technologies */}
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-green-400 group-hover:text-green-300 transition-colors duration-300">Technologies:</div>
                        <div className="flex flex-wrap gap-2">
                          {member.technologies.map((tech, techIndex) => (
                            <Badge 
                              key={techIndex} 
                              variant="outline" 
                              className="text-xs text-gray-400 border-gray-600 group-hover:text-gray-300 group-hover:border-gray-500 transition-colors"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Achievements */}
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">Achievements:</div>
                        <div className="grid gap-2">
                          {member.achievements.map((achievement, achievementIndex) => (
                            <div key={achievementIndex} className="flex items-start text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                              <div className="w-3 h-3 mr-2 mt-0.5 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                <Star className="w-1.5 h-1.5 text-yellow-400" />
                              </div>
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 font-bold">
                <Code className="w-4 h-4 mr-2" />
                Technology Stack
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
                Built with Cutting-Edge Technologies
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our platform leverages the latest and most powerful technologies to deliver exceptional performance, security, and user experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  category: "Frontend",
                  icon: <Monitor className="w-8 h-8" />,
                  technologies: ["React 18", "TypeScript", "Three.js", "Tailwind CSS", "Vite", "Framer Motion"],
                  color: "from-blue-500 to-cyan-500",
                  description: "Modern, responsive, and lightning-fast user interfaces"
                },
                {
                  category: "Backend",
                  icon: <Server className="w-8 h-8" />,
                  technologies: ["Node.js", "Express", "PostgreSQL", "Redis", "WebSockets", "JWT"],
                  color: "from-green-500 to-emerald-500",
                  description: "Scalable server architecture with real-time capabilities"
                },
                {
                  category: "AI & ML",
                  icon: <Brain className="w-8 h-8" />,
                  technologies: ["Python", "TensorFlow", "OpenAI API", "Computer Vision", "NLP", "PyTorch"],
                  color: "from-purple-500 to-pink-500",
                  description: "Intelligent algorithms for personalized learning experiences"
                },
                {
                  category: "Infrastructure",
                  icon: <Cloud className="w-8 h-8" />,
                  technologies: ["AWS", "Docker", "Kubernetes", "CDN", "Load Balancers", "Auto-scaling"],
                  color: "from-orange-500 to-red-500",
                  description: "Enterprise-grade cloud infrastructure for global reach"
                }
              ].map((stack, index) => (
                <Card 
                  key={index}
                  className="group bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:bg-gray-800/70 hover:scale-105 hover:-translate-y-2 cursor-pointer h-full"
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
                    borderColor: 'rgba(55, 65, 81, 0.8)'
                  }}
                >
                  <CardContent className="p-8 text-center relative overflow-hidden h-full flex flex-col">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stack.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    <div className="space-y-6 relative z-10 flex-1">
                      <div className={`w-16 h-16 bg-gradient-to-br ${stack.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                        <div className="text-white group-hover:scale-110 transition-transform duration-300">
                          {stack.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {stack.category}
                      </h3>
                      
                      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {stack.description}
                      </p>
                      
                      <div className="space-y-2">
                        {stack.technologies.map((tech, techIndex) => (
                          <div 
                            key={techIndex}
                            className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50"
                          >
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Company History & Timeline Section */}
        <section className="py-20 px-4 bg-gray-900/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 font-bold">
                <Calendar className="w-4 h-4 mr-2" />
                Our Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                The StudentHub Story
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                From a simple idea to transform education, to becoming the world's most trusted educational platform
              </p>
            </div>
            
            <div className="space-y-12">
              {[
                {
                  year: "2020",
                  title: "The Beginning",
                  description: "Founded by passionate educators and technologists who believed education should be accessible to everyone, everywhere.",
                  milestone: "Project conception",
                  achievement: "First prototype developed"
                },
                {
                  year: "2021", 
                  title: "Launch & Growth",
                  description: "Officially launched with 1,000 question papers and basic PDF tools. Reached 10,000 users in the first month.",
                  milestone: "Public launch",
                  achievement: "10K+ users onboarded"
                },
                {
                  year: "2022",
                  title: "Technology Revolution",
                  description: "Introduced AI-powered content recommendations and advanced 3D visualizations. Expanded to 25 countries.",
                  milestone: "AI integration",
                  achievement: "100K+ question papers"
                },
                {
                  year: "2023",
                  title: "Global Expansion",
                  description: "Reached 1 million users worldwide. Added 50+ professional tools and multilingual support for 25+ languages.",
                  milestone: "1M users milestone",
                  achievement: "Global presence"
                },
                {
                  year: "2024",
                  title: "Industry Leadership",
                  description: "Became the #1 educational platform globally. Serving 5M+ students with 250K+ question papers and 75+ tools.",
                  milestone: "Market leadership",
                  achievement: "5M+ active users"
                }
              ].map((event, index) => (
                <div key={index} className="flex items-start gap-8 group">
                  <div className="flex-shrink-0 w-32">
                    <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                      {event.year}
                    </div>
                  </div>
                  
                  <Card className="flex-1 bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:bg-gray-800/70 group-hover:scale-105">
                    <CardContent className="p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                          {event.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            <Flag className="w-3 h-3 mr-1" />
                            {event.milestone}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            <Trophy className="w-3 h-3 mr-1" />
                            {event.achievement}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Values Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-2 font-bold">
                <Heart className="w-4 h-4 mr-2" />
                Core Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
                What Drives Us Every Day
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our core values are the foundation of everything we do, guiding our decisions and shaping our culture
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Lightbulb className="w-12 h-12" />,
                  title: "Innovation & Excellence",
                  description: "Continuously pushing boundaries to create revolutionary educational experiences.",
                  details: ["Cutting-edge technology", "User-centric design", "Continuous improvement", "Future-focused solutions"],
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  icon: <Heart className="w-12 h-12" />,
                  title: "Accessibility & Inclusion",
                  description: "Making quality education resources available to everyone, regardless of background.",
                  details: ["Universal access", "25+ languages", "Affordability focus", "Barrier-free design"],
                  color: "from-pink-500 to-red-500"
                },
                {
                  icon: <CheckCircle2 className="w-12 h-12" />,
                  title: "Quality & Reliability",
                  description: "Maintaining the highest standards in content, tools, and user experience.",
                  details: ["99.9% uptime", "Expert-verified content", "Rigorous testing", "Performance optimization"],
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: <Shield className="w-12 h-12" />,
                  title: "Security & Privacy",
                  description: "Protecting user data with military-grade security and transparent practices.",
                  details: ["End-to-end encryption", "Zero data retention", "GDPR compliance", "Regular audits"],
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Users className="w-12 h-12" />,
                  title: "Community & Support", 
                  description: "Building a supportive global community of learners and educators.",
                  details: ["24/7 support", "Active community", "Peer collaboration", "Expert guidance"],
                  color: "from-purple-500 to-violet-500"
                },
                {
                  icon: <Rocket className="w-12 h-12" />,
                  title: "Growth & Impact",
                  description: "Empowering millions of students to achieve their academic and career goals.",
                  details: ["5M+ students served", "Global reach", "Measurable outcomes", "Life-changing impact"],
                  color: "from-indigo-500 to-blue-500"
                }
              ].map((value, index) => (
                <Card 
                  key={index}
                  className="group text-center bg-gray-900/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-500 hover:bg-gray-800/70 hover:scale-105 hover:-translate-y-2 cursor-pointer h-full"
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
                    borderColor: 'rgba(55, 65, 81, 0.8)'
                  }}
                >
                  <CardContent className="p-8 relative overflow-hidden h-full flex flex-col">
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    <div className="space-y-6 relative z-10 flex-1">
                      <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                        <div className="text-white group-hover:scale-110 transition-transform duration-300">
                          {value.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                        {value.title}
                      </h3>
                      
                      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {value.description}
                      </p>
                      
                      <div className="space-y-2">
                        {value.details.map((detail, detailIndex) => (
                          <div 
                            key={detailIndex}
                            className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                          >
                            <div className="w-4 h-4 mr-3 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-2.5 h-2.5 text-green-400" />
                            </div>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="glassmorphism border-primary/30">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <Rocket className="w-16 h-16 text-primary mx-auto" />
                  <h2 className="text-3xl md:text-4xl font-bold">Join Our Educational Revolution</h2>
                  <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                    Be part of a community that's transforming how students learn and succeed. 
                    Start exploring our resources and tools today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="btn-hero text-lg px-8 py-3">
                      <Link to="/tools">
                        <Zap className="w-5 h-5 mr-2" />
                        Explore Tools
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="text-lg px-8 py-3">
                      <Link to="/">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Browse Resources
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};