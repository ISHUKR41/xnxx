import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolModal } from '../Tools/ToolModal';
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
  CheckCircle
} from 'lucide-react';

export const ComprehensiveToolsSection: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<{id: string, title: string} | null>(null);

  const toolCategories = [
    {
      category: "PDF Tools",
      description: "Professional PDF processing and manipulation tools",
      icon: <FileText className="w-8 h-8 text-red-600" />,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      tools: [
        {
          id: "merge-pdf",
          title: "Merge PDF Files",
          description: "Combine multiple PDF files into a single document",
          icon: <Archive className="w-6 h-6" />,
          features: ["Drag & Drop", "Reorder Pages", "Preview", "Fast Processing"],
          usage: "50K+ uses this month"
        },
        {
          id: "split-pdf",
          title: "Split PDF Files",
          description: "Extract pages or split PDF into multiple files",
          icon: <Scissors className="w-6 h-6" />,
          features: ["Page Range", "Custom Split", "Batch Process", "Quality Preserved"],
          usage: "35K+ uses this month"
        },
        {
          id: "compress-pdf",
          title: "Compress PDF",
          description: "Reduce PDF file size without losing quality",
          icon: <Archive className="w-6 h-6" />,
          features: ["Smart Compression", "Quality Control", "Size Preview", "Batch Support"],
          usage: "75K+ uses this month"
        },
        {
          id: "protect-pdf",
          title: "Protect PDF",
          description: "Add password protection and security to PDFs",
          icon: <Shield className="w-6 h-6" />,
          features: ["Password Protection", "Encryption", "Access Control", "Security Settings"],
          usage: "25K+ uses this month"
        },
        {
          id: "pdf-to-word",
          title: "PDF to Word",
          description: "Convert PDF documents to editable Word files",
          icon: <Edit3 className="w-6 h-6" />,
          features: ["Text Extraction", "Format Preservation", "Table Support", "Image Extraction"],
          usage: "45K+ uses this month"
        },
        {
          id: "pdf-to-powerpoint",
          title: "PDF to PowerPoint",
          description: "Transform PDF pages into PowerPoint slides",
          icon: <Layers className="w-6 h-6" />,
          features: ["Slide Creation", "Layout Preservation", "Image Support", "Template Options"],
          usage: "Coming Soon"
        }
      ]
    },
    {
      category: "Image Tools",
      description: "Advanced image editing and optimization utilities",
      icon: <Image className="w-8 h-8 text-blue-600" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      tools: [
        {
          id: "resize-image",
          title: "Resize Images",
          description: "Change image dimensions while maintaining quality",
          icon: <Monitor className="w-6 h-6" />,
          features: ["Custom Dimensions", "Aspect Ratio Lock", "Batch Resize", "Multiple Formats"],
          usage: "60K+ uses this month"
        },
        {
          id: "crop-image",
          title: "Crop Images",
          description: "Crop and trim images with precision controls",
          icon: <Scissors className="w-6 h-6" />,
          features: ["Free Crop", "Aspect Ratios", "Smart Crop", "Preview Mode"],
          usage: "40K+ uses this month"
        },
        {
          id: "compress-image",
          title: "Compress Images",
          description: "Reduce image file size without quality loss",
          icon: <Archive className="w-6 h-6" />,
          features: ["Lossless Compression", "Quality Slider", "Batch Process", "Format Optimization"],
          usage: "80K+ uses this month"
        },
        {
          id: "convert-image",
          title: "Convert Format",
          description: "Convert between different image formats",
          icon: <FileImage className="w-6 h-6" />,
          features: ["Multiple Formats", "Quality Control", "Batch Convert", "Metadata Preserve"],
          usage: "55K+ uses this month"
        }
      ]
    },
    {
      category: "Text Tools",
      description: "Text processing and document creation utilities",
      icon: <Type className="w-8 h-8 text-green-600" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      tools: [
        {
          id: "text-to-pdf",
          title: "Text to PDF",
          description: "Convert text content into professional PDF documents",
          icon: <FileText className="w-6 h-6" />,
          features: ["Custom Fonts", "Page Layouts", "Formatting Options", "Templates"],
          usage: "30K+ uses this month"
        },
        {
          id: "word-counter",
          title: "Word Counter",
          description: "Count words, characters, and analyze text statistics",
          icon: <Calculator className="w-6 h-6" />,
          features: ["Real-time Count", "Reading Time", "Keyword Density", "Export Stats"],
          usage: "Coming Soon"
        },
        {
          id: "text-formatter",
          title: "Text Formatter",
          description: "Format and style text with various options",
          icon: <Palette className="w-6 h-6" />,
          features: ["Case Conversion", "Line Spacing", "Alignment", "Special Characters"],
          usage: "Coming Soon"
        }
      ]
    },
    {
      category: "Study Tools",
      description: "Educational tools to enhance learning experience",
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      tools: [
        {
          id: "note-maker",
          title: "Note Maker",
          description: "Create and organize study notes efficiently",
          icon: <PenTool className="w-6 h-6" />,
          features: ["Rich Text Editor", "Templates", "Organization", "Export Options"],
          usage: "Coming Soon"
        },
        {
          id: "quiz-generator",
          title: "Quiz Generator",
          description: "Generate quizzes from your study materials",
          icon: <Target className="w-6 h-6" />,
          features: ["Auto Questions", "Multiple Choice", "Timer", "Progress Tracking"],
          usage: "Coming Soon"
        },
        {
          id: "study-planner", 
          title: "Study Planner",
          description: "Plan and track your study schedule",
          icon: <Clock className="w-6 h-6" />,
          features: ["Schedule Planning", "Reminders", "Progress Tracking", "Goal Setting"],
          usage: "Coming Soon"
        }
      ]
    }
  ];



  const openTool = (toolId: string, toolTitle: string) => {
    setSelectedTool({ id: toolId, title: toolTitle });
  };

  const closeTool = () => {
    setSelectedTool(null);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 text-sm font-semibold">
            Comprehensive Toolkit
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Professional Tools at Your Fingertips
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover our comprehensive collection of tools designed to streamline your workflow. 
            From PDF manipulation to image editing, we've got everything you need to be productive.
          </p>
        </div>

        {/* Tools Categories */}
        <div className="space-y-16">
          {toolCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="relative">
              {/* Category Header */}
              <div className="flex items-center mb-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg mr-6`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{category.category}</h3>
                  <p className="text-gray-600 text-lg">{category.description}</p>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => (
                  <Card 
                    key={toolIndex} 
                    className={`${category.bgColor} ${category.borderColor} border-2 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1`}
                    onClick={() => openTool(tool.id, tool.title)}
                  >
                    <CardContent className="p-6">
                      {/* Tool Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {tool.icon}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tool.usage}
                        </Badge>
                      </div>

                      {/* Tool Content */}
                      <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Features List */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-1">
                          {tool.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full group-hover:bg-primary/90 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTool(tool.id, tool.title);
                        }}
                      >
                        {tool.usage === "Coming Soon" ? (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Coming Soon
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Try Tool
                          </>
                        )}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Statistics */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Tools Usage This Month</h3>
            <p className="text-xl opacity-90">
              Join thousands of users who trust our professional tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500K+</div>
              <p className="opacity-90">Total Tool Uses</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="opacity-90">Daily Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <p className="opacity-90">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <p className="opacity-90">User Rating</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Our Tools?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "Lightning Fast",
                description: "Process files in seconds with optimized algorithms"
              },
              {
                icon: <Shield className="w-8 h-8 text-green-500" />,
                title: "Secure & Private",
                description: "Your files are processed securely and deleted automatically"
              },
              {
                icon: <Globe className="w-8 h-8 text-blue-500" />,
                title: "No Installation",
                description: "Use all tools directly in your browser, no downloads required"
              },
              {
                icon: <Star className="w-8 h-8 text-purple-500" />,
                title: "Professional Quality",
                description: "Enterprise-grade tools with professional results"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                    {benefit.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal
          isOpen={!!selectedTool}
          onClose={closeTool}
          toolId={selectedTool.id}
          toolTitle={selectedTool.title}
        />
      )}
    </section>
  );
};