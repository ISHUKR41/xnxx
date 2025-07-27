import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import {
  Menu, X, Home, Info, Wrench, Phone, 
  BookOpen, Zap, Shield, Globe, ChevronDown,
  Search, User, Settings, LogOut, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

interface FloatingLogoProps {
  isScrolled: boolean;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({ isScrolled }) => {
  const logoRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      logoRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
      logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={logoRef} scale={isScrolled ? 0.8 : 1}>
      <Box args={[0.6, 0.6, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#1E40AF" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </Box>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        SH
      </Text>
    </group>
  );
};

export const Enhanced3DNavbar: React.FC = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  const navigationItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      description: 'Educational platform homepage'
    },
    { 
      path: '/about', 
      label: 'About', 
      icon: Info,
      description: 'Learn about our mission'
    },
    { 
      path: '/tools', 
      label: 'Tools', 
      icon: Wrench,
      description: 'PDF, Image & AI tools'
    },
    { 
      path: '/contact', 
      label: 'Contact', 
      icon: Phone,
      description: 'Get in touch with us'
    }
  ];

  const toolsDropdownItems = [
    { label: 'PDF Tools', icon: BookOpen, path: '/tools?category=pdf' },
    { label: 'Image Tools', icon: Zap, path: '/tools?category=image' },
    { label: 'AI Tools', icon: Shield, path: '/tools?category=ai' },
    { label: 'Text Tools', icon: Globe, path: '/tools?category=text' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* 3D Animated Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 relative">
                <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[2, 2, 2]} intensity={0.8} />
                  <FloatingLogo isScrolled={isScrolled} />
                </Canvas>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col"
              >
                <span className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  StudentHub
                </span>
                <span className="text-xs text-gray-400 -mt-1">
                  Educational Platform
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return item.label === 'Tools' ? (
                  <DropdownMenu key={item.path}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`group relative px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50 ${
                          location.includes('/tools') 
                            ? 'bg-blue-600/20 text-blue-400' 
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                        <ChevronDown className="w-3 h-3 ml-1" />
                        
                        {location.includes('/tools') && (
                          <motion.div
                            layoutId="activeNavBg"
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-56 bg-gray-900/95 backdrop-blur-xl border-gray-700 shadow-2xl"
                      align="center"
                    >
                      {toolsDropdownItems.map((tool) => {
                        const ToolIcon = tool.icon;
                        return (
                          <Link key={tool.path} href={tool.path}>
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-800/50 text-gray-300 hover:text-white">
                              <ToolIcon className="w-4 h-4 mr-2" />
                              {tool.label}
                            </DropdownMenuItem>
                          </Link>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link key={item.path} href={item.path}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50 ${
                        isActive(item.path) 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2 inline" />
                      {item.label}
                      
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="activeNavBg"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-3">
              
              {/* Search Bar */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-48 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-gray-900/95 backdrop-blur-xl border-gray-700 shadow-2xl">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-800/50 text-gray-300 hover:text-white">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-800/50 text-gray-300 hover:text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-800/50 text-red-400 hover:text-red-300">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-gray-900/98 backdrop-blur-xl border-b border-gray-700/50 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.path}>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                          isActive(item.path)
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Enhanced3DNavbar;