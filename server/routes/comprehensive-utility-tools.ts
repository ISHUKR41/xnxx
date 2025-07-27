import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import QRCode from 'qrcode';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './temp/uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function to create download link
const createDownloadLink = async (filePath: string, originalName: string): Promise<string> => {
  const downloadId = uuidv4();
  const downloadDir = `./temp/downloads/${downloadId}`;
  await fs.mkdir(downloadDir, { recursive: true });
  
  const downloadPath = path.join(downloadDir, originalName);
  await fs.copyFile(filePath, downloadPath);
  
  // Set expiration (4 minutes)
  setTimeout(async () => {
    try {
      await fs.rm(downloadDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up download:', error);
    }
  }, 4 * 60 * 1000);
  
  return `/temp/downloads/${downloadId}/${originalName}`;
};

// QR Code Generator
export const generateQR = async (req: Request, res: Response) => {
  try {
    const { 
      text, 
      size = '300', 
      errorCorrection = 'M', 
      color = '#000000', 
      backgroundColor = '#FFFFFF',
      format = 'png',
      margin = '4',
      logo = '',
      logoSize = '20'
    } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const qrSize = parseInt(size);
    const qrMargin = parseInt(margin);
    
    // QR Code options
    const options = {
      type: format === 'svg' ? 'svg' : 'png',
      quality: 0.92,
      margin: qrMargin,
      color: {
        dark: color,
        light: backgroundColor
      },
      width: qrSize,
      errorCorrectionLevel: errorCorrection as 'L' | 'M' | 'Q' | 'H'
    };

    let qrCodeData;
    
    if (format === 'svg') {
      qrCodeData = await QRCode.toString(text, { ...options, type: 'svg' });
      const outputPath = `./temp/processed/${uuidv4()}-qrcode.svg`;
      await fs.writeFile(outputPath, qrCodeData);
      
      const downloadUrl = await createDownloadLink(outputPath, 'qrcode.svg');
      
      res.json({
        success: true,
        downloadUrl,
        expiresIn: 240,
        format: 'SVG',
        size: `${qrSize}x${qrSize}`,
        message: 'QR Code generated successfully'
      });
    } else {
      qrCodeData = await QRCode.toBuffer(text, options);
      const outputPath = `./temp/processed/${uuidv4()}-qrcode.png`;
      await fs.writeFile(outputPath, qrCodeData);
      
      const downloadUrl = await createDownloadLink(outputPath, 'qrcode.png');
      
      res.json({
        success: true,
        downloadUrl,
        expiresIn: 240,
        format: 'PNG',
        size: `${qrSize}x${qrSize}`,
        message: 'QR Code generated successfully'
      });
    }
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR Code' });
  }
};

// Password Generator
export const generatePassword = async (req: Request, res: Response) => {
  try {
    const { 
      length = '12', 
      includeUppercase = 'true',
      includeLowercase = 'true',
      includeNumbers = 'true',
      includeSymbols = 'false',
      excludeSimilar = 'true',
      excludeAmbiguous = 'true',
      pronounceable = 'false',
      count = '1'
    } = req.body;
    
    const passwordLength = Math.max(4, Math.min(128, parseInt(length)));
    const passwordCount = Math.max(1, Math.min(100, parseInt(count)));
    
    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'il1Lo0O';
    const ambiguousChars = '{}[]()/\\\'"`~,;.<>';
    
    let charset = '';
    
    if (includeUppercase === 'true') charset += uppercase;
    if (includeLowercase === 'true') charset += lowercase;
    if (includeNumbers === 'true') charset += numbers;
    if (includeSymbols === 'true') charset += symbols;
    
    if (!charset) {
      return res.status(400).json({ error: 'At least one character type must be selected' });
    }
    
    // Remove similar and ambiguous characters if requested
    if (excludeSimilar === 'true') {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    if (excludeAmbiguous === 'true') {
      charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }
    
    const passwords = [];
    
    for (let i = 0; i < passwordCount; i++) {
      let password = '';
      
      if (pronounceable === 'true') {
        // Generate pronounceable password (simplified)
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        const vowels = 'aeiou';
        
        for (let j = 0; j < passwordLength; j++) {
          if (j % 2 === 0) {
            password += consonants[Math.floor(Math.random() * consonants.length)];
          } else {
            password += vowels[Math.floor(Math.random() * vowels.length)];
          }
        }
        
        // Add numbers and symbols if requested
        if (includeNumbers === 'true' && passwordLength > 4) {
          const numPos = Math.floor(Math.random() * passwordLength);
          password = password.substring(0, numPos) + 
                   Math.floor(Math.random() * 10) + 
                   password.substring(numPos + 1);
        }
        
        if (includeSymbols === 'true' && passwordLength > 6) {
          const symPos = Math.floor(Math.random() * passwordLength);
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          password = password.substring(0, symPos) + symbol + password.substring(symPos + 1);
        }
        
        // Capitalize some letters
        if (includeUppercase === 'true') {
          password = password.split('').map((char, index) => 
            Math.random() > 0.7 && index > 0 ? char.toUpperCase() : char
          ).join('');
        }
      } else {
        // Generate random password
        const bytes = crypto.randomBytes(passwordLength * 2);
        for (let j = 0; j < passwordLength; j++) {
          password += charset[bytes[j] % charset.length];
        }
      }
      
      passwords.push(password);
    }
    
    // Calculate password strength
    const calculateStrength = (pwd: string) => {
      let score = 0;
      
      if (pwd.length >= 8) score += 1;
      if (pwd.length >= 12) score += 1;
      if (/[a-z]/.test(pwd)) score += 1;
      if (/[A-Z]/.test(pwd)) score += 1;
      if (/[0-9]/.test(pwd)) score += 1;
      if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
      
      return score;
    };
    
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const sampleStrength = calculateStrength(passwords[0]);
    
    res.json({
      success: true,
      passwords,
      count: passwordCount,
      length: passwordLength,
      strength: {
        score: sampleStrength,
        label: strengthLabels[sampleStrength] || 'Very Weak'
      },
      settings: {
        includeUppercase: includeUppercase === 'true',
        includeLowercase: includeLowercase === 'true',
        includeNumbers: includeNumbers === 'true',
        includeSymbols: includeSymbols === 'true',
        excludeSimilar: excludeSimilar === 'true',
        excludeAmbiguous: excludeAmbiguous === 'true',
        pronounceable: pronounceable === 'true'
      },
      message: `${passwordCount} password(s) generated successfully`
    });
  } catch (error) {
    console.error('Password generation error:', error);
    res.status(500).json({ error: 'Failed to generate password' });
  }
};

// Hash Generator
export const generateHash = async (req: Request, res: Response) => {
  try {
    const { text, algorithms = ['md5', 'sha1', 'sha256'] } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const supportedAlgorithms = ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512'];
    const algorithmList = Array.isArray(algorithms) ? algorithms : [algorithms];
    
    const results: { [key: string]: string } = {};
    
    for (const algorithm of algorithmList) {
      if (supportedAlgorithms.includes(algorithm.toLowerCase())) {
        const hash = crypto.createHash(algorithm.toLowerCase()).update(text, 'utf8').digest('hex');
        results[algorithm.toUpperCase()] = hash;
      }
    }
    
    if (Object.keys(results).length === 0) {
      return res.status(400).json({ error: 'No valid algorithms specified' });
    }
    
    res.json({
      success: true,
      originalText: text,
      hashes: results,
      algorithms: algorithmList,
      message: `Hashes generated for ${Object.keys(results).length} algorithm(s)`
    });
  } catch (error) {
    console.error('Hash generation error:', error);
    res.status(500).json({ error: 'Failed to generate hashes' });
  }
};

// Base64 Encoder/Decoder
export const base64Convert = async (req: Request, res: Response) => {
  try {
    const { text, direction = 'encode', format = 'standard', chunking = 'false' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    let result: string;
    
    if (direction === 'encode') {
      // Encode to Base64
      const buffer = Buffer.from(text, 'utf8');
      result = buffer.toString('base64');
      
      // Apply URL-safe encoding if requested
      if (format === 'urlsafe') {
        result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      }
      
      // Add chunking if requested (76 characters per line for MIME)
      if (chunking === 'true') {
        result = result.match(/.{1,76}/g)?.join('\n') || result;
      }
    } else {
      // Decode from Base64
      try {
        let cleanedText = text.replace(/\s/g, ''); // Remove whitespace
        
        // Handle URL-safe format
        if (format === 'urlsafe') {
          cleanedText = cleanedText.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding if needed
          while (cleanedText.length % 4) {
            cleanedText += '=';
          }
        }
        
        const buffer = Buffer.from(cleanedText, 'base64');
        result = buffer.toString('utf8');
      } catch (decodeError) {
        return res.status(400).json({ error: 'Invalid Base64 input' });
      }
    }
    
    res.json({
      success: true,
      originalText: text,
      result,
      direction,
      format,
      statistics: {
        originalLength: text.length,
        resultLength: result.length,
        compressionRatio: direction === 'encode' 
          ? `${((result.length / text.length - 1) * 100).toFixed(1)}% larger`
          : `${((1 - result.length / text.length) * 100).toFixed(1)}% smaller`
      },
      message: `Text successfully ${direction === 'encode' ? 'encoded to' : 'decoded from'} Base64`
    });
  } catch (error) {
    console.error('Base64 conversion error:', error);
    res.status(500).json({ error: 'Failed to convert Base64' });
  }
};

// URL Encoder/Decoder
export const urlEncode = async (req: Request, res: Response) => {
  try {
    const { text, direction = 'encode', component = 'true' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    let result: string;
    
    if (direction === 'encode') {
      if (component === 'true') {
        result = encodeURIComponent(text);
      } else {
        result = encodeURI(text);
      }
    } else {
      try {
        if (component === 'true') {
          result = decodeURIComponent(text);
        } else {
          result = decodeURI(text);
        }
      } catch (decodeError) {
        return res.status(400).json({ error: 'Invalid URL encoded input' });
      }
    }
    
    res.json({
      success: true,
      originalText: text,
      result,
      direction,
      method: component === 'true' ? 'encodeURIComponent' : 'encodeURI',
      statistics: {
        originalLength: text.length,
        resultLength: result.length,
        difference: result.length - text.length
      },
      message: `Text successfully ${direction === 'encode' ? 'URL encoded' : 'URL decoded'}`
    });
  } catch (error) {
    console.error('URL encoding error:', error);
    res.status(500).json({ error: 'Failed to encode/decode URL' });
  }
};

// Color Palette Generator
export const generateColorPalette = async (req: Request, res: Response) => {
  try {
    const { 
      baseColor = '#3B82F6', 
      count = '5', 
      type = 'complementary',
      format = 'hex'
    } = req.body;
    
    const colorCount = Math.max(2, Math.min(20, parseInt(count)));
    
    // Convert hex to HSL for manipulation
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return [h * 360, s * 100, l * 100];
    };
    
    // Convert HSL to hex
    const hslToHex = (h: number, s: number, l: number) => {
      h /= 360;
      s /= 100;
      l /= 100;
      
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };
    
    const [baseH, baseS, baseL] = hexToHsl(baseColor);
    const colors = [];
    
    // Generate colors based on type
    switch (type) {
      case 'complementary':
        for (let i = 0; i < colorCount; i++) {
          const hue = (baseH + (i * 360 / colorCount)) % 360;
          colors.push(hslToHex(hue, baseS, baseL));
        }
        break;
      case 'analogous':
        for (let i = 0; i < colorCount; i++) {
          const hue = (baseH + (i * 30 - 60)) % 360;
          colors.push(hslToHex(hue, baseS, baseL));
        }
        break;
      case 'triadic':
        for (let i = 0; i < colorCount; i++) {
          const hue = (baseH + (i * 120)) % 360;
          colors.push(hslToHex(hue, baseS, baseL));
        }
        break;
      case 'monochromatic':
        for (let i = 0; i < colorCount; i++) {
          const lightness = Math.max(10, Math.min(90, baseL + (i - colorCount/2) * 20));
          colors.push(hslToHex(baseH, baseS, lightness));
        }
        break;
      default:
        // Random palette
        for (let i = 0; i < colorCount; i++) {
          const hue = Math.random() * 360;
          const saturation = 40 + Math.random() * 40;
          const lightness = 30 + Math.random() * 40;
          colors.push(hslToHex(hue, saturation, lightness));
        }
    }
    
    // Convert to requested format
    const formatColors = (colorList: string[]) => {
      return colorList.map(color => {
        const [h, s, l] = hexToHsl(color);
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        switch (format.toLowerCase()) {
          case 'rgb':
            return `rgb(${r}, ${g}, ${b})`;
          case 'hsl':
            return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
          case 'hex':
          default:
            return color;
        }
      });
    };
    
    const formattedColors = formatColors(colors);
    
    res.json({
      success: true,
      baseColor,
      colors: formattedColors,
      palette: {
        type,
        count: colorCount,
        format: format.toUpperCase()
      },
      message: `${colorCount} color palette generated successfully`
    });
  } catch (error) {
    console.error('Color palette generation error:', error);
    res.status(500).json({ error: 'Failed to generate color palette' });
  }
};

// Export multer upload middleware
export const uploadMiddleware = upload.array('files', 5);