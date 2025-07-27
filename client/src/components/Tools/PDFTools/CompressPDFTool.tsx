import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, Zap, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompressionResult {
  downloadUrl: string;
  originalSize: string;
  compressedSize: string;
  compressionRatio: number;
}

export const CompressPDFTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResult(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleCompress = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to compress",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 12, 90));
      }, 250);

      const response = await fetch('/api/pdf-tools/compress', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (response.ok) {
        setResult({
          downloadUrl: data.downloadUrl,
          originalSize: data.originalSize,
          compressedSize: data.compressedSize,
          compressionRatio: Math.abs(data.compressionRatio || 0)
        });
        toast({
          title: "Success!",
          description: data.message
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Compress error:', error);
      toast({
        title: "Compression Failed",
        description: error instanceof Error ? error.message : "Failed to compress PDF file",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (result?.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = 'compressed.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your compressed PDF is being downloaded"
      });
    }
  };

  const resetTool = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCompressionQuality = (ratio: number) => {
    if (ratio >= 30) return { text: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (ratio >= 20) return { text: "Very Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (ratio >= 10) return { text: "Good", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (ratio > 0) return { text: "Minimal", color: "text-orange-600", bg: "bg-orange-100" };
    return { text: "None", color: "text-gray-600", bg: "bg-gray-100" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Compress PDF File</h2>
        <p className="text-foreground-secondary">
          Reduce PDF file size while maintaining quality. Perfect for email attachments and web uploads.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Select PDF File</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                Choose a PDF file to compress and reduce its file size
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                Choose PDF File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected File */}
      {file && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{file.name}</h3>
                  <p className="text-sm text-foreground-secondary">
                    Original Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCompress}
                disabled={isProcessing}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isProcessing ? 'Compressing...' : 'Compress PDF'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressing PDF file...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-foreground-secondary text-center">
                Optimizing images, removing metadata, and reducing file size...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compression Results */}
      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-green-800">
                PDF Compressed Successfully!
              </h3>

              {/* Compression Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-gray-700">{result.originalSize}</div>
                  <div className="text-sm text-gray-500">Original Size</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">{result.compressedSize}</div>
                  <div className="text-sm text-gray-500">Compressed Size</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">{result.compressionRatio}%</div>
                  <div className="text-sm text-gray-500">Size Reduction</div>
                </div>
              </div>

              {/* Compression Quality Indicator */}
              <div className="flex justify-center">
                {(() => {
                  const quality = getCompressionQuality(result.compressionRatio);
                  return (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full ${quality.bg}`}>
                      <BarChart3 className={`w-4 h-4 mr-2 ${quality.color}`} />
                      <span className={`text-sm font-medium ${quality.color}`}>
                        {quality.text} Compression
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="space-x-4">
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Compressed PDF
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Compress Another PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compression Benefits */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">⚡ Compression Benefits:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Faster Uploads:</strong> Reduced file size means quicker uploads to email, cloud storage</li>
            <li>• <strong>Email Friendly:</strong> Most email providers have size limits (25MB typically)</li>
            <li>• <strong>Storage Savings:</strong> Use less space on your device and cloud storage</li>
            <li>• <strong>Quality Maintained:</strong> Smart compression preserves readability</li>
            <li>• <strong>Web Optimized:</strong> Faster loading times for web documents</li>
          </ul>
        </CardContent>
      </Card>

      {/* Compression Methods */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-purple-800 mb-2">🔧 Our Compression Techniques:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• <strong>Image Optimization:</strong> Compress images without visible quality loss</li>
            <li>• <strong>Metadata Removal:</strong> Remove unnecessary metadata and hidden data</li>
            <li>• <strong>Font Optimization:</strong> Optimize embedded fonts and remove unused ones</li>
            <li>• <strong>Structure Optimization:</strong> Improve PDF internal structure</li>
            <li>• <strong>Duplicate Removal:</strong> Remove duplicate objects and resources</li>
          </ul>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Files with many images typically compress better</li>
            <li>• Scanned documents may have limited compression potential</li>
            <li>• Already optimized PDFs may show minimal compression</li>
            <li>• Large files (&gt;10MB) often achieve better compression ratios</li>
            <li>• Text-heavy documents compress less than image-heavy ones</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};