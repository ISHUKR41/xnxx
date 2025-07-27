import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'temp/uploads/' });

// Convert text to PDF
router.post('/text-to-pdf', async (req, res) => {
  try {
    const { text, fontSize = 12, fontFamily = 'Helvetica' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const pdfDoc = await PDFDocument.create();
    
    // Select font
    let font;
    switch (fontFamily.toLowerCase()) {
      case 'times':
        font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        break;
      case 'courier':
        font = await pdfDoc.embedFont(StandardFonts.Courier);
        break;
      default:
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    
    const pageWidth = 595; // A4 width in points
    const pageHeight = 842; // A4 height in points
    const margin = 50;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = fontSize * 1.2;
    
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;
    
    // Split text into lines and handle page breaks
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (currentY < margin + lineHeight) {
        // Add new page
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
      
      // Handle long lines by wrapping
      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > maxWidth && currentLine) {
          // Draw current line and start new one
          page.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          
          currentY -= lineHeight;
          if (currentY < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
          }
          
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      // Draw remaining text
      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        currentY -= lineHeight;
      }
    }
    
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join('temp/processed', `text_to_pdf_${Date.now()}.pdf`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, pdfBytes);

    res.json({ 
      success: true, 
      message: 'Text converted to PDF successfully',
      pages: pdfDoc.getPageCount(),
      downloadUrl: `/api/text-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('Text to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert text to PDF' });
  }
});

// Text summarizer (basic implementation)
router.post('/summarize', async (req, res) => {
  try {
    const { text, maxSentences = 3 } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Basic text summarization using sentence scoring
    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    
    if (sentences.length <= maxSentences) {
      return res.json({
        success: true,
        originalLength: text.length,
        summaryLength: text.length,
        summary: text.trim(),
        compressionRatio: 0
      });
    }

    // Simple word frequency scoring
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach((word: string) => {
      if (word.length > 3) { // Ignore short words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Score sentences based on word frequency
    const scoredSentences = sentences.map((sentence: string, index: number) => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      const score = sentenceWords.reduce((sum: number, word: string) => {
        return sum + (wordFreq[word] || 0);
      }, 0) / sentenceWords.length;
      
      return {
        sentence: sentence.trim(),
        score,
        index
      };
    });

    // Get top sentences
    const topSentences = scoredSentences
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, maxSentences)
      .sort((a: any, b: any) => a.index - b.index)
      .map((item: any) => item.sentence);

    const summary = topSentences.join('. ') + '.';
    const compressionRatio = Math.round(((text.length - summary.length) / text.length) * 100);

    res.json({
      success: true,
      originalLength: text.length,
      summaryLength: summary.length,
      summary,
      compressionRatio
    });

  } catch (error) {
    console.error('Text summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

// Grammar checker (basic implementation)
router.post('/grammar-check', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Basic grammar rules
    const issues = [];
    
    // Check for double spaces
    const doubleSpaces = text.match(/  +/g);
    if (doubleSpaces) {
      issues.push({
        type: 'spacing',
        message: 'Multiple consecutive spaces found',
        count: doubleSpaces.length,
        suggestion: 'Use single spaces between words'
      });
    }
    
    // Check for missing capital after periods
    const missingCaps = text.match(/\. [a-z]/g);
    if (missingCaps) {
      issues.push({
        type: 'capitalization',
        message: 'Missing capitalization after periods',
        count: missingCaps.length,
        suggestion: 'Capitalize the first letter after sentences'
      });
    }
    
    // Check for common typos
    const commonTypos = {
      'teh': 'the',
      'recieve': 'receive',
      'seperate': 'separate',
      'occured': 'occurred',
      'neccessary': 'necessary'
    };
    
    Object.entries(commonTypos).forEach(([typo, correction]) => {
      const regex = new RegExp(`\\b${typo}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        issues.push({
          type: 'spelling',
          message: `Possible typo: "${typo}" should be "${correction}"`,
          count: matches.length,
          suggestion: `Replace "${typo}" with "${correction}"`
        });
      }
    });

    res.json({
      success: true,
      issuesFound: issues.length,
      issues,
      score: Math.max(0, 100 - (issues.length * 10))
    });

  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
});

// Download processed files
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('temp/processed', filename);
    
    // Check if file exists
    await fs.access(filePath);
    
    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(404).json({ error: 'File not found' });
      } else {
        // Clean up file after download
        setTimeout(async () => {
          try {
            await fs.unlink(filePath);
          } catch (cleanupError) {
            console.error('File cleanup error:', cleanupError);
          }
        }, 60000); // Delete after 1 minute
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;