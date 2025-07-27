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
  Loader2, Scissors, Combine, Shield, Archive,
  RefreshCw, Palette, Crop, Maximize, Minimize,
  RotateCw, FlipHorizontal, FlipVertical, Eye,
  Copy, Share, Save, Trash2, Edit, Wand2,
  Sparkles, Target, TrendingUp, Award, Lock,
  Unlock, FileImage, FileSpreadsheet, Presentation,
  Book, Scan, Table, MessageSquare, QrCode,
  Volume2, Hash, Code, PlayCircle, Instagram,
  Smartphone, Monitor, Tablet, HardDrive, Cloud,
  Layers, Grid, Search, Filter, SortAsc,
  Paintbrush, Pipette, Square, Circle,
  Triangle, Hexagon, Move, CornerDownRight
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
      description: "Complete PDF processing suite with 35+ professional tools",
      gradient: "from-red-600 via-orange-600 to-pink-600",
      icon: FileText,
      tools: [
        // PDF ⇆ Office Conversions
        {
          id: 'pdf-to-word',
          name: 'PDF to Word',
          description: 'Convert PDF files to editable Word documents with perfect formatting',
          icon: FileText,
          premium: false,
          endpoint: '/api/pdf/office/pdf-to-word',
          options: ['preserveLayout', 'ocrMode', 'language']
        },
        {
          id: 'word-to-pdf',
          name: 'Word to PDF',
          description: 'Convert Word documents to professional PDF files',
          icon: FileText,
          premium: false,
          endpoint: '/api/pdf/office/word-to-pdf',
          options: ['quality', 'bookmarks', 'metadata']
        },
        {
          id: 'pdf-to-excel',
          name: 'PDF to Excel',
          description: 'Extract tables from PDF and convert to Excel spreadsheets',
          icon: FileSpreadsheet,
          premium: false,
          endpoint: '/api/pdf/office/pdf-to-excel',
          options: ['tableDetection', 'sheetNaming', 'formatting']
        },
        {
          id: 'excel-to-pdf',
          name: 'Excel to PDF',
          description: 'Convert Excel spreadsheets to PDF with custom formatting',
          icon: FileSpreadsheet,
          premium: false,
          endpoint: '/api/pdf/office/excel-to-pdf',
          options: ['orientation', 'scaling', 'pageBreaks']
        },
        {
          id: 'pdf-to-powerpoint',
          name: 'PDF to PowerPoint',
          description: 'Convert PDF pages to PowerPoint presentation slides',
          icon: Presentation,
          premium: false,
          endpoint: '/api/pdf/office/pdf-to-powerpoint',
          options: ['slideLayout', 'imageQuality', 'animations']
        },
        {
          id: 'powerpoint-to-pdf',
          name: 'PowerPoint to PDF',
          description: 'Convert presentations to PDF with speaker notes',
          icon: Presentation,
          premium: false,
          endpoint: '/api/pdf/office/powerpoint-to-pdf',
          options: ['includeNotes', 'quality', 'handouts']
        },
        // PDF ⇆ Image Tools
        {
          id: 'pdf-to-jpg',
          name: 'PDF to JPG',
          description: 'Convert PDF pages to high-quality JPG images',
          icon: FileImage,
          premium: false,
          endpoint: '/api/pdf/image/pdf-to-jpg',
          options: ['resolution', 'quality', 'colorSpace']
        },
        {
          id: 'pdf-to-png',
          name: 'PDF to PNG',
          description: 'Convert PDF pages to PNG with transparency support',
          icon: FileImage,
          premium: false,
          endpoint: '/api/pdf/image/pdf-to-png',
          options: ['resolution', 'transparent', 'compression']
        },
        {
          id: 'jpg-to-pdf',
          name: 'JPG to PDF',
          description: 'Convert multiple JPG images to a single PDF document',
          icon: FileText,
          premium: false,
          endpoint: '/api/pdf/image/jpg-to-pdf',
          options: ['pageSize', 'orientation', 'margin', 'quality']
        },
        {
          id: 'png-to-pdf',
          name: 'PNG to PDF',
          description: 'Convert PNG images to PDF with transparency preservation',
          icon: FileText,
          premium: false,
          endpoint: '/api/pdf/image/png-to-pdf',
          options: ['background', 'compression', 'layout']
        },
        // Core PDF Operations
        {
          id: 'merge-pdf',
          name: 'Merge PDF',
          description: 'Combine multiple PDF files into one with bookmarks',
          icon: Combine,
          premium: false,
          endpoint: '/api/pdf/core/merge',
          options: ['addBookmarks', 'pageNumbers', 'title']
        },
        {
          id: 'split-pdf',
          name: 'Split PDF',
          description: 'Split PDF by pages, ranges, or file size limits',
          icon: Scissors,
          premium: false,
          endpoint: '/api/pdf/core/split',
          options: ['splitType', 'ranges', 'maxSize', 'naming']
        },
        {
          id: 'compress-pdf',
          name: 'Compress PDF',
          description: 'Reduce PDF file size with intelligent compression',
          icon: Archive,
          premium: false,
          endpoint: '/api/pdf/core/compress',
          options: ['compressionLevel', 'imageQuality', 'preserveBookmarks']
        },
        {
          id: 'protect-pdf',
          name: 'Protect PDF',
          description: 'Add password protection and restrict PDF permissions',
          icon: Lock,
          premium: true,
          endpoint: '/api/pdf/core/protect',
          options: ['userPassword', 'ownerPassword', 'permissions']
        },
        {
          id: 'unlock-pdf',
          name: 'Unlock PDF',
          description: 'Remove password protection from PDF documents',
          icon: Unlock,
          premium: true,
          endpoint: '/api/pdf/core/unlock',
          options: ['password']
        }
      ]
    },
    image: {
      title: "Image Tools",
      description: "Professional image processing with 25+ advanced tools",
      gradient: "from-green-600 via-cyan-600 to-blue-600",
      icon: Image,
      tools: [
        {
          id: 'resize-image',
          name: 'Resize Image',
          description: 'Resize images with AI-powered upscaling and smart cropping',
          icon: Maximize,
          premium: false,
          endpoint: '/api/image/resize',
          options: ['width', 'height', 'algorithm', 'maintainRatio', 'background']
        },
        {
          id: 'compress-image',
          name: 'Compress Image',
          description: 'Reduce file size while maintaining visual quality',
          icon: Archive,
          premium: false,
          endpoint: '/api/image/compress',
          options: ['quality', 'progressive', 'preserveMetadata', 'optimization']
        },
        {
          id: 'convert-format',
          name: 'Convert Format',
          description: 'Convert between JPG, PNG, WebP, AVIF, and more formats',
          icon: RefreshCw,
          premium: false,
          endpoint: '/api/image/convert',
          options: ['outputFormat', 'quality', 'progressive', 'lossless']
        },
        {
          id: 'crop-image',
          name: 'Crop Image',
          description: 'Crop images with precision tools and aspect ratio presets',
          icon: Crop,
          premium: false,
          endpoint: '/api/image/crop',
          options: ['x', 'y', 'width', 'height', 'aspectRatio', 'gravity']
        }
      ]
    },
    text: {
      title: "Text & Document Tools",
      description: "Advanced text processing and document creation tools",
      gradient: "from-purple-600 via-pink-600 to-red-600",
      icon: Type,
      tools: [
        {
          id: 'text-to-pdf',
          name: 'Text to PDF',
          description: 'Convert plain text to formatted PDF documents',
          icon: FileText,
          premium: false,
          endpoint: '/api/text/text-to-pdf',
          options: ['font', 'fontSize', 'lineSpacing', 'margins', 'pageSize']
        },
        {
          id: 'grammar-checker',
          name: 'Grammar Checker',
          description: 'AI-powered grammar and spell checking',
          icon: CheckCircle,
          premium: true,
          endpoint: '/api/text/grammar-check',
          options: ['language', 'style', 'suggestions', 'severity']
        },
        {
          id: 'text-summarizer',
          name: 'Text Summarizer',
          description: 'Generate concise summaries of long text content',
          icon: Brain,
          premium: true,
          endpoint: '/api/text/summarize',
          options: ['length', 'style', 'keyPoints', 'bullets']
        }
      ]
    },
    utility: {
      title: "Utility Tools",
      description: "Essential productivity and convenience tools",
      gradient: "from-yellow-600 via-orange-600 to-red-600",
      icon: Settings,
      tools: [
        {
          id: 'qr-generator',
          name: 'QR Code Generator',
          description: 'Generate customizable QR codes for text, URLs, and data',
          icon: QrCode,
          premium: false,
          endpoint: '/api/util/qr-generate',
          options: ['size', 'errorCorrection', 'color', 'logo', 'format']
        },
        {
          id: 'password-generator',
          name: 'Password Generator',
          description: 'Generate secure passwords with custom criteria',
          icon: Shield,
          premium: false,
          endpoint: '/api/util/password-generate',
          options: ['length', 'complexity', 'exclude', 'pronounceable']
        }
      ]
    }
  };

  // 3D Background Effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // File handling functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles && uploadedFiles.length > 0) {
      setFiles(uploadedFiles);
      toast({
        title: "Files uploaded successfully",
        description: `${uploadedFiles.length} file(s) ready for processing`,
      });
    }
  };

  const handleToolProcess = async () => {
    if (!selectedTool || !files || files.length === 0) {
      toast({
        title: "Error",
        description: "Please select files first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const tool = Object.values(toolCategories)
        .flatMap(category => category.tools)
        .find(t => t.id === selectedTool);

      if (!tool) return;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const response = await fetch(tool.endpoint, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        setResult(result);
        toast({
          title: "Processing completed",
          description: "Your files have been processed successfully",
        });
      } else {
        throw new Error('Processing failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Processing failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setSelectedTool(null);
    }
  };

  const currentTools = toolCategories[activeCategory as keyof typeof toolCategories]?.tools || [];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Professional Tools Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Complete suite of 90+ professional tools for PDF processing, image editing, 
            text conversion, and utility functions. All powered by cutting-edge technology.
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {Object.entries(toolCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={key}
                onClick={() => setActiveCategory(key)}
                variant={activeCategory === key ? "default" : "outline"}
                size="lg"
                className={`group relative overflow-hidden border-2 transition-all duration-300 ${
                  activeCategory === key
                    ? `bg-gradient-to-r ${category.gradient} border-transparent text-white shadow-2xl scale-105`
                    : 'border-gray-600 hover:border-gray-400 bg-gray-900/50 backdrop-blur-sm'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                <span className="font-semibold">{category.title}</span>
                <span className="ml-2 text-xs opacity-75">
                  {category.tools.length} tools
                </span>
              </Button>
            );
          })}
        </motion.div>

        {/* Category Description */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">
            {toolCategories[activeCategory as keyof typeof toolCategories]?.title}
          </h2>
          <p className="text-gray-400 text-lg">
            {toolCategories[activeCategory as keyof typeof toolCategories]?.description}
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          key={`${activeCategory}-grid`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {currentTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <Card className="h-full bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/20 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-cyan-400" />
                      </div>
                      {tool.premium && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold">
                          <Crown className="w-3 h-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                      {tool.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {tool.description}
                    </p>

                    <Button
                      onClick={() => setSelectedTool(tool.id)}
                      className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
                      disabled={tool.premium}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {tool.premium ? 'Upgrade to Pro' : 'Use Tool'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tool Modal */}
        <AnimatePresence>
          {selectedTool && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTool(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {currentTools.find(t => t.id === selectedTool)?.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTool(null)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <Label htmlFor="files" className="text-lg font-semibold mb-2 block">
                      Upload Files
                    </Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <Input
                        id="files"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Label htmlFor="files" className="cursor-pointer">
                        <span className="text-lg font-semibold text-cyan-400 hover:text-cyan-300">
                          Choose files
                        </span>
                        <span className="text-gray-400 ml-2">or drag and drop</span>
                      </Label>
                      {files && (
                        <p className="mt-2 text-sm text-gray-400">
                          {files.length} file(s) selected
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Processing...</span>
                        <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {/* Result */}
                  {result && (
                    <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span className="font-semibold text-green-400">Processing Complete</span>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-500">
                        <Download className="w-4 h-4 mr-2" />
                        Download Result
                      </Button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleToolProcess}
                      disabled={!files || isProcessing}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Process Files
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTool(null)}
                      className="border-gray-600"
                    >
                      Cancel
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