import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'temp/uploads/' });

// Text to PDF conversion
router.post('/text-to-pdf', express.json(), async (req, res) => {
  try {
    const { text, fontSize = 12, fontFamily = 'Helvetica', margins = 50 } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Set font
    let font;
    switch (fontFamily) {
      case 'Times':
        font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        break;
      case 'Courier':
        font = await pdfDoc.embedFont(StandardFonts.Courier);
        break;
      default:
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }

    // Calculate text dimensions and pages needed
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    const contentWidth = pageWidth - (margins * 2);
    const contentHeight = pageHeight - (margins * 2);
    
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.2;
    const linesPerPage = Math.floor(contentHeight / lineHeight);
    
    // Process text into pages
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margins;
    let lineCount = 0;
    
    for (const line of lines) {
      // Split long lines to fit page width
      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth <= contentWidth) {
          currentLine = testLine;
        } else {
          // Draw current line and start new one
          if (currentLine) {
            currentPage.drawText(currentLine, {
              x: margins,
              y: currentY,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
            currentY -= lineHeight;
            lineCount++;
            
            // Check if we need a new page
            if (lineCount >= linesPerPage) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              currentY = pageHeight - margins;
              lineCount = 0;
            }
          }
          currentLine = word;
        }
      }
      
      // Draw remaining text in current line
      if (currentLine) {
        currentPage.drawText(currentLine, {
          x: margins,
          y: currentY,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        currentY -= lineHeight;
        lineCount++;
        
        // Check if we need a new page
        if (lineCount >= linesPerPage) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margins;
          lineCount = 0;
        }
      }
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join('temp/processed', `text_to_pdf_${Date.now()}.pdf`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, pdfBytes);

    res.json({ 
      success: true, 
      message: 'Text converted to PDF successfully',
      downloadUrl: `/api/text-tools/download/${path.basename(outputPath)}`,
      pageCount: pdfDoc.getPageCount(),
      characterCount: text.length
    });

  } catch (error) {
    console.error('Text to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert text to PDF' });
  }
});

// Note taking endpoint
router.post('/save-note', express.json(), async (req, res) => {
  try {
    const { title, content, format = 'txt' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${title || 'note'}_${timestamp}.${format}`;
    const outputPath = path.join('temp/processed', filename);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    if (format === 'txt') {
      await fs.writeFile(outputPath, content, 'utf8');
    } else if (format === 'pdf') {
      // Convert to PDF using same logic as text-to-pdf
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      const lines = content.split('\n');
      let y = height - 50;
      
      for (const line of lines) {
        if (y < 50) {
          page.drawText(line, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
          y -= 15;
        }
      }
      
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
    }

    res.json({ 
      success: true, 
      message: 'Note saved successfully',
      downloadUrl: `/api/text-tools/download/${filename}`,
      filename
    });

  } catch (error) {
    console.error('Save note error:', error);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Text summarization endpoint (basic implementation)
router.post('/summarize', express.json(), async (req, res) => {
  try {
    const { text, maxLength = 200 } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Basic text summarization (extract first few sentences)
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [];
    const targetSentences = Math.max(1, Math.floor(sentences.length * 0.3));
    
    let summary = sentences.slice(0, targetSentences).join(' ');
    
    // Truncate if still too long
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength - 3) + '...';
    }

    res.json({ 
      success: true, 
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
      compressionRatio: ((1 - summary.length / text.length) * 100).toFixed(1)
    });

  } catch (error) {
    console.error('Text summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

// Download processed files
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('temp/processed', filename);
    
    // Check if file exists
    await fs.access(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream file
    const fileBuffer = await fs.readFile(filePath);
    res.send(fileBuffer);
    
    // Clean up file after download
    setTimeout(async () => {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }, 60000); // Delete after 1 minute
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;