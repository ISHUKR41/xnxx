import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image, Download, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  file: File;
  id: string;
  preview: string;
}

const ConvertImageTool: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [outputFormat, setOutputFormat] = useState('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLinks, setDownloadLinks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
    { value: 'bmp', label: 'BMP' },
    { value: 'tiff', label: 'TIFF' }
  ];

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid Files",
        description: "Only image files are allowed",
        variant: "destructive"
      });
    }

    const newFiles: FileItem[] = imageFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file)
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [toast]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(file => file.id !== id);
    });
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one image file to convert",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setDownloadLinks([]);

    try {
      const convertedLinks: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i].file);
        formData.append('format', outputFormat);

        const response = await fetch('/api/image-tools/convert', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Conversion failed');
        }

        const data = await response.json();
        convertedLinks.push(data.downloadUrl);
        
        setProgress(((i + 1) / files.length) * 100);
      }

      setDownloadLinks(convertedLinks);
      toast({
        title: "Conversion Complete! ✅",
        description: `${files.length} image(s) converted to ${outputFormat.toUpperCase()} successfully`,
      });

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert images",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    downloadLinks.forEach((link, index) => {
      const a = document.createElement('a');
      a.href = link;
      a.download = `converted_${index + 1}.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== droppedFiles.length) {
      toast({
        title: "Invalid Files",
        description: "Only image files are allowed",
        variant: "destructive"
      });
    }

    const newFiles: FileItem[] = imageFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file)
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="glassmorphism hover-lift">
        <CardContent className="p-6">
          <div 
            className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/60 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Images to Convert</h3>
            <p className="text-foreground-secondary mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <p className="text-sm text-foreground-secondary">
              Supports PNG, JPG, WebP, BMP, TIFF formats
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Format Selection */}
      {files.length > 0 && (
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <RefreshCw className="w-5 h-5 text-primary" />
              <label className="text-sm font-medium">Convert to:</label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Selected Images ({files.length})</h3>
              <Button
                onClick={() => setFiles([])}
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {files.map(file => (
                <div key={file.id} className="relative group">
                  <div className="bg-background-secondary rounded-lg p-3 hover:bg-background-tertiary transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={file.preview} 
                        alt={file.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <p className="text-xs text-foreground-secondary">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        onClick={() => removeFile(file.id)}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full btn-hero"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Converting Images...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert to {outputFormat.toUpperCase()}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Converting images...</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download */}
      {downloadLinks.length > 0 && (
        <Card className="glassmorphism border-success/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-success">Conversion Complete!</h3>
              <p className="text-foreground-secondary">
                {downloadLinks.length} image(s) converted successfully to {outputFormat.toUpperCase()}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={downloadAll} className="btn-hero">
                  <Download className="w-4 h-4 mr-2" />
                  Download All ({downloadLinks.length})
                </Button>
                <Button 
                  onClick={() => {
                    setFiles([]);
                    setDownloadLinks([]);
                    setProgress(0);
                  }}
                  variant="outline"
                >
                  Convert More Images
                </Button>
              </div>
              
              <div className="text-xs text-foreground-secondary mt-4">
                Files will be automatically deleted after 1 hour for security
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConvertImageTool;