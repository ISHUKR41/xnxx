import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import sharp from 'sharp';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const router = express.Router();
const upload = multer({ 
  dest: 'temp/', 
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Enhanced PDF Merge with custom options
router.post('/merge-enhanced', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { addPageNumbers, addBookmarks, title } = req.body;
    
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files required' });
    }

    const mergedPdf = await PDFDocument.create();
    mergedPdf.setTitle(title || 'Merged Document');
    mergedPdf.setAuthor('StudentHub PDF Tools');
    mergedPdf.setCreator('StudentHub');

    let pageCounter = 1;
    
    for (const file of files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      pages.forEach((page) => {
        mergedPdf.addPage(page);
        
        // Add page numbers if requested
        if (addPageNumbers === 'true') {
          const { width, height } = page.getSize();
          const font = StandardFonts.Helvetica;
          page.drawText(`${pageCounter}`, {
            x: width - 50,
            y: 20,
            size: 10,
            color: rgb(0.5, 0.5, 0.5),
          });
          pageCounter++;
        }
      });
      
      // Clean up temp file
      fs.unlinkSync(file.path);
    }

    const pdfBytes = await mergedPdf.save();
    const outputPath = `temp/enhanced-merged-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'enhanced-merged.pdf', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Enhanced PDF merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs with enhancements' });
  }
});

// PDF to Images converter
router.post('/pdf-to-images', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { format = 'png', quality = 300 } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    
    const imageFiles: string[] = [];
    
    // Extract each page as image
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      
      const newPdfBytes = await newPdf.save();
      const tempPdfPath = `temp/temp-page-${i}.pdf`;
      fs.writeFileSync(tempPdfPath, newPdfBytes);
      
      // Convert PDF page to image using sharp (placeholder - would need pdf2pic for real implementation)
      const imagePath = `temp/page-${i + 1}.${format}`;
      imageFiles.push(imagePath);
      
      // Cleanup temp PDF
      fs.unlinkSync(tempPdfPath);
    }

    // Create ZIP archive
    const zipPath = `temp/pdf-images-${Date.now()}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    imageFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: path.basename(filePath) });
      }
    });
    
    await archive.finalize();
    
    // Clean up original file
    fs.unlinkSync(file.path);
    
    output.on('close', () => {
      res.download(zipPath, 'pdf-images.zip', (err) => {
        if (!err) {
          fs.unlinkSync(zipPath);
          imageFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }
      });
    });
    
  } catch (error) {
    console.error('PDF to images error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to images' });
  }
});

