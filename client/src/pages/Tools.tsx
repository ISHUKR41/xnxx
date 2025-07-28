import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Image, Type, Settings, Star, Search, Filter,
  Upload, Download, Zap, Shield, Palette, Hash, QrCode,
  RotateCw, Scissors, Maximize, Archive, Eye, Wand2
} from 'lucide-react';

// Comprehensive Tools Data Structure
const toolsData = {
  pdf: {
    title: "PDF Tools",
    description: "Professional PDF processing with 35+ advanced tools",
    icon: FileText,
    gradient: "from-red-500 via-orange-500 to-pink-500",
    count: 35,
    tools: [
      // PDF Core Operations
      { id: 'pdf-merge', name: 'Merge PDF', description: 'Combine multiple PDF files into one document', endpoint: '/api/tools/pdf/merge', icon: FileText, category: 'core' },
      { id: 'pdf-split', name: 'Split PDF', description: 'Split PDF into separate pages or custom ranges', endpoint: '/api/tools/pdf/split', icon: Scissors, category: 'core' },
      { id: 'pdf-compress', name: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality', endpoint: '/api/tools/pdf/compress', icon: Archive, category: 'core' },
      { id: 'pdf-rotate', name: 'Rotate PDF', description: 'Rotate PDF pages to correct orientation', endpoint: '/api/tools/pdf/rotate', icon: RotateCw, category: 'core' },
      { id: 'pdf-protect', name: 'Protect PDF', description: 'Add password protection and permissions', endpoint: '/api/tools/pdf/protect', icon: Shield, category: 'security' },
      { id: 'pdf-unlock', name: 'Unlock PDF', description: 'Remove password protection from PDF', endpoint: '/api/tools/pdf/unlock', icon: Shield, category: 'security' },
      
      // PDF Conversion
      { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to high-quality JPG images', endpoint: '/api/tools/pdf/to-jpg', icon: Image, category: 'conversion' },
      { id: 'pdf-to-png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG images', endpoint: '/api/tools/pdf/to-png', icon: Image, category: 'conversion' },
      { id: 'images-to-pdf', name: 'Images to PDF', description: 'Create PDF from multiple images', endpoint: '/api/tools/pdf/from-images', icon: FileText, category: 'conversion' },
      { id: 'office-to-pdf', name: 'Office to PDF', description: 'Convert Word, Excel, PowerPoint to PDF', endpoint: '/api/tools/pdf/from-office', icon: FileText, category: 'conversion' },
      
      // PDF Enhancement
      { id: 'pdf-watermark', name: 'Add Watermark', description: 'Add text or image watermark to PDF', endpoint: '/api/tools/pdf/watermark', icon: Eye, category: 'enhancement' },
      { id: 'pdf-page-numbers', name: 'Page Numbers', description: 'Add page numbers to PDF documents', endpoint: '/api/tools/pdf/page-numbers', icon: Hash, category: 'enhancement' },
      { id: 'pdf-ocr', name: 'PDF OCR', description: 'Extract text from scanned PDFs', endpoint: '/api/tools/pdf/ocr', icon: Type, category: 'enhancement' }
    ]
  },
  
  image: {
    title: "Image Tools", 
    description: "Advanced image editing and optimization with 25+ tools",
    icon: Image,
    gradient: "from-blue-500 via-purple-500 to-indigo-500", 
    count: 25,
    tools: [
      // Image Basic Operations
      { id: 'image-resize', name: 'Resize Image', description: 'Change image dimensions with quality preservation', endpoint: '/api/tools/image/resize', icon: Maximize, category: 'basic' },
      { id: 'image-crop', name: 'Crop Image', description: 'Cut specific area from image', endpoint: '/api/tools/image/crop', icon: Scissors, category: 'basic' },
      { id: 'image-compress', name: 'Compress Image', description: 'Reduce image file size optimally', endpoint: '/api/tools/image/compress', icon: Archive, category: 'optimization' },
      { id: 'image-convert', name: 'Convert Format', description: 'Convert between JPG, PNG, WebP, HEIC formats', endpoint: '/api/tools/image/convert', icon: RotateCw, category: 'conversion' },
      { id: 'image-rotate', name: 'Rotate Image', description: 'Rotate image by any angle', endpoint: '/api/tools/image/rotate', icon: RotateCw, category: 'basic' },
      { id: 'image-flip', name: 'Flip Image', description: 'Flip image horizontally or vertically', endpoint: '/api/tools/image/flip', icon: RotateCw, category: 'basic' },
      
      // Image Enhancement
      { id: 'image-enhance', name: 'Enhance Image', description: 'Auto-enhance brightness, contrast, saturation', endpoint: '/api/tools/image/enhance', icon: Wand2, category: 'enhancement' },
      { id: 'remove-background', name: 'Remove Background', description: 'AI-powered background removal', endpoint: '/api/tools/image/remove-background', icon: Eye, category: 'enhancement' },
      { id: 'upscale-image', name: 'Upscale Image', description: 'Increase image resolution with AI', endpoint: '/api/tools/image/upscale', icon: Maximize, category: 'enhancement' },
      { id: 'image-watermark', name: 'Add Watermark', description: 'Add text or image watermark', endpoint: '/api/tools/image/watermark-text', icon: Eye, category: 'enhancement' }
    ]
  },
  
  text: {
    title: "Text Tools",
    description: "Comprehensive text processing and analysis tools",
    icon: Type,
    gradient: "from-green-500 via-teal-500 to-cyan-500",
    count: 15,
    tools: [
      { id: 'text-to-pdf', name: 'Text to PDF', description: 'Convert plain text to formatted PDF', endpoint: '/api/tools/text/to-pdf', icon: FileText, category: 'conversion' },
      { id: 'extract-text', name: 'Extract Text', description: 'Extract text from PDF documents', endpoint: '/api/tools/text/extract-from-pdf', icon: Type, category: 'extraction' }
    ]
  },
  
  utility: {
    title: "Utility Tools",
    description: "Essential productivity and development utilities", 
    icon: Settings,
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    count: 20,
    tools: [
      { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate customizable QR codes', endpoint: '/api/tools/utility/qr-code', icon: QrCode, category: 'generator' },
      { id: 'password-generator', name: 'Password Generator', description: 'Generate strong, secure passwords', endpoint: '/api/tools/utility/password', icon: Shield, category: 'generator' },
      { id: 'hash-text', name: 'Hash Generator', description: 'Generate MD5, SHA256, SHA512 hashes', endpoint: '/api/tools/utility/hash', icon: Hash, category: 'crypto' },
      { id: 'base64-encode', name: 'Base64 Encode', description: 'Encode text to Base64 format', endpoint: '/api/tools/utility/base64-encode', icon: Type, category: 'encoding' },
      { id: 'base64-decode', name: 'Base64 Decode', description: 'Decode Base64 to plain text', endpoint: '/api/tools/utility/base64-decode', icon: Type, category: 'encoding' }
    ]
  }
};

// Tool Modal Component
const ToolModal = ({ tool, isOpen, onClose }: { tool: any, isOpen: boolean, onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;
    
    setProcessing(true);
    const formData = new FormData();
    
    // Handle different tool types
    if (tool.id.includes('merge') || tool.id.includes('images-to-pdf')) {
      formData.append('files', file);
    } else {
      formData.append('file', file);
    }

    try {
      const response = await fetch(tool.endpoint, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          setResult(data);
        } else {
          // Handle file download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `processed_${file.name}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          setResult({ success: true, message: 'File processed and downloaded!' });
        }
      } else {
        const error = await response.json();
        setResult({ success: false, error: error.error || 'Processing failed' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Network error occurred' });
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{tool.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <p className="text-gray-300 mb-6">{tool.description}</p>

        {!result && (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">
                {file ? file.name : 'Drag & drop your file here'}
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept={tool.id.includes('pdf') ? '.pdf' : tool.id.includes('image') ? 'image/*' : '*'}
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Choose File
              </label>
            </div>

            {file && (
              <button
                onClick={processFile}
                disabled={processing}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Process File
                  </>
                )}
              </button>
            )}
          </>
        )}

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
            <p className={`${result.success ? 'text-green-300' : 'text-red-300'}`}>
              {result.success ? result.message || 'Processing completed!' : result.error}
            </p>
            {result.success && (
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Process Another File
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Main Tools Page Component
export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['all', 'pdf', 'image', 'text', 'utility'];
  
  const filteredTools = Object.entries(toolsData).filter(([key, category]) => {
    if (selectedCategory !== 'all' && key !== selectedCategory) return false;
    if (searchTerm) {
      return category.tools.some(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const openTool = (tool: any) => {
    setSelectedTool(tool);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Revolutionary Tools Suite
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            95+ Professional tools for PDF, Image, Text & Utility processing with cutting-edge AI technology
          </motion.p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            {Object.entries(toolsData).map(([key, category]) => (
              <motion.div 
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-400">{category.count}+</div>
                <div className="text-gray-400">{category.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-12">
          {filteredTools.map(([key, category]) => (
            <motion.section 
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-2xl bg-gradient-to-r ${category.gradient} bg-opacity-10`}>
                <div className="flex items-center gap-4 mb-4">
                  <category.icon className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                    <p className="text-gray-300">{category.description}</p>
                  </div>
                  <div className="ml-auto bg-blue-500/20 px-3 py-1 rounded-full">
                    <span className="text-blue-300 font-semibold">{category.count}+ Tools</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {category.tools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all"
                      onClick={() => openTool(tool)}
                    >
                      <div className="flex items-start gap-3">
                        <tool.icon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white mb-1">{tool.name}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                              {tool.category}
                            </span>
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-gray-400">4.8</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* Tool Modal */}
      <ToolModal 
        tool={selectedTool}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}