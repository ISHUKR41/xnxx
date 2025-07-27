import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, Trash2, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  file: File;
  id: string;
  preview: string;
}

export const MergePDFTool: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid Files",
        description: "Only PDF files are allowed",
        variant: "destructive"
      });
    }

    const newFiles: FileItem[] = pdfFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.name
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const moveFile = (id: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(file => file.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newFiles = [...prev];
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Insufficient Files",
        description: "Please select at least 2 PDF files to merge",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setDownloadLink(null);

    try {
      const formData = new FormData();
      files.forEach(fileItem => {
        formData.append('files', fileItem.file);
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/pdf-tools/merge', {
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
      console.error('Merge error:', error);
      toast({
        title: "Merge Failed",
        description: error instanceof Error ? error.message : "Failed to merge PDF files",
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
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your merged PDF is being downloaded"
      });
    }
  };

  const resetTool = () => {
    setFiles([]);
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
        <h2 className="text-3xl font-bold text-foreground">Merge PDF Files</h2>
        <p className="text-foreground-secondary">
          Combine multiple PDF files into a single document. Drag and drop or click to select files.
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
              <h3 className="text-lg font-semibold text-foreground mb-2">Select PDF Files</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                Choose multiple PDF files to merge them into one document
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                Choose PDF Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Selected Files ({files.length})
              </h3>
              <Button variant="outline" size="sm" onClick={resetTool}>
                Clear All
              </Button>
            </div>
            
            <div className="space-y-3">
              {files.map((fileItem, index) => (
                <div key={fileItem.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-foreground">
                      {index + 1}. {fileItem.preview}
                    </span>
                    <span className="text-xs text-foreground-secondary">
                      ({(fileItem.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFile(fileItem.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileItem.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Button */}
      {files.length >= 2 && (
        <div className="text-center">
          <Button
            onClick={handleMerge}
            disabled={isProcessing}
            size="lg"
            className="bg-gradient-primary hover:bg-gradient-primary/90 px-8 py-3"
          >
            {isProcessing ? 'Merging...' : `Merge ${files.length} PDF Files`}
          </Button>
        </div>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Merging PDF files...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download */}
      {downloadLink && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">PDF Merged Successfully!</h3>
              <p className="text-sm text-green-600 mb-4">
                Your PDF files have been merged into a single document.
              </p>
              <div className="space-x-4">
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Merged PDF
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Merge More Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Drag files up/down to change the merge order</li>
            <li>• Maximum file size: 50MB per file</li>
            <li>• Supported format: PDF only</li>
            <li>• Files are processed securely and deleted after download</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};