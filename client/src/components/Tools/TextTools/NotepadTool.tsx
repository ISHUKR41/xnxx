import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Download, FileText, Type, Clock, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotepadTool: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [format, setFormat] = useState('txt');
  const [isSaving, setIsSaving] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  const updateCounts = useCallback((text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateCounts(newContent);
  }, [updateCounts]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Note",
        description: "Please add some content to save",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    setDownloadLink(null);

    try {
      const response = await fetch('/api/text-tools/save-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || 'Untitled Note',
          content,
          format
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save note');
      }

      const data = await response.json();
      setDownloadLink(data.downloadUrl);

      toast({
        title: "Note Saved! ✅",
        description: `Your note has been saved as ${data.filename}`,
      });

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save note",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied! 📋",
      description: "Note content copied to clipboard",
    });
  };

  const handleClear = () => {
    setContent('');
    setTitle('');
    setWordCount(0);
    setCharCount(0);
    setDownloadLink(null);
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Quick Notepad</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Note Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title (optional)"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Save Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="txt">Text File (.txt)</SelectItem>
                  <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Note Content</label>
              <div className="flex items-center gap-4 text-xs text-foreground-secondary">
                <span className="flex items-center gap-1">
                  <Type className="w-3 h-3" />
                  {charCount} characters
                </span>
                <span>{wordCount} words</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getCurrentDateTime()}
                </span>
              </div>
            </div>
            
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your note here..."
              className="min-h-[400px] w-full resize-none font-mono text-sm leading-relaxed"
              style={{ height: 'auto' }}
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSave} disabled={isSaving} className="btn-hero flex-1">
                {isSaving ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save as {format.toUpperCase()}
                  </>
                )}
              </Button>
              
              <Button onClick={handleCopy} variant="outline" disabled={!content.trim()}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              
              <Button onClick={handleClear} variant="outline" disabled={!content.trim() && !title.trim()}>
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download */}
      {downloadLink && (
        <Card className="glassmorphism border-success/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-success">Note Saved Successfully!</h3>
              <p className="text-foreground-secondary">
                Your note has been saved as a {format.toUpperCase()} file
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-hero">
                  <a href={downloadLink} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download {format.toUpperCase()}
                  </a>
                </Button>
                <Button 
                  onClick={() => {
                    setDownloadLink(null);
                  }}
                  variant="outline"
                >
                  Save Another Note
                </Button>
              </div>
              
              <div className="text-xs text-foreground-secondary mt-4">
                File will be automatically deleted after 1 hour for security
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">📚 Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground-secondary">
            <div>
              <h4 className="font-medium text-foreground mb-2">Text Format (.txt)</h4>
              <p>Perfect for simple notes, code snippets, and plain text documents. Compatible with all text editors.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">PDF Format (.pdf)</h4>
              <p>Great for formatted documents, reports, and sharing. Preserves formatting across devices.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotepadTool;