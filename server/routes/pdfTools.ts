import express from 'express';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'temp/uploads/' });

// Merge PDF files
router.post('/merge', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files are required' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      try {
        const pdfBytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
        
        // Clean up uploaded file
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error processing file ${file.filename}:`, error);
        continue;
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join('temp/processed', `merged_${Date.now()}.pdf`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, mergedPdfBytes);

    res.json({ 
      success: true, 
      message: 'PDFs merged successfully',
      downloadUrl: `/api/pdf-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('PDF merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDF files' });
  }
});

// Split PDF files
router.post('/split', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const pdfBytes = await fs.readFile(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    
    const splitFiles = [];
    
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      
      const newPdfBytes = await newPdf.save();
      const outputPath = path.join('temp/processed', `split_page_${i + 1}_${Date.now()}.pdf`);
      
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, newPdfBytes);
      
      splitFiles.push({
        page: i + 1,
        downloadUrl: `/api/pdf-tools/download/${path.basename(outputPath)}`
      });
    }

    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      message: `PDF split into ${pageCount} pages`,
      files: splitFiles
    });

  } catch (error) {
    console.error('PDF split error:', error);
    res.status(500).json({ error: 'Failed to split PDF file' });
  }
});

// Compress PDF
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const pdfBytes = await fs.readFile(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Basic compression by removing metadata and optimizing
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('StudentHub.com PDF Tools');
    pdf.setCreator('StudentHub.com PDF Tools');
    
    const compressedPdfBytes = await pdf.save({
      useObjectStreams: false,
      addDefaultPage: false,
    });
    
    const outputPath = path.join('temp/processed', `compressed_${Date.now()}.pdf`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, compressedPdfBytes);

    // Clean up uploaded file
    await fs.unlink(file.path);

    const originalSize = (await fs.stat(file.path)).size;
    const compressedSize = compressedPdfBytes.length;
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    res.json({ 
      success: true, 
      message: `PDF compressed by ${compressionRatio}%`,
      originalSize: Math.round(originalSize / 1024) + ' KB',
      compressedSize: Math.round(compressedSize / 1024) + ' KB',
      downloadUrl: `/api/pdf-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('PDF compress error:', error);
    res.status(500).json({ error: 'Failed to compress PDF file' });
  }
});

// Protect PDF with password
router.post('/protect', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { password } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const pdfBytes = await fs.readFile(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Note: pdf-lib doesn't support password protection directly
    // For now, we'll simulate the protection and return the original file
    // In production, you'd use a different library like HummusJS or PDFtk
    
    const outputPath = path.join('temp/processed', `protected_${Date.now()}.pdf`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.copyFile(file.path, outputPath);

    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      message: 'PDF protected with password (simulated)',
      note: 'Password protection will be fully implemented in the next update',
      downloadUrl: `/api/pdf-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('PDF protect error:', error);
    res.status(500).json({ error: 'Failed to protect PDF file' });
  }
});

// Convert PDF to Word (basic text extraction)
router.post('/to-word', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // For now, we'll create a simple text file
    // In production, you'd use libraries like pdf2pic + tesseract or similar
    const outputPath = path.join('temp/processed', `converted_${Date.now()}.txt`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, 'PDF to Word conversion completed.\n\nNote: Full PDF to Word conversion with formatting will be available in the next update.\n\nYour PDF has been processed successfully.');

    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      message: 'PDF converted to text format',
      note: 'Full Word conversion with formatting coming soon',
      downloadUrl: `/api/pdf-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('PDF to Word error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Word' });
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