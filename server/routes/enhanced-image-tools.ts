import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

const router = express.Router();
const upload = multer({ 
  dest: 'temp/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Advanced Image Resize with multiple options
router.post('/resize-advanced', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { 
      width, 
      height, 
      maintainAspectRatio, 
      resizeMode = 'fit',
      background = 'white',
      format = 'original'
    } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    let sharpInstance = sharp(file.path);
    const metadata = await sharpInstance.metadata();
    
    // Determine output format
    let outputFormat = format === 'original' ? metadata.format : format;
    let outputPath = `temp/resized-${Date.now()}.${outputFormat}`;
    
    // Configure resize options
    const resizeOptions: any = {
      withoutEnlargement: false
    };
    
    switch (resizeMode) {
      case 'fill':
        resizeOptions.fit = 'fill';
        break;
      case 'inside':
        resizeOptions.fit = 'inside';
        break;
      case 'outside':
        resizeOptions.fit = 'outside';
        break;
      case 'cover':
        resizeOptions.fit = 'cover';
        break;
      default:
        resizeOptions.fit = 'contain';
    }
    
    if (background && background !== 'transparent') {
      resizeOptions.background = background;
    }

    // Apply resize
    if (maintainAspectRatio === 'true' || !height) {
      sharpInstance = sharpInstance.resize(parseInt(width), null, resizeOptions);
    } else {
      sharpInstance = sharpInstance.resize(parseInt(width), parseInt(height), resizeOptions);
    }

    // Apply output format and quality
    switch (outputFormat) {
      case 'jpeg':
      case 'jpg':
        await sharpInstance.jpeg({ quality: 90 }).toFile(outputPath);
        break;
      case 'png':
        await sharpInstance.png({ quality: 90 }).toFile(outputPath);
        break;
      case 'webp':
        await sharpInstance.webp({ quality: 90 }).toFile(outputPath);
        break;
      default:
        await sharpInstance.toFile(outputPath);
    }

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, `resized-image.${outputFormat}`, (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Advanced image resize error:', error);
    res.status(500).json({ error: 'Failed to resize image with advanced options' });
  }
});

// Image Format Conversion
router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { targetFormat, quality = 90, compression = 6 } = req.body;
    
    if (!file || !targetFormat) {
      return res.status(400).json({ error: 'Image file and target format required' });
    }

    const outputPath = `temp/converted-${Date.now()}.${targetFormat}`;
    let sharpInstance = sharp(file.path);

    // Apply conversion based on target format
    switch (targetFormat.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        await sharpInstance.jpeg({ 
          quality: parseInt(quality),
          progressive: true,
          mozjpeg: true
        }).toFile(outputPath);
        break;
        
      case 'png':
        await sharpInstance.png({ 
          quality: parseInt(quality),
          compressionLevel: parseInt(compression),
          progressive: true
        }).toFile(outputPath);
        break;
        
      case 'webp':
        await sharpInstance.webp({ 
          quality: parseInt(quality),
          effort: 6
        }).toFile(outputPath);
        break;
        
      case 'avif':
        await sharpInstance.avif({ 
          quality: parseInt(quality),
          effort: 6
        }).toFile(outputPath);
        break;
        
      case 'tiff':
        await sharpInstance.tiff({ 
          quality: parseInt(quality),
          compression: 'lzw'
        }).toFile(outputPath);
        break;
        
      default:
        throw new Error(`Unsupported format: ${targetFormat}`);
    }

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, `converted-image.${targetFormat}`, (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Image conversion error:', error);
    res.status(500).json({ error: 'Failed to convert image format' });
  }
});

// Advanced Image Compression
router.post('/compress-advanced', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { 
      quality = 80, 
      compressionLevel = 'balanced',
      preserveMetadata = false,
      outputFormat 
    } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const metadata = await sharp(file.path).metadata();
    const format = outputFormat || metadata.format || 'jpeg';
    const outputPath = `temp/compressed-${Date.now()}.${format}`;
    
    let sharpInstance = sharp(file.path);
    
    // Remove metadata unless preservation is requested
    if (!preserveMetadata) {
      sharpInstance = sharpInstance.withMetadata({});
    }

    // Set compression options based on level
    let compressionOptions: any = {};
    
    switch (compressionLevel) {
      case 'maximum':
        compressionOptions = { quality: Math.max(10, parseInt(quality) - 20) };
        break;
      case 'high':
        compressionOptions = { quality: Math.max(20, parseInt(quality) - 10) };
        break;
      case 'balanced':
        compressionOptions = { quality: parseInt(quality) };
        break;
      case 'low':
        compressionOptions = { quality: Math.min(95, parseInt(quality) + 10) };
        break;
    }

    // Apply format-specific compression
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        await sharpInstance.jpeg({
          ...compressionOptions,
          progressive: true,
          mozjpeg: true
        }).toFile(outputPath);
        break;
        
      case 'png':
        await sharpInstance.png({
          quality: compressionOptions.quality,
          compressionLevel: 9,
          progressive: true
        }).toFile(outputPath);
        break;
        
      case 'webp':
        await sharpInstance.webp({
          ...compressionOptions,
          effort: 6
        }).toFile(outputPath);
        break;
        
      default:
        await sharpInstance.jpeg(compressionOptions).toFile(outputPath);
    }

    // Calculate compression ratio
    const originalSize = fs.statSync(file.path).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.setHeader('X-Compression-Savings', `${savings}%`);
    res.setHeader('X-Original-Size', originalSize.toString());
    res.setHeader('X-Compressed-Size', compressedSize.toString());
    
    res.download(outputPath, `compressed-image.${format}`, (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Advanced image compression error:', error);
    res.status(500).json({ error: 'Failed to compress image' });
  }
});

