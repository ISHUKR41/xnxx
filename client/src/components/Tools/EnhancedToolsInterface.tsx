import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';
import {
  FileText, Image, Type, Brain, Upload, Download,
  Settings, Zap, Crown, Star, CheckCircle, AlertCircle,
  Loader2, Scissors, Combine, Shield, Compress,
  RefreshCw, Palette, Crop, Maximize, Minimize,
  RotateCw, FlipHorizontal, FlipVertical, Eye,
  Copy, Share, Save, Trash2, Edit, Wand2,
  Sparkles, Target, TrendingUp, Award
} from 'lucide-react';

export const EnhancedToolsInterface: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCategory, setActiveCategory] = useState('pdf');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const toolCategories = {
    pdf: {
      title: "PDF Tools",
      description: "Professional PDF processing and manipulation tools",
      gradient: "from-red-600 to-orange-600",
      icon: FileText,
      tools: [
        {
          id: 'pdf-merge',
          name: 'Merge PDFs',
          description: 'Combine multiple PDF files into one document',
          icon: Combine,
          premium: false,
          endpoint: '/api/pdf/merge-enhanced',
          options: ['addPageNumbers', 'addBookmarks', 'title']
        },
        {
          id: 'pdf-split',
          name: 'Split PDF',
          description: 'Split PDF into separate pages or custom ranges',
          icon: Scissors,
          premium: false,
          endpoint: '/api/pdf/split-advanced',
          options: ['splitType', 'ranges', 'pageSize']
        },
        {
          id: 'pdf-compress',
          name: 'Compress PDF',
          description: 'Reduce PDF file size while maintaining quality',
          icon: Compress,
          premium: false,
          endpoint: '/api/pdf/compress',
          options: ['compressionLevel']
        },
        {
          id: 'pdf-protect',
          name: 'Protect PDF',
          description: 'Add password protection to PDF documents',
          icon: Shield,
          premium: true,
          endpoint: '/api/pdf/protect',
          options: ['password', 'ownerPassword']
        },
        {
          id: 'pdf-to-images',
          name: 'PDF to Images',
          description: 'Convert PDF pages to individual image files',
          icon: Image,
          premium: false,
          endpoint: '/api/pdf/pdf-to-images',
          options: ['format', 'quality']
        },
        {
          id: 'images-to-pdf',
          name: 'Images to PDF',
          description: 'Convert multiple images into a single PDF',
          icon: FileText,
          premium: false,
          endpoint: '/api/pdf/images-to-pdf',
          options: ['title', 'layout', 'margin']
        }
      ]
    },
    image: {
      title: "Image Tools",
      description: "Advanced image processing and optimization tools",
      gradient: "from-green-600 to-cyan-600",
      icon: Image,
      tools: [
        {
          id: 'image-resize',
          name: 'Resize Images',
          description: 'Resize images with advanced options and quality control',
          icon: Maximize,
          premium: false,
          endpoint: '/api/image/resize-advanced',
          options: ['width', 'height', 'maintainAspectRatio', 'resizeMode', 'background', 'format']
        },
        {
          id: 'image-compress',
          name: 'Compress Images',
          description: 'Reduce image file size with smart compression',
          icon: Compress,
          premium: false,
          endpoint: '/api/image/compress-advanced',
          options: ['quality', 'compressionLevel', 'preserveMetadata', 'outputFormat']
        },
        {
          id: 'image-convert',
          name: 'Convert Format',
          description: 'Convert images between different formats',
          icon: RefreshCw,
          premium: false,
          endpoint: '/api/image/convert',
          options: ['targetFormat', 'quality', 'compression']
        },
        {
          id: 'image-crop',
          name: 'Crop Images',
          description: 'Crop images with manual, center, or smart modes',
          icon: Crop,
          premium: false,
          endpoint: '/api/image/crop',
          options: ['x', 'y', 'width', 'height', 'cropMode']
        },
        {
          id: 'batch-process',
          name: 'Batch Process',
          description: 'Process multiple images with the same operation',
          icon: Wand2,
          premium: true,
          endpoint: '/api/image/batch-process',
          options: ['operation', 'width', 'height', 'quality', 'format', 'watermarkText']
        },
        {
          id: 'image-metadata',
          name: 'Extract Metadata',
          description: 'Extract detailed information from image files',
          icon: Eye,
          premium: false,
          endpoint: '/api/image/metadata',
          options: []
        }
      ]
    },
    text: {
      title: "Text & AI Tools",
      description: "Intelligent text processing and AI-powered utilities",
      gradient: "from-purple-600 to-pink-600",
      icon: Type,
      tools: [
        {
          id: 'text-to-pdf',
          name: 'Text to PDF',
          description: 'Convert text content to formatted PDF documents',
          icon: FileText,
          premium: false,
          endpoint: '/api/text/text-to-pdf',
          options: ['title', 'fontSize', 'fontFamily', 'margins']
        },
        {
          id: 'ai-summarize',
          name: 'AI Summarizer',
          description: 'Generate intelligent summaries of long text',
          icon: Brain,
          premium: true,
          endpoint: '/api/ai/summarize',
          options: ['length', 'style']
        },
        {
          id: 'grammar-check',
          name: 'Grammar Check',
          description: 'AI-powered grammar and style checking',
          icon: CheckCircle,
          premium: true,
          endpoint: '/api/ai/grammar-check',
          options: ['language', 'style']
        },
        {
          id: 'content-generator',
          name: 'Content Generator',
          description: 'Generate content using AI assistance',
          icon: Sparkles,
          premium: true,
          endpoint: '/api/ai/generate-content',
          options: ['type', 'tone', 'length']
        }
      ]
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(400, 200);
    renderer.setClearColor(0x000000, 0);

    // Create tool-themed floating objects
    const toolObjects: THREE.Mesh[] = [];
    const geometries = [
      new THREE.BoxGeometry(0.3, 0.4, 0.05), // Documents
      new THREE.RingGeometry(0.2, 0.3, 8), // Settings rings
      new THREE.SphereGeometry(0.2, 16, 16), // Processing spheres
      new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8), // Tools
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 }), // Red for PDF
      new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.7 }), // Green for Images
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.9 }), // Purple for Text
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 }), // Cyan for AI
    ];

    for (let i = 0; i < 8; i++) {
      const geometry = geometries[i % geometries.length];
      const material = materials[i % materials.length];
      const object = new THREE.Mesh(geometry, material);
      
      object.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      );
      
      toolObjects.push(object);
      scene.add(object);
    }

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(0, 0, 3);
    
    scene.add(ambientLight, pointLight);
    camera.position.z = 4;

    const animate = () => {
      const time = Date.now() * 0.001;
      
      toolObjects.forEach((object, index) => {
        object.rotation.x += 0.01 + index * 0.001;
        object.rotation.y += 0.015 + index * 0.002;
        object.position.y += Math.sin(time + index) * 0.003;
      });

      pointLight.position.x = Math.sin(time) * 2;
      pointLight.position.y = Math.cos(time * 1.2) * 1.5;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      setFiles(uploadedFiles);
      toast({
        title: "Files uploaded",
        description: `Selected ${uploadedFiles.length} file(s) for processing.`,
      });
    }
  };

  const handleToolProcess = async (tool: any, formData: any) => {
    if (!files || files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const data = new FormData();
      
      // Add files
      if (tool.id === 'pdf-merge' || tool.id === 'batch-process' || tool.id === 'images-to-pdf') {
        for (let i = 0; i < files.length; i++) {
          data.append('files', files[i]);
        }
      } else {
        data.append('file', files[0]);
      }

      // Add form options
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          data.append(key, value as string);
        }
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(tool.endpoint, {
        method: 'POST',
        body: data,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        if (tool.id === 'image-metadata') {
          const result = await response.json();
          setResult(result);
          toast({
            title: "Metadata extracted",
            description: "Image metadata has been successfully extracted.",
          });
        } else {
          // Handle file download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `processed-${Date.now()}.${tool.id.includes('pdf') ? 'pdf' : 'zip'}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast({
            title: "Processing complete",
            description: "Your file has been processed and downloaded.",
          });
        }
      } else {
        throw new Error(`Processing failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Tool processing error:', error);
      toast({
        title: "Processing failed",
        description: "An error occurred while processing your file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setTimeout(() => setSelectedTool(null), 1000);
    }
  };

  const currentCategory = toolCategories[activeCategory as keyof typeof toolCategories];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <canvas ref={canvasRef} className="opacity-80" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Professional Tools Suite
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Access our comprehensive collection of professional-grade tools for PDF processing, image manipulation, and AI-powered text analysis.
          </p>

          {/* Category Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(toolCategories).map(([key, category]) => (
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
                <category.icon className="w-5 h-5 mr-2" />
                {category.title}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Current Category Tools */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-black mb-4 bg-gradient-to-r ${currentCategory.gradient} bg-clip-text text-transparent`}>
              {currentCategory.title}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {currentCategory.description}
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50 backdrop-blur-sm transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${currentCategory.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}>
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {tool.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {tool.premium && (
                              <Badge className="text-xs bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30 text-yellow-400">
                                <Crown className="w-3 h-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    <Button 
                      onClick={() => setSelectedTool(tool.id)}
                      className={`w-full bg-gradient-to-r ${currentCategory.gradient} hover:shadow-lg transition-all duration-300`}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Use Tool
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tool Modal */}
        <AnimatePresence>
          {selectedTool && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTool(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tool Interface Implementation would go here */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Tool Interface: {selectedTool}
                  </h3>
                  
                  <div className="mb-6">
                    <Label htmlFor="file-upload" className="text-gray-300 mb-2 block">
                      Select Files
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  {isProcessing && (
                    <div className="mb-6">
                      <Progress value={progress} className="mb-2" />
                      <p className="text-gray-300">Processing... {progress}%</p>
                    </div>
                  )}

                  {result && (
                    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                      <pre className="text-sm text-gray-300 overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setSelectedTool(null)}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        const tool = Object.values(toolCategories)
                          .flatMap(cat => cat.tools)
                          .find(t => t.id === selectedTool);
                        if (tool) {
                          handleToolProcess(tool, {});
                        }
                      }}
                      disabled={isProcessing || !files}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Process
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};