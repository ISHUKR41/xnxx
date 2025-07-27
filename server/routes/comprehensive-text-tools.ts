import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './temp/uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for text files
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

// Text to PDF Converter
export const textToPdf = async (req: Request, res: Response) => {
  try {
    const { text, font = 'Helvetica', fontSize = '12', lineSpacing = '1.2', margins = '50', pageSize = 'letter' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const pdfDoc = await PDFDocument.create();
    
    // Page size configurations
    const pageSizes: { [key: string]: [number, number] } = {
      letter: [612, 792],
      a4: [595, 842],
      legal: [612, 1008],
      a3: [842, 1191]
    };
    
    const [pageWidth, pageHeight] = pageSizes[pageSize] || pageSizes.letter;
    const marginValue = parseInt(margins);
    const fontSizeValue = parseInt(fontSize);
    const lineSpacingValue = parseFloat(lineSpacing);
    
    // Embed font
    let pdfFont;
    try {
      pdfFont = await pdfDoc.embedFont(StandardFonts[font as keyof typeof StandardFonts] || StandardFonts.Helvetica);
    } catch {
      pdfFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    
    // Calculate text layout
    const textWidth = pageWidth - (marginValue * 2);
    const textHeight = pageHeight - (marginValue * 2);
    const lineHeight = fontSizeValue * lineSpacingValue;
    const linesPerPage = Math.floor(textHeight / lineHeight);
    
    // Split text into words and wrap lines
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidthTest = pdfFont.widthOfTextAtSize(testLine, fontSizeValue);
      
      if (textWidthTest <= textWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is too long, force break
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Create pages and add text
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - marginValue;
    let lineCount = 0;
    
    for (const line of lines) {
      if (lineCount >= linesPerPage) {
        // Create new page
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - marginValue;
        lineCount = 0;
      }
      
      currentPage.drawText(line, {
        x: marginValue,
        y: yPosition,
        size: fontSizeValue,
        font: pdfFont,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= lineHeight;
      lineCount++;
    }
    
    const pdfBytes = await pdfDoc.save();
    const outputPath = `./temp/processed/${uuidv4()}-text-to-pdf.pdf`;
    await fs.writeFile(outputPath, pdfBytes);
    
    const downloadUrl = await createDownloadLink(outputPath, 'text-document.pdf');
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      pageCount: pdfDoc.getPageCount(),
      wordCount: words.length,
      message: `Text successfully converted to PDF (${pdfDoc.getPageCount()} pages, ${words.length} words)`
    });
  } catch (error) {
    console.error('Text to PDF conversion error:', error);
    res.status(500).json({ error: 'Failed to convert text to PDF' });
  }
};

// HTML to PDF Converter
export const htmlToPdf = async (req: Request, res: Response) => {
  try {
    const { html, pageSize = 'a4', margins = '1cm', css = '', javascript = 'false' } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // For a real implementation, you would use puppeteer or similar
    // For now, we'll create a simple PDF with the HTML text content
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Strip HTML tags for basic text extraction
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Add content to PDF
    const lines = textContent.match(/.{1,80}/g) || [];
    let yPosition = 800;
    
    page.drawText('HTML Document Conversion', {
      x: 50,
      y: yPosition,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 30;
    
    for (const line of lines.slice(0, 35)) { // Limit to fit on page
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 15;
      
      if (yPosition < 50) break;
    }
    
    const pdfBytes = await pdfDoc.save();
    const outputPath = `./temp/processed/${uuidv4()}-html-to-pdf.pdf`;
    await fs.writeFile(outputPath, pdfBytes);
    
    const downloadUrl = await createDownloadLink(outputPath, 'html-document.pdf');
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      message: 'HTML successfully converted to PDF'
    });
  } catch (error) {
    console.error('HTML to PDF conversion error:', error);
    res.status(500).json({ error: 'Failed to convert HTML to PDF' });
  }
};

// Word Counter Tool
export const wordCounter = async (req: Request, res: Response) => {
  try {
    const { text, includeSpaces = 'true', readingSpeed = '200', detailed = 'true' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Basic counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const lines = text.split('\n').length;
    
    // Reading time calculation
    const readingSpeedWpm = parseInt(readingSpeed);
    const readingTimeMinutes = Math.ceil(words / readingSpeedWpm);
    const readingTimeSeconds = Math.ceil((words / readingSpeedWpm) * 60);
    
    // Additional analysis if detailed
    let detailedStats = {};
    if (detailed === 'true') {
      const wordFrequency: { [key: string]: number } = {};
      const wordList = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
      
      wordList.forEach(word => {
        if (word.length > 0) {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
      });
      
      const sortedWords = Object.entries(wordFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      const averageWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : '0';
      const averageWordsPerParagraph = paragraphs > 0 ? (words / paragraphs).toFixed(1) : '0';
      
      detailedStats = {
        averageWordsPerSentence: parseFloat(averageWordsPerSentence),
        averageWordsPerParagraph: parseFloat(averageWordsPerParagraph),
        mostFrequentWords: sortedWords,
        uniqueWords: Object.keys(wordFrequency).length,
        lexicalDiversity: Object.keys(wordFrequency).length / words || 0
      };
    }
    
    const results = {
      characters: includeSpaces === 'true' ? characters : charactersNoSpaces,
      charactersWithSpaces: characters,
      charactersWithoutSpaces: charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime: {
        minutes: readingTimeMinutes,
        seconds: readingTimeSeconds,
        formattedTime: readingTimeMinutes > 0 
          ? `${readingTimeMinutes} min ${readingTimeSeconds % 60} sec` 
          : `${readingTimeSeconds} sec`
      },
      ...detailedStats
    };
    
    res.json({
      success: true,
      statistics: results,
      message: `Text analysis complete: ${words} words, ${sentences} sentences, ${paragraphs} paragraphs`
    });
  } catch (error) {
    console.error('Word counter error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
};

// Text Summarizer Tool (AI-powered placeholder)
export const textSummarizer = async (req: Request, res: Response) => {
  try {
    const { text, length = 'medium', style = 'paragraph', keyPoints = 'false', bullets = 'false' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Simple extractive summarization (in real implementation, use AI service)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    let summaryLength;
    switch (length) {
      case 'short':
        summaryLength = Math.max(1, Math.ceil(sentences.length * 0.2));
        break;
      case 'long':
        summaryLength = Math.max(3, Math.ceil(sentences.length * 0.4));
        break;
      default: // medium
        summaryLength = Math.max(2, Math.ceil(sentences.length * 0.3));
    }
    
    // Simple scoring based on sentence length and position
    const scoredSentences = sentences.map((sentence, index) => {
      const words = sentence.trim().split(/\s+/).length;
      const positionScore = index < sentences.length * 0.3 ? 2 : 1; // First 30% get higher score
      const lengthScore = words > 10 && words < 30 ? 2 : 1; // Prefer medium-length sentences
      
      return {
        sentence: sentence.trim(),
        score: positionScore + lengthScore,
        index
      };
    });
    
    // Select top sentences
    const selectedSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, summaryLength)
      .sort((a, b) => a.index - b.index) // Restore original order
      .map(s => s.sentence);
    
    let summary;
    if (bullets === 'true') {
      summary = selectedSentences.map(s => `• ${s}`).join('\n');
    } else if (keyPoints === 'true') {
      summary = selectedSentences.map((s, i) => `${i + 1}. ${s}`).join('\n');
    } else {
      summary = selectedSentences.join('. ') + '.';
    }
    
    const originalWords = text.trim().split(/\s+/).length;
    const summaryWords = summary.trim().split(/\s+/).length;
    const compressionRatio = ((originalWords - summaryWords) / originalWords * 100).toFixed(1);
    
    res.json({
      success: true,
      summary,
      statistics: {
        originalWords,
        summaryWords,
        compressionRatio: `${compressionRatio}%`,
        originalSentences: sentences.length,
        summarySentences: selectedSentences.length
      },
      message: `Text summarized: ${originalWords} → ${summaryWords} words (${compressionRatio}% reduction)`
    });
  } catch (error) {
    console.error('Text summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
};

// Grammar Checker Tool (AI-powered placeholder)
export const grammarChecker = async (req: Request, res: Response) => {
  try {
    const { text, language = 'en', style = 'general', suggestions = 'true', severity = 'medium' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Simple grammar checking (in real implementation, use LanguageTool or similar)
    const issues = [];
    
    // Basic checks
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    // Check for common issues
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // Double spaces
      if (sentence.includes('  ')) {
        issues.push({
          type: 'spacing',
          severity: 'minor',
          message: 'Double space found',
          suggestion: 'Use single space',
          position: sentence.indexOf('  '),
          length: 2
        });
      }
      
      // Sentence starts with lowercase (except after certain punctuation)
      if (sentence.length > 0 && /^[a-z]/.test(sentence)) {
        issues.push({
          type: 'capitalization',
          severity: 'major',
          message: 'Sentence should start with capital letter',
          suggestion: sentence.charAt(0).toUpperCase() + sentence.slice(1),
          position: 0,
          length: 1
        });
      }
      
      // Very long sentences
      if (sentence.split(/\s+/).length > 25) {
        issues.push({
          type: 'readability',
          severity: 'minor',
          message: 'Consider breaking this long sentence',
          suggestion: 'Split into shorter sentences for better readability',
          position: 0,
          length: sentence.length
        });
      }
    }
    
    // Check for repeated words
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] === words[i + 1] && words[i].length > 2) {
        issues.push({
          type: 'repetition',
          severity: 'major',
          message: 'Repeated word found',
          suggestion: `Remove duplicate "${words[i]}"`,
          position: i,
          length: words[i].length
        });
      }
    }
    
    const correctedText = text; // In real implementation, apply corrections
    
    res.json({
      success: true,
      originalText: text,
      correctedText,
      issues: issues.slice(0, 20), // Limit to 20 issues
      statistics: {
        totalIssues: issues.length,
        majorIssues: issues.filter(i => i.severity === 'major').length,
        minorIssues: issues.filter(i => i.severity === 'minor').length,
        wordCount: words.length,
        sentenceCount: sentences.length
      },
      message: `Grammar check complete: ${issues.length} issues found`
    });
  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
};

// Case Converter Tool
export const caseConverter = async (req: Request, res: Response) => {
  try {
    const { text, caseType, preserveFormatting = 'false' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    if (!caseType) {
      return res.status(400).json({ error: 'Case type is required' });
    }

    let convertedText = text;
    
    switch (caseType.toLowerCase()) {
      case 'uppercase':
        convertedText = text.toUpperCase();
        break;
      case 'lowercase':
        convertedText = text.toLowerCase();
        break;
      case 'titlecase':
        convertedText = text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentencecase':
        convertedText = text.toLowerCase().replace(/(^\w|\.\s*\w)/g, (txt) => 
          txt.toUpperCase()
        );
        break;
      case 'camelcase':
        convertedText = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
        break;
      case 'pascalcase':
        convertedText = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
        break;
      case 'snakecase':
        convertedText = text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
        break;
      case 'kebabcase':
        convertedText = text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
        break;
      case 'alternating':
        convertedText = text
          .split('')
          .map((char, index) => 
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
        break;
      case 'inverse':
        convertedText = text
          .split('')
          .map(char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
        break;
      default:
        return res.status(400).json({ error: 'Invalid case type' });
    }
    
    res.json({
      success: true,
      originalText: text,
      convertedText,
      caseType,
      statistics: {
        originalLength: text.length,
        convertedLength: convertedText.length,
        wordCount: text.trim().split(/\s+/).length
      },
      message: `Text successfully converted to ${caseType}`
    });
  } catch (error) {
    console.error('Case conversion error:', error);
    res.status(500).json({ error: 'Failed to convert case' });
  }
};

// Export multer upload middleware
export const uploadMiddleware = upload.array('files', 5);