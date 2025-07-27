import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'temp/uploads/' });

// Resize Image
router.post('/resize', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { width, height, maintainAspectRatio = true } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    if (!width && !height) {
      return res.status(400).json({ error: 'Width or height is required' });
    }

    let resizeOptions: any = {};
    
    if (maintainAspectRatio === 'true') {
      resizeOptions.width = width ? parseInt(width) : undefined;
      resizeOptions.height = height ? parseInt(height) : undefined;
      resizeOptions.fit = 'inside';
      resizeOptions.withoutEnlargement = true;
    } else {
      resizeOptions.width = parseInt(width);
      resizeOptions.height = parseInt(height);
      resizeOptions.fit = 'fill';
    }

    const processedImage = await sharp(file.path)
      .resize(resizeOptions)
      .toBuffer();

    const outputPath = path.join('temp/processed', `resized_${Date.now()}.png`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, processedImage);
    
    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      message: 'Image resized successfully',
      downloadUrl: `/api/image-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('Image resize error:', error);
    res.status(500).json({ error: 'Failed to resize image' });
  }
});

// Crop Image
router.post('/crop', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { x, y, width, height } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const cropOptions = {
      left: parseInt(x) || 0,
      top: parseInt(y) || 0,
      width: parseInt(width),
      height: parseInt(height)
    };

    const processedImage = await sharp(file.path)
      .extract(cropOptions)
      .toBuffer();

    const outputPath = path.join('temp/processed', `cropped_${Date.now()}.png`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, processedImage);
    
    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      message: 'Image cropped successfully',
      downloadUrl: `/api/image-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('Image crop error:', error);
    res.status(500).json({ error: 'Failed to crop image' });
  }
});

// Compress Image
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { quality = 80, format = 'jpeg' } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    let sharpInstance = sharp(file.path);
    
    if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality: parseInt(quality) });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality: parseInt(quality) });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: parseInt(quality) });
    }

    const processedImage = await sharpInstance.toBuffer();
    const outputPath = path.join('temp/processed', `compressed_${Date.now()}.${format}`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, processedImage);
    
    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      message: 'Image compressed successfully',
      downloadUrl: `/api/image-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('Image compress error:', error);
    res.status(500).json({ error: 'Failed to compress image' });
  }
});

// Convert Image Format
router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { format = 'png' } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    let sharpInstance = sharp(file.path);
    
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        sharpInstance = sharpInstance.jpeg();
        break;
      case 'png':
        sharpInstance = sharpInstance.png();
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp();
        break;
      case 'tiff':
        sharpInstance = sharpInstance.tiff();
        break;
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }

    const processedImage = await sharpInstance.toBuffer();
    const outputPath = path.join('temp/processed', `converted_${Date.now()}.${format}`);
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, processedImage);
    
    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      message: 'Image converted successfully',
      downloadUrl: `/api/image-tools/download/${path.basename(outputPath)}`
    });

  } catch (error) {
    console.error('Image convert error:', error);
    res.status(500).json({ error: 'Failed to convert image' });
  }
});

// Download processed file
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
      }
    });
    
  } catch (error) {
    console.error('File access error:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;