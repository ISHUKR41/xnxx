import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, Scissors, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SplitResult {
  page: number;
  downloadUrl: string;
}

export const SplitPDFTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitResults, setSplitResults] = useState<SplitResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setSplitResults([]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleSplit = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to split",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setSplitResults([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const response = await fetch('/api/pdf-tools/split', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (response.ok) {
        setSplitResults(result.files);
        toast({
          title: "Success!",
          description: result.message
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Split error:', error);
      toast({
        title: "Split Failed",
        description: error instanceof Error ? error.message : "Failed to split PDF file",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (downloadUrl: string, page: number) => {
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `page_${page}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `Page ${page} is being downloaded`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the file",
        variant: "destructive"
      });
    }
  };

  const downloadAll = async () => {
    for (const result of splitResults) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
      await handleDownload(result.downloadUrl, result.page);
    }
  };

  const resetTool = () => {
    setFile(null);
    setSplitResults([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Split PDF File</h2>
        <p className="text-foreground-secondary">
          Split a PDF into individual pages or extract specific pages from your document.
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
                Choose a PDF file to split into individual pages
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
                onClick={handleSplit}
                disabled={isProcessing}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                <Scissors className="w-4 h-4 mr-2" />
                {isProcessing ? 'Splitting...' : 'Split PDF'}
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
                <span>Splitting PDF file...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Split Results */}
      {splitResults.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-800">
                PDF Split Successfully! ({splitResults.length} pages)
              </h3>
              <div className="space-x-2">
                <Button onClick={downloadAll} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Split Another PDF
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {splitResults.map((result) => (
                <Card key={result.page} className="bg-white border-green-200">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <File className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Page {result.page}</h4>
                      <p className="text-sm text-green-600">Ready for download</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(result.downloadUrl, result.page)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Split Options Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">✂️ Split Options:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Split All Pages:</strong> Each page becomes a separate PDF file</li>
            <li>• <strong>Maximum file size:</strong> 50MB per PDF</li>
            <li>• <strong>Output format:</strong> Individual PDF files for each page</li>
            <li>• <strong>Quality:</strong> Original quality maintained</li>
            <li>• <strong>Security:</strong> Files are processed securely and deleted after download</li>
          </ul>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Use "Download All" to get all pages at once</li>
            <li>• Each page will be named "page_X.pdf" where X is the page number</li>
            <li>• Perfect for extracting specific pages from large documents</li>
            <li>• All pages maintain original formatting and quality</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};