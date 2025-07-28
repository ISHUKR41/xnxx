import * as crypto from 'crypto';
import * as qrcode from 'qrcode';

export class UtilityService {

  async generateQRCode(text: string, options: any = {}): Promise<Buffer> {
    const {
      width = 256,
      margin = 4,
      color = {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel = 'M'
    } = options;

    try {
      const buffer = await qrcode.toBuffer(text, {
        width,
        margin,
        color,
        errorCorrectionLevel,
        type: 'png'
      });
      
      return buffer;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  async generatePassword(options: any = {}): Promise<string> {
    const {
      length = 12,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = false,
      excludeAmbiguous = true,
      customCharacters = ''
    } = options;

    let characters = '';
    
    if (customCharacters) {
      characters = customCharacters;
    } else {
      if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers) characters += '0123456789';
      if (includeSymbols) characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      if (excludeAmbiguous) {
        characters = characters.replace(/[0O1lI|]/g, '');
      }
    }

    if (!characters) {
      throw new Error('No character set selected for password generation');
    }

    let password = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charactersLength);
      password += characters.charAt(randomIndex);
    }

    return password;
  }

  async hashText(text: string, algorithm: string = 'sha256'): Promise<string> {
    const supportedAlgorithms = ['md5', 'sha1', 'sha256', 'sha512', 'blake2b512'];
    
    if (!supportedAlgorithms.includes(algorithm)) {
      throw new Error(`Unsupported algorithm: ${algorithm}. Supported: ${supportedAlgorithms.join(', ')}`);
    }

    const hash = crypto.createHash(algorithm);
    hash.update(text, 'utf8');
    return hash.digest('hex');
  }

  async encodeBase64(text: string): Promise<string> {
    return Buffer.from(text, 'utf8').toString('base64');
  }

  async decodeBase64(encodedText: string): Promise<string> {
    try {
      return Buffer.from(encodedText, 'base64').toString('utf8');
    } catch (error) {
      throw new Error('Invalid Base64 string');
    }
  }

  async encodeURL(text: string): Promise<string> {
    return encodeURIComponent(text);
  }

  async decodeURL(encodedText: string): Promise<string> {
    try {
      return decodeURIComponent(encodedText);
    } catch (error) {
      throw new Error('Invalid URL encoded string');
    }
  }

  async generateUUID(version: number = 4): Promise<string> {
    if (version === 4) {
      return crypto.randomUUID();
    } else {
      throw new Error('Only UUID v4 is currently supported');
    }
  }

  async generateColorPalette(baseColor?: string, count: number = 5): Promise<any> {
    const colors = [];
    
    if (baseColor) {
      // Generate palette based on base color
      const hsl = this.hexToHsl(baseColor);
      
      for (let i = 0; i < count; i++) {
        const newHue = (hsl.h + (360 / count) * i) % 360;
        const newColor = this.hslToHex(newHue, hsl.s, hsl.l);
        colors.push({
          hex: newColor,
          hsl: { h: newHue, s: hsl.s, l: hsl.l },
          rgb: this.hexToRgb(newColor)
        });
      }
    } else {
      // Generate random colors
      for (let i = 0; i < count; i++) {
        const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        colors.push({
          hex,
          hsl: this.hexToHsl(hex),
          rgb: this.hexToRgb(hex)
        });
      }
    }

    return {
      colors,
      count: colors.length,
      baseColor: baseColor || 'random'
    };
  }

  async convertUnits(value: number, fromUnit: string, toUnit: string, category: string): Promise<any> {
    const conversions: any = {
      length: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        millimeter: 1000,
        inch: 39.3701,
        foot: 3.28084,
        yard: 1.09361,
        mile: 0.000621371
      },
      weight: {
        kilogram: 1,
        gram: 1000,
        pound: 2.20462,
        ounce: 35.274,
        ton: 0.001
      },
      temperature: {
        celsius: (c: number) => ({ celsius: c, fahrenheit: (c * 9/5) + 32, kelvin: c + 273.15 }),
        fahrenheit: (f: number) => ({ fahrenheit: f, celsius: (f - 32) * 5/9, kelvin: ((f - 32) * 5/9) + 273.15 }),
        kelvin: (k: number) => ({ kelvin: k, celsius: k - 273.15, fahrenheit: ((k - 273.15) * 9/5) + 32 })
      }
    };

    if (!conversions[category]) {
      throw new Error(`Unsupported category: ${category}`);
    }

    if (category === 'temperature') {
      if (!conversions[category][fromUnit]) {
        throw new Error(`Unsupported temperature unit: ${fromUnit}`);
      }
      return conversions[category][fromUnit](value);
    } else {
      const categoryConversions = conversions[category];
      if (!categoryConversions[fromUnit] || !categoryConversions[toUnit]) {
        throw new Error(`Unsupported unit in ${category}: ${fromUnit} or ${toUnit}`);
      }

      const baseValue = value / categoryConversions[fromUnit];
      const convertedValue = baseValue * categoryConversions[toUnit];

      return {
        original: { value, unit: fromUnit },
        converted: { value: convertedValue, unit: toUnit },
        category
      };
    }
  }

  async calculateAge(birthDate: string, targetDate?: string): Promise<any> {
    const birth = new Date(birthDate);
    const target = targetDate ? new Date(targetDate) : new Date();

    if (birth > target) {
      throw new Error('Birth date cannot be in the future');
    }

    const ageMs = target.getTime() - birth.getTime();
    const ageDate = new Date(ageMs);

    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;

    const totalDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(ageMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(ageMs / (1000 * 60));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      birthDate: birth.toISOString().split('T')[0],
      targetDate: target.toISOString().split('T')[0]
    };
  }

  async generateLoremIpsum(options: any = {}): Promise<string> {
    const {
      paragraphs = 1,
      sentences = 5,
      words = 50,
      type = 'paragraphs'
    } = options;

    const loremWords = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
      'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
      'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
      'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    if (type === 'words') {
      const result = [];
      for (let i = 0; i < words; i++) {
        result.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      return result.join(' ');
    }

    if (type === 'sentences') {
      const result = [];
      for (let i = 0; i < sentences; i++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let j = 0; j < sentenceLength; j++) {
          sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        result.push(sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '.');
      }
      return result.join(' ');
    }

    // Default: paragraphs
    const result = [];
    for (let i = 0; i < paragraphs; i++) {
      const paragraphSentences = [];
      const sentenceCount = Math.floor(Math.random() * 5) + 3;
      
      for (let j = 0; j < sentenceCount; j++) {
        const sentenceLength = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let k = 0; k < sentenceLength; k++) {
          sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        paragraphSentences.push(sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '.');
      }
      result.push(paragraphSentences.join(' '));
    }
    
    return result.join('\n\n');
  }

  async validateEmail(email: string): Promise<any> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    return {
      email,
      isValid,
      errors: isValid ? [] : ['Invalid email format']
    };
  }

  async validateURL(url: string): Promise<any> {
    try {
      const urlObj = new URL(url);
      return {
        url,
        isValid: true,
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash
      };
    } catch (error) {
      return {
        url,
        isValid: false,
        errors: ['Invalid URL format']
      };
    }
  }

  // Helper functions for color conversion
  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private hexToHsl(hex: string): { h: number, s: number, l: number } {
    const rgb = this.hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

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

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private hslToHex(h: number, s: number, l: number): string {
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

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
}

export const utilityService = new UtilityService();