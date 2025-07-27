import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Type, Settings, Palette, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TextToPDFTool: React.FC = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  
  // PDF customization options
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Times-Roman');
  const [pageSize, setPageSize] = useState('A4');
  const [margin, setMargin] = useState('20');
  
  const { toast } = useToast();

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to convert to PDF",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setDownloadLink(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 200);

      const response = await fetch('/api/text-tools/text-to-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          title: title || 'Document',
          fontSize: parseInt(fontSize),
          fontFamily: fontFamily,
          pageSize: pageSize,
          margins: parseInt(margin)
        })
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
      console.error('Generate error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate PDF",
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
      link.download = `${title || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your PDF document is being downloaded"
      });
    }
  };

  const resetTool = () => {
    setText('');
    setTitle('');
    setDownloadLink(null);
    setProgress(0);
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  return (
    <div className="space-y-6 bg-black text-white p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">📝➡️📄 Text to PDF Converter</h2>
        <p className="text-gray-200 text-lg">
          Convert your text into professional PDF documents with custom formatting
        </p>
        <p className="text-blue-400 font-semibold">✨ 30K+ conversions this month | Professional quality</p>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Text Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="title" className="text-white text-lg font-semibold">📄 Document Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title (optional)"
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white text-lg font-semibold">✍️ Document Content</Label>
                <Textarea
                  id="content"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Enter your text content here... You can write essays, reports, letters, or any other document content."
                  className="bg-gray-700 border-gray-600 text-white mt-2 min-h-[300px] resize-y"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>Words: {wordCount}</span>
                  <span>Characters: {charCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                PDF Settings
              </h3>

              <div>
                <Label htmlFor="font-size" className="text-white">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="10">10pt</SelectItem>
                    <SelectItem value="11">11pt</SelectItem>
                    <SelectItem value="12">12pt (Standard)</SelectItem>
                    <SelectItem value="14">14pt</SelectItem>
                    <SelectItem value="16">16pt</SelectItem>
                    <SelectItem value="18">18pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="font-family" className="text-white">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="Times-Roman">Times Roman</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="page-size" className="text-white">Page Size</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="A4">A4 (210×297mm)</SelectItem>
                    <SelectItem value="Letter">Letter (8.5×11in)</SelectItem>
                    <SelectItem value="Legal">Legal (8.5×14in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="margin" className="text-white">Margin (mm)</Label>
                <Input
                  id="margin"
                  type="number"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  min="10"
                  max="50"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isProcessing || !text.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isProcessing ? 'Generating...' : 'Generate PDF'}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {text && (
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold flex items-center mb-2">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </h4>
                <div className="bg-white p-3 rounded text-black text-xs max-h-32 overflow-y-auto">
                  <div className="font-bold mb-2">{title || "Untitled Document"}</div>
                  <div className="whitespace-pre-wrap">{text.substring(0, 200)}{text.length > 200 ? '...' : ''}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Progress */}
      {isProcessing && (
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Generating PDF document...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-400 text-center">
                Creating professional PDF with your custom settings...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Section */}
      {downloadLink && (
        <Card className="bg-green-900/20 border-green-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">PDF Generated Successfully!</h3>
                  <p className="text-sm text-gray-300">Your document is ready for download</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={resetTool} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  Create Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextToPDFTool;