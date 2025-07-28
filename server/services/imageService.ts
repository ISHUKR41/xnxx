import sharp from 'sharp';

export class ImageService {

  // Core Image Operations
  async resizeImage(buffer: Buffer, options: any): Promise<Buffer> {
    const image = sharp(buffer);
    const { width, height } = await image.metadata();
    
    let newWidth: number;
    let newHeight: number;
    
    if (options.resize_mode === 'percentage') {
      newWidth = Math.round((width || 0) * (options.percentage / 100));
      newHeight = Math.round((height || 0) * (options.percentage / 100));
    } else {
      newWidth = options.pixels_width;
      newHeight = options.pixels_height;
    }
    
    let resizer = image.resize(newWidth, newHeight, {
      fit: options.maintain_ratio ? 'inside' : 'fill',
      withoutEnlargement: options.no_enlarge_if_smaller
    });
    
    return await resizer.toBuffer();
  }

  async cropImage(buffer: Buffer, options: any): Promise<Buffer> {
    const { width, height, x = 0, y = 0 } = options;
    
    return await sharp(buffer)
      .extract({ 
        left: x, 
        top: y, 
        width: width, 
        height: height 
      })
      .toBuffer();
  }

  async compressImage(buffer: Buffer, options: any = {}): Promise<Buffer> {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const { compression_level = 'recommended' } = options;
    
    let quality: number;
    switch (compression_level) {
      case 'extreme':
        quality = 60;
        break;
      case 'low':
        quality = 90;
        break;
      case 'recommended':
      default:
        quality = 75;
        break;
    }
    
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      return await image.jpeg({ quality }).toBuffer();
    } else if (metadata.format === 'png') {
      return await image.png({ 
        compressionLevel: compression_level === 'extreme' ? 9 : 6,
        quality 
      }).toBuffer();
    } else if (metadata.format === 'webp') {
      return await image.webp({ quality }).toBuffer();
    }
    