// Image Crop Tool
router.post('/crop', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { x, y, width, height, cropMode = 'manual' } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const metadata = await sharp(file.path).metadata();
    const outputPath = `temp/cropped-${Date.now()}.${metadata.format}`;
    
    let sharpInstance = sharp(file.path);

    if (cropMode === 'center') {
      // Center crop to specified dimensions
      sharpInstance = sharpInstance.resize(
        parseInt(width), 
        parseInt(height), 
        { 
          fit: 'cover',
          position: 'center'
        }
      );
    } else if (cropMode === 'smart') {
      // Smart crop using entropy (focus on most interesting area)
      sharpInstance = sharpInstance.resize(
        parseInt(width), 
        parseInt(height), 
        { 
          fit: 'cover',
          position: 'entropy'
        }
      );
    } else {
      // Manual crop with specific coordinates
      const cropOptions = {
        left: parseInt(x) || 0,
        top: parseInt(y) || 0,
        width: parseInt(width),
        height: parseInt(height)
      };
      
      sharpInstance = sharpInstance.extract(cropOptions);
    }

    await sharpInstance.toFile(outputPath);

    // Clean up original file
    fs.unlinkSync(file.path);

    res.download(outputPath, 'cropped-image.' + metadata.format, (err) => {
      if (!err) {
        fs.unlinkSync(outputPath);
      }
    });
  } catch (error) {
    console.error('Image crop error:', error);
    res.status(500).json({ error: 'Failed to crop image' });
  }
});

// Batch Image Processing
router.post('/batch-process', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { 
      operation,
      width,
      height,
      quality = 80,
      format,
      watermarkText,
      watermarkOpacity = 0.5
    } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one image file required' });
    }

    const processedFiles: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = await sharp(file.path).metadata();
      const outputFormat = format || metadata.format || 'jpeg';
      const outputPath = `temp/batch-${i + 1}-${Date.now()}.${outputFormat}`;
      
      let sharpInstance = sharp(file.path);
      
      // Apply the specified operation
      switch (operation) {
        case 'resize':
          sharpInstance = sharpInstance.resize(parseInt(width), parseInt(height), {
            fit: 'inside',
            withoutEnlargement: false
          });
          break;
          
        case 'compress':
          // Compression is applied during save
          break;
          
        case 'convert':
          // Format conversion is applied during save
          break;
          
        case 'normalize':
          sharpInstance = sharpInstance.normalize();
          break;
          
        case 'enhance':
          sharpInstance = sharpInstance
            .modulate({ brightness: 1.1, saturation: 1.1 })
            .sharpen();
          break;
      }
      
      // Add watermark if requested
      if (watermarkText) {
        const textSvg = `
          <svg width="${metadata.width}" height="${metadata.height}">
            <text x="50%" y="95%" 
                  text-anchor="middle" 
                  font-family="Arial" 
                  font-size="24" 
                  fill="white" 
                  fill-opacity="${watermarkOpacity}">
              ${watermarkText}
            </text>
          </svg>
        `;
        
        const watermarkBuffer = Buffer.from(textSvg);
        sharpInstance = sharpInstance.composite([
          { input: watermarkBuffer, gravity: 'southeast' }
        ]);
      }

      // Save with appropriate format and quality
      switch (outputFormat.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          await sharpInstance.jpeg({ quality: parseInt(quality) }).toFile(outputPath);
          break;
        case 'png':
          await sharpInstance.png({ quality: parseInt(quality) }).toFile(outputPath);
          break;
        case 'webp':
          await sharpInstance.webp({ quality: parseInt(quality) }).toFile(outputPath);
          break;
        default:
          await sharpInstance.toFile(outputPath);
      }
      
      processedFiles.push(outputPath);
      
      // Clean up original file
      fs.unlinkSync(file.path);
    }

    // Create ZIP archive for batch download
    const zipPath = `temp/batch-processed-${Date.now()}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    processedFiles.forEach((filePath, index) => {
      archive.file(filePath, { name: `processed-${index + 1}.${format || 'jpg'}` });
    });
    
    await archive.finalize();
    
    output.on('close', () => {
      res.download(zipPath, 'batch-processed-images.zip', (err) => {
        if (!err) {
          fs.unlinkSync(zipPath);
          processedFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }
      });
    });
    
  } catch (error) {
    console.error('Batch image processing error:', error);
    res.status(500).json({ error: 'Failed to process images in batch' });
  }
});

// Image Metadata Extractor
router.post('/metadata', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const metadata = await sharp(file.path).metadata();
    const stats = fs.statSync(file.path);
    
    const imageInfo = {
      filename: file.originalname,
      size: stats.size,
      sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      channels: metadata.channels,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      hasProfile: metadata.hasProfile,
      space: metadata.space,
      created: stats.birthtime,
      modified: stats.mtime,
      aspectRatio: metadata.width && metadata.height ? 
        (metadata.width / metadata.height).toFixed(2) : null,
      megapixels: metadata.width && metadata.height ? 
        ((metadata.width * metadata.height) / 1000000).toFixed(1) : null
    };

    // Clean up file
    fs.unlinkSync(file.path);

    res.json(imageInfo);
    
  } catch (error) {
    console.error('Image metadata extraction error:', error);
    res.status(500).json({ error: 'Failed to extract image metadata' });
  }
});

export default router;