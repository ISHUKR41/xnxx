import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Type, Settings, Palette } from 'lucide-react';
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
      const formData = new FormData();
      formData.append('text', text);
      formData.append('title', title || 'Document');
      formData.append('fontSize', fontSize);
      formData.append('fontFamily', fontFamily);
      formData.append('pageSize', pageSize);
      formData.append('margin', margin);

      // Simulate progress
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
          fontSize: parseInt(fontSize),
          fontFamily: fontFamily,
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
    setFontSize('12');
    setFontFamily('Times-Roman');
    setPageSize('A4');
    setMargin('20');
  };

  const insertSampleText = () => {
    const sample = `Welcome to StudentHub.com

This is a sample document created using our Text to PDF converter tool. 

Key Features:
• Convert any text to professional PDF documents
• Customize fonts, sizes, and page layouts  
• Perfect for creating study materials, reports, and documents
• Fast and reliable conversion process

Benefits of PDF Format:
1. Universal compatibility across all devices
2. Preserves formatting and layout
3. Professional appearance for documents
4. Easy to share and print
5. Widely accepted format for submissions

You can replace this sample text with your own content and customize the appearance using the settings panel.

Happy learning!
StudentHub Team`;
    setText(sample);
  };

  const getWordCount = () => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return text.length;
  };

  const getEstimatedPages = () => {
    const wordsPerPage = Math.floor((595 - 2 * parseInt(margin)) * (842 - 2 * parseInt(margin)) / (parseInt(fontSize) * 1.5 * 6)); // Rough estimate
    return Math.ceil(getWordCount() / wordsPerPage) || 1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Text to PDF Converter</h2>
        <p className="text-foreground-secondary">
          Convert your text content into professional PDF documents with customizable formatting options.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          {/* Document Title */}
          <Card>
            <CardContent className="p-4">
              <Label htmlFor="title" className="text-sm font-medium">Document Title (Optional)</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title..."
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Text Content */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-content" className="text-sm font-medium">Text Content</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={insertSampleText}
                >
                  Insert Sample Text
                </Button>
              </div>
              <Textarea
                id="text-content"
                value={text}
                onChange={handleTextChange}
                placeholder="Enter your text content here..."
                className="min-h-[400px] resize-none"
              />
              
              {/* Text Statistics */}
              <div className="flex items-center justify-between text-sm text-foreground-secondary">
                <span>{getCharacterCount()} characters</span>
                <span>{getWordCount()} words</span>
                <span>~{getEstimatedPages()} page{getEstimatedPages() !== 1 ? 's' : ''}</span>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isProcessing || !text.trim()}
            className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
            size="lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            {isProcessing ? 'Generating PDF...' : 'Generate PDF'}
          </Button>
        </div>

        {/* Settings Panel - Takes 1 column */}
        <div className="space-y-4">
          {/* PDF Settings */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">PDF Settings</h3>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-sm">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10pt</SelectItem>
                    <SelectItem value="11">11pt</SelectItem>
                    <SelectItem value="12">12pt</SelectItem>
                    <SelectItem value="14">14pt</SelectItem>
                    <SelectItem value="16">16pt</SelectItem>
                    <SelectItem value="18">18pt</SelectItem>
                    <SelectItem value="20">20pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Family */}
              <div className="space-y-2">
                <Label className="text-sm">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Times-Roman">Times Roman</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Courier">Courier</SelectItem>
                    <SelectItem value="Times-Bold">Times Bold</SelectItem>
                    <SelectItem value="Helvetica-Bold">Helvetica Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <Label className="text-sm">Page Size</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                    <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                    <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                    <SelectItem value="Legal">Legal (8.5 × 14 in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Margins */}
              <div className="space-y-2">
                <Label className="text-sm">Margins (mm)</Label>
                <Select value={margin} onValueChange={setMargin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10mm (Narrow)</SelectItem>
                    <SelectItem value="15">15mm (Medium)</SelectItem>
                    <SelectItem value="20">20mm (Normal)</SelectItem>
                    <SelectItem value="25">25mm (Wide)</SelectItem>
                    <SelectItem value="30">30mm (Extra Wide)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preview Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Type className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Preview Info</h4>
              </div>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Font:</span>
                  <span>{fontFamily} ({fontSize}pt)</span>
                </div>
                <div className="flex justify-between">
                  <span>Page:</span>
                  <span>{pageSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margins:</span>
                  <span>{margin}mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Pages:</span>
                  <span>{getEstimatedPages()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating PDF document...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-foreground-secondary text-center">
                Formatting text and creating PDF structure...
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
              <h3 className="text-lg font-semibold text-green-800 mb-2">PDF Generated Successfully!</h3>
              <p className="text-sm text-green-600 mb-4">
                Your text has been converted to a professional PDF document.
              </p>
              <div className="space-x-4">
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Create Another PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-purple-800 mb-2">✨ Key Features:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• <strong>Professional Formatting:</strong> Clean, readable PDF documents</li>
            <li>• <strong>Custom Fonts:</strong> Choose from multiple font families and sizes</li>
            <li>• <strong>Flexible Layouts:</strong> Various page sizes and margin options</li>
            <li>• <strong>Real-time Preview:</strong> See estimated pages and formatting details</li>
            <li>• <strong>Fast Generation:</strong> Quick conversion with progress tracking</li>
            <li>• <strong>Universal Compatibility:</strong> PDFs work on all devices and platforms</li>
          </ul>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-800 mb-2">📚 Perfect For:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Study Notes:</strong> Convert handwritten or typed notes to PDF</li>
            <li>• <strong>Essay Submissions:</strong> Format academic papers professionally</li>
            <li>• <strong>Reports:</strong> Create structured documents for presentations</li>
            <li>• <strong>Documentation:</strong> Generate manuals and guides</li>
            <li>• <strong>Letters:</strong> Format formal and informal correspondence</li>
            <li>• <strong>Meeting Minutes:</strong> Document discussions and decisions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};