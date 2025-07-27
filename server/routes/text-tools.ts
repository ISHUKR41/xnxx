import express from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';

const router = express.Router();

// Text to PDF Tool  
router.post('/text-to-pdf', async (req, res) => {
  try {
    const { text, title, fontSize, fontFamily, margins } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content required' });
    }

    const pdfDoc = await PDFDocument.create();
    
    // Font selection
    let font;
    switch (fontFamily) {
      case 'Helvetica':
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        break;
      case 'Courier':
        font = await pdfDoc.embedFont(StandardFonts.Courier);
        break;
      case 'Times-Roman':
      default:
        font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        break;
    }
    
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    const textSize = fontSize || 12;
    const marginSize = margins || 50;
    const color = rgb(0, 0, 0); // black text
    
    // Add title if provided
    if (title) {
      page.drawText(title, {
        x: marginSize,
        y: height - marginSize,
        size: textSize + 4,
        font: font,
        color: color,
      });
    }

    // Word wrapping logic
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = width - (marginSize * 2);

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, textSize);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Draw text
    const lineHeight = textSize + 4;
    let yPosition = title ? height - marginSize - 30 : height - marginSize;

    for (const line of lines) {
      if (yPosition < 50) {
        // Add new page if needed
        const newPage = pdfDoc.addPage();
        yPosition = newPage.getSize().height - 50;
      }
      
      page.drawText(line, {
        x: marginSize,
        y: yPosition,
        size: textSize,
        font: font,
        color: color,
      });
      
      yPosition -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    const outputPath = `temp/text-to-pdf-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, pdfBytes);

    res.json({
      success: true,
      message: 'PDF generated successfully',
      downloadUrl: `/temp/${path.basename(outputPath)}`
    });
    
    // Clean up after 5 minutes
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 5 * 60 * 1000);
  } catch (error) {
    console.error('Text to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert text to PDF' });
  }
});

export default router;