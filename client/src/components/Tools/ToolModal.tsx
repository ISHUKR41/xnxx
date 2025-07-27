import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  X, Upload, Download, FileText, Image, Type, 
  Zap, CheckCircle, AlertCircle, Settings,
  Sparkles, ArrowRight, File, Camera
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

interface ToolModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, isOpen, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [options, setOptions] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!tool) return null;

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const fileArray = Array.from(selectedFiles);
    
    // Validate file types based on tool category
    const allowedTypes = getAllowedFileTypes(tool.category);
    const validFiles = fileArray.filter(file => 
      allowedTypes.some(type => file.type.includes(type) || file.name.toLowerCase().endsWith(type))
    );
    
    if (validFiles.length !== fileArray.length) {
      toast({
        title: "Invalid Files",
        description: `Some files were skipped. This tool accepts: ${allowedTypes.join(', ')}`,
        variant: "destructive"
      });
    }
    
    setFiles(tool.inputType === 'multiple' ? validFiles : validFiles.slice(0, 1));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getAllowedFileTypes = (category: string): string[] => {
    switch (category) {
      case 'PDF':
        return ['.pdf', 'application/pdf'];
      case 'Image':
        return ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', 'image/'];
      case 'Text':
        return ['.txt', '.doc', '.docx', 'text/', 'application/'];
      default:
        return ['*'];
    }
  };

  const processFiles = async () => {
    if (tool.inputType === 'text' && !textInput.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter some text to process",
        variant: "destructive"
      });
      return;
    }

    if (tool.inputType !== 'text' && files.length === 0) {
      toast({
        title: "Files Required",
        description: "Please select files to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      let response: Response;

      if (tool.inputType === 'text') {
        // Handle text-based tools
        response = await fetch(tool.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textInput,
            ...options
          })
        });
      } else {
        // Handle file-based tools
        const formData = new FormData();
        
        if (tool.inputType === 'multiple') {
          files.forEach(file => formData.append('files', file));
        } else {
          formData.append('file', files[0]);
        }
        
        // Add options to form data
        Object.entries(options).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        response = await fetch(tool.endpoint, {
          method: 'POST',
          body: formData
        });

        clearInterval(progressInterval);
      }

      setProgress(100);

      if (response.ok) {
        if (tool.inputType === 'text') {
          // Handle JSON response for text tools
          const result = await response.json();
          handleTextResult(result);
        } else {
          // Handle file download
          const blob = await response.blob();
          downloadFile(blob, `processed-${tool.id}-${Date.now()}`);
        }

        toast({
          title: "Success!",
          description: `${tool.title} completed successfully`,
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Tool processing error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleTextResult = (result: any) => {
    // Create a modal or new section to display text results
    const resultWindow = window.open('', '_blank');
    if (resultWindow) {
      resultWindow.document.write(`
        <html>
          <head>
            <title>${tool.title} - Result</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; background: #000; color: #fff; }
              .container { max-width: 800px; margin: 0 auto; }
              .result { background: #111; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; }
              .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0; }
              .stat { background: #222; padding: 1rem; border-radius: 6px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${tool.title} Results</h1>
              <div class="result">
                <pre>${JSON.stringify(result, null, 2)}</pre>
              </div>
              <button onclick="window.close()" style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
          </body>
        </html>
      `);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const renderOptions = () => {
    switch (tool.id) {
      case 'image-resize':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width</Label>
              <Input
                type="number"
                placeholder="800"
                value={options.width || ''}
                onChange={(e) => setOptions(prev => ({ ...prev, width: e.target.value }))}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                type="number"
                placeholder="600"
                value={options.height || ''}
                onChange={(e) => setOptions(prev => ({ ...prev, height: e.target.value }))}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.maintainAspectRatio || false}
                  onChange={(e) => setOptions(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
                />
                <span>Maintain aspect ratio</span>
              </label>
            </div>
          </div>
        );
      
      case 'image-compress':
        return (
          <div>
            <Label>Quality (1-100)</Label>
            <Input
              type="number"
              min="1"
              max="100"
              placeholder="80"
              value={options.quality || ''}
              onChange={(e) => setOptions(prev => ({ ...prev, quality: e.target.value }))}
              className="bg-gray-800 border-gray-600"
            />
          </div>
        );
      
      case 'text-to-pdf':
        return (
          <div className="space-y-4">
            <div>
              <Label>Document Title</Label>
              <Input
                placeholder="My Document"
                value={options.title || ''}
                onChange={(e) => setOptions(prev => ({ ...prev, title: e.target.value }))}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Font Size</Label>
                <Input
                  type="number"
                  placeholder="12"
                  value={options.fontSize || ''}
                  onChange={(e) => setOptions(prev => ({ ...prev, fontSize: e.target.value }))}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <Label>Font Family</Label>
                <select
                  value={options.fontFamily || 'Times-Roman'}
                  onChange={(e) => setOptions(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                >
                  <option value="Times-Roman">Times Roman</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Courier">Courier</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gray-800/50 ${tool.color}`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">{tool.title}</CardTitle>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-gray-800/50 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Section */}
              {tool.inputType === 'text' ? (
                <div>
                  <Label className="text-white mb-2 block">Enter Text</Label>
                  <textarea
                    placeholder="Enter your text here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-white mb-2 block">
                    {tool.inputType === 'multiple' ? 'Select Files' : 'Select File'}
                  </Label>
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple={tool.inputType === 'multiple'}
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                      accept={getAcceptString(tool.category)}
                    />
                    
                    {files.length === 0 ? (
                      <div className="space-y-3">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-white font-medium">
                            Drop files here or click to browse
                          </p>
                          <p className="text-gray-400 text-sm">
                            Supports: {getAllowedFileTypes(tool.category).join(', ')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <File className="w-5 h-5 text-blue-400" />
                              <span className="text-white">{file.name}</span>
                              <span className="text-gray-400 text-sm">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFiles(files.filter((_, i) => i !== index));
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Options */}
              {renderOptions() && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Options</h3>
                  {renderOptions()}
                </div>
              )}

              {/* Processing */}
              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
                    <span className="text-white">Processing...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-400">{progress}% Complete</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={processFiles}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : `Process with ${tool.title}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getAcceptString = (category: string): string => {
  switch (category) {
    case 'PDF':
      return '.pdf';
    case 'Image':
      return '.jpg,.jpeg,.png,.webp,.bmp,.tiff';
    case 'Text':
      return '.txt,.doc,.docx';
    default:
      return '*';
  }
};