import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/StudentHub/Header';
import * as THREE from 'three';
import {
  Mail, Phone, MapPin, Clock, Send, User, MessageSquare,
  Globe, Instagram, Twitter, Facebook, Linkedin, Youtube,
  ArrowRight, Star, Heart, Zap, Award, Target, Shield,
  BookOpen, Users, TrendingUp, Calendar, Headphones,
  Coffee, Lightbulb, Rocket, Brain, Eye, Sparkles,
  CheckCircle, Download, FileText, Video, Mic, Camera,
  Monitor, Smartphone, Tablet, Wifi, Database, Cloud
} from 'lucide-react';

const EnhancedContactPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

    // Create floating geometric shapes
    const geometries = [
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.ConeGeometry(0.6, 1.2, 8),
      new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
      new THREE.TorusGeometry(0.6, 0.2, 8, 16),
      new THREE.OctahedronGeometry(0.8)
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.9 }),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.6 }),
      new THREE.MeshPhongMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.7 })
    ];

    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[i % geometries.length];
      const material = materials[i % materials.length];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15
      );
      
      meshes.push(mesh);
      scene.add(mesh);
    }

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 100);
    const pointLight2 = new THREE.PointLight(0x10b981, 1, 100);
    
    pointLight1.position.set(10, 10, 10);
    pointLight2.position.set(-10, -10, 10);
    
    scene.add(ambientLight, pointLight1, pointLight2);
    camera.position.z = 12;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 + index * 0.001;
        mesh.rotation.y += 0.015 + index * 0.002;
        mesh.position.y += Math.sin(time + index) * 0.01;
        mesh.position.x += Math.cos(time + index * 0.5) * 0.005;
      });

      pointLight1.position.x = Math.sin(time) * 8;
      pointLight1.position.y = Math.cos(time * 1.2) * 8;
      
      pointLight2.position.x = Math.cos(time * 0.8) * 8;
      pointLight2.position.z = Math.sin(time * 1.5) * 8;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Open Google Form in new tab
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSczWJI6cXslwpNgayBkuH0pnKfCZx0weAYi2lbnkLLpb76Myg/viewform', '_blank');
    }, 2000);
  };

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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Address",
      primary: "support@studenthub.com",
      secondary: "admin@studenthub.com",
      color: "text-blue-400",
      bg: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      primary: "+91 98765 43210",
      secondary: "+91 87654 32109",
      color: "text-green-400",
      bg: "from-green-500/20 to-green-600/20"
    },
    {
      icon: MapPin,
      title: "Office Address",
      primary: "StudentHub Technologies Pvt Ltd",
      secondary: "Sector 62, Noida, UP 201309, India",
      color: "text-purple-400",
      bg: "from-purple-500/20 to-purple-600/20"
    },
    {
      icon: Globe,
      title: "Website",
      primary: "www.studenthub.com",
      secondary: "Available 24/7",
      color: "text-cyan-400",
      bg: "from-cyan-500/20 to-cyan-600/20"
    }
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", url: "#", color: "text-pink-400" },
    { icon: Twitter, label: "Twitter", url: "#", color: "text-blue-400" },
    { icon: Facebook, label: "Facebook", url: "#", color: "text-blue-600" },
    { icon: Linkedin, label: "LinkedIn", url: "#", color: "text-blue-500" },
    { icon: Youtube, label: "YouTube", url: "#", color: "text-red-500" }
  ];

  const workingHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM IST" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM IST" },
    { day: "Sunday", hours: "Closed" }
  ];

  const quickStats = [
    { label: "Response Time", value: "< 2 Hours", icon: Clock, color: "text-blue-400" },
    { label: "Support Rating", value: "4.9/5", icon: Star, color: "text-yellow-400" },
    { label: "Tickets Resolved", value: "25K+", icon: CheckCircle, color: "text-green-400" },
    { label: "Happy Students", value: "2.5M+", icon: Users, color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section with 3D Animation */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30"></div>
        
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
                <Mail className="w-5 h-5 mr-2" />
                Contact StudentHub
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            >
              Get In Touch
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12"
            >
              Have questions? Need support? Want to partner with us? We're here to help you succeed in your educational journey. Our expert team is available 24/7 to assist you.
            </motion.p>

            {/* Live India Time Display */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-12 max-w-lg mx-auto"
            >
              <div className="flex items-center justify-center space-x-4">
                <Clock className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-bold text-lg">India Time (IST)</p>
                  <p className="text-2xl font-black text-white">
                    {currentTime.toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      hour12: true,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {currentTime.toLocaleDateString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

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
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 text-center"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3 mx-auto`} />
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Information</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple ways to reach us - choose what works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${info.bg} backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300`}
              >
                <info.icon className={`w-12 h-12 ${info.color} mb-6`} />
                <h3 className="text-2xl font-bold text-white mb-4">{info.title}</h3>
                <p className={`${info.color} font-semibold text-lg mb-2`}>{info.primary}</p>
                <p className="text-gray-400">{info.secondary}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Form Integration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Send Us a Message</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Fill out our comprehensive contact form and we'll get back to you within 2 hours
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-700"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-white text-lg font-semibold mb-3">
                      <User className="w-5 h-5 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-lg font-semibold mb-3">
                      <Mail className="w-5 h-5 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-lg font-semibold mb-3">
                    <MessageSquare className="w-5 h-5 inline mr-2" />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="What can we help you with?"
                  />
                </div>

                <div>
                  <label className="block text-white text-lg font-semibold mb-3">
                    <FileText className="w-5 h-5 inline mr-2" />
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell us more about your query or feedback..."
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold rounded-xl border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Opening Form...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-12 text-center">
                <p className="text-gray-400 mb-4">Or contact us directly through our Google Form:</p>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSczWJI6cXslwpNgayBkuH0pnKfCZx0weAYi2lbnkLLpb76Myg/viewform', '_blank')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 font-semibold rounded-xl"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Open Google Form
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Working Hours & Social Links */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white flex items-center">
                    <Clock className="w-8 h-8 text-blue-400 mr-3" />
                    Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-600">
                      <span className="text-gray-300 font-semibold">{schedule.day}</span>
                      <span className="text-white font-bold">{schedule.hours}</span>
                    </div>
                  ))}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl border border-green-500/30">
                    <p className="text-green-400 font-semibold flex items-center">
                      <Headphones className="w-5 h-5 mr-2" />
                      24/7 Emergency Support Available
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white flex items-center">
                    <Globe className="w-8 h-8 text-purple-400 mr-3" />
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-8 text-lg">Stay connected with us on social media for updates, tips, and educational content.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-300 group"
                      >
                        <social.icon className={`w-6 h-6 ${social.color} mr-3 group-hover:scale-110 transition-transform duration-300`} />
                        <span className="text-white font-semibold group-hover:text-gray-200">{social.label}</span>
                      </motion.a>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30">
                    <div className="flex items-center mb-4">
                      <Heart className="w-6 h-6 text-pink-400 mr-2" />
                      <span className="text-pink-400 font-bold">Join Our Community</span>
                    </div>
                    <p className="text-gray-300">
                      Over 2.5 million students trust StudentHub for their educational needs. Join our growing community today!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning Journey?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join millions of students who trust StudentHub for their educational success
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 font-semibold rounded-xl">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Resources
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 font-semibold rounded-xl">
                  <Rocket className="w-5 h-5 mr-2" />
                  Try Tools Free
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedContactPage;