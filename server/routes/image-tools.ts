import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const router = express.Router();
const upload = multer({ 
  dest: 'temp/',
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Image Resize Tool
router.post('/resize', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { width, height, maintainAspectRatio } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    let sharpInstance = sharp(file.path);
    
    if (maintainAspectRatio === 'true') {
      sharpInstance = sharpInstance.resize(parseInt(width), parseInt(height), {
        fit: 'inside',
        withoutEnlargement: false
      });
    } else {
      sharpInstance = sharpInstance.resize(parseInt(width), parseInt(height));
    }

    const outputPath = `temp/resized-${Date.now()}.jpg`;
    await sharpInstance.jpeg({ quality: 90 }).toFile(outputPath);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'resized-image.jpg', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Image resize error:', error);
    res.status(500).json({ error: 'Failed to resize image' });
  }
});

// Image Compress Tool
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { quality } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const compressionQuality = quality ? parseInt(quality) : 80;
    const outputPath = `temp/compressed-${Date.now()}.jpg`;
    
    await sharp(file.path)
      .jpeg({ quality: compressionQuality })
      .toFile(outputPath);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'compressed-image.jpg', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Image compress error:', error);
    res.status(500).json({ error: 'Failed to compress image' });
  }
});

// Image Crop Tool
router.post('/crop', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { left, top, width, height } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const outputPath = `temp/cropped-${Date.now()}.jpg`;
    
    await sharp(file.path)
      .extract({
        left: parseInt(left) || 0,
        top: parseInt(top) || 0,
        width: parseInt(width) || 100,
        height: parseInt(height) || 100
      })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'cropped-image.jpg', (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Image crop error:', error);
    res.status(500).json({ error: 'Failed to crop image' });
  }
});

// Image Convert Tool
router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { outputFormat } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const format = outputFormat || 'jpeg';
    const outputPath = `temp/converted-${Date.now()}.${format}`;
    
    let sharpInstance = sharp(file.path);
    
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        await sharpInstance.jpeg({ quality: 90 }).toFile(outputPath);
        break;
      case 'png':
        await sharpInstance.png().toFile(outputPath);
        break;
      case 'webp':
        await sharpInstance.webp({ quality: 90 }).toFile(outputPath);
        break;
      default:
        throw new Error('Unsupported format');
    }

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, `converted-image.${format}`, (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Image convert error:', error);
    res.status(500).json({ error: 'Failed to convert image' });
  }
});

export default router;