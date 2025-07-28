import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { spawn, spawnSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export class PDFService {
  
  // Core PDF Operations
  async mergePDFs(files: Express.Multer.File[]): Promise<Buffer> {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      try {
        const sourcePdf = await PDFDocument.load(file.buffer);
        const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        throw new Error(`Failed to process ${file.originalname}`);
      }
    }
    
    return Buffer.from(await mergedPdf.save());
  }

  async splitPDF(buffer: Buffer, mode: 'pages' | 'ranges' | 'fixed', options: any = {}): Promise<Buffer[]> {
    const pdf = await PDFDocument.load(buffer);
    const pageCount = pdf.getPageCount();
    const result: Buffer[] = [];

    switch (mode) {
      case 'pages':
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
          result.push(Buffer.from(await newPdf.save()));
        }
        break;
        
      case 'ranges':
        const ranges = options.ranges || '1-2,3-4';
        const rangeArray = this.parseRanges(ranges, pageCount);
        for (const range of rangeArray) {
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(pdf, range);
          pages.forEach(page => newPdf.addPage(page));
          result.push(Buffer.from(await newPdf.save()));
        }
        break;
        
      case 'fixed':
        const fixedRange = options.fixed_range || 2;
        for (let i = 0; i < pageCount; i += fixedRange) {
          const endIndex = Math.min(i + fixedRange, pageCount);
          const pageIndices = Array.from({ length: endIndex - i }, (_, idx) => i + idx);
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(pdf, pageIndices);
          pages.forEach(page => newPdf.addPage(page));
          result.push(Buffer.from(await newPdf.save()));
        }
        break;
    }

    return result;
  }

  async compressPDF(buffer: Buffer, level: 'low' | 'recommended' | 'extreme' = 'recommended'): Promise<Buffer> {
    const tempInput = join(tmpdir(), `input-${Date.now()}.pdf`);
    const tempOutput = join(tmpdir(), `output-${Date.now()}.pdf`);
    
    writeFileSync(tempInput, buffer);
    
    const presets = {
      low: '/prepress',
      recommended: '/ebook',
      extreme: '/screen'
    };
    
    return new Promise((resolve, reject) => {
      const gs = spawn('gs', [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        `-dPDFSETTINGS=${presets[level]}`,
        '-dNOPAUSE',
        '-dBATCH',
        '-dQUIET',
        `-sOutputFile=${tempOutput}`,
        tempInput
      ]);
      
      gs.on('close', (code) => {
        if (code === 0 && existsSync(tempOutput)) {
          const result = readFileSync(tempOutput);
          unlinkSync(tempInput);
          unlinkSync(tempOutput);
          resolve(result);
        } else {
          unlinkSync(tempInput);
          if (existsSync(tempOutput)) unlinkSync(tempOutput);
          reject(new Error('PDF compression failed'));
        }
      });
    });
  }

  async rotatePDF(buffer: Buffer, angle: number, pages?: number[]): Promise<Buffer> {
    const pdf = await PDFDocument.load(buffer);
    const pageIndices = pages || Array.from({ length: pdf.getPageCount() }, (_, i) => i);
    
    pageIndices.forEach(index => {
      if (index < pdf.getPageCount()) {
        pdf.getPage(index).setRotation(degrees(angle));
      }
    });
    
    return Buffer.from(await pdf.save());
  }

  async protectPDF(buffer: Buffer, password: string, permissions: any = {}): Promise<Buffer> {
    const pdf = await PDFDocument.load(buffer);
    
    // Note: pdf-lib doesn't have built-in encryption, using external command
    const tempInput = join(tmpdir(), `input-${Date.now()}.pdf`);
    const tempOutput = join(tmpdir(), `output-${Date.now()}.pdf`);
    
    writeFileSync(tempInput, buffer);
    
    return new Promise((resolve, reject) => {
      const qpdf = spawn('qpdf', [
        '--encrypt', password, password, '256', '--',
        tempInput, tempOutput
      ]);
      
      qpdf.on('close', (code) => {
        if (code === 0 && existsSync(tempOutput)) {
          const result = readFileSync(tempOutput);
          unlinkSync(tempInput);
          unlinkSync(tempOutput);
          resolve(result);
        } else {
          unlinkSync(tempInput);
          if (existsSync(tempOutput)) unlinkSync(tempOutput);
          reject(new Error('PDF protection failed'));
        }
      });
    });
  }

  async unlockPDF(buffer: Buffer, password: string): Promise<Buffer> {
    const tempInput = join(tmpdir(), `input-${Date.now()}.pdf`);
    const tempOutput = join(tmpdir(), `output-${Date.now()}.pdf`);
    
    writeFileSync(tempInput, buffer);
    
    return new Promise((resolve, reject) => {
      const qpdf = spawn('qpdf', [
        '--decrypt', `--password=${password}`,
        tempInput, tempOutput
      ]);
      
      qpdf.on('close', (code) => {
        if (code === 0 && existsSync(tempOutput)) {
          const result = readFileSync(tempOutput);
          unlinkSync(tempInput);
          unlinkSync(tempOutput);
          resolve(result);
        } else {
          unlinkSync(tempInput);
          if (existsSync(tempOutput)) unlinkSync(tempOutput);
          reject(new Error('PDF unlock failed - check password'));
        }
      });
    });
  }

  // Image Conversion
  async pdfToImages(buffer: Buffer, format: 'jpg' | 'png' = 'jpg'): Promise<string[]> {
    const tempInput = join(tmpdir(), `input-${Date.now()}.pdf`);
    const tempOutput = join(tmpdir(), `output-${Date.now()}`);
    
    writeFileSync(tempInput, buffer);
    
    return new Promise((resolve, reject) => {
      const pdftoppm = spawn('pdftoppm', [
        `-${format}`,
        '-r', '300', // High quality 300 DPI
        tempInput,
        tempOutput
      ]);
      
      pdftoppm.on('close', (code) => {
        if (code === 0) {
          const images: string[] = [];
          let pageNum = 1;
          
          while (existsSync(`${tempOutput}-${pageNum}.${format}`)) {
            const imageBuffer = readFileSync(`${tempOutput}-${pageNum}.${format}`);
            images.push(imageBuffer.toString('base64'));
            unlinkSync(`${tempOutput}-${pageNum}.${format}`);
            pageNum++;
          }
          
          unlinkSync(tempInput);
          resolve(images);
        } else {
          unlinkSync(tempInput);
          reject(new Error('PDF to image conversion failed'));
        }
      });
    });
  }

  async imagesToPDF(files: Express.Multer.File[], options: any = {}): Promise<Buffer> {
    const pdf = await PDFDocument.create();
    
    for (const file of files) {
      const image = sharp(file.buffer);
      const { width, height } = await image.metadata();
      
      let imageBytes: Buffer;
      let embedImage: any;
      
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        imageBytes = await image.jpeg({ quality: 90 }).toBuffer();
        embedImage = await pdf.embedJpg(imageBytes);
      } else {
        imageBytes = await image.png().toBuffer();
        embedImage = await pdf.embedPng(imageBytes);
      }
      
      const page = pdf.addPage([width || 595, height || 842]);
      page.drawImage(embedImage, {
        x: 0,
        y: 0,
        width: width || 595,
        height: height || 842
      });
    }
    
    return Buffer.from(await pdf.save());
  }

  // Watermark and Page Numbers
  async addWatermark(buffer: Buffer, text: string, options: any = {}): Promise<Buffer> {
    const pdf = await PDFDocument.load(buffer);
    const pages = pdf.getPages();
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    
    const {
      fontSize = 50,
      opacity = 0.25,
      rotation = -45,
      color = [0.75, 0.75, 0.75]
    } = options;
    
    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - (text.length * fontSize) / 4,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color[0], color[1], color[2]),
        rotate: degrees(rotation),
        opacity
      });
    });
    
    return Buffer.from(await pdf.save());
  }

  async addPageNumbers(buffer: Buffer, options: any = {}): Promise<Buffer> {
    const pdf = await PDFDocument.load(buffer);
    const pages = pdf.getPages();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    
    const {
      position = 'bottom-center',
      fontSize = 12,
      color = [0, 0, 0],
      startNumber = 1,
      format = '{n}'
    } = options;
    
    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const pageNumber = startNumber + index;
      const text = format.replace('{n}', pageNumber.toString()).replace('{p}', pages.length.toString());
      
      let x = width / 2;
      let y = 30;
      
      if (position.includes('top')) y = height - 30;
      if (position.includes('left')) x = 30;
      if (position.includes('right')) x = width - 30;
      
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color[0], color[1], color[2])
      });
    });
    
    return Buffer.from(await pdf.save());
  }

  // OCR Processing
  async performOCR(buffer: Buffer, languages: string[] = ['eng']): Promise<Buffer> {
    const tempInput = join(tmpdir(), `input-${Date.now()}.pdf`);
    const tempOutput = join(tmpdir(), `output-${Date.now()}`);
    
    writeFileSync(tempInput, buffer);
    
    return new Promise((resolve, reject) => {
      const tesseract = spawn('tesseract', [
        tempInput,
        tempOutput,
        'pdf',
        '-l', languages.join('+')
      ]);
      
      tesseract.on('close', (code) => {
        if (code === 0 && existsSync(`${tempOutput}.pdf`)) {
          const result = readFileSync(`${tempOutput}.pdf`);
          unlinkSync(tempInput);
          unlinkSync(`${tempOutput}.pdf`);
          resolve(result);
        } else {
          unlinkSync(tempInput);
          if (existsSync(`${tempOutput}.pdf`)) unlinkSync(`${tempOutput}.pdf`);
          reject(new Error('OCR processing failed'));
        }
      });
    });
  }

  // Office Conversion
  async convertToPDF(buffer: Buffer, sourceFormat: string): Promise<Buffer> {
    const tempInput = join(tmpdir(), `input-${Date.now()}.${sourceFormat}`);
    const tempOutput = join(tmpdir(), `output-${Date.now()}.pdf`);
    
    writeFileSync(tempInput, buffer);
    
    return new Promise((resolve, reject) => {
      const libreoffice = spawn('libreoffice', [
        '--headless',
        '--convert-to', 'pdf',
        '--outdir', tmpdir(),
        tempInput
      ]);
      
      libreoffice.on('close', (code) => {
        if (code === 0 && existsSync(tempOutput)) {
          const result = readFileSync(tempOutput);
          unlinkSync(tempInput);
          unlinkSync(tempOutput);
          resolve(result);
        } else {
          unlinkSync(tempInput);
          if (existsSync(tempOutput)) unlinkSync(tempOutput);
          reject(new Error('Office to PDF conversion failed'));
        }
      });
    });
  }

  // Utility functions
  private parseRanges(rangeString: string, maxPages: number): number[][] {
    const ranges: number[][] = [];
    const parts = rangeString.split(',');
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()) - 1);
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        ranges.push(range.filter(i => i >= 0 && i < maxPages));
      } else {
        const pageIndex = parseInt(part.trim()) - 1;
        if (pageIndex >= 0 && pageIndex < maxPages) {
          ranges.push([pageIndex]);
        }
      }
    }
    
    return ranges;
  }
}

export const pdfService = new PDFService();