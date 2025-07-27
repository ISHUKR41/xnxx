import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Settings, RotateCcw, Eye, Link, ImageIcon } from 'lucide-react';

export const ResizeImageTool = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [newDimensions, setNewDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, WebP)",
        variant: "destructive"
      });
      return;
    }

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setNewDimensions({ width: img.width, height: img.height });
        setOriginalImage(e.target?.result as string);
        setResizedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const updateDimensions = (field: 'width' | 'height', value: number) => {
    if (maintainAspectRatio && dimensions.width && dimensions.height) {
      const aspectRatio = dimensions.width / dimensions.height;
      if (field === 'width') {
        setNewDimensions({
          width: value,
          height: Math.round(value / aspectRatio)
        });
      } else {
        setNewDimensions({
          width: Math.round(value * aspectRatio),
          height: value
        });
      }
    } else {
      setNewDimensions(prev => ({ ...prev, [field]: value }));
    }
  };

  const resizeImage = async () => {
    if (!originalImage || !originalFile) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', originalFile);
      formData.append('width', newDimensions.width.toString());
      formData.append('height', newDimensions.height.toString());
      formData.append('maintainAspectRatio', maintainAspectRatio.toString());

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/image-tools/resize', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setResizedImage(url);
        
        toast({
          title: "✅ Success!",
          description: `Image resized to ${newDimensions.width}x${newDimensions.height} pixels`
        });
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Failed to resize image');
      }
    } catch (error) {
      console.error('Resize error:', error);
      toast({
        title: "❌ Resize Failed",
        description: error instanceof Error ? error.message : "Failed to resize image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResizedImage = () => {
    if (resizedImage) {
      const link = document.createElement('a');
      link.href = resizedImage;
      const fileName = originalFile?.name || 'resized-image';
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const ext = originalFile?.type.split('/')[1] || 'png';
      link.download = `${nameWithoutExt}-resized.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your resized image is being downloaded"
      });
    }
  };

  const resetTool = () => {
    setOriginalImage(null);
    setResizedImage(null);
    setOriginalFile(null);
    setDimensions({ width: 0, height: 0 });
    setNewDimensions({ width: 0, height: 0 });
    setProgress(0);
  };

  return (
    <div className="space-y-6 bg-black text-white p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">🖼️ Image Resizer</h2>
        <p className="text-gray-200 text-lg">
          Resize your images while maintaining quality and aspect ratio
        </p>
        <p className="text-blue-400 font-semibold">✨ 60K+ resizes this month | Lossless quality</p>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors bg-gray-800">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🎨 Select Image</h3>
              <p className="text-sm text-gray-300 mb-4">
                Upload JPG, PNG, GIF, or WebP images
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <label htmlFor="image-upload" className="cursor-pointer">
                  Choose Image
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview and Controls */}
      {originalImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Original Image ({dimensions.width} × {dimensions.height})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img src={originalImage} alt="Original" className="w-full h-auto rounded border border-gray-600" />
            </CardContent>
          </Card>

          {/* Resize Controls */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Resize Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width" className="text-white">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={newDimensions.width}
                    onChange={(e) => updateDimensions('width', parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-white">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={newDimensions.height}
                    onChange={(e) => updateDimensions('height', parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                />
                <Label htmlFor="aspect-ratio" className="text-white">
                  <Link className="w-4 h-4 inline mr-1" />
                  Maintain aspect ratio
                </Label>
              </div>

              <Button
                onClick={resizeImage}
                disabled={isProcessing || !originalImage}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                {isProcessing ? 'Resizing...' : 'Resize Image'}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resized Image Result */}
      {resizedImage && (
        <Card className="bg-green-900/20 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>
                <Eye className="w-5 h-5 mr-2 inline" />
                Resized Image ({newDimensions.width} × {newDimensions.height})
              </span>
              <div className="flex space-x-2">
                <Button onClick={downloadResizedImage} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={resetTool} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img src={resizedImage} alt="Resized" className="w-full h-auto rounded border border-gray-600" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResizeImageTool;