import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  dest: 'temp/uploads/',
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/avif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
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

// Resize images with advanced options
router.post('/resize', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image file is required' 
      });
    }

    const files = req.files as Express.Multer.File[];
    const { 
      width, 
      height, 
      maintainAspectRatio = 'true',
      resizeMode = 'fit',
      background = '#ffffff',
      format = 'original',
      quality = 90
    } = req.body;

    const widthPx = parseInt(width) || null;
    const heightPx = parseInt(height) || null;
    const maintainAspect = maintainAspectRatio === 'true';
    const qualityNum = Math.min(Math.max(parseInt(quality) || 90, 1), 100);

    if (!widthPx && !heightPx) {
      return res.status(400).json({
        success: false,
        message: 'At least width or height must be specified'
      });
    }

    const sessionId = uuidv4();
    const processedFiles: Array<{name: string, originalSize: number, newSize: number, path: string}> = [];

    // Process each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const originalSize = (await fs.stat(file.path)).size;
        
        // Get original image info
        const metadata = await sharp(file.path).metadata();
        
        // Create Sharp instance
        let sharpInstance = sharp(file.path);

        // Configure resize options
        const resizeOptions: any = {};
        
        if (widthPx) resizeOptions.width = widthPx;
        if (heightPx) resizeOptions.height = heightPx;

        if (maintainAspect) {
          resizeOptions.fit = resizeMode === 'fill' ? 'fill' : 'inside';
          if (resizeMode === 'fill') {
            resizeOptions.background = background;
          }
        } else {
          resizeOptions.fit = 'fill';
        }

        sharpInstance = sharpInstance.resize(resizeOptions);

        // Determine output format
        let outputFormat = format === 'original' ? 
          (metadata.format || 'jpeg') : format;
        
        let outputExt = outputFormat;
        if (outputFormat === 'jpeg') outputExt = 'jpg';

        // Apply format and quality
        switch (outputFormat) {
          case 'jpeg':
          case 'jpg':
            sharpInstance = sharpInstance.jpeg({ quality: qualityNum });
            break;
          case 'png':
            sharpInstance = sharpInstance.png({ 
              quality: qualityNum,
              compressionLevel: Math.floor((100 - qualityNum) / 10)
            });
            break;
          case 'webp':
            sharpInstance = sharpInstance.webp({ quality: qualityNum });
            break;
          case 'avif':
            sharpInstance = sharpInstance.avif({ quality: qualityNum });
            break;
          default:
            sharpInstance = sharpInstance.jpeg({ quality: qualityNum });
        }

        // Generate output filename
        const originalName = path.parse(file.originalname).name;
        const outputFileName = `resized_${originalName}_${widthPx || 'auto'}x${heightPx || 'auto'}.${outputExt}`;
        const outputPath = `temp/downloads/resize_${sessionId}_${i + 1}.${outputExt}`;

        // Process and save
        await sharpInstance.toFile(outputPath);
        
        const newSize = (await fs.stat(outputPath)).size;
        
        processedFiles.push({
          name: outputFileName,
          originalSize,
          newSize,
          path: outputPath
        });

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

    if (processedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process any images'
      });
    }

    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

    // If multiple files, create ZIP
    if (processedFiles.length > 1) {
      const zipPath = `temp/downloads/resized_images_${sessionId}.zip`;
      const output = createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      for (const file of processedFiles) {
        const fileBuffer = await fs.readFile(file.path);
        archive.append(fileBuffer, { name: file.name });
        // Clean up individual files
        await fs.unlink(file.path);
      }

      await archive.finalize();

      res.json({
        success: true,
        message: `${processedFiles.length} images resized successfully`,
        downloadUrl: `/temp/resized_images_${sessionId}.zip`,
        sessionId,
        expiresAt,
        totalFiles: processedFiles.length,
        files: processedFiles.map(f => ({ 
          name: f.name, 
          originalSize: f.originalSize, 
          newSize: f.newSize,
          compressionRatio: ((f.originalSize - f.newSize) / f.originalSize * 100).toFixed(1)
        }))
      });
    } else {
      // Single file
      const file = processedFiles[0];
      res.json({
        success: true,
        message: 'Image resized successfully',
        downloadUrl: `/temp/resize_${sessionId}_1.${path.extname(file.path).substring(1)}`,
        sessionId,
        expiresAt,
        originalSize: file.originalSize,
        newSize: file.newSize,
        compressionRatio: ((file.originalSize - file.newSize) / file.originalSize * 100).toFixed(1)
      });
    }

  } catch (error) {
    console.error('Error resizing images:', error);
    
    // Clean up uploaded files
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
      message: 'Failed to resize images. Please ensure all files are valid image files.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Compress images
router.post('/compress', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image file is required' 
      });
    }

    const files = req.files as Express.Multer.File[];
    const { 
      quality = 80,
      compressionLevel = 'medium',
      preserveMetadata = 'false',
      outputFormat = 'original'
    } = req.body;

    const qualityNum = Math.min(Math.max(parseInt(quality) || 80, 1), 100);
    const preserveMeta = preserveMetadata === 'true';

    const sessionId = uuidv4();
    const processedFiles: Array<{name: string, originalSize: number, compressedSize: number, path: string}> = [];

    // Process each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const originalSize = (await fs.stat(file.path)).size;
        const metadata = await sharp(file.path).metadata();
        
        let sharpInstance = sharp(file.path);

        // Remove metadata if not preserving
        if (!preserveMeta) {
          sharpInstance = sharpInstance.withMetadata();
        }

        // Determine output format
        let format = outputFormat === 'original' ? 
          (metadata.format || 'jpeg') : outputFormat;
        
        let outputExt = format;
        if (format === 'jpeg') outputExt = 'jpg';

        // Apply compression based on format
        switch (format) {
          case 'jpeg':
          case 'jpg':
            sharpInstance = sharpInstance.jpeg({ 
              quality: qualityNum,
              mozjpeg: compressionLevel === 'high'
            });
            break;
          case 'png':
            const pngLevel = compressionLevel === 'high' ? 9 : 
                            compressionLevel === 'medium' ? 6 : 3;
            sharpInstance = sharpInstance.png({ 
              quality: qualityNum,
              compressionLevel: pngLevel,
              adaptiveFiltering: compressionLevel === 'high'
            });
            break;
          case 'webp':
            sharpInstance = sharpInstance.webp({ 
              quality: qualityNum,
              effort: compressionLevel === 'high' ? 6 : 4
            });
            break;
          case 'avif':
            sharpInstance = sharpInstance.avif({ 
              quality: qualityNum,
              effort: compressionLevel === 'high' ? 9 : 4
            });
            break;
          default:
            sharpInstance = sharpInstance.jpeg({ quality: qualityNum });
        }

        // Generate output filename
        const originalName = path.parse(file.originalname).name;
        const outputFileName = `compressed_${originalName}.${outputExt}`;
        const outputPath = `temp/downloads/compress_${sessionId}_${i + 1}.${outputExt}`;

        // Process and save
        await sharpInstance.toFile(outputPath);
        
        const compressedSize = (await fs.stat(outputPath)).size;
        
        processedFiles.push({
          name: outputFileName,
          originalSize,
          compressedSize,
          path: outputPath
        });

        // Clean up uploaded file
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error compressing image ${file.originalname}:`, error);
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
    }

    if (processedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to compress any images'
      });
    }

    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();
    const totalOriginalSize = processedFiles.reduce((sum, f) => sum + f.originalSize, 0);
    const totalCompressedSize = processedFiles.reduce((sum, f) => sum + f.compressedSize, 0);
    const overallCompressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);

    // If multiple files, create ZIP
    if (processedFiles.length > 1) {
      const zipPath = `temp/downloads/compressed_images_${sessionId}.zip`;
      const output = createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      for (const file of processedFiles) {
        const fileBuffer = await fs.readFile(file.path);
        archive.append(fileBuffer, { name: file.name });
        // Clean up individual files
        await fs.unlink(file.path);
      }

      await archive.finalize();

      res.json({
        success: true,
        message: `${processedFiles.length} images compressed successfully`,
        downloadUrl: `/temp/compressed_images_${sessionId}.zip`,
        sessionId,
        expiresAt,
        totalFiles: processedFiles.length,
        originalSize: totalOriginalSize,
        compressedSize: totalCompressedSize,
        compressionRatio: parseFloat(overallCompressionRatio),
        spaceSaved: totalOriginalSize - totalCompressedSize,
        files: processedFiles.map(f => ({ 
          name: f.name, 
          originalSize: f.originalSize, 
          compressedSize: f.compressedSize,
          compressionRatio: ((f.originalSize - f.compressedSize) / f.originalSize * 100).toFixed(1)
        }))
      });
    } else {
      // Single file
      const file = processedFiles[0];
      res.json({
        success: true,
        message: 'Image compressed successfully',
        downloadUrl: `/temp/compress_${sessionId}_1.${path.extname(file.path).substring(1)}`,
        sessionId,
        expiresAt,
        originalSize: file.originalSize,
        compressedSize: file.compressedSize,
        compressionRatio: ((file.originalSize - file.compressedSize) / file.originalSize * 100).toFixed(1),
        spaceSaved: file.originalSize - file.compressedSize
      });
    }

  } catch (error) {
    console.error('Error compressing images:', error);
    
    // Clean up uploaded files
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
      message: 'Failed to compress images. Please ensure all files are valid image files.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Convert image format
router.post('/convert', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image file is required' 
      });
    }

    const files = req.files as Express.Multer.File[];
    const { 
      targetFormat = 'jpeg',
      quality = 90,
      compression = 'medium'
    } = req.body;

    const qualityNum = Math.min(Math.max(parseInt(quality) || 90, 1), 100);
    const supportedFormats = ['jpeg', 'png', 'webp', 'avif', 'tiff', 'gif'];

    if (!supportedFormats.includes(targetFormat)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported target format: ${targetFormat}. Supported formats: ${supportedFormats.join(', ')}`
      });
    }

    const sessionId = uuidv4();
    const processedFiles: Array<{name: string, originalFormat: string, newFormat: string, path: string, size: number}> = [];

    // Process each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const metadata = await sharp(file.path).metadata();
        const originalFormat = metadata.format || 'unknown';
        
        let sharpInstance = sharp(file.path);

        // Apply format conversion
        let outputExt = targetFormat;
        if (targetFormat === 'jpeg') outputExt = 'jpg';

        switch (targetFormat) {
          case 'jpeg':
            sharpInstance = sharpInstance.jpeg({ 
              quality: qualityNum,
              mozjpeg: compression === 'high'
            });
            break;
          case 'png':
            const pngLevel = compression === 'high' ? 9 : 
                            compression === 'medium' ? 6 : 3;
            sharpInstance = sharpInstance.png({ 
              quality: qualityNum,
              compressionLevel: pngLevel
            });
            break;
          case 'webp':
            sharpInstance = sharpInstance.webp({ 
              quality: qualityNum,
              effort: compression === 'high' ? 6 : 4
            });
            break;
          case 'avif':
            sharpInstance = sharpInstance.avif({ 
              quality: qualityNum,
              effort: compression === 'high' ? 9 : 4
            });
            break;
          case 'tiff':
            sharpInstance = sharpInstance.tiff({ 
              quality: qualityNum,
              compression: compression === 'high' ? 'jpeg' : 'none'
            });
            break;
          case 'gif':
            // Convert to gif through png first
            sharpInstance = sharpInstance.png();
            outputExt = 'png'; // Sharp doesn't support gif output
            break;
          default:
            sharpInstance = sharpInstance.jpeg({ quality: qualityNum });
        }

        // Generate output filename
        const originalName = path.parse(file.originalname).name;
        const outputFileName = `${originalName}.${outputExt}`;
        const outputPath = `temp/downloads/convert_${sessionId}_${i + 1}.${outputExt}`;

        // Process and save
        await sharpInstance.toFile(outputPath);
        
        const fileSize = (await fs.stat(outputPath)).size;
        
        processedFiles.push({
          name: outputFileName,
          originalFormat,
          newFormat: targetFormat,
          path: outputPath,
          size: fileSize
        });

        // Clean up uploaded file
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error converting image ${file.originalname}:`, error);
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
    }

    if (processedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to convert any images'
      });
    }

    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

    // If multiple files, create ZIP
    if (processedFiles.length > 1) {
      const zipPath = `temp/downloads/converted_images_${sessionId}.zip`;
      const output = createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      for (const file of processedFiles) {
        const fileBuffer = await fs.readFile(file.path);
        archive.append(fileBuffer, { name: file.name });
        // Clean up individual files
        await fs.unlink(file.path);
      }

      await archive.finalize();

      res.json({
        success: true,
        message: `${processedFiles.length} images converted to ${targetFormat.toUpperCase()} successfully`,
        downloadUrl: `/temp/converted_images_${sessionId}.zip`,
        sessionId,
        expiresAt,
        totalFiles: processedFiles.length,
        targetFormat: targetFormat.toUpperCase(),
        files: processedFiles.map(f => ({ 
          name: f.name, 
          originalFormat: f.originalFormat.toUpperCase(),
          newFormat: f.newFormat.toUpperCase(),
          size: f.size
        }))
      });
    } else {
      // Single file
      const file = processedFiles[0];
      res.json({
        success: true,
        message: `Image converted to ${targetFormat.toUpperCase()} successfully`,
        downloadUrl: `/temp/convert_${sessionId}_1.${path.extname(file.path).substring(1)}`,
        sessionId,
        expiresAt,
        originalFormat: file.originalFormat.toUpperCase(),
        newFormat: file.newFormat.toUpperCase(),
        size: file.size
      });
    }

  } catch (error) {
    console.error('Error converting images:', error);
    
    // Clean up uploaded files
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
      message: 'Failed to convert images. Please ensure all files are valid image files.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Crop images
router.post('/crop', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image file is required' 
      });
    }

    const files = req.files as Express.Multer.File[];
    const { 
      x = 0, 
      y = 0, 
      width, 
      height, 
      cropMode = 'manual' 
    } = req.body;

    const cropX = parseInt(x) || 0;
    const cropY = parseInt(y) || 0;
    const cropWidth = parseInt(width);
    const cropHeight = parseInt(height);

    if (cropMode === 'manual' && (!cropWidth || !cropHeight)) {
      return res.status(400).json({
        success: false,
        message: 'Width and height are required for manual crop mode'
      });
    }

    const sessionId = uuidv4();
    const processedFiles: Array<{name: string, originalSize: [number, number], croppedSize: [number, number], path: string}> = [];

    // Process each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const metadata = await sharp(file.path).metadata();
        const originalWidth = metadata.width || 0;
        const originalHeight = metadata.height || 0;
        
        let sharpInstance = sharp(file.path);
        let finalWidth = cropWidth;
        let finalHeight = cropHeight;
        let finalX = cropX;
        let finalY = cropY;

        // Handle different crop modes
        switch (cropMode) {
          case 'center':
            finalWidth = cropWidth || Math.min(originalWidth, originalHeight);
            finalHeight = cropHeight || finalWidth;
            finalX = Math.max(0, (originalWidth - finalWidth) / 2);
            finalY = Math.max(0, (originalHeight - finalHeight) / 2);
            break;
          case 'smart':
            // Use Sharp's attention-based cropping
            sharpInstance = sharpInstance.resize({
              width: cropWidth || originalWidth,
              height: cropHeight || originalHeight,
              fit: 'cover',
              position: 'attention'
            });
            finalWidth = cropWidth || originalWidth;
            finalHeight = cropHeight || originalHeight;
            break;
          case 'manual':
          default:
            // Ensure crop area is within image bounds
            finalX = Math.max(0, Math.min(finalX, originalWidth - 1));
            finalY = Math.max(0, Math.min(finalY, originalHeight - 1));
            finalWidth = Math.min(finalWidth, originalWidth - finalX);
            finalHeight = Math.min(finalHeight, originalHeight - finalY);
            break;
        }

        // Apply cropping
        if (cropMode !== 'smart') {
          sharpInstance = sharpInstance.extract({ 
            left: finalX, 
            top: finalY, 
            width: finalWidth, 
            height: finalHeight 
          });
        }

        // Generate output filename
        const originalName = path.parse(file.originalname).name;
        const originalExt = path.parse(file.originalname).ext || '.jpg';
        const outputFileName = `cropped_${originalName}_${finalWidth}x${finalHeight}${originalExt}`;
        const outputPath = `temp/downloads/crop_${sessionId}_${i + 1}${originalExt}`;

        // Process and save
        await sharpInstance.toFile(outputPath);
        
        processedFiles.push({
          name: outputFileName,
          originalSize: [originalWidth, originalHeight],
          croppedSize: [finalWidth, finalHeight],
          path: outputPath
        });

        // Clean up uploaded file
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error cropping image ${file.originalname}:`, error);
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
    }

    if (processedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to crop any images'
      });
    }

    const expiresAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();

    // If multiple files, create ZIP
    if (processedFiles.length > 1) {
      const zipPath = `temp/downloads/cropped_images_${sessionId}.zip`;
      const output = createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      for (const file of processedFiles) {
        const fileBuffer = await fs.readFile(file.path);
        archive.append(fileBuffer, { name: file.name });
        // Clean up individual files
        await fs.unlink(file.path);
      }

      await archive.finalize();

      res.json({
        success: true,
        message: `${processedFiles.length} images cropped successfully`,
        downloadUrl: `/temp/cropped_images_${sessionId}.zip`,
        sessionId,
        expiresAt,
        totalFiles: processedFiles.length,
        cropMode,
        files: processedFiles.map(f => ({ 
          name: f.name, 
          originalSize: f.originalSize,
          croppedSize: f.croppedSize
        }))
      });
    } else {
      // Single file
      const file = processedFiles[0];
      const ext = path.extname(file.path);
      res.json({
        success: true,
        message: 'Image cropped successfully',
        downloadUrl: `/temp/crop_${sessionId}_1${ext}`,
        sessionId,
        expiresAt,
        originalSize: file.originalSize,
        croppedSize: file.croppedSize,
        cropMode
      });
    }

  } catch (error) {
    console.error('Error cropping images:', error);
    
    // Clean up uploaded files
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
      message: 'Failed to crop images. Please ensure all files are valid image files.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;