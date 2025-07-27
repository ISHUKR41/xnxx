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
      bgColor: "bg-gray-800",
      borderColor: "border-red-600",
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
      bgColor: "bg-gray-800",
      borderColor: "border-blue-600",
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
      bgColor: "bg-gray-800",
      borderColor: "border-green-600",
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
      bgColor: "bg-gray-800",
      borderColor: "border-purple-600",
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
    <section className="py-20 bg-black text-white relative overflow-hidden" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      {/* Enhanced 3D Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-500/25 to-red-500/25 rounded-full blur-lg animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header with 3D Effects */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 text-white px-8 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
              Comprehensive Professional Toolkit
              <span className="w-2 h-2 bg-white rounded-full ml-2 animate-ping"></span>
            </span>
          </Badge>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent leading-tight">
            <span className="block transform hover:scale-105 transition-transform duration-300">
              Professional Tools
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mt-2">
              at Your Fingertips
            </span>
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <p className="text-2xl text-gray-200 leading-relaxed mb-6">
              Discover our comprehensive collection of <span className="text-blue-400 font-semibold">professional-grade tools</span> designed to 
              streamline your workflow and boost productivity.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              From <span className="text-green-400 font-semibold">advanced PDF manipulation</span> to 
              <span className="text-purple-400 font-semibold"> intelligent image editing</span>, 
              we've got everything you need for <span className="text-yellow-400 font-semibold">maximum efficiency</span>.
            </p>
            
            {/* Real-time Statistics */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">2M+</div>
                <div className="text-sm text-gray-400">Files Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">500K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50+</div>
                <div className="text-sm text-gray-400">Professional Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Categories */}
        <div className="space-y-16">
          {toolCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="relative">
              {/* Enhanced Category Header with 3D Effects */}
              <div className="flex items-center mb-10 group">
                <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-2xl mr-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    {category.category}
                  </h3>
                  <p className="text-gray-300 text-xl leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                    {category.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Fully Functional
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      <Zap className="w-3 h-3 mr-1" />
                      Lightning Fast
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Enhanced Tools Grid with Dark Theme */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.tools.map((tool, toolIndex) => (
                  <Card 
                    key={toolIndex} 
                    className="group cursor-pointer bg-gray-900/50 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/70 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 h-full backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2"
                    onClick={() => openTool(tool.id, tool.title)}
                    style={{ 
                      background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
                      borderColor: 'rgba(55, 65, 81, 0.8)'
                    }}
                  >
                    <CardContent className="p-8 h-full flex flex-col relative overflow-hidden">
                      {/* Animated Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Tool Header */}
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="text-blue-400 group-hover:text-blue-300 transition-all duration-300 transform group-hover:scale-110">
                          {tool.icon}
                        </div>
                        <div className="flex space-x-2">
                          {tool.usage !== "Coming Soon" && (
                            <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 transition-colors">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                            <Shield className="w-3 h-3 mr-1" />
                            Secure
                          </Badge>
                        </div>
                      </div>

                      {/* Tool Info */}
                      <div className="flex-1 mb-6 relative z-10">
                        <h4 className="font-black text-xl mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">
                          {tool.title}
                        </h4>
                        <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {tool.description}
                        </p>

                        {/* Enhanced Features */}
                        <div className="grid grid-cols-1 gap-3 mb-6">
                          {tool.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                              <div className="w-5 h-5 mr-3 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              </div>
                              <span className="font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Enhanced Usage Stats */}
                        <div className="grid grid-cols-1 gap-3 mb-6">
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <span className="flex items-center text-gray-300">
                              <Users className="w-4 h-4 mr-2 text-blue-400" />
                              {tool.usage}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <span className="flex items-center text-gray-300">
                              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                              Lightning Fast Processing
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Button */}
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl relative z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTool(tool.id, tool.title);
                        }}
                      >
                        <div className="flex items-center justify-center">
                          {tool.usage === "Coming Soon" ? (
                            <>
                              <Clock className="w-5 h-5 mr-2" />
                              Coming Soon
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-5 h-5 mr-2" />
                              Try Tool Now
                            </>
                          )}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Usage Statistics with Dark Theme */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-12 text-white border border-gray-700/50 relative overflow-hidden">
          {/* Background animations */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="text-center mb-12 relative z-10">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 font-bold">
              <TrendingUp className="w-4 h-4 mr-2" />
              Live Statistics
            </Badge>
            <h3 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Tools Usage This Month
            </h3>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Join <span className="text-blue-400 font-bold">millions of professionals</span> who trust our 
              <span className="text-purple-400 font-bold"> enterprise-grade tools</span> for their daily workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            <div className="text-center group">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  2M+
                </div>
                <p className="text-gray-300 font-semibold text-lg">Files Processed</p>
                <p className="text-gray-500 text-sm mt-1">This month alone</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  500K+
                </div>
                <p className="text-gray-300 font-semibold text-lg">Active Users</p>
                <p className="text-gray-500 text-sm mt-1">Daily active users</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <p className="text-gray-300 font-semibold text-lg">Success Rate</p>
                <p className="text-gray-500 text-sm mt-1">Guaranteed uptime</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:bg-gray-800/70">
                <div className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  4.9/5
                </div>
                <p className="text-gray-300 font-semibold text-lg">User Rating</p>
                <p className="text-gray-500 text-sm mt-1">Average satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Benefits Section with Dark Theme */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-2 font-bold">
              <Star className="w-4 h-4 mr-2" />
              Premium Features
            </Badge>
            <h3 className="text-4xl md:text-5xl font-black text-center mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
              Why Choose Our Professional Tools?
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Experience the difference with our enterprise-grade tools designed for maximum efficiency and reliability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10 text-yellow-400" />,
                title: "Lightning Fast",
                description: "Process files in seconds with AI-optimized algorithms and cloud infrastructure",
                color: "from-yellow-500/20 to-orange-500/20",
                borderColor: "border-yellow-500/30",
                glowColor: "yellow-500/20"
              },
              {
                icon: <Shield className="w-10 h-10 text-green-400" />,
                title: "Bank-Level Security",
                description: "Military-grade encryption with automatic file deletion and zero data retention",
                color: "from-green-500/20 to-emerald-500/20",
                borderColor: "border-green-500/30",
                glowColor: "green-500/20"
              },
              {
                icon: <Globe className="w-10 h-10 text-blue-400" />,
                title: "Zero Installation",
                description: "Access all tools instantly through your browser with no downloads or setup required",
                color: "from-blue-500/20 to-cyan-500/20",
                borderColor: "border-blue-500/30",
                glowColor: "blue-500/20"
              },
              {
                icon: <Star className="w-10 h-10 text-purple-400" />,
                title: "Enterprise Quality",
                description: "Professional-grade tools trusted by Fortune 500 companies worldwide",
                color: "from-purple-500/20 to-pink-500/20",
                borderColor: "border-purple-500/30",
                glowColor: "purple-500/20"
              }
            ].map((benefit, index) => (
              <Card 
                key={index} 
                className={`text-center bg-gray-900/50 border-gray-700 hover:${benefit.borderColor} transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:-translate-y-2 backdrop-blur-sm`}
                style={{ 
                  background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))',
                  borderColor: 'rgba(55, 65, 81, 0.8)'
                }}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  {/* Background glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border ${benefit.borderColor}`}>
                      <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                    </div>
                    <h4 className="font-black text-xl mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal
          tool={{
            id: selectedTool.id,
            title: selectedTool.title,
            description: `Professional ${selectedTool.title.toLowerCase()} tool`,
            category: 'Tools',
            icon: null,
            color: 'blue',
            premium: false,
            popular: false,
            new: false,
            endpoint: `/api/tools/${selectedTool.id}`,
            inputType: 'file',
            features: ['Fast Processing', 'High Quality', 'Secure']
          }}
          isOpen={!!selectedTool}
          onClose={closeTool}
        />
      )}
    </section>
  );
};