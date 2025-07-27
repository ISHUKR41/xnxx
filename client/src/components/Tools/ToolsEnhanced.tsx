import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ToolModal } from './ToolModal';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';
import {
  Search, Filter, FileText, Image, Wrench, Star, Sparkles,
  ArrowRight, Download, Upload, Scissors, Combine, RotateCcw,
  Edit, FileSignature, FileImage, FileOutput, Crop, Type,
  ClipboardCheck, Zap, Lock, Unlock, Eye, FileX, Copy,
  RefreshCw, Shield, Users, ArrowUp, Palette, Globe,
  Heart, Monitor, Smartphone, Tablet, Settings, Play,
  Pause, Volume2, Mic, Camera, Code, Cpu, Database,
  Cloud, Wifi, Bluetooth, MessageSquare, Calendar,
  MapPin, Phone, Mail, BookOpen, GraduationCap, Trophy,
  TrendingUp, BarChart, PieChart, Activity, Target,
  Lightbulb, Brain, Rocket, Magic
} from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  premium: boolean;
  popular: boolean;
  new: boolean;
  endpoint: string;
  inputType: string;
  features: string[];
}

export const ToolsEnhanced: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const { toast } = useToast();

  // Enhanced 3D Animation Setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);

    // Create floating tool icons
    const geometries = [
      new THREE.OctahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(0.6),
      new THREE.IcosahedronGeometry(0.5),
      new THREE.DodecahedronGeometry(0.7),
      new THREE.ConeGeometry(0.5, 1),
      new THREE.CylinderGeometry(0.3, 0.3, 1)
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9 }),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 })
    ];

    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(geometries[i], materials[i]);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      );
      meshes.push(mesh);
      scene.add(mesh);
    }

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(0, 0, 5);
    
    scene.add(ambientLight, directionalLight, pointLight);
    camera.position.z = 8;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 + index * 0.002;
        mesh.rotation.y += 0.01 + index * 0.003;
        mesh.rotation.z += 0.005 + index * 0.001;
        
        mesh.position.y += Math.sin(time + index) * 0.01;
        mesh.position.x += Math.cos(time * 0.5 + index) * 0.005;
      });

      pointLight.position.x = Math.sin(time) * 3;
      pointLight.position.y = Math.cos(time * 1.2) * 2;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  const tools: Tool[] = [
    // PDF Tools
    {
      id: 'pdf-merge',
      title: 'Merge PDF Files',
      description: 'Combine multiple PDF files into a single document with ease',
      category: 'PDF',
      icon: Combine,
      color: 'text-blue-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/pdf-tools/merge',
      inputType: 'multiple',
      features: ['Drag & Drop', 'Reorder Pages', 'Batch Processing', 'High Quality Output']
    },
    {
      id: 'pdf-split',
      title: 'Split PDF',
      description: 'Extract pages or split PDF into multiple documents',
      category: 'PDF',
      icon: Scissors,
      color: 'text-green-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/pdf-tools/split',
      inputType: 'single',
      features: ['Page Range Selection', 'Individual Pages', 'Custom Split', 'ZIP Download']
    },
    {
      id: 'pdf-compress',
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      category: 'PDF',
      icon: ArrowDown,
      color: 'text-purple-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/pdf-tools/compress',
      inputType: 'single',
      features: ['Smart Compression', 'Quality Control', 'Size Reduction', 'Fast Processing']
    },
    {
      id: 'pdf-protect',
      title: 'Password Protect PDF',
      description: 'Add password protection and encryption to your PDFs',
      category: 'PDF',
      icon: Lock,
      color: 'text-red-400',
      premium: false,
      popular: false,
      new: false,
      endpoint: '/api/pdf-tools/protect',
      inputType: 'single',
      features: ['256-bit Encryption', 'User Passwords', 'Owner Permissions', 'Security Settings']
    },
    {
      id: 'pdf-unlock',
      title: 'Unlock PDF',
      description: 'Remove password protection from PDF documents',
      category: 'PDF',
      icon: Unlock,
      color: 'text-yellow-400',
      premium: false,
      popular: false,
      new: false,
      endpoint: '/api/pdf-tools/unlock',
      inputType: 'single',
      features: ['Password Removal', 'Decrypt Files', 'Access Restoration', 'Secure Processing']
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Convert PDF documents to editable Word format',
      category: 'PDF',
      icon: FileText,
      color: 'text-cyan-400',
      premium: true,
      popular: true,
      new: false,
      endpoint: '/api/pdf-tools/to-word',
      inputType: 'single',
      features: ['OCR Support', 'Layout Preservation', 'Font Recognition', 'Table Extraction']
    },

    // Image Tools
    {
      id: 'image-resize',
      title: 'Resize Images',
      description: 'Change image dimensions while maintaining quality',
      category: 'Image',
      icon: RotateCcw,
      color: 'text-blue-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/image-tools/resize',
      inputType: 'single',
      features: ['Custom Dimensions', 'Aspect Ratio Lock', 'Batch Resize', 'High Quality']
    },
    {
      id: 'image-compress',
      title: 'Compress Images',
      description: 'Reduce image file size without losing quality',
      category: 'Image',
      icon: ArrowDown,
      color: 'text-green-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/image-tools/compress',
      inputType: 'single',
      features: ['Lossless Compression', 'Quality Control', 'Format Optimization', 'Batch Processing']
    },
    {
      id: 'image-crop',
      title: 'Crop Images',
      description: 'Crop and trim images to perfect dimensions',
      category: 'Image',
      icon: Crop,
      color: 'text-purple-400',
      premium: false,
      popular: false,
      new: false,
      endpoint: '/api/image-tools/crop',
      inputType: 'single',
      features: ['Manual Selection', 'Aspect Ratios', 'Precision Cropping', 'Preview Mode']
    },
    {
      id: 'image-convert',
      title: 'Convert Image Format',
      description: 'Convert between JPG, PNG, WebP, and other formats',
      category: 'Image',
      icon: RefreshCw,
      color: 'text-yellow-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/image-tools/convert',
      inputType: 'single',
      features: ['Multiple Formats', 'Quality Settings', 'Transparent PNG', 'Modern WebP']
    },

    // Text & AI Tools
    {
      id: 'text-to-pdf',
      title: 'Text to PDF',
      description: 'Convert plain text into formatted PDF documents',
      category: 'Text',
      icon: Type,
      color: 'text-blue-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/text-tools/text-to-pdf',
      inputType: 'text',
      features: ['Font Selection', 'Custom Formatting', 'Page Layout', 'Headers & Footers']
    },
    {
      id: 'text-summarize',
      title: 'Text Summarizer',
      description: 'AI-powered text summarization for long documents',
      category: 'AI',
      icon: Brain,
      color: 'text-purple-400',
      premium: true,
      popular: true,
      new: true,
      endpoint: '/api/ai-tools/summarize-text',
      inputType: 'text',
      features: ['AI Powered', 'Length Control', 'Key Points', 'Multiple Languages']
    },
    {
      id: 'grammar-check',
      title: 'Grammar Checker',
      description: 'Advanced grammar and spell checking with suggestions',
      category: 'AI',
      icon: ClipboardCheck,
      color: 'text-green-400',
      premium: true,
      popular: true,
      new: true,
      endpoint: '/api/ai-tools/grammar-check',
      inputType: 'text',
      features: ['Grammar Analysis', 'Spell Check', 'Style Suggestions', 'Readability Score']
    },
    {
      id: 'word-count',
      title: 'Word Counter',
      description: 'Count words, characters, sentences, and paragraphs',
      category: 'Text',
      icon: BarChart,
      color: 'text-cyan-400',
      premium: false,
      popular: false,
      new: false,
      endpoint: '/api/ai-tools/count-words',
      inputType: 'text',
      features: ['Detailed Statistics', 'Reading Time', 'Speaking Time', 'Character Count']
    },
    {
      id: 'qr-generator',
      title: 'QR Code Generator',
      description: 'Generate QR codes for text, URLs, and data',
      category: 'Utility',
      icon: QrCode,
      color: 'text-yellow-400',
      premium: false,
      popular: true,
      new: false,
      endpoint: '/api/ai-tools/generate-qr',
      inputType: 'text',
      features: ['Custom Size', 'Error Correction', 'High Resolution', 'Multiple Formats']
    },
    {
      id: 'text-formatter',
      title: 'Text Formatter',
      description: 'Format text with various case and style options',
      category: 'Text',
      icon: Palette,
      color: 'text-pink-400',
      premium: false,
      popular: false,
      new: false,
      endpoint: '/api/ai-tools/format-text',
      inputType: 'text',
      features: ['Case Conversion', 'camelCase', 'snake_case', 'kebab-case']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', icon: Wrench, count: tools.length },
    { id: 'PDF', name: 'PDF Tools', icon: FileText, count: tools.filter(t => t.category === 'PDF').length },
    { id: 'Image', name: 'Image Tools', icon: Image, count: tools.filter(t => t.category === 'Image').length },
    { id: 'Text', name: 'Text Tools', icon: Type, count: tools.filter(t => t.category === 'Text').length },
    { id: 'AI', name: 'AI Tools', icon: Brain, count: tools.filter(t => t.category === 'AI').length },
    { id: 'Utility', name: 'Utilities', icon: Settings, count: tools.filter(t => t.category === 'Utility').length }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || tool.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  const handleFileProcess = async (file: File, tool: Tool) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(tool.endpoint, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processed-${file.name}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Success!",
          description: `${tool.title} completed successfully`,
        });
      } else {
        throw new Error('Processing failed');
      }
    } catch (error) {
      console.error('Tool processing error:', error);
      toast({
        title: "Error",
        description: "Failed to process file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setSelectedTool(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 3D Background Animation */}
      <div className="fixed inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg font-bold">
              <Sparkles className="w-5 h-5 mr-2" />
              Powerful Tools Collection
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              All-in-One Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12">
              Professional-grade tools for PDFs, images, text processing, and AI-powered utilities. 
              Everything you need in one powerful platform.
            </p>
          </motion.div>
        </section>

        {/* Search and Filter Section */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category.id)}
                  className={`${
                    activeFilter === category.id 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800'
                  } text-white`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredTool(tool.id)}
                onHoverEnd={() => setHoveredTool(null)}
              >
                <Card 
                  className="bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm"
                  onClick={() => handleToolSelect(tool)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg bg-gray-800/50 ${tool.color}`}>
                          <tool.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg font-semibold">
                            {tool.title}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            {tool.popular && (
                              <Badge variant="secondary" className="text-xs bg-blue-600/20 text-blue-400">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                            {tool.new && (
                              <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-400">
                                ✨ New
                              </Badge>
                            )}
                            {tool.premium && (
                              <Badge variant="secondary" className="text-xs bg-yellow-600/20 text-yellow-400">
                                👑 Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {feature}
                          </Badge>
                        ))}
                        {tool.features.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            +{tool.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        Use Tool
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Tools Found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </section>

        {/* Tool Modal */}
        <ToolModal 
          tool={selectedTool} 
          isOpen={!!selectedTool} 
          onClose={handleCloseModal} 
        />
      </div>
    </div>
  );
};

function QrCode(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="m21 16-3.5-3.5-3.5 3.5" />
      <path d="m21 21-3.5-3.5-3.5 3.5" />
    </svg>
  );
}

function ArrowDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}