import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProtectPDFTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const validatePasswords = () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password to protect the PDF",
        variant: "destructive"
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both password fields match",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleProtect = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to protect",
        variant: "destructive"
      });
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setDownloadLink(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const response = await fetch('/api/pdf-tools/protect', {
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
      console.error('Protect error:', error);
      toast({
        title: "Protection Failed",
        description: error instanceof Error ? error.message : "Failed to protect PDF file",
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
      link.download = 'protected.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your protected PDF is being downloaded"
      });
    }
  };

  const resetTool = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setDownloadLink(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setConfirmPassword(result);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { text: 'Weak', color: 'text-red-500', bg: 'bg-red-100' };
    if (strength <= 3) return { text: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (strength <= 4) return { text: 'Strong', color: 'text-green-500', bg: 'bg-green-100' };
    return { text: 'Very Strong', color: 'text-green-600', bg: 'bg-green-100' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Protect PDF with Password</h2>
        <p className="text-foreground-secondary">
          Add password protection to your PDF files to secure sensitive documents and control access.
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
                Choose a PDF file to add password protection
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

      {/* Selected File and Password Settings */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{file.name}</h3>
                  <p className="text-sm text-foreground-secondary">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
                  <Shield className="w-4 h-4" />
                  <span>Will be protected with password</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
                  <Lock className="w-4 h-4" />
                  <span>Original file will remain unchanged</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Password Settings</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateStrongPassword}
                >
                  Generate Strong Password
                </Button>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getPasswordStrength(password).bg} ${getPasswordStrength(password).color}`}>
                      {getPasswordStrength(password).text}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                
                {/* Match Indicator */}
                {confirmPassword && (
                  <div className="text-xs">
                    {password === confirmPassword ? (
                      <span className="text-green-600">✓ Passwords match</span>
                    ) : (
                      <span className="text-red-500">✗ Passwords don't match</span>
                    )}
                  </div>
                )}
              </div>

              {/* Protect Button */}
              <Button
                onClick={handleProtect}
                disabled={isProcessing || !password || !confirmPassword}
                className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isProcessing ? 'Protecting...' : 'Protect PDF'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Adding password protection...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-foreground-secondary text-center">
                Encrypting PDF and applying security settings...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success and Download */}
      {downloadLink && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">PDF Protected Successfully!</h3>
              <p className="text-sm text-green-600 mb-4">
                Your PDF is now password-protected. Save your password in a secure location.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Keep your password safe! You won't be able to open the PDF without it.
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Protected PDF
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Protect Another PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔐 Password Security Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Length:</strong> Use at least 8 characters, preferably 12 or more</li>
            <li>• <strong>Complexity:</strong> Include uppercase, lowercase, numbers, and symbols</li>
            <li>• <strong>Uniqueness:</strong> Don't reuse passwords from other accounts</li>
            <li>• <strong>Storage:</strong> Store passwords in a secure password manager</li>
            <li>• <strong>Sharing:</strong> Only share with authorized recipients via secure channels</li>
          </ul>
        </CardContent>
      </Card>

      {/* Protection Features */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-purple-800 mb-2">🛡️ Protection Features:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• <strong>Open Protection:</strong> Password required to open the PDF</li>
            <li>• <strong>Encryption:</strong> Content is encrypted using strong algorithms</li>
            <li>• <strong>Access Control:</strong> Prevents unauthorized viewing</li>
            <li>• <strong>Compatibility:</strong> Works with all PDF readers</li>
            <li>• <strong>Note:</strong> Full encryption features will be available in the next update</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};