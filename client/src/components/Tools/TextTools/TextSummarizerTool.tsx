import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { FileText, Zap, Copy, Download, BarChart3, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextSummarizerTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [maxLength, setMaxLength] = useState([200]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{
    originalLength: number;
    summaryLength: number;
    compressionRatio: string;
  } | null>(null);
  const { toast } = useToast();

  const wordCount = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
  const charCount = inputText.length;

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to summarize",
        variant: "destructive"
      });
      return;
    }

    if (inputText.trim().split(/\s+/).length < 10) {
      toast({
        title: "Text Too Short",
        description: "Please provide at least 10 words for meaningful summarization",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setSummary('');
    setStats(null);

    try {
      const response = await fetch('/api/text-tools/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          maxLength: maxLength[0]
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Summarization failed');
      }

      const data = await response.json();
      setSummary(data.summary);
      setStats({
        originalLength: data.originalLength,
        summaryLength: data.summaryLength,
        compressionRatio: data.compressionRatio
      });

      toast({
        title: "Text Summarized! ✅",
        description: `Reduced from ${data.originalLength} to ${data.summaryLength} characters (${data.compressionRatio}% compression)`,
      });

    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        title: "Summarization Failed",
        description: error instanceof Error ? error.message : "Failed to summarize text",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 📋",
      description: `${type} copied to clipboard`,
    });
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded! 📥",
      description: `${filename} has been downloaded`,
    });
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setStats(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">AI Text Summarizer</h2>
          </div>
          <p className="text-foreground-secondary">
            Get concise summaries of long texts, articles, and documents. Perfect for quick understanding and note-taking.
          </p>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Original Text</label>
              <div className="flex items-center gap-4 text-xs text-foreground-secondary">
                <span>{charCount} characters</span>
                <span>{wordCount} words</span>
              </div>
            </div>
            
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your long text, article, or document here to get a concise summary..."
              className="min-h-[200px] w-full resize-none text-sm leading-relaxed"
            />

            {/* Summary Length Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Maximum Summary Length</label>
                <span className="text-sm text-foreground-secondary">{maxLength[0]} characters</span>
              </div>
              <Slider
                value={maxLength}
                onValueChange={setMaxLength}
                max={500}
                min={50}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-foreground-secondary">
                <span>Brief (50)</span>
                <span>Medium (250)</span>
                <span>Detailed (500)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSummarize} 
                disabled={isProcessing || !inputText.trim()} 
                className="btn-hero flex-1"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
              
              <Button onClick={handleClear} variant="outline" disabled={!inputText.trim()}>
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing and summarizing text...</span>
                <span>Processing</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Result */}
      {summary && (
        <Card className="glassmorphism border-success/30">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-success">📝 Summary</h3>
                <div className="flex gap-2">
                  <Button onClick={() => handleCopy(summary, 'Summary')} size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={() => handleDownload(summary, 'summary.txt')} size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="bg-background-secondary rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>

              {/* Statistics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-background-secondary rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.originalLength}</div>
                    <div className="text-xs text-foreground-secondary">Original Characters</div>
                  </div>
                  <div className="bg-background-secondary rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-success">{stats.summaryLength}</div>
                    <div className="text-xs text-foreground-secondary">Summary Characters</div>
                  </div>
                  <div className="bg-background-secondary rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-accent">{stats.compressionRatio}%</div>
                    <div className="text-xs text-foreground-secondary">Text Reduced</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Tips */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">💡 Tips for Better Summaries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground-secondary">
            <div>
              <h4 className="font-medium text-foreground mb-2">📖 Best Input Types</h4>
              <ul className="space-y-1">
                <li>• News articles and blog posts</li>
                <li>• Research papers and reports</li>
                <li>• Meeting notes and transcripts</li>
                <li>• Long emails and documents</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">⚙️ Optimization Tips</h4>
              <ul className="space-y-1">
                <li>• Use 100-200 chars for quick overviews</li>
                <li>• Use 300-500 chars for detailed summaries</li>
                <li>• Provide at least 50 words for input</li>
                <li>• Remove excessive formatting before input</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextSummarizerTool;