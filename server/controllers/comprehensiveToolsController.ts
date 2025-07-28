import { Request, Response } from 'express';
import { pdfService } from '../services/pdfService';
import { imageService } from '../services/imageService';
import { textService } from '../services/textService';
import { utilityService } from '../services/utilityService';

export class ComprehensiveToolsController {

  // ===== PDF TOOLS =====
  
  // Core PDF Operations
  async mergePDF(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length < 2) {
        return res.status(400).json({ error: 'At least 2 PDF files required for merging' });
      }

      const result = await pdfService.mergePDFs(files);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF merge error:', error);
      res.status(500).json({ error: 'Failed to merge PDF files' });
    }
  }

  async splitPDF(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const { split_mode = 'pages', ranges, fixed_range } = req.body;
      const options = { ranges, fixed_range: parseInt(fixed_range) };
      
      const results = await pdfService.splitPDF(file.buffer, split_mode, options);
      
      // Convert results to base64 for JSON response
      const base64Results = results.map((buffer, index) => ({
        filename: `page_${index + 1}.pdf`,
        data: buffer.toString('base64')
      }));
      
      res.json({ 
        success: true, 
        files: base64Results,
        count: results.length 
      });
    } catch (error) {
      console.error('PDF split error:', error);
      res.status(500).json({ error: 'Failed to split PDF file' });
    }
  }

  async compressPDF(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const { compression_level = 'recommended' } = req.body;
      const result = await pdfService.compressPDF(file.buffer, compression_level);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF compression error:', error);
      res.status(500).json({ error: 'Failed to compress PDF file' });
    }
  }

  async rotatePDF(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const { angle = 90, pages } = req.body;
      const pageIndices = pages ? pages.split(',').map((p: string) => parseInt(p) - 1) : undefined;
      
      const result = await pdfService.rotatePDF(file.buffer, parseInt(angle), pageIndices);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=rotated.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF rotation error:', error);
      res.status(500).json({ error: 'Failed to rotate PDF file' });
    }
  }

  async protectPDF(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const { password, permissions = {} } = req.body;
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }
      
      const result = await pdfService.protectPDF(file.buffer, password, permissions);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=protected.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF protection error:', error);
      res.status(500).json({ error: 'Failed to protect PDF file' });
    }
  }

  async unlockPDF(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }
      
      const result = await pdfService.unlockPDF(file.buffer, password);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=unlocked.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF unlock error:', error);
      res.status(500).json({ error: 'Failed to unlock PDF file - check password' });
    }
  }

  // PDF Image Conversion
  async pdfToJPG(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const images = await pdfService.pdfToImages(file.buffer, 'jpg');
      
      res.json({
        success: true,
        images: images.map((img, index) => ({
          filename: `page_${index + 1}.jpg`,
          data: img
        })),
        count: images.length
      });
    } catch (error) {
      console.error('PDF to JPG error:', error);
      res.status(500).json({ error: 'Failed to convert PDF to JPG' });
    }
  }

  async pdfToPNG(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const images = await pdfService.pdfToImages(file.buffer, 'png');
      
      res.json({
        success: true,
        images: images.map((img, index) => ({
          filename: `page_${index + 1}.png`,
          data: img
        })),
        count: images.length
      });
    } catch (error) {
      console.error('PDF to PNG error:', error);
      res.status(500).json({ error: 'Failed to convert PDF to PNG' });
    }
  }

  async imageToPDF(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'At least one image file is required' });
      }

      const result = await pdfService.imagesToPDF(files);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=images.pdf');
      res.send(result);
    } catch (error) {
      console.error('Image to PDF error:', error);
      res.status(500).json({ error: 'Failed to convert images to PDF' });
    }
  }

  // PDF Enhancement
  async addWatermark(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const { text, ...options } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Watermark text is required' });
      }
      
      const result = await pdfService.addWatermark(file.buffer, text, options);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF watermark error:', error);
      res.status(500).json({ error: 'Failed to add watermark to PDF' });
    }
  }

  async addPageNumbers(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const options = req.body;
      const result = await pdfService.addPageNumbers(file.buffer, options);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=numbered.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF page numbers error:', error);
      res.status(500).json({ error: 'Failed to add page numbers to PDF' });
    }
  }

  async performOCR(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const { languages = ['eng'] } = req.body;
      const result = await pdfService.performOCR(file.buffer, languages);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=ocr.pdf');
      res.send(result);
    } catch (error) {
      console.error('PDF OCR error:', error);
      res.status(500).json({ error: 'Failed to perform OCR on PDF' });
    }
  }

  // Office Conversion
  async officeToPDF(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Office file is required' });
      }

      const sourceFormat = file.originalname?.split('.').pop()?.toLowerCase() || 'docx';
      const result = await pdfService.convertToPDF(file.buffer, sourceFormat);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=converted.pdf`);
      res.send(result);
    } catch (error) {
      console.error('Office to PDF error:', error);
      res.status(500).json({ error: 'Failed to convert office file to PDF' });
    }
  }

  // ===== IMAGE TOOLS =====
  
  async resizeImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const options = req.body;
      const result = await imageService.resizeImage(file.buffer, options);
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=resized.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image resize error:', error);
      res.status(500).json({ error: 'Failed to resize image' });
    }
  }

  async cropImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const { width, height, x, y } = req.body;
      const result = await imageService.cropImage(file.buffer, { width: parseInt(width), height: parseInt(height), x: parseInt(x), y: parseInt(y) });
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=cropped.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image crop error:', error);
      res.status(500).json({ error: 'Failed to crop image' });
    }
  }

  async compressImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const options = req.body;
      const result = await imageService.compressImage(file.buffer, options);
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=compressed.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image compression error:', error);
      res.status(500).json({ error: 'Failed to compress image' });
    }
  }

  async convertImageFormat(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const { format } = req.body;
      if (!format) {
        return res.status(400).json({ error: 'Target format is required' });
      }

      const result = await imageService.convertImageFormat(file.buffer, format);
      
      res.setHeader('Content-Type', `image/${format}`);
      res.setHeader('Content-Disposition', `attachment; filename=converted.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image format conversion error:', error);
      res.status(500).json({ error: 'Failed to convert image format' });
    }
  }

  async rotateImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const { angle = 90 } = req.body;
      const result = await imageService.rotateImage(file.buffer, parseInt(angle));
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=rotated.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image rotation error:', error);
      res.status(500).json({ error: 'Failed to rotate image' });
    }
  }

  async flipImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const { direction = 'horizontal' } = req.body;
      const result = await imageService.flipImage(file.buffer, direction);
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=flipped.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image flip error:', error);
      res.status(500).json({ error: 'Failed to flip image' });
    }
  }

  async enhanceImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const options = req.body;
      const result = await imageService.enhanceImage(file.buffer, options);
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=enhanced.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image enhancement error:', error);
      res.status(500).json({ error: 'Failed to enhance image' });
    }
  }

  async removeBackground(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const result = await imageService.removeBackground(file.buffer);
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=no-background.png');
      res.send(result);
    } catch (error) {
      console.error('Background removal error:', error);
      res.status(500).json({ error: 'Failed to remove background' });
    }
  }

  async upscaleImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const { factor = 2 } = req.body;
      const result = await imageService.upscaleImage(file.buffer, parseFloat(factor));
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=upscaled.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image upscale error:', error);
      res.status(500).json({ error: 'Failed to upscale image' });
    }
  }

  async addImageWatermark(req: Request, res: Response) {
    try {
      const files = req.files as any;
      if (!files || !files.image || !files.watermark) {
        return res.status(400).json({ error: 'Both image and watermark files are required' });
      }

      const imageFile = files.image[0];
      const watermarkFile = files.watermark[0];
      const options = req.body;

      const result = await imageService.addImageWatermark(imageFile.buffer, watermarkFile.buffer, options);
      
      const format = imageFile.mimetype.split('/')[1];
      res.setHeader('Content-Type', imageFile.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=watermarked.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Image watermark error:', error);
      res.status(500).json({ error: 'Failed to add watermark to image' });
    }
  }

  async addTextWatermarkToImage(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const { text, ...options } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Watermark text is required' });
      }

      const result = await imageService.addTextWatermark(file.buffer, text, options);
      
      const format = file.mimetype.split('/')[1];
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=watermarked.${format}`);
      res.send(result);
    } catch (error) {
      console.error('Text watermark error:', error);
      res.status(500).json({ error: 'Failed to add text watermark to image' });
    }
  }

  // ===== TEXT TOOLS =====
  
  async textToPDF(req: Request, res: Response) {
    try {
      const { text, options = {} } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      const result = await textService.textToPDF(text, options);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=text.pdf');
      res.send(result);
    } catch (error) {
      console.error('Text to PDF error:', error);
      res.status(500).json({ error: 'Failed to convert text to PDF' });
    }
  }

  async extractTextFromPDF(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const text = await textService.extractTextFromPDF(file.buffer);
      
      res.json({
        success: true,
        text: text,
        wordCount: text.split(/\s+/).length,
        characterCount: text.length
      });
    } catch (error) {
      console.error('Text extraction error:', error);
      res.status(500).json({ error: 'Failed to extract text from PDF' });
    }
  }

  // ===== UTILITY TOOLS =====
  
  async generateQRCode(req: Request, res: Response) {
    try {
      const { text, options = {} } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      const result = await utilityService.generateQRCode(text, options);
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
      res.send(result);
    } catch (error) {
      console.error('QR code generation error:', error);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  }

  async generatePassword(req: Request, res: Response) {
    try {
      const options = req.body;
      const password = await utilityService.generatePassword(options);
      
      res.json({
        success: true,
        password: password,
        length: password.length
      });
    } catch (error) {
      console.error('Password generation error:', error);
      res.status(500).json({ error: 'Failed to generate password' });
    }
  }

  async hashText(req: Request, res: Response) {
    try {
      const { text, algorithm = 'sha256' } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      const hash = await utilityService.hashText(text, algorithm);
      
      res.json({
        success: true,
        original: text,
        algorithm: algorithm,
        hash: hash
      });
    } catch (error) {
      console.error('Text hashing error:', error);
      res.status(500).json({ error: 'Failed to hash text' });
    }
  }

  async encodeBase64(req: Request, res: Response) {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      const encoded = await utilityService.encodeBase64(text);
      
      res.json({
        success: true,
        original: text,
        encoded: encoded
      });
    } catch (error) {
      console.error('Base64 encoding error:', error);
      res.status(500).json({ error: 'Failed to encode text' });
    }
  }

  async decodeBase64(req: Request, res: Response) {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Encoded text is required' });
      }

      const decoded = await utilityService.decodeBase64(text);
      
      res.json({
        success: true,
        encoded: text,
        decoded: decoded
      });
    } catch (error) {
      console.error('Base64 decoding error:', error);
      res.status(500).json({ error: 'Failed to decode text' });
    }
  }
}

export const comprehensiveToolsController = new ComprehensiveToolsController();