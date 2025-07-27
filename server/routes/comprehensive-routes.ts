import express from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';

// Import all comprehensive tool functions
import {
  pdfToWord, wordToPdf, pdfToJpg, jpgToPdf, mergePdf, splitPdf, compressPdf, protectPdf,
  uploadMiddleware as pdfUpload
} from './comprehensive-pdf-tools';

import {
  resizeImage, compressImage, convertFormat, cropImage, rotateImage, flipImage,
  uploadMiddleware as imageUpload
} from './comprehensive-image-tools';

import {
  textToPdf, htmlToPdf, wordCounter, textSummarizer, grammarChecker, caseConverter,
  uploadMiddleware as textUpload
} from './comprehensive-text-tools';

import {
  generateQR, generatePassword, generateHash, base64Convert, urlEncode, generateColorPalette,
  uploadMiddleware as utilUpload
} from './comprehensive-utility-tools';

const router = express.Router();

// Ensure temp directories exist
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

// PDF Tools Routes
router.post('/pdf/office/pdf-to-word', pdfUpload, pdfToWord);
router.post('/pdf/office/word-to-pdf', pdfUpload, wordToPdf);
router.post('/pdf/image/pdf-to-jpg', pdfUpload, pdfToJpg);
router.post('/pdf/image/jpg-to-pdf', pdfUpload, jpgToPdf);
router.post('/pdf/core/merge', pdfUpload, mergePdf);
router.post('/pdf/core/split', pdfUpload, splitPdf);
router.post('/pdf/core/compress', pdfUpload, compressPdf);
router.post('/pdf/core/protect', pdfUpload, protectPdf);

// Image Tools Routes
router.post('/image/resize', imageUpload, resizeImage);
router.post('/image/compress', imageUpload, compressImage);
router.post('/image/convert', imageUpload, convertFormat);
router.post('/image/crop', imageUpload, cropImage);
router.post('/image/rotate', imageUpload, rotateImage);
router.post('/image/flip', imageUpload, flipImage);

// Text Tools Routes
router.post('/text/text-to-pdf', textToPdf);
router.post('/text/html-to-pdf', htmlToPdf);
router.post('/text/word-count', wordCounter);
router.post('/text/summarize', textSummarizer);
router.post('/text/grammar-check', grammarChecker);
router.post('/text/case-convert', caseConverter);

// Utility Tools Routes
router.post('/util/qr-generate', generateQR);
router.post('/util/password-generate', generatePassword);
router.post('/util/hash-generate', generateHash);
router.post('/util/base64-convert', base64Convert);
router.post('/util/url-encode', urlEncode);
router.post('/util/color-palette', generateColorPalette);

// Download endpoint for processed files
router.get('/download/:downloadId/:filename', async (req, res) => {
  try {
    const { downloadId, filename } = req.params;
    const filePath = path.join('temp/downloads', downloadId, filename);
    
    // Check if file exists
    await fs.access(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream file
    const fileBuffer = await fs.readFile(filePath);
    res.send(fileBuffer);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(404).json({ 
      error: 'File not found or expired',
      message: 'The requested file may have expired or does not exist'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      pdf: 'operational',
      image: 'operational', 
      text: 'operational',
      utility: 'operational'
    }
  });
});

export default router;