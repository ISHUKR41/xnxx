import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, BookOpen, Users, Trophy, Clock, Star, Download, Search, Filter, Target, Zap, Globe, Heart, TrendingUp, Award, ChevronDown, Mouse, Shield } from 'lucide-react';
import * as THREE from 'three';
import { Link } from 'wouter';

export const EnhancedHeroSection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameId = useRef<number>(0);
  const [currentStats, setCurrentStats] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic statistics data
  const statsData = [
    { label: "Active Students", value: "50,000+", icon: <Users className="w-6 h-6" />, color: "text-blue-500" },
    { label: "Question Papers", value: "15,000+", icon: <BookOpen className="w-6 h-6" />, color: "text-green-500" },
    { label: "Success Stories", value: "25,000+", icon: <Trophy className="w-6 h-6" />, color: "text-yellow-500" },
    { label: "Years of Excellence", value: "10+", icon: <Award className="w-6 h-6" />, color: "text-purple-500" }
  ];

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Statistics carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStats(prev => (prev + 1) % statsData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Enhanced Lighting System
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x1E88E5, 1.5);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 0.8, 25);
    pointLight1.position.set(-8, 6, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 0.6, 20);
    pointLight2.position.set(8, -4, 6);
    scene.add(pointLight2);

    // Central Knowledge Sphere with Particles
    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x1E88E5,
      transparent: true,
      opacity: 0.3,
      wireframe: false,
      shininess: 100,
      emissive: 0x001122,
      emissiveIntensity: 0.2
    });
    const knowledgeSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(knowledgeSphere);

    // Particle system around the sphere
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating Educational Elements
    const educationalElements: THREE.Group[] = [];
    
    // Books
    for (let i = 0; i < 20; i++) {
      const bookGroup = new THREE.Group();
      
      const bookGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
      const bookColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9ff3, 0x54a0ff];
      const bookMaterial = new THREE.MeshPhongMaterial({
        color: bookColors[i % bookColors.length],
        shininess: 80
      });
      
      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      bookGroup.add(book);
      
      const radius = 8 + Math.random() * 6;
      const angle = (i / 20) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 10;
      
      bookGroup.position.x = Math.cos(angle) * radius;
      bookGroup.position.y = height;
      bookGroup.position.z = Math.sin(angle) * radius;
      
      bookGroup.rotation.x = Math.random() * Math.PI;
      bookGroup.rotation.y = Math.random() * Math.PI;
      bookGroup.rotation.z = Math.random() * Math.PI;
      
      educationalElements.push(bookGroup);
      scene.add(bookGroup);
    }

    // Mathematical Symbols
    for (let i = 0; i < 25; i++) {
      const mathGroup = new THREE.Group();
      const mathColors = [0xffd700, 0x32cd32, 0xff4757, 0x8e44ad, 0xe67e22, 0x2ecc71];
      
      if (i % 5 === 0) {
        // Plus signs
        const plus1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.08, 0.08),
          new THREE.MeshPhongMaterial({ color: mathColors[i % mathColors.length] })
        );
        const plus2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.4, 0.08),
          new THREE.MeshPhongMaterial({ color: mathColors[i % mathColors.length] })
        );
        mathGroup.add(plus1, plus2);
      } else if (i % 5 === 1) {
        // Circles for π, ∞
        const circle = new THREE.Mesh(
          new THREE.TorusGeometry(0.2, 0.05, 8, 16),
          new THREE.MeshPhongMaterial({ color: mathColors[i % mathColors.length] })
        );
        mathGroup.add(circle);
      } else if (i % 5 === 2) {
        // Triangles for Δ, angles
        const triangle = new THREE.Mesh(
          new THREE.ConeGeometry(0.15, 0.3, 3),
          new THREE.MeshPhongMaterial({ color: mathColors[i % mathColors.length] })
        );
        mathGroup.add(triangle);
      } else if (i % 5 === 3) {
        // Squares for equations
        const square = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.25, 0.05),
          new THREE.MeshPhongMaterial({ color: mathColors[i % mathColors.length] })
        );
        mathGroup.add(square);
      } else {
        // Spheres for variables
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshPhongMaterial({ color: mathColors[i % mathColors.length] })
        );
        mathGroup.add(sphere);
      }
      
      const radius = 12 + Math.random() * 8;
      const angle = (i / 25) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 15;
      
      mathGroup.position.x = Math.cos(angle) * radius;
      mathGroup.position.y = height;
      mathGroup.position.z = Math.sin(angle) * radius;
      
      educationalElements.push(mathGroup);
      scene.add(mathGroup);
    }

    camera.position.z = 15;
    camera.position.y = 2;

    // Animation loop
    const animate = () => {
      // Rotate main sphere
      knowledgeSphere.rotation.x += 0.005;
      knowledgeSphere.rotation.y += 0.008;
      
      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
        positions[i3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Animate educational elements
      educationalElements.forEach((element, index) => {
        element.rotation.x += 0.01 + (index % 3) * 0.005;
        element.rotation.y += 0.008 + (index % 2) * 0.003;
        element.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;
        
        // Orbital motion
        const time = Date.now() * 0.0005;
        const radius = 8 + Math.sin(time + index) * 2;
        const angle = (index / educationalElements.length) * Math.PI * 2 + time * 0.2;
        
        element.position.x = Math.cos(angle) * radius;
        element.position.z = Math.sin(angle) * radius;
      });

      renderer.render(scene, camera);
      frameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Responsive handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Mouse interaction
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
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background">
      {/* 3D Background */}
      <div ref={mountRef} className="absolute inset-0 -z-10" />
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-7xl">
        
        {/* Main Hero Content */}
        <div className="space-y-8 md:space-y-12 animate-fadeInUp">
          
          {/* Hero Badge */}
          <div className="flex justify-center animate-bounce">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-600/10 text-blue-400 border-blue-400/20 hover:bg-blue-600/20 transition-colors">
              <Star className="w-4 h-4 mr-2" />
              India's #1 Educational Platform
              <TrendingUp className="w-4 h-4 ml-2" />
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight">
              StudentHub.com
            </h1>
            <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-200">
              Your Gateway to Educational Excellence
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-4">
              Access 15,000+ question papers, practice materials, and educational tools. 
              Join 50,000+ students who trust us for their academic success.
            </p>
          </div>

          {/* Dynamic Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {statsData.map((stat, index) => (
              <Card key={index} className={`glass-subtle hover-lift transition-all duration-500 ${currentStats === index ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className={`${stat.color} mb-3 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="glass-intense hover-scale group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Smart Search</h3>
                <p className="text-sm text-gray-200">
                  Find exactly what you need with our AI-powered search across 15,000+ papers
                </p>
              </CardContent>
            </Card>

            <Card className="glass-intense hover-scale group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Instant Download</h3>
                <p className="text-sm text-gray-200">
                  High-quality PDF downloads ready in seconds, no registration required
                </p>
              </CardContent>
            </Card>

            <Card className="glass-intense hover-scale group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Exam Focused</h3>
                <p className="text-sm text-gray-200">
                  Curated content for JEE, NEET, CBSE, State Boards, and competitive exams
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link to="/tools">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold px-8 py-4 rounded-full shadow-glow hover:shadow-glow-intense transition-all duration-300 group">
                Start Learning
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-400/20 text-blue-400 hover:bg-blue-400/10 px-8 py-4 rounded-full group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 opacity-70">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Shield className="w-4 h-4" />
              100% Secure
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Zap className="w-4 h-4" />
              Lightning Fast
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Heart className="w-4 h-4" />
              Trusted by 50K+ Students
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Globe className="w-4 h-4" />
              Available 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToContent}>
        <div className="flex flex-col items-center space-y-2 text-gray-300 hover:text-blue-400 transition-colors">
          <Mouse className="w-6 h-6" />
          <ChevronDown className="w-4 h-4" />
          <span className="text-xs font-medium">Scroll to explore</span>
        </div>
      </div>

      {/* Background Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />
    </section>
  );
};