    // Default to JPEG for other formats
    return await image.jpeg({ quality }).toBuffer();
  }

  async convertImageFormat(buffer: Buffer, targetFormat: string, options: any = {}): Promise<Buffer> {
    const image = sharp(buffer);
    
    switch (targetFormat.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return await image.jpeg({ quality: options.quality || 90 }).toBuffer();
        
      case 'png':
        return await image.png({ 
          compressionLevel: options.compressionLevel || 6 
        }).toBuffer();
        
      case 'webp':
        return await image.webp({ 
          quality: options.quality || 80 
        }).toBuffer();
        
      case 'tiff':
        return await image.tiff({ 
          compression: 'lzw',
          quality: options.quality || 90 
        }).toBuffer();
        
      case 'gif':
        // For static GIF conversion
        return await image.gif().toBuffer();
        
      case 'gif_animation':
        // Animated GIF creation from multiple images
        return await this.createAnimatedGif([buffer], options);
        
      case 'heic':
        return await image.heif({ quality: options.quality || 80 }).toBuffer();
        
      default:
        throw new Error(`Unsupported target format: ${targetFormat}`);
    }
  }

  async rotateImage(buffer: Buffer, angle: number): Promise<Buffer> {
    return await sharp(buffer)
      .rotate(angle)
      .toBuffer();
  }

  async flipImage(buffer: Buffer, direction: 'horizontal' | 'vertical'): Promise<Buffer> {
    if (direction === 'horizontal') {
      return await sharp(buffer).flop().toBuffer();
    } else {
      return await sharp(buffer).flip().toBuffer();
    }
  }

  // Advanced Image Operations
  async addImageWatermark(buffer: Buffer, watermarkBuffer: Buffer, options: any = {}): Promise<Buffer> {
    const {
      gravity = 'center',
      transparency = 100,
      vertical_adjustment_percent = 0,
      horizontal_adjustment_percent = 0
    } = options;
    
    const mainImage = sharp(buffer);
    const { width, height } = await mainImage.metadata();
    
    // Process watermark
    const watermark = sharp(watermarkBuffer);
    if (transparency < 100) {
      await watermark.composite([{
        input: Buffer.from([255, 255, 255, Math.round(255 * transparency / 100)]),
        raw: { width: 1, height: 1, channels: 4 },
        blend: 'dest-in'
      }]);
    }
    
    // Calculate position based on gravity
    const position = this.calculateWatermarkPosition(
      width || 0, 
      height || 0, 
      gravity, 
      vertical_adjustment_percent,
      horizontal_adjustment_percent
    );
    
    return await mainImage
      .composite([{
        input: await watermark.toBuffer(),
        ...position
      }])
      .toBuffer();
  }

  async addTextWatermark(buffer: Buffer, text: string, options: any = {}): Promise<Buffer> {
    const {
      font_size = 14,
      font_color = '#000000',
      transparency = 100,
      rotation = 0,
      gravity = 'center'
    } = options;
    
    const image = sharp(buffer);
    const { width, height } = await image.metadata();
    
    // Create simple text watermark using SVG
    const textWidth = text.length * font_size * 0.6;
    const textHeight = font_size;
    
    let x = (width || 0) / 2 - textWidth / 2;
    let y = (height || 0) / 2 + textHeight / 2;
    
    // Apply gravity positioning
    if (gravity.includes('North')) y = textHeight + 20;
    if (gravity.includes('South')) y = (height || 0) - 20;
    if (gravity.includes('West')) x = 20;
    if (gravity.includes('East')) x = (width || 0) - textWidth - 20;
    
    const svgText = `
      <svg width="${width}" height="${height}">
        <text x="${x}" y="${y}" 
              font-family="Arial" 
              font-size="${font_size}" 
              fill="${font_color}" 
              opacity="${transparency / 100}"
              transform="rotate(${rotation} ${x + textWidth/2} ${y - textHeight/2})">
          ${text}
        </text>
      </svg>
    `;
    
    const textOverlay = Buffer.from(svgText);
    
    return await image
      .composite([{
        input: textOverlay,
        blend: 'over'
      }])
      .toBuffer();
  }

  // Image Enhancement and Effects
  async enhanceImage(buffer: Buffer, options: any = {}): Promise<Buffer> {
    let image = sharp(buffer);
    
    // Apply various enhancements
    if (options.brightness !== undefined) {
      image = image.modulate({ brightness: 1 + (options.brightness / 100) });
    }
    
    if (options.contrast !== undefined) {
      image = image.linear(1 + (options.contrast / 100), 0);
    }
    
    if (options.saturation !== undefined) {
      image = image.modulate({ saturation: 1 + (options.saturation / 100) });
    }
    
    if (options.sharpen) {
      image = image.sharpen();
    }
    
    if (options.blur && options.blur > 0) {
      image = image.blur(options.blur);
    }
    
    if (options.normalize) {
      image = image.normalize();
    }
    
    return await image.toBuffer();
  }

  async removeBackground(buffer: Buffer): Promise<Buffer> {
    // This is a simplified background removal using sharp
    // For production, you might want to use AI-based services like Remove.bg API
    
    return await sharp(buffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .threshold(128) // Simple threshold-based background removal
      .toBuffer();
  }

  async upscaleImage(buffer: Buffer, factor: number = 2): Promise<Buffer> {
    const image = sharp(buffer);
    const { width, height } = await image.metadata();
    
    return await image
      .resize(
        Math.round((width || 0) * factor),
        Math.round((height || 0) * factor),
        { 
          kernel: sharp.kernel.lanczos3,
          fit: 'fill'
        }
      )
      .toBuffer();
  }

  // Utility Functions
  private async createAnimatedGif(images: Buffer[], options: any = {}): Promise<Buffer> {
    // This is a placeholder for animated GIF creation
    // In production, you would use libraries like 'gifencoder' or similar
    const { gif_time = 50, gif_loop = true } = options;
    
    // For now, return the first image as static GIF
    return await sharp(images[0]).gif().toBuffer();
  }

  private calculateWatermarkPosition(
    imageWidth: number, 
    imageHeight: number, 
    gravity: string,
    verticalAdjustment: number = 0,
    horizontalAdjustment: number = 0
  ) {
    let left = 0;
    let top = 0;
    
    // Calculate base position based on gravity
    switch (gravity.toLowerCase()) {
      case 'northwest':
        left = 0;
        top = 0;
        break;
      case 'north':
        left = imageWidth / 2;
        top = 0;
        break;
      case 'northeast':
        left = imageWidth;
        top = 0;
        break;
      case 'west':
        left = 0;
        top = imageHeight / 2;
        break;
      case 'center':
        left = imageWidth / 2;
        top = imageHeight / 2;
        break;
      case 'east':
        left = imageWidth;
        top = imageHeight / 2;
        break;
      case 'southwest':
        left = 0;
        top = imageHeight;
        break;
      case 'south':
        left = imageWidth / 2;
        top = imageHeight;
        break;
      case 'southeast':
        left = imageWidth;
        top = imageHeight;
        break;
    }
    
    // Apply adjustments
    left += (horizontalAdjustment / 100) * imageWidth;
    top += (verticalAdjustment / 100) * imageHeight;
    
    return { left: Math.round(left), top: Math.round(top) };
  }

  async getImageInfo(buffer: Buffer): Promise<any> {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: buffer.length,
      hasAlpha: metadata.hasAlpha,
      channels: metadata.channels,
      density: metadata.density
    };
  }
}

export const imageService = new ImageService();