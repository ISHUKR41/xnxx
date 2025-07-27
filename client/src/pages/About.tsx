import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import * as THREE from 'three';
import {
  Users, Award, Target, Lightbulb, Heart, Globe, 
  TrendingUp, CheckCircle, Star, BookOpen, 
  Zap, Shield, Clock, Sparkles, Database,
  Cpu, Cloud, Lock, Rocket, Brain, Eye,
  Coffee, Headphones, Code, Palette
} from 'lucide-react';

const About: React.FC = () => {
  const [activeSection, setActiveSection] = useState('mission');
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  // 3D Animation Setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(800, 400);
    renderer.setClearColor(0x000000, 0);

    // Create animated geometric shapes
    const geometry1 = new THREE.OctahedronGeometry(1);
    const geometry2 = new THREE.TetrahedronGeometry(0.8);
    const geometry3 = new THREE.IcosahedronGeometry(0.6);

    const material1 = new THREE.MeshPhongMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.8,
      wireframe: false 
    });
    const material2 = new THREE.MeshPhongMaterial({ 
      color: 0x22d3ee, 
      transparent: true, 
      opacity: 0.7,
      wireframe: true 
    });
    const material3 = new THREE.MeshPhongMaterial({ 
      color: 0xfbbf24, 
      transparent: true, 
      opacity: 0.9,
      wireframe: false 
    });

    const mesh1 = new THREE.Mesh(geometry1, material1);
    const mesh2 = new THREE.Mesh(geometry2, material2);
    const mesh3 = new THREE.Mesh(geometry3, material3);

    mesh1.position.set(-2, 0, 0);
    mesh2.position.set(0, 0, 0);
    mesh3.position.set(2, 0, 0);

    scene.add(mesh1, mesh2, mesh3);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      mesh1.rotation.x += 0.01;
      mesh1.rotation.y += 0.01;
      mesh1.position.y = Math.sin(time) * 0.5;
      
      mesh2.rotation.x -= 0.015;
      mesh2.rotation.y -= 0.01;
      mesh2.position.y = Math.cos(time * 1.2) * 0.3;
      
      mesh3.rotation.x += 0.02;
      mesh3.rotation.z += 0.01;
      mesh3.position.y = Math.sin(time * 0.8) * 0.7;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);

    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, []);

  // Enhanced animation controls
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief Executive Officer & Founder",
      expertise: "Educational Technology, Machine Learning",
      experience: "15+ years",
      education: "PhD Computer Science, IIT Delhi",
      achievements: "50+ Research Papers, 3 Patents",
      passion: "Democratizing Quality Education",
      avatar: "👨‍💼"
    },
    {
      name: "Priya Sharma",
      role: "Chief Technology Officer",
      expertise: "Full-Stack Development, Cloud Architecture",
      experience: "12+ years",
      education: "M.Tech Software Engineering, IIT Bombay",
      achievements: "Led 20+ Major Projects",
      passion: "Building Scalable Ed-Tech Solutions",
      avatar: "👩‍💻"
    },
    {
      name: "Amit Patel",
      role: "Head of Content & Academics",
      expertise: "Curriculum Design, Educational Assessment",
      experience: "18+ years",
      education: "M.Ed, Jamia Millia Islamia",
      achievements: "Content for 500K+ Students",
      passion: "Quality Content Creation",
      avatar: "👨‍🏫"
    },
    {
      name: "Neha Gupta",
      role: "Head of Product Design",
      expertise: "UX/UI Design, User Research",
      experience: "10+ years",
      education: "Design Graduate, NID Ahmedabad",
      achievements: "Award-winning Designs",
      passion: "User-Centric Design",
      avatar: "👩‍🎨"
    }
  ];

  const milestones = [
    { year: "2019", event: "Company Founded", details: "Started with a vision to transform Indian education" },
    { year: "2020", event: "1,000 Users", details: "Reached our first milestone during pandemic" },
    { year: "2021", event: "AI Integration", details: "Launched AI-powered study recommendations" },
    { year: "2022", event: "100K Users", details: "Became a trusted platform for lakhs of students" },
    { year: "2023", event: "1M+ Downloads", details: "Crossed 10 lakh question paper downloads" },
    { year: "2024", event: "Premium Launch", details: "Introduced advanced features and tools" },
    { year: "2025", event: "2M+ Active Users", details: "Serving 20 lakh+ students across India" }
  ];

  const stats = [
    { label: "Active Students", value: "2.5M+", icon: Users, color: "text-blue-400" },
    { label: "Question Papers", value: "50K+", icon: BookOpen, color: "text-green-400" },
    { label: "Universities Covered", value: "500+", icon: Award, color: "text-purple-400" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-yellow-400" },
    { label: "Daily Downloads", value: "10K+", icon: Cloud, color: "text-cyan-400" },
    { label: "Expert Curators", value: "150+", icon: Star, color: "text-pink-400" }
  ];

  const technologies = [
    { name: "React & TypeScript", icon: Code, description: "Modern frontend development" },
    { name: "Node.js & Express", icon: Cpu, description: "Robust backend services" },
    { name: "PostgreSQL", icon: Database, description: "Reliable data storage" },
    { name: "AWS Cloud", icon: Cloud, description: "Scalable infrastructure" },
    { name: "AI/ML Models", icon: Brain, description: "Intelligent recommendations" },
    { name: "Advanced Security", icon: Lock, description: "Enterprise-grade protection" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with 3D Animation */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg font-bold animate-pulse">
                <Sparkles className="w-5 h-5 mr-2" />
                About StudentHub.com
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            >
              Revolutionizing Education
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12"
            >
              We're on a mission to democratize quality education by providing instant access to comprehensive academic resources, powered by cutting-edge technology and curated by educational experts.
            </motion.p>

            {/* 3D Animation Canvas */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center mb-12"
            >
              <div className="relative">
                <canvas 
                  ref={canvasRef}
                  className="rounded-xl shadow-2xl border border-gray-700"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3 mx-auto`} />
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Foundation</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on strong principles that guide every decision we make
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-2xl p-8 border border-blue-500/30"
            >
              <Target className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To democratize quality education by providing every student in India with instant access to comprehensive, verified academic resources. We believe that geographical and economic barriers should never limit a student's potential to excel.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-blue-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Accessible to all students</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Expert-curated content</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Technology-driven solutions</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-2xl p-8 border border-purple-500/30"
            >
              <Eye className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To become India's most trusted and comprehensive educational platform, where every student can find the resources they need to achieve academic excellence. We envision a future where quality education is a right, not a privilege.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-purple-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Pan-India coverage</span>
                </div>
                <div className="flex items-center text-purple-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">AI-powered personalization</span>
                </div>
                <div className="flex items-center text-purple-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Global recognition</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-2xl p-8 border border-green-500/30"
            >
              <Heart className="w-12 h-12 text-green-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
              <p className="text-gray-300 leading-relaxed">
                Integrity, innovation, and inclusivity form the core of everything we do. We're committed to maintaining the highest standards of quality while fostering an environment of continuous learning and growth.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Quality over quantity</span>
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Student-first approach</span>
                </div>
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Continuous innovation</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Journey</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From a small idea to serving millions of students across India
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
                      <div className="text-2xl font-bold text-blue-400 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{milestone.event}</h3>
                      <p className="text-gray-300">{milestone.details}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-black"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Passionate professionals dedicated to transforming education in India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-xl p-6 border border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-6xl mb-4 text-center">{member.avatar}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong className="text-white">Expertise:</strong> {member.expertise}</p>
                  <p><strong className="text-white">Experience:</strong> {member.experience}</p>
                  <p><strong className="text-white">Education:</strong> {member.education}</p>
                  <p><strong className="text-white">Achievements:</strong> {member.achievements}</p>
                  <p><strong className="text-white">Passion:</strong> {member.passion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Technology Stack</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built with cutting-edge technologies for maximum performance and reliability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-xl p-6 border border-gray-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300"
              >
                <tech.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{tech.name}</h3>
                <p className="text-gray-300">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-cyan-900/40">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Studies?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join millions of students who trust StudentHub.com for their academic success. 
              Start your journey towards excellence today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-bold">
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-bold">
                <Coffee className="w-5 h-5 mr-2" />
                Contact Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;