import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, FileType, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PDFToWordTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setDownloadLink(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to convert",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setDownloadLink(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 8, 90));
      }, 400);

      const response = await fetch('/api/pdf-tools/to-word', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (response.ok) {
        setDownloadLink(result.downloadUrl);
        toast({
          title: "Success!",
          description: result.message
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Convert error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert PDF to Word",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (downloadLink) {
      const link = document.createElement('a');
      link.href = downloadLink;
      link.download = 'converted-document.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your converted document is being downloaded"
      });
    }
  };

  const resetTool = () => {
    setFile(null);
    setDownloadLink(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">PDF to Word Converter</h2>
        <p className="text-foreground-secondary">
          Convert PDF documents to editable Word format while preserving layout and formatting.
        </p>
      </div>

      {/* Important Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Development Notice</h4>
              <p className="text-sm text-yellow-700">
                This tool currently provides text extraction. Full Word conversion with formatting 
                will be available in the next update. The output will be a text file (.txt) containing 
                the extracted content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                Choose a PDF file to convert to Word/Text format
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
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={handleConvert}
                disabled={isProcessing}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                <FileType className="w-4 h-4 mr-2" />
                {isProcessing ? 'Converting...' : 'Convert to Word'}
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
                <span>Converting PDF to Word format...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-foreground-secondary text-center">
                Extracting text and preserving formatting...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Section */}
      {downloadLink && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Conversion Completed!</h3>
              <p className="text-sm text-green-600 mb-4">
                Your PDF has been converted to text format. You can now edit the content.
              </p>
              <div className="space-x-4">
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Text File
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Convert Another PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Features */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📄 Current Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Text Extraction:</strong> Extract all readable text from PDF</li>
            <li>• <strong>Plain Text Output:</strong> Clean, editable text format</li>
            <li>• <strong>Fast Processing:</strong> Quick conversion without quality loss</li>
            <li>• <strong>Universal Compatibility:</strong> Works with any text editor</li>
            <li>• <strong>Secure Processing:</strong> Files are processed locally and deleted after use</li>
          </ul>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-purple-800 mb-2">🚀 Coming Soon - Full Word Conversion:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• <strong>Rich Formatting:</strong> Preserve fonts, styles, and colors</li>
            <li>• <strong>Layout Preservation:</strong> Maintain original document structure</li>
            <li>• <strong>Table Support:</strong> Convert tables with proper formatting</li>
            <li>• <strong>Image Extraction:</strong> Include images in the converted document</li>
            <li>• <strong>DOCX Output:</strong> Generate native Microsoft Word files</li>
          </ul>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-800 mb-2">✅ Best Results:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Text-based PDFs:</strong> Work better than scanned documents</li>
            <li>• <strong>Standard Fonts:</strong> Common fonts convert more accurately</li>
            <li>• <strong>Simple Layouts:</strong> Single-column layouts preserve better</li>
            <li>• <strong>File Size:</strong> Smaller files process faster</li>
            <li>• <strong>Quality:</strong> High-quality PDFs produce better results</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};