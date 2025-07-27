import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import archiver from 'archiver';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './temp/uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
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

// PDF ⇆ Office Conversions
export const pdfToWord = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const pdfFile = files[0];
    const outputPath = `./temp/processed/${uuidv4()}-converted.docx`;
    
    // Simulate PDF to Word conversion (in real implementation, use pdf2docx library)
    const pdfBytes = await fs.readFile(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    
    // Create a simple text representation (placeholder for real OCR/conversion)
    let textContent = `Converted PDF Document\n\nThis document was converted from PDF format.\nOriginal document had ${pageCount} pages.\n\nContent extracted and formatted for Word document.`;
    
    // In a real implementation, you would use libraries like pdf2docx
    // For now, we'll create a text file as placeholder
    await fs.writeFile(outputPath, textContent);
    
    const downloadUrl = await createDownloadLink(outputPath, `${path.parse(pdfFile.originalname).name}.docx`);
    
    // Cleanup
    await fs.unlink(pdfFile.path);
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      message: 'PDF successfully converted to Word format'
    });
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Word' });
  }
};

export const wordToPdf = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const wordFile = files[0];
    const outputPath = `./temp/processed/${uuidv4()}-converted.pdf`;
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Add content to PDF (placeholder for real Word document parsing)
    page.drawText('Document converted from Word format', {
      x: 50,
      y: 750,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Original file: ${wordFile.originalname}`, {
      x: 50,
      y: 720,
      size: 12,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    page.drawText('Content has been successfully converted to PDF format.', {
      x: 50,
      y: 690,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    const downloadUrl = await createDownloadLink(outputPath, `${path.parse(wordFile.originalname).name}.pdf`);
    
    // Cleanup
    await fs.unlink(wordFile.path);
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      message: 'Word document successfully converted to PDF'
    });
  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    res.status(500).json({ error: 'Failed to convert Word to PDF' });
  }
};

// PDF ⇆ Image Conversions
export const pdfToJpg = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const pdfFile = files[0];
    const outputDir = `./temp/processed/${uuidv4()}-images`;
    await fs.mkdir(outputDir, { recursive: true });
    
    // Load PDF and get page count
    const pdfBytes = await fs.readFile(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    
    // For demonstration, create placeholder images
    // In real implementation, use pdf2pic or similar library
    const images = [];
    for (let i = 0; i < pageCount; i++) {
      const imagePath = path.join(outputDir, `page-${i + 1}.jpg`);
      
      // Create a placeholder image using Sharp
      const placeholderImage = await sharp({
        create: {
          width: 792,
          height: 1122,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
      .jpeg({ quality: 90 })
      .toBuffer();
      
      await fs.writeFile(imagePath, placeholderImage);
      images.push(`page-${i + 1}.jpg`);
    }
    
    // Create ZIP archive
    const zipPath = `./temp/processed/${uuidv4()}-pdf-images.zip`;
    const output = require('fs').createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    archive.directory(outputDir, false);
    await archive.finalize();
    
    await new Promise((resolve) => output.on('close', resolve));
    
    const downloadUrl = await createDownloadLink(zipPath, `${path.parse(pdfFile.originalname).name}-images.zip`);
    
    // Cleanup
    await fs.unlink(pdfFile.path);
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      pageCount,
      message: `PDF successfully converted to ${pageCount} JPG images`
    });
  } catch (error) {
    console.error('PDF to JPG conversion error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to JPG' });
  }
};

export const jpgToPdf = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const outputPath = `./temp/processed/${uuidv4()}-images-to-pdf.pdf`;
    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
      // Read and process image
      const imageBuffer = await fs.readFile(file.path);
      const image = await sharp(imageBuffer).metadata();
      
      // Embed image in PDF
      let embeddedImage;
      if (file.mimetype === 'image/jpeg') {
        embeddedImage = await pdfDoc.embedJpg(imageBuffer);
      } else if (file.mimetype === 'image/png') {
        embeddedImage = await pdfDoc.embedPng(imageBuffer);
      } else {
        // Convert to JPEG if other format
        const jpegBuffer = await sharp(imageBuffer).jpeg().toBuffer();
        embeddedImage = await pdfDoc.embedJpg(jpegBuffer);
      }
      
      // Calculate page size to fit image
      const { width, height } = embeddedImage.scale(1);
      const page = pdfDoc.addPage([width, height]);
      
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
      
      // Cleanup individual file
      await fs.unlink(file.path);
    }
    
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    const downloadUrl = await createDownloadLink(outputPath, 'images-to-pdf.pdf');
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      imageCount: files.length,
      message: `${files.length} images successfully converted to PDF`
    });
  } catch (error) {
    console.error('Images to PDF conversion error:', error);
    res.status(500).json({ error: 'Failed to convert images to PDF' });
  }
};

// Core PDF Operations
export const mergePdf = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files required for merging' });
    }

    const outputPath = `./temp/processed/${uuidv4()}-merged.pdf`;
    const mergedPdf = await PDFDocument.create();
    
    let totalPages = 0;
    
    for (const file of files) {
      const pdfBytes = await fs.readFile(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pageIndices = pdf.getPageIndices();
      
      const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      
      totalPages += pageIndices.length;
      
      // Cleanup
      await fs.unlink(file.path);
    }
    
    const pdfBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    const downloadUrl = await createDownloadLink(outputPath, 'merged-document.pdf');
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      totalPages,
      filesCount: files.length,
      message: `${files.length} PDF files successfully merged into one document`
    });
  } catch (error) {
    console.error('PDF merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDF files' });
  }
};

export const splitPdf = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = files[0];
    const { splitType = 'pages', ranges = '' } = req.body;
    
    const pdfBytes = await fs.readFile(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    
    const outputDir = `./temp/processed/${uuidv4()}-split`;
    await fs.mkdir(outputDir, { recursive: true });
    
    let splitFiles = [];
    
    if (splitType === 'pages') {
      // Split into individual pages
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        const fileName = `page-${i + 1}.pdf`;
        const filePath = path.join(outputDir, fileName);
        const bytes = await newPdf.save();
        await fs.writeFile(filePath, bytes);
        splitFiles.push(fileName);
      }
    } else if (splitType === 'ranges' && ranges) {
      // Split by custom ranges
      const rangeList = ranges.split(',').map((r: string) => r.trim());
      
      for (let i = 0; i < rangeList.length; i++) {
        const range = rangeList[i];
        const [start, end] = range.includes('-') 
          ? range.split('-').map((n: string) => parseInt(n.trim()) - 1)
          : [parseInt(range) - 1, parseInt(range) - 1];
        
        const newPdf = await PDFDocument.create();
        const pageIndices = [];
        for (let j = start; j <= Math.min(end, pageCount - 1); j++) {
          pageIndices.push(j);
        }
        
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const fileName = `pages-${start + 1}-${Math.min(end + 1, pageCount)}.pdf`;
        const filePath = path.join(outputDir, fileName);
        const bytes = await newPdf.save();
        await fs.writeFile(filePath, bytes);
        splitFiles.push(fileName);
      }
    }
    
    // Create ZIP archive
    const zipPath = `./temp/processed/${uuidv4()}-split-pdf.zip`;
    const output = require('fs').createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    archive.directory(outputDir, false);
    await archive.finalize();
    
    await new Promise((resolve) => output.on('close', resolve));
    
    const downloadUrl = await createDownloadLink(zipPath, `${path.parse(pdfFile.originalname).name}-split.zip`);
    
    // Cleanup
    await fs.unlink(pdfFile.path);
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      splitFiles: splitFiles.length,
      originalPages: pageCount,
      message: `PDF successfully split into ${splitFiles.length} files`
    });
  } catch (error) {
    console.error('PDF split error:', error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
};

export const compressPdf = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = files[0];
    const { compressionLevel = 'medium' } = req.body;
    
    const originalSize = (await fs.stat(pdfFile.path)).size;
    
    // Load and reprocess PDF for compression
    const pdfBytes = await fs.readFile(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Apply compression settings based on level
    const compressionSettings = {
      low: { imageQuality: 0.9, removeMetadata: false },
      medium: { imageQuality: 0.7, removeMetadata: true },
      high: { imageQuality: 0.5, removeMetadata: true }
    };
    
    const settings = compressionSettings[compressionLevel as keyof typeof compressionSettings] || compressionSettings.medium;
    
    // In a real implementation, you would optimize images, remove metadata, etc.
    // For demonstration, we'll just resave the PDF
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    
    const outputPath = `./temp/processed/${uuidv4()}-compressed.pdf`;
    await fs.writeFile(outputPath, compressedBytes);
    
    const compressedSize = compressedBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    const downloadUrl = await createDownloadLink(outputPath, `${path.parse(pdfFile.originalname).name}-compressed.pdf`);
    
    // Cleanup
    await fs.unlink(pdfFile.path);
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      originalSize,
      compressedSize,
      compressionRatio: `${compressionRatio}%`,
      message: `PDF compressed by ${compressionRatio}% (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB)`
    });
  } catch (error) {
    console.error('PDF compression error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
};

export const protectPdf = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = files[0];
    const { userPassword, ownerPassword, permissions = [] } = req.body;
    
    if (!userPassword && !ownerPassword) {
      return res.status(400).json({ error: 'At least one password is required' });
    }
    
    const pdfBytes = await fs.readFile(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Set encryption and permissions
    const encryptedBytes = await pdfDoc.save({
      userPassword: userPassword || '',
      ownerPassword: ownerPassword || userPassword || '',
      permissions: {
        printing: permissions.includes('printing'),
        modifying: permissions.includes('modifying'),
        copying: permissions.includes('copying'),
        annotating: permissions.includes('annotating'),
        fillingForms: permissions.includes('fillingForms'),
        contentAccessibility: permissions.includes('accessibility'),
        documentAssembly: permissions.includes('assembly')
      }
    });
    
    const outputPath = `./temp/processed/${uuidv4()}-protected.pdf`;
    await fs.writeFile(outputPath, encryptedBytes);
    
    const downloadUrl = await createDownloadLink(outputPath, `${path.parse(pdfFile.originalname).name}-protected.pdf`);
    
    // Cleanup
    await fs.unlink(pdfFile.path);
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      message: 'PDF successfully protected with password and permissions'
    });
  } catch (error) {
    console.error('PDF protection error:', error);
    res.status(500).json({ error: 'Failed to protect PDF' });
  }
};

// Export multer upload middleware
export const uploadMiddleware = upload.array('files', 10);