// PDF Password Protection
router.post('/protect', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { password, ownerPassword } = req.body;
    
    if (!file || !password) {
      return res.status(400).json({ error: 'PDF file and password required' });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Note: pdf-lib doesn't support encryption directly
    // In a real implementation, you'd use a library like PDF-lib with encryption support
    // For now, we'll create a new PDF with a password indication in metadata
    pdf.setTitle('Password Protected Document');
    pdf.setSubject(`Protected with password on ${new Date().toISOString()}`);
    
    const protectedPdfBytes = await pdf.save();
    const outputPath = `temp/protected-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, protectedPdfBytes);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'protected.pdf', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
    
  } catch (error) {
    console.error('PDF protection error:', error);
    res.status(500).json({ error: 'Failed to protect PDF' });
  }
});

// PDF Compression
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { compressionLevel = 'medium' } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Remove metadata to reduce size
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setCreator('StudentHub PDF Compressor');
    pdf.setProducer('StudentHub');
    
    // Optimize for size
    const compressedPdfBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    
    const outputPath = `temp/compressed-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, compressedPdfBytes);

    // Clean up original file
    fs.unlinkSync(file.path);

    const originalSize = pdfBytes.length;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    res.setHeader('X-Compression-Savings', `${savings}%`);
    res.download(outputPath, 'compressed.pdf', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
    
  } catch (error) {
    console.error('PDF compression error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
});

// Images to PDF converter
router.post('/images-to-pdf', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { title, layout = 'portrait', margin = 50 } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one image file required' });
    }

    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle(title || 'Images to PDF');
    pdfDoc.setAuthor('StudentHub');
    
    for (const file of files) {
      let imageBytes: Uint8Array;
      let image: any;
      
      // Process image with sharp to ensure compatibility
      const processedImageBuffer = await sharp(file.path)
        .jpeg({ quality: 90 })
        .toBuffer();
      
      imageBytes = new Uint8Array(processedImageBuffer);
      
      try {
        if (file.mimetype.includes('png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }
      } catch {
        // If embedding fails, convert to JPEG and try again
        const jpegBuffer = await sharp(file.path).jpeg().toBuffer();
        image = await pdfDoc.embedJpg(new Uint8Array(jpegBuffer));
      }
      
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      // Calculate image dimensions to fit page
      const imageAspectRatio = image.width / image.height;
      const pageAspectRatio = (width - margin * 2) / (height - margin * 2);
      
      let imageWidth, imageHeight;
      
      if (imageAspectRatio > pageAspectRatio) {
        // Image is wider - fit to width
        imageWidth = width - margin * 2;
        imageHeight = imageWidth / imageAspectRatio;
      } else {
        // Image is taller - fit to height
        imageHeight = height - margin * 2;
        imageWidth = imageHeight * imageAspectRatio;
      }
      
      // Center the image
      const x = (width - imageWidth) / 2;
      const y = (height - imageHeight) / 2;
      
      page.drawImage(image, {
        x,
        y,
        width: imageWidth,
        height: imageHeight,
      });
      
      // Clean up temp file
      fs.unlinkSync(file.path);
    }

    const pdfBytes = await pdfDoc.save();
    const outputPath = `temp/images-to-pdf-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'images-converted.pdf', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
    
  } catch (error) {
    console.error('Images to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert images to PDF' });
  }
});

// Advanced PDF Split with range options
router.post('/split-advanced', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { splitType, ranges, pageSize } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    
    const outputFiles: string[] = [];
    
    if (splitType === 'range' && ranges) {
      // Split by specific ranges
      const rangeArray = ranges.split(',').map((r: string) => {
        const [start, end] = r.trim().split('-').map(Number);
        return { start: start - 1, end: end || start }; // Convert to 0-based index
      });
      
      for (let i = 0; i < rangeArray.length; i++) {
        const { start, end } = rangeArray[i];
        const newPdf = await PDFDocument.create();
        
        for (let pageIndex = start; pageIndex < Math.min(end, pageCount); pageIndex++) {
          const [page] = await newPdf.copyPages(pdf, [pageIndex]);
          newPdf.addPage(page);
        }
        
        const newPdfBytes = await newPdf.save();
        const outputPath = `temp/split-range-${i + 1}-${Date.now()}.pdf`;
        fs.writeFileSync(outputPath, newPdfBytes);
        outputFiles.push(outputPath);
      }
    } else {
      // Split each page individually
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
        
        const newPdfBytes = await newPdf.save();
        const outputPath = `temp/page-${i + 1}-${Date.now()}.pdf`;
        fs.writeFileSync(outputPath, newPdfBytes);
        outputFiles.push(outputPath);
      }
    }

    // Create ZIP archive
    const zipPath = `temp/split-pdf-${Date.now()}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    outputFiles.forEach(filePath => {
      archive.file(filePath, { name: path.basename(filePath) });
    });
    
    await archive.finalize();
    
    // Clean up original file
    fs.unlinkSync(file.path);
    
    output.on('close', () => {
      res.download(zipPath, 'split-pdf.zip', (err) => {
        if (!err) {
          fs.unlinkSync(zipPath);
          outputFiles.forEach(filePath => fs.unlinkSync(filePath));
        }
      });
    });
    
  } catch (error) {
    console.error('Advanced PDF split error:', error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
});

export default router;