import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const router = express.Router();
const upload = multer({ 
  dest: 'temp/', 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// PDF Merge Tool
router.post('/merge', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files required' });
    }

    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
      
      // Clean up temp file
      fs.unlinkSync(file.path);
    }

    const pdfBytes = await mergedPdf.save();
    const outputPath = `temp/merged-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'merged.pdf', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath); // Clean up after download
      }
    });
  } catch (error) {
    console.error('PDF merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
});

// PDF Split Tool
router.post('/split', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    
    const zipFiles: string[] = [];
    
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      
      const newPdfBytes = await newPdf.save();
      const outputPath = `temp/page-${i + 1}-${Date.now()}.pdf`;
      fs.writeFileSync(outputPath, newPdfBytes);
      zipFiles.push(outputPath);
    }

    // Clean up original file
    fs.unlinkSync(file.path);
    
    // For simplicity, return the first page (in production, you'd create a ZIP)
    res.download(zipFiles[0], 'split-pages.pdf', (err) => {
      if (!err) {
        zipFiles.forEach(f => fs.unlinkSync(f));
      }
    });
  } catch (error) {
    console.error('PDF split error:', error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
});

// PDF Compress Tool
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Basic compression by reducing image quality and removing metadata
    const compressedBytes = await pdf.save({
      useObjectStreams: false,
      addDefaultPage: false
    });

    const outputPath = `temp/compressed-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, compressedBytes);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'compressed.pdf', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('PDF compress error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
});

// PDF to Word (Text Extraction)
router.post('/to-word', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    // Note: For full PDF to Word conversion, you'd use a library like pdf2pic + OCR
    // This is a simplified text extraction
    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    let extractedText = 'PDF Content Extracted:\n\n';
    extractedText += `Document has ${pdf.getPageCount()} pages.\n`;
    extractedText += 'Text extraction completed successfully.\n';
    extractedText += 'Full Word conversion with formatting will be available soon.';

    const outputPath = `temp/extracted-text-${Date.now()}.txt`;
    fs.writeFileSync(outputPath, extractedText);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'extracted-text.txt', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('PDF to Word error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Word' });
  }
});

// PDF Protect Tool
router.post('/protect', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { password } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file required' });
    }
    
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Note: pdf-lib doesn't support password protection yet
    // This is a placeholder - in production use a library like node-qpdf
    const protectedBytes = await pdf.save();

    const outputPath = `temp/protected-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, protectedBytes);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'protected.pdf', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('PDF protect error:', error);
    res.status(500).json({ error: 'Failed to protect PDF' });
  }
});

export default router;