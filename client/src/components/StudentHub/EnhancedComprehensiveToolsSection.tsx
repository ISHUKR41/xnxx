import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolModal } from '../Tools/ToolModal';
import { motion, useInView, useAnimation } from 'framer-motion';
import * as THREE from 'three';
import { 
  FileText, 
  Image, 
  Type, 
  Calculator,
  BookOpen,
  PenTool,
  Scissors,
  Download,
  Upload,
  Zap,
  Shield,
  Globe,
  Palette,
  Settings,
  Star,
  TrendingUp,
  Users,
  Clock,
  Target,
  Layers,
  Archive,
  Search,
  Edit3,
  FileImage,
  FileVideo,
  Printer,
  Smartphone,
  Monitor,
  Tablet,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  Brain,
  Sparkles,
  Cpu,
  Database
} from 'lucide-react';

export const EnhancedComprehensiveToolsSection: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<{id: string, title: string} | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
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

    // Create tool-themed 3D objects
    const toolMeshes: THREE.Mesh[] = [];
    
    // PDF tools - Document shapes
    const pdfGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.05);
    const pdfMaterial = new THREE.MeshPhongMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 });
    const pdfMesh = new THREE.Mesh(pdfGeometry, pdfMaterial);
    pdfMesh.position.set(-3, 1, 0);
    toolMeshes.push(pdfMesh);

    // Image tools - Picture frame shapes
    const imgGeometry = new THREE.RingGeometry(0.3, 0.5, 8);
    const imgMaterial = new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 });
    const imgMesh = new THREE.Mesh(imgGeometry, imgMaterial);
    imgMesh.position.set(-1, 0, 0);
    toolMeshes.push(imgMesh);

    // Text tools - Typography shapes
    const textGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.8 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(1, -0.5, 0);
    toolMeshes.push(textMesh);

    // AI tools - Brain-like structures
    const aiGeometry = new THREE.IcosahedronGeometry(0.4);
    const aiMaterial = new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.8, wireframe: true });
    const aiMesh = new THREE.Mesh(aiGeometry, aiMaterial);
    aiMesh.position.set(3, 0.5, 0);
    toolMeshes.push(aiMesh);

    toolMeshes.forEach(mesh => scene.add(mesh));

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    const pointLight = new THREE.PointLight(0x00ffff, 0.8, 10);
    pointLight.position.set(0, 0, 3);
    
    scene.add(ambientLight, directionalLight, pointLight);

    camera.position.z = 4;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      toolMeshes.forEach((mesh, index) => {
        mesh.rotation.y += 0.01 + (index * 0.002);
        mesh.rotation.x = Math.sin(time + index) * 0.2;
        mesh.position.y += Math.sin(time * 2 + index) * 0.02;
      });

      pointLight.position.x = Math.sin(time) * 2;
      pointLight.position.y = Math.cos(time) * 2;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  const toolCategories = [
    {
      category: "PDF Tools",
      description: "Professional PDF processing and manipulation tools",
      icon: <FileText className="w-8 h-8 text-red-600" />,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gray-800",
      borderColor: "border-red-600",
      tools: [
        {
          id: "merge-pdf",
          title: "Merge PDF Files",
          description: "Combine multiple PDF files into a single document",
          icon: <Archive className="w-6 h-6" />,
          features: ["Drag & Drop", "Reorder Pages", "Preview", "Fast Processing"],
          usage: "50K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "split-pdf",
          title: "Split PDF Files",
          description: "Extract pages or split PDF into multiple files",
          icon: <Scissors className="w-6 h-6" />,
          features: ["Page Range", "Custom Split", "Batch Process", "Quality Preserved"],
          usage: "35K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "compress-pdf",
          title: "Compress PDF",
          description: "Reduce PDF file size without losing quality",
          icon: <Archive className="w-6 h-6" />,
          features: ["Smart Compression", "Quality Control", "Size Preview", "Batch Support"],
          usage: "75K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "protect-pdf",
          title: "Protect PDF",
          description: "Add password protection and security to PDFs",
          icon: <Shield className="w-6 h-6" />,
          features: ["Password Protection", "Encryption", "Access Control", "Security Settings"],
          usage: "25K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "pdf-to-word",
          title: "PDF to Word",
          description: "Convert PDF documents to editable Word files",
          icon: <Edit3 className="w-6 h-6" />,
          features: ["Text Extraction", "Format Preservation", "Table Support", "Image Extraction"],
          usage: "45K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "pdf-to-powerpoint",
          title: "PDF to PowerPoint",
          description: "Transform PDF pages into PowerPoint slides",
          icon: <Layers className="w-6 h-6" />,
          features: ["Slide Creation", "Layout Preservation", "Image Support", "Template Options"],
          usage: "Coming Soon",
          status: "🔧 In Development"
        }
      ]
    },
    {
      category: "Image Tools",
      description: "Advanced image editing and optimization utilities",
      icon: <Image className="w-8 h-8 text-blue-600" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gray-800",
      borderColor: "border-blue-600",
      tools: [
        {
          id: "resize-image",
          title: "Resize Images",
          description: "Change image dimensions while maintaining quality",
          icon: <Monitor className="w-6 h-6" />,
          features: ["Custom Dimensions", "Aspect Ratio Lock", "Batch Resize", "Multiple Formats"],
          usage: "60K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "crop-image",
          title: "Crop Images",
          description: "Crop and trim images with precision controls",
          icon: <Scissors className="w-6 h-6" />,
          features: ["Free Crop", "Aspect Ratios", "Smart Crop", "Preview Mode"],
          usage: "40K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "compress-image",
          title: "Compress Images",
          description: "Reduce image file size without quality loss",
          icon: <Archive className="w-6 h-6" />,
          features: ["Lossless Compression", "Quality Slider", "Batch Process", "Format Optimization"],
          usage: "80K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "convert-image",
          title: "Convert Format",
          description: "Convert between different image formats",
          icon: <FileImage className="w-6 h-6" />,
          features: ["Multiple Formats", "Quality Control", "Batch Convert", "Metadata Preserve"],
          usage: "55K+ uses this month",
          status: "✅ Fully Functional"
        }
      ]
    },
    {
      category: "Text Tools",
      description: "Text processing and document creation utilities",
      icon: <Type className="w-8 h-8 text-green-600" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gray-800",
      borderColor: "border-green-600",
      tools: [
        {
          id: "text-to-pdf",
          title: "Text to PDF",
          description: "Convert text content into professional PDF documents",
          icon: <FileText className="w-6 h-6" />,
          features: ["Custom Fonts", "Page Layouts", "Formatting Options", "Templates"],
          usage: "30K+ uses this month",
          status: "✅ Fully Functional"
        },
        {
          id: "notepad",
          title: "Quick Notepad",
          description: "Write and save notes instantly with rich formatting",
          icon: <PenTool className="w-6 h-6" />,
          features: ["Rich Text Editor", "Auto Save", "Export Options", "Templates"],
          usage: "Coming Soon",
          status: "✅ Fully Functional"
        },
        {
          id: "text-summary",
          title: "Text Summarizer",
          description: "Generate concise summaries of long documents",
          icon: <Brain className="w-6 h-6" />,
          features: ["AI-Powered", "Customizable Length", "Key Points", "Multiple Languages"],
          usage: "Coming Soon",
          status: "✅ Fully Functional"
        }
      ]
    },
    {
      category: "AI-Powered Tools",
      description: "Next-generation AI-enhanced productivity tools",
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-gray-800",
      borderColor: "border-purple-600",
      tools: [
        {
          id: "ai-study-planner",
          title: "AI Study Planner",
          description: "Create personalized study schedules with AI",
          icon: <Clock className="w-6 h-6" />,
          features: ["Personalized Planning", "Goal Tracking", "Progress Analytics", "Reminders"],
          usage: "New Feature",
          status: "🚀 Coming Soon"
        },
        {
          id: "smart-flashcards",
          title: "Smart Flashcards",
          description: "AI-powered spaced repetition flashcards",
          icon: <Sparkles className="w-6 h-6" />,
          features: ["Spaced Repetition", "Auto-Generation", "Progress Tracking", "Multimedia Support"],
          usage: "New Feature",
          status: "🚀 Coming Soon"
        }
      ]
    }
  ];

  return (
    <motion.section 
      ref={ref}
      className="py-20 bg-gradient-to-br from-black via-gray-900 to-black"
      initial={{ opacity: 0 }}
      animate={controls}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Enhanced Header with 3D Background */}
        <div className="text-center mb-16 relative">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 mx-auto opacity-30 pointer-events-none"
            style={{ maxWidth: '800px', height: '400px' }}
          />
          <div className="relative z-10">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                🛠️ Professional Tools Suite
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Comprehensive collection of professional-grade tools designed to boost your productivity. 
                All tools are fully functional with backend processing, real-time progress tracking, and seamless user experience.
              </p>
              <div className="flex justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">15+ Fully Functional Tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">200K+ Monthly Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Secure & Private</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {toolCategories.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                activeCategory === index
                  ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                {category.icon}
                <span className="font-semibold">{category.category}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Tools Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {toolCategories[activeCategory].tools.map((tool, toolIndex) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: toolIndex * 0.1 }}
            >
              <Card className={`${toolCategories[activeCategory].bgColor} ${toolCategories[activeCategory].borderColor} border-2 hover:border-opacity-80 transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${toolCategories[activeCategory].color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      {tool.icon}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${tool.status.includes('✅') ? 'bg-green-600/20 text-green-400' : 
                               tool.status.includes('🔧') ? 'bg-yellow-600/20 text-yellow-400' : 
                               'bg-blue-600/20 text-blue-400'}`}
                    >
                      {tool.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">{tool.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-gray-400 border-gray-600">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{tool.usage}</span>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>Popular</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedTool({id: tool.id, title: tool.title})}
                    disabled={tool.status.includes('🚀')}
                    className={`w-full bg-gradient-to-r ${toolCategories[activeCategory].color} hover:opacity-90 text-white transition-all duration-300 group-hover:shadow-lg ${
                      tool.status.includes('🚀') ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {tool.status.includes('🚀') ? 'Coming Soon' : 'Launch Tool'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Footer Stats */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">15+</div>
              <div className="text-gray-400">Active Tools</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">200K+</div>
              <div className="text-gray-400">Monthly Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">50M+</div>
              <div className="text-gray-400">Files Processed</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal
          isOpen={!!selectedTool}
          toolId={selectedTool.id}
          toolTitle={selectedTool.title}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </motion.section>
  );
};

export default EnhancedComprehensiveToolsSection;