import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
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

// Image Resize Tool
export const resizeImage = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { width, height, algorithm = 'lanczos3', maintainRatio = 'true', background = 'transparent' } = req.body;
    
    if (!width && !height) {
      return res.status(400).json({ error: 'Width or height must be specified' });
    }

    const outputDir = `./temp/processed/${uuidv4()}-resized`;
    await fs.mkdir(outputDir, { recursive: true });
    
    const processedFiles = [];
    
    for (const file of files) {
      const image = sharp(file.path);
      const metadata = await image.metadata();
      
      let resizeOptions: any = {};
      
      if (maintainRatio === 'true') {
        resizeOptions.width = width ? parseInt(width) : undefined;
        resizeOptions.height = height ? parseInt(height) : undefined;
        resizeOptions.fit = sharp.fit.inside;
        resizeOptions.withoutEnlargement = false;
      } else {
        resizeOptions.width = width ? parseInt(width) : metadata.width;
        resizeOptions.height = height ? parseInt(height) : metadata.height;
        resizeOptions.fit = sharp.fit.fill;
      }
      
      // Set background for padding
      if (background !== 'transparent') {
        resizeOptions.background = background;
      }
      
      const outputPath = path.join(outputDir, file.originalname);
      
      await image
        .resize(resizeOptions)
        .toFile(outputPath);
      
      processedFiles.push(file.originalname);
      
      // Cleanup original file
      await fs.unlink(file.path);
    }
    
    let downloadUrl: string;
    
    if (processedFiles.length === 1) {
      // Single file - direct download
      const singleFile = path.join(outputDir, processedFiles[0]);
      downloadUrl = await createDownloadLink(singleFile, `resized-${processedFiles[0]}`);
    } else {
      // Multiple files - create ZIP
      const zipPath = `./temp/processed/${uuidv4()}-resized-images.zip`;
      const output = require('fs').createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.pipe(output);
      archive.directory(outputDir, false);
      await archive.finalize();
      
      await new Promise((resolve) => output.on('close', resolve));
      downloadUrl = await createDownloadLink(zipPath, 'resized-images.zip');
    }
    
    // Cleanup processed directory
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      processedFiles: processedFiles.length,
      message: `${processedFiles.length} image(s) successfully resized`
    });
  } catch (error) {
    console.error('Image resize error:', error);
    res.status(500).json({ error: 'Failed to resize images' });
  }
};

// Image Compress Tool
export const compressImage = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { quality = '80', progressive = 'true', preserveMetadata = 'false', optimization = 'medium' } = req.body;
    
    const outputDir = `./temp/processed/${uuidv4()}-compressed`;
    await fs.mkdir(outputDir, { recursive: true });
    
    const processedFiles = [];
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    for (const file of files) {
      const originalStats = await fs.stat(file.path);
      totalOriginalSize += originalStats.size;
      
      const image = sharp(file.path);
      const metadata = await image.metadata();
      
      let processedImage = image;
      
      // Remove metadata if not preserving
      if (preserveMetadata !== 'true') {
        processedImage = processedImage.withoutMetadata();
      }
      
      const outputPath = path.join(outputDir, file.originalname);
      const qualityValue = parseInt(quality);
      
      // Apply compression based on format
      if (metadata.format === 'jpeg' || file.mimetype === 'image/jpeg') {
        await processedImage
          .jpeg({ 
            quality: qualityValue, 
            progressive: progressive === 'true',
            mozjpeg: optimization === 'high'
          })
          .toFile(outputPath);
      } else if (metadata.format === 'png' || file.mimetype === 'image/png') {
        await processedImage
          .png({ 
            quality: qualityValue,
            progressive: progressive === 'true',
            compressionLevel: optimization === 'high' ? 9 : 6
          })
          .toFile(outputPath);
      } else if (metadata.format === 'webp' || file.mimetype === 'image/webp') {
        await processedImage
          .webp({ 
            quality: qualityValue,
            lossless: optimization === 'lossless'
          })
          .toFile(outputPath);
      } else {
        // Convert to JPEG for other formats
        const jpegPath = path.join(outputDir, `${path.parse(file.originalname).name}.jpg`);
        await processedImage
          .jpeg({ 
            quality: qualityValue, 
            progressive: progressive === 'true'
          })
          .toFile(jpegPath);
      }
      
      const compressedStats = await fs.stat(outputPath);
      totalCompressedSize += compressedStats.size;
      
      processedFiles.push(file.originalname);
      
      // Cleanup original file
      await fs.unlink(file.path);
    }
    
    let downloadUrl: string;
    
    if (processedFiles.length === 1) {
      // Single file - direct download
      const singleFile = path.join(outputDir, processedFiles[0]);
      downloadUrl = await createDownloadLink(singleFile, `compressed-${processedFiles[0]}`);
    } else {
      // Multiple files - create ZIP
      const zipPath = `./temp/processed/${uuidv4()}-compressed-images.zip`;
      const output = require('fs').createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.pipe(output);
      archive.directory(outputDir, false);
      await archive.finalize();
      
      await new Promise((resolve) => output.on('close', resolve));
      downloadUrl = await createDownloadLink(zipPath, 'compressed-images.zip');
    }
    
    const compressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
    
    // Cleanup processed directory
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      processedFiles: processedFiles.length,
      originalSize: totalOriginalSize,
      compressedSize: totalCompressedSize,
      compressionRatio: `${compressionRatio}%`,
      message: `${processedFiles.length} image(s) compressed by ${compressionRatio}%`
    });
  } catch (error) {
    console.error('Image compression error:', error);
    res.status(500).json({ error: 'Failed to compress images' });
  }
};

// Image Format Conversion
export const convertFormat = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { outputFormat = 'jpeg', quality = '90', progressive = 'false', lossless = 'false' } = req.body;
    
    const supportedFormats = ['jpeg', 'png', 'webp', 'avif', 'tiff', 'bmp'];
    if (!supportedFormats.includes(outputFormat.toLowerCase())) {
      return res.status(400).json({ error: 'Unsupported output format' });
    }
    
    const outputDir = `./temp/processed/${uuidv4()}-converted`;
    await fs.mkdir(outputDir, { recursive: true });
    
    const processedFiles = [];
    
    for (const file of files) {
      const image = sharp(file.path);
      const baseName = path.parse(file.originalname).name;
      const outputPath = path.join(outputDir, `${baseName}.${outputFormat}`);
      
      let processedImage = image;
      const qualityValue = parseInt(quality);
      
      // Apply format-specific options
      switch (outputFormat.toLowerCase()) {
        case 'jpeg':
          processedImage = processedImage.jpeg({ 
            quality: qualityValue, 
            progressive: progressive === 'true' 
          });
          break;
        case 'png':
          processedImage = processedImage.png({ 
            quality: qualityValue,
            progressive: progressive === 'true'
          });
          break;
        case 'webp':
          processedImage = processedImage.webp({ 
            quality: lossless === 'true' ? 100 : qualityValue,
            lossless: lossless === 'true'
          });
          break;
        case 'avif':
          processedImage = processedImage.avif({ 
            quality: qualityValue
          });
          break;
        case 'tiff':
          processedImage = processedImage.tiff({ 
            quality: qualityValue
          });
          break;
        case 'bmp':
          processedImage = processedImage.png(); // BMP via PNG
          break;
      }
      
      await processedImage.toFile(outputPath);
      processedFiles.push(`${baseName}.${outputFormat}`);
      
      // Cleanup original file
      await fs.unlink(file.path);
    }
    
    let downloadUrl: string;
    
    if (processedFiles.length === 1) {
      // Single file - direct download
      const singleFile = path.join(outputDir, processedFiles[0]);
      downloadUrl = await createDownloadLink(singleFile, processedFiles[0]);
    } else {
      // Multiple files - create ZIP
      const zipPath = `./temp/processed/${uuidv4()}-converted-images.zip`;
      const output = require('fs').createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.pipe(output);
      archive.directory(outputDir, false);
      await archive.finalize();
      
      await new Promise((resolve) => output.on('close', resolve));
      downloadUrl = await createDownloadLink(zipPath, `converted-images.zip`);
    }
    
    // Cleanup processed directory
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      processedFiles: processedFiles.length,
      outputFormat: outputFormat.toUpperCase(),
      message: `${processedFiles.length} image(s) successfully converted to ${outputFormat.toUpperCase()}`
    });
  } catch (error) {
    console.error('Image format conversion error:', error);
    res.status(500).json({ error: 'Failed to convert image format' });
  }
};

// Image Crop Tool
export const cropImage = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { x = '0', y = '0', width, height, aspectRatio, gravity = 'center' } = req.body;
    
    if (!width || !height) {
      return res.status(400).json({ error: 'Width and height are required for cropping' });
    }
    
    const outputDir = `./temp/processed/${uuidv4()}-cropped`;
    await fs.mkdir(outputDir, { recursive: true });
    
    const processedFiles = [];
    
    for (const file of files) {
      const image = sharp(file.path);
      const metadata = await image.metadata();
      
      let cropOptions = {
        left: parseInt(x),
        top: parseInt(y),
        width: parseInt(width),
        height: parseInt(height)
      };
      
      // Handle aspect ratio cropping
      if (aspectRatio) {
        const [ratioW, ratioH] = aspectRatio.split(':').map((n: string) => parseInt(n));
        const targetRatio = ratioW / ratioH;
        const imageRatio = (metadata.width || 1) / (metadata.height || 1);
        
        if (imageRatio > targetRatio) {
          // Image is wider, crop width
          const newWidth = Math.floor((metadata.height || 1) * targetRatio);
          cropOptions = {
            left: Math.floor(((metadata.width || 1) - newWidth) / 2),
            top: 0,
            width: newWidth,
            height: metadata.height || 1
          };
        } else {
          // Image is taller, crop height
          const newHeight = Math.floor((metadata.width || 1) / targetRatio);
          cropOptions = {
            left: 0,
            top: Math.floor(((metadata.height || 1) - newHeight) / 2),
            width: metadata.width || 1,
            height: newHeight
          };
        }
      }
      
      const outputPath = path.join(outputDir, file.originalname);
      
      await image
        .extract(cropOptions)
        .toFile(outputPath);
      
      processedFiles.push(file.originalname);
      
      // Cleanup original file
      await fs.unlink(file.path);
    }
    
    let downloadUrl: string;
    
    if (processedFiles.length === 1) {
      // Single file - direct download
      const singleFile = path.join(outputDir, processedFiles[0]);
      downloadUrl = await createDownloadLink(singleFile, `cropped-${processedFiles[0]}`);
    } else {
      // Multiple files - create ZIP
      const zipPath = `./temp/processed/${uuidv4()}-cropped-images.zip`;
      const output = require('fs').createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.pipe(output);
      archive.directory(outputDir, false);
      await archive.finalize();
      
      await new Promise((resolve) => output.on('close', resolve));
      downloadUrl = await createDownloadLink(zipPath, 'cropped-images.zip');
    }
    
    // Cleanup processed directory
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      processedFiles: processedFiles.length,
      message: `${processedFiles.length} image(s) successfully cropped`
    });
  } catch (error) {
    console.error('Image crop error:', error);
    res.status(500).json({ error: 'Failed to crop images' });
  }
};

// Image Rotate Tool
export const rotateImage = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { angle = '90', background = 'transparent', autoStraighten = 'false' } = req.body;
    
    const outputDir = `./temp/processed/${uuidv4()}-rotated`;
    await fs.mkdir(outputDir, { recursive: true });
    
    const processedFiles = [];
    
    for (const file of files) {
      const image = sharp(file.path);
      const outputPath = path.join(outputDir, file.originalname);
      
      let rotateOptions: any = {
        angle: parseInt(angle)
      };
      
      if (background !== 'transparent') {
        rotateOptions.background = background;
      }
      
      await image
        .rotate(rotateOptions.angle, { background: rotateOptions.background })
        .toFile(outputPath);
      
      processedFiles.push(file.originalname);
      
      // Cleanup original file
      await fs.unlink(file.path);
    }
    
    let downloadUrl: string;
    
    if (processedFiles.length === 1) {
      // Single file - direct download
      const singleFile = path.join(outputDir, processedFiles[0]);
      downloadUrl = await createDownloadLink(singleFile, `rotated-${processedFiles[0]}`);
    } else {
      // Multiple files - create ZIP
      const zipPath = `./temp/processed/${uuidv4()}-rotated-images.zip`;
      const output = require('fs').createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.pipe(output);
      archive.directory(outputDir, false);
      await archive.finalize();
      
      await new Promise((resolve) => output.on('close', resolve));
      downloadUrl = await createDownloadLink(zipPath, 'rotated-images.zip');
    }
    
    // Cleanup processed directory
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      processedFiles: processedFiles.length,
      rotationAngle: `${angle}°`,
      message: `${processedFiles.length} image(s) successfully rotated by ${angle}°`
    });
  } catch (error) {
    console.error('Image rotation error:', error);
    res.status(500).json({ error: 'Failed to rotate images' });
  }
};

// Image Flip Tool
export const flipImage = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { direction = 'horizontal', preserveExif = 'false' } = req.body;
    
    const outputDir = `./temp/processed/${uuidv4()}-flipped`;
    await fs.mkdir(outputDir, { recursive: true });
    
    const processedFiles = [];
    
    for (const file of files) {
      let image = sharp(file.path);
      
      if (preserveExif !== 'true') {
        image = image.withoutMetadata();
      }
      
      if (direction === 'horizontal') {
        image = image.flop();
      } else if (direction === 'vertical') {
        image = image.flip();
      } else if (direction === 'both') {
        image = image.flip().flop();
      }
      
      const outputPath = path.join(outputDir, file.originalname);
      await image.toFile(outputPath);
      
      processedFiles.push(file.originalname);
      
      // Cleanup original file
      await fs.unlink(file.path);
    }
    
    let downloadUrl: string;
    
    if (processedFiles.length === 1) {
      // Single file - direct download
      const singleFile = path.join(outputDir, processedFiles[0]);
      downloadUrl = await createDownloadLink(singleFile, `flipped-${processedFiles[0]}`);
    } else {
      // Multiple files - create ZIP
      const zipPath = `./temp/processed/${uuidv4()}-flipped-images.zip`;
      const output = require('fs').createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.pipe(output);
      archive.directory(outputDir, false);
      await archive.finalize();
      
      await new Promise((resolve) => output.on('close', resolve));
      downloadUrl = await createDownloadLink(zipPath, 'flipped-images.zip');
    }
    
    // Cleanup processed directory
    await fs.rm(outputDir, { recursive: true, force: true });
    
    res.json({
      success: true,
      downloadUrl,
      expiresIn: 240,
      processedFiles: processedFiles.length,
      flipDirection: direction,
      message: `${processedFiles.length} image(s) successfully flipped ${direction}ly`
    });
  } catch (error) {
    console.error('Image flip error:', error);
    res.status(500).json({ error: 'Failed to flip images' });
  }
};

// Export multer upload middleware
export const uploadMiddleware = upload.array('files', 10);