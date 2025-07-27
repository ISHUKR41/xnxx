import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'temp/uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'), false);
    }
  }
});

// Utility function to ensure temp directories exist
async function ensureTempDirs() {
  const dirs = ['temp/uploads', 'temp/downloads', 'temp/processed'];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.log(`Directory ${dir} already exists or created`);
    }
  }
}

// Initialize temp directories
ensureTempDirs();

// Cleanup expired files (runs every 5 minutes)
setInterval(async () => {
  try {
    const dirs = ['temp/uploads', 'temp/downloads', 'temp/processed'];
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    for (const dir of dirs) {
      try {
        const files = await fs.readdir(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.unlink(filePath);
            console.log(`Cleaned up expired file: ${filePath}`);
          }
        }
      } catch (error) {
        console.log(`Error cleaning directory ${dir}:`, error);
      }
    }
  } catch (error) {
    console.log('Error in cleanup process:', error);
  }
}, 5 * 60 * 1000);

// Merge PDF files
router.post('/merge', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least 2 PDF files are required for merging' 
      });
    }

    const files = req.files as Express.Multer.File[];
    const mergedPdf = await PDFDocument.create();

    // Process each PDF file
    for (const file of files) {
      try {
        const pdfBytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        
        // Clean up uploaded file
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        // Clean up uploaded file even if processing failed
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
    }

    // Generate merged PDF
    const pdfBytes = await mergedPdf.save();
    
    // Save to temp directory with unique filename
    const sessionId = uuidv4();
    const outputPath = `temp/downloads/merged_${sessionId}.pdf`;
    await fs.writeFile(outputPath, pdfBytes);

    // Set expiration time (4 minutes from now)
    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

    res.json({
      success: true,
      message: 'PDFs merged successfully',
      downloadUrl: `/temp/merged_${sessionId}.pdf`,
      sessionId,
      expiresAt,
      fileSize: pdfBytes.length,
      pageCount: mergedPdf.getPageCount()
    });

  } catch (error) {
    console.error('Error merging PDFs:', error);
    
    // Clean up any uploaded files
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      for (const file of files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to merge PDFs. Please ensure all files are valid PDF documents.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Split PDF by page ranges
router.post('/split', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'PDF file is required' 
      });
    }

    const { ranges, splitType = 'range' } = req.body;
    
    const pdfBytes = await fs.readFile(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();

    let splitRanges: Array<{start: number, end: number}> = [];

    if (splitType === 'pages') {
      // Split into individual pages
      for (let i = 0; i < totalPages; i++) {
        splitRanges.push({ start: i, end: i });
      }
    } else if (splitType === 'range' && ranges) {
      // Parse custom ranges (e.g., "1-3,5-7,9")
      const rangeStrings = ranges.split(',');
      for (const rangeString of rangeStrings) {
        const range = rangeString.trim();
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(n => parseInt(n.trim()) - 1);
          if (start >= 0 && end < totalPages && start <= end) {
            splitRanges.push({ start, end });
          }
        } else {
          const pageNum = parseInt(range.trim()) - 1;
          if (pageNum >= 0 && pageNum < totalPages) {
            splitRanges.push({ start: pageNum, end: pageNum });
          }
        }
      }
    }

    if (splitRanges.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid split ranges specified'
      });
    }

    const sessionId = uuidv4();
    const outputFiles: Array<{name: string, path: string, pageCount: number}> = [];

    // Create split PDFs
    for (let i = 0; i < splitRanges.length; i++) {
      const { start, end } = splitRanges[i];
      const newPdf = await PDFDocument.create();
      
      for (let pageNum = start; pageNum <= end; pageNum++) {
        const [copiedPage] = await newPdf.copyPages(pdf, [pageNum]);
        newPdf.addPage(copiedPage);
      }

      const splitPdfBytes = await newPdf.save();
      const fileName = `split_${i + 1}_pages_${start + 1}-${end + 1}.pdf`;
      const outputPath = `temp/downloads/split_${sessionId}_${i + 1}.pdf`;
      
      await fs.writeFile(outputPath, splitPdfBytes);
      outputFiles.push({
        name: fileName,
        path: outputPath,
        pageCount: end - start + 1
      });
    }

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    // If multiple files, create a ZIP archive
    if (outputFiles.length > 1) {
      const zipPath = `temp/downloads/split_${sessionId}.zip`;
      const output = createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      for (const file of outputFiles) {
        const fileBuffer = await fs.readFile(file.path);
        archive.append(fileBuffer, { name: file.name });
        // Clean up individual files
        await fs.unlink(file.path);
      }

      await archive.finalize();

      const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

      res.json({
        success: true,
        message: `PDF split into ${outputFiles.length} files successfully`,
        downloadUrl: `/temp/split_${sessionId}.zip`,
        sessionId,
        expiresAt,
        totalFiles: outputFiles.length,
        files: outputFiles.map(f => ({ name: f.name, pageCount: f.pageCount }))
      });
    } else {
      // Single file output
      const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();
      
      res.json({
        success: true,
        message: 'PDF split successfully',
        downloadUrl: `/temp/split_${sessionId}_1.pdf`,
        sessionId,
        expiresAt,
        totalFiles: 1,
        files: outputFiles.map(f => ({ name: f.name, pageCount: f.pageCount }))
      });
    }

  } catch (error) {
    console.error('Error splitting PDF:', error);
    
    // Clean up uploaded file
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to split PDF. Please ensure the file is a valid PDF document.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Compress PDF
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'PDF file is required' 
      });
    }

    const { compressionLevel = 'medium' } = req.body;
    
    const originalBytes = await fs.readFile(req.file.path);
    const originalSize = originalBytes.length;
    
    // Load and re-save PDF (basic compression)
    const pdf = await PDFDocument.load(originalBytes);
    
    // Compression settings based on level
    let compressOptions: any = {};
    switch (compressionLevel) {
      case 'low':
        compressOptions = { compress: false };
        break;
      case 'medium':
        compressOptions = { compress: true };
        break;
      case 'high':
        compressOptions = { compress: true, addDefaultPage: false };
        break;
      default:
        compressOptions = { compress: true };
    }

    const compressedBytes = await pdf.save(compressOptions);
    const compressedSize = compressedBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    // Save compressed PDF
    const sessionId = uuidv4();
    const outputPath = `temp/downloads/compressed_${sessionId}.pdf`;
    await fs.writeFile(outputPath, compressedBytes);

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

    res.json({
      success: true,
      message: 'PDF compressed successfully',
      downloadUrl: `/temp/compressed_${sessionId}.pdf`,
      sessionId,
      expiresAt,
      originalSize,
      compressedSize,
      compressionRatio: parseFloat(compressionRatio),
      spaceSaved: originalSize - compressedSize
    });

  } catch (error) {
    console.error('Error compressing PDF:', error);
    
    // Clean up uploaded file
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to compress PDF. Please ensure the file is a valid PDF document.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Protect PDF with password
router.post('/protect', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'PDF file is required' 
      });
    }

    const { password, ownerPassword } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to protect the PDF'
      });
    }

    const pdfBytes = await fs.readFile(req.file.path);
    const pdf = await PDFDocument.load(pdfBytes);

    // Save with password protection
    const protectedBytes = await pdf.save({
      userPassword: password,
      ownerPassword: ownerPassword || password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: false
      }
    });

    // Save protected PDF
    const sessionId = uuidv4();
    const outputPath = `temp/downloads/protected_${sessionId}.pdf`;
    await fs.writeFile(outputPath, protectedBytes);

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

    res.json({
      success: true,
      message: 'PDF protected with password successfully',
      downloadUrl: `/temp/protected_${sessionId}.pdf`,
      sessionId,
      expiresAt,
      originalSize: pdfBytes.length,
      protectedSize: protectedBytes.length
    });

  } catch (error) {
    console.error('Error protecting PDF:', error);
    
    // Clean up uploaded file
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to protect PDF. Please ensure the file is a valid PDF document.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Convert images to PDF
router.post('/images-to-pdf', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image file is required' 
      });
    }

    const files = req.files as Express.Multer.File[];
    const { title = 'Images to PDF', layout = 'fit', margin = 50 } = req.body;

    const pdf = await PDFDocument.create();

    // Process each image
    for (const file of files) {
      try {
        let imageBytes: Uint8Array;
        let image: any;

        // Convert image to supported format if needed
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
          imageBytes = await fs.readFile(file.path);
          image = await pdf.embedJpg(imageBytes);
        } else {
          // Convert to JPEG using Sharp for better compatibility
          const convertedBuffer = await sharp(file.path)
            .jpeg({ quality: 90 })
            .toBuffer();
          image = await pdf.embedJpg(convertedBuffer);
        }

        // Add page with image
        const page = pdf.addPage();
        const { width: pageWidth, height: pageHeight } = page.getSize();
        const { width: imgWidth, height: imgHeight } = image.scale(1);

        // Calculate dimensions based on layout
        let x: number, y: number, width: number, height: number;
        const marginPx = parseInt(margin.toString());

        if (layout === 'fit') {
          const availableWidth = pageWidth - (marginPx * 2);
          const availableHeight = pageHeight - (marginPx * 2);
          
          const scaleX = availableWidth / imgWidth;
          const scaleY = availableHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY);
          
          width = imgWidth * scale;
          height = imgHeight * scale;
          x = (pageWidth - width) / 2;
          y = (pageHeight - height) / 2;
        } else {
          // Fill page
          width = pageWidth - (marginPx * 2);
          height = pageHeight - (marginPx * 2);
          x = marginPx;
          y = marginPx;
        }

        page.drawImage(image, { x, y, width, height });
        
        // Clean up uploaded file
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error processing image ${file.originalname}:`, error);
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
    }

    // Add title to PDF metadata
    pdf.setTitle(title);
    pdf.setCreator('StudentHub PDF Tools');
    pdf.setProducer('StudentHub Educational Platform');

    const pdfBytes = await pdf.save();
    
    // Save PDF
    const sessionId = uuidv4();
    const outputPath = `temp/downloads/images_to_pdf_${sessionId}.pdf`;
    await fs.writeFile(outputPath, pdfBytes);

    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

    res.json({
      success: true,
      message: `${files.length} images converted to PDF successfully`,
      downloadUrl: `/temp/images_to_pdf_${sessionId}.pdf`,
      sessionId,
      expiresAt,
      fileSize: pdfBytes.length,
      pageCount: pdf.getPageCount(),
      imageCount: files.length
    });

  } catch (error) {
    console.error('Error converting images to PDF:', error);
    
    // Clean up any uploaded files
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      for (const file of files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to convert images to PDF. Please ensure all files are valid image files.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;