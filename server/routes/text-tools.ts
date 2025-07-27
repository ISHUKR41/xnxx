import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'temp/uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Text to PDF conversion
router.post('/text-to-pdf', upload.none(), async (req, res) => {
  try {
    const { text, title = 'Document', fontSize = 12, fontFamily = 'Times-Roman', margins = 50 } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text content is required' });
    }

    const sessionId = uuidv4();
    
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Set font
    let font;
    try {
      font = await pdfDoc.embedFont(StandardFonts[fontFamily as keyof typeof StandardFonts] || StandardFonts.TimesRoman);
    } catch {
      font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    }
    
    // Calculate text dimensions and wrapping
    const maxWidth = width - (parseInt(margins) * 2);
    const lineHeight = parseInt(fontSize) * 1.2;
    let yPosition = height - parseInt(margins);
    
    // Add title if provided
    if (title && title.trim()) {
      const titleFontSize = parseInt(fontSize) + 4;
      page.drawText(title, {
        x: parseInt(margins),
        y: yPosition,
        size: titleFontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= titleFontSize * 2;
    }
    
    // Split text into lines and handle word wrapping
    const words = text.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, parseInt(fontSize));
      
      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        // Draw current line
        if (currentLine) {
          page.drawText(currentLine, {
            x: parseInt(margins),
            y: yPosition,
            size: parseInt(fontSize),
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= lineHeight;
        }
        
        // Start new line with current word
        currentLine = word;
        
        // Check if we need a new page
        if (yPosition < parseInt(margins)) {
          const newPage = pdfDoc.addPage();
          yPosition = newPage.getSize().height - parseInt(margins);
        }
      }
    }
    
    // Draw remaining text
    if (currentLine) {
      page.drawText(currentLine, {
        x: parseInt(margins),
        y: yPosition,
        size: parseInt(fontSize),
        font: font,
        color: rgb(0, 0, 0),
      });
    }
    
    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const outputPath = `temp/downloads/text-to-pdf_${sessionId}.pdf`;
    await fs.writeFile(outputPath, pdfBytes);
    
    // Set expiration (4 minutes)
    setTimeout(async () => {
      try {
        await fs.unlink(outputPath);
      } catch (error) {
        console.log('File already deleted or not found:', outputPath);
      }
    }, 4 * 60 * 1000);
    
    res.json({
      success: true,
      message: 'Text converted to PDF successfully!',
      downloadUrl: `/downloads/text-to-pdf_${sessionId}.pdf`,
      expiresAt: new Date(Date.now() + 4 * 60 * 1000).toISOString()
    });
    
  } catch (error) {
    console.error('Text to PDF conversion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to convert text to PDF. Please try again.' 
    });
  }
});

// Word count tool
router.post('/word-count', upload.single('file'), async (req, res) => {
  try {
    const { text } = req.body;
    let content = text;
    
    if (req.file) {
      // Read file content
      const fileContent = await fs.readFile(req.file.path, 'utf-8');
      content = fileContent;
      
      // Clean up uploaded file
      await fs.unlink(req.file.path);
    }
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Text content or file is required' });
    }
    
    // Count statistics
    const words = content.trim().split(/\s+/).filter((word: string) => word.length > 0);
    const characters = content.length;
    const charactersNoSpaces = content.replace(/\s/g, '').length;
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0).length;
    const lines = content.split('\n').length;
    
    // Reading time estimation (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words.length / 200);
    
    // Most common words (excluding common stop words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
    
    const wordFreq: { [key: string]: number } = {};
    words.forEach((word: string) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord && !stopWords.has(cleanWord)) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
    
    res.json({
      success: true,
      message: 'Text analysis completed successfully!',
      data: {
        words: words.length,
        characters,
        charactersNoSpaces,
        sentences,
        paragraphs,
        lines,
        readingTimeMinutes,
        topWords,
        preview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
      }
    });
    
  } catch (error) {
    console.error('Word count error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze text. Please try again.' 
    });
  }
});

// Code formatter tool
router.post('/format-code', upload.none(), async (req, res) => {
  try {
    const { code, language = 'javascript', indentSize = 2, useSpaces = true } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Code content is required' });
    }
    
    // Basic code formatting logic
    let formattedCode = code;
    const indent = useSpaces ? ' '.repeat(parseInt(indentSize)) : '\t';
    
    // Simple formatting based on language
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
      case 'json':
        formattedCode = formatJavaScript(code, indent);
        break;
      case 'html':
        formattedCode = formatHTML(code, indent);
        break;
      case 'css':
        formattedCode = formatCSS(code, indent);
        break;
      case 'python':
        formattedCode = formatPython(code, indent);
        break;
      default:
        formattedCode = formatGeneric(code, indent);
    }
    
    res.json({
      success: true,
      message: 'Code formatted successfully!',
      data: {
        originalCode: code,
        formattedCode,
        language,
        indentSize: parseInt(indentSize),
        useSpaces,
        linesCount: formattedCode.split('\n').length,
        charactersCount: formattedCode.length
      }
    });
    
  } catch (error) {
    console.error('Code formatting error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to format code. Please try again.' 
    });
  }
});

// Helper formatting functions
function formatJavaScript(code: string, indent: string): string {
  let formatted = '';
  let level = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const prevChar = i > 0 ? code[i - 1] : '';
    
    if (!inString && (char === '"' || char === "'" || char === '`')) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && prevChar !== '\\') {
      inString = false;
      stringChar = '';
    }
    
    if (!inString) {
      if (char === '{' || char === '[') {
        formatted += char + '\n' + indent.repeat(++level);
        continue;
      } else if (char === '}' || char === ']') {
        formatted += '\n' + indent.repeat(--level) + char;
        continue;
      } else if (char === ';') {
        formatted += char + '\n' + indent.repeat(level);
        continue;
      } else if (char === ',') {
        formatted += char + '\n' + indent.repeat(level);
        continue;
      }
    }
    
    formatted += char;
  }
  
  return formatted.replace(/\n\s*\n/g, '\n').trim();
}

function formatHTML(code: string, indent: string): string {
  let formatted = '';
  let level = 0;
  let inTag = false;
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    
    if (char === '<') {
      inTag = true;
      if (code[i + 1] === '/') {
        level--;
        formatted += '\n' + indent.repeat(level) + char;
      } else {
        formatted += '\n' + indent.repeat(level) + char;
        if (!code.substring(i).match(/^<[^>]*\/>/)) {
          level++;
        }
      }
    } else if (char === '>') {
      inTag = false;
      formatted += char;
    } else {
      formatted += char;
    }
  }
  
  return formatted.replace(/\n\s*\n/g, '\n').trim();
}

function formatCSS(code: string, indent: string): string {
  let formatted = '';
  let level = 0;
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    
    if (char === '{') {
      formatted += char + '\n' + indent.repeat(++level);
    } else if (char === '}') {
      formatted += '\n' + indent.repeat(--level) + char + '\n';
    } else if (char === ';') {
      formatted += char + '\n' + indent.repeat(level);
    } else {
      formatted += char;
    }
  }
  
  return formatted.replace(/\n\s*\n/g, '\n').trim();
}

function formatPython(code: string, indent: string): string {
  const lines = code.split('\n');
  let level = 0;
  let formatted = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.endsWith(':')) {
      formatted += indent.repeat(level) + trimmed + '\n';
      level++;
    } else if (trimmed === '' || trimmed.startsWith('#')) {
      formatted += trimmed + '\n';
    } else {
      if (['return', 'break', 'continue', 'pass'].some(keyword => trimmed.startsWith(keyword))) {
        formatted += indent.repeat(Math.max(0, level - 1)) + trimmed + '\n';
      } else {
        formatted += indent.repeat(level) + trimmed + '\n';
      }
    }
    
    if (trimmed.startsWith('def ') || trimmed.startsWith('class ') || trimmed.startsWith('if ') || 
        trimmed.startsWith('for ') || trimmed.startsWith('while ') || trimmed.startsWith('try:') ||
        trimmed.startsWith('except:') || trimmed.startsWith('finally:')) {
      // Level already incremented above
    }
  }
  
  return formatted.trim();
}

function formatGeneric(code: string, indent: string): string {
  const lines = code.split('\n');
  return lines.map(line => line.trim()).join('\n');
}

export default router;