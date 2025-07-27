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
  Sparkles
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
    { icon: <Users className="w-8 h-8" />, value: "1M+", label: "Students Served" },
    { icon: <BookOpen className="w-8 h-8" />, value: "50K+", label: "Question Papers" },
    { icon: <Zap className="w-8 h-8" />, value: "30+", label: "Free Tools" },
    { icon: <Trophy className="w-8 h-8" />, value: "99.9%", label: "Uptime" }
  ];

  const features = [
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "Comprehensive Education Hub",
      description: "Access thousands of previous year question papers, study materials, and educational resources all in one place."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Powerful Online Tools",
      description: "Professional-grade PDF, image, and text processing tools that work instantly in your browser without any downloads."
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Secure & Private",
      description: "Your files are processed securely and automatically deleted after use. We prioritize your privacy and data security."
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Accessible Everywhere",
      description: "Works on any device with internet access. No installations, no subscriptions - just instant access to quality tools."
    }
  ];

  const team = [
    {
      name: "Development Team",
      role: "Full-Stack Engineering",
      description: "Passionate developers creating cutting-edge educational technology to empower students worldwide."
    },
    {
      name: "Content Team", 
      role: "Educational Content",
      description: "Educators and subject matter experts ensuring high-quality, accurate, and relevant educational materials."
    },
    {
      name: "Design Team",
      role: "User Experience",
      description: "Designers focused on creating intuitive, accessible, and beautiful interfaces for seamless learning."
    }
  ];

  const achievements = [
    { icon: <Award className="w-6 h-6" />, text: "Recognized as top educational platform" },
    { icon: <Star className="w-6 h-6" />, text: "4.9/5 average user rating" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "Growing by 10,000+ users monthly" },
    { icon: <Heart className="w-6 h-6" />, text: "Loved by students worldwide" }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center space-y-3 animate-pulse"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-primary mx-auto">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-foreground-secondary">{stat.label}</div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="glassmorphism hover-lift">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="text-primary">{feature.icon}</div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-foreground-secondary leading-relaxed">
                        {feature.description}
                      </p>
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
            <Card className="glassmorphism">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Achievements</h2>
                  <p className="text-lg text-foreground-secondary">
                    Recognition and milestones that drive us to continue improving.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-background-secondary rounded-lg">
                      <div className="text-primary">{achievement.icon}</div>
                      <span className="text-foreground">{achievement.text}</span>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="glassmorphism hover-lift">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <Badge variant="secondary" className="text-primary">
                        {member.role}
                      </Badge>
                      <p className="text-foreground-secondary leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="glassmorphism">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Core Values</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-4">
                    <Lightbulb className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="text-xl font-bold">Innovation</h3>
                    <p className="text-foreground-secondary">
                      Continuously improving and innovating to provide better educational experiences.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Heart className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="text-xl font-bold">Accessibility</h3>
                    <p className="text-foreground-secondary">
                      Making quality education resources available to everyone, everywhere.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="text-xl font-bold">Quality</h3>
                    <p className="text-foreground-secondary">
                      Maintaining the highest standards in content, tools, and user experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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