import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { spawn } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export class TextService {

  async textToPDF(text: string, options: any = {}): Promise<Buffer> {
    const {
      fontSize = 12,
      pageSize = 'A4',
      margin = 50,
      lineHeight = 1.5,
      fontColor = [0, 0, 0]
    } = options;

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    
    // Page dimensions for A4
    const pageWidth = 595;
    const pageHeight = 842;
    const contentWidth = pageWidth - (margin * 2);
    
    // Split text into lines that fit the page width
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth <= contentWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word); // Single word is too long but we need to include it
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Create pages and add text
    let currentPage = pdf.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;
    const lineSpacing = fontSize * lineHeight;
    
    for (const line of lines) {
      if (yPosition < margin + fontSize) {
        // Start new page
        currentPage = pdf.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
      
      currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(fontColor[0], fontColor[1], fontColor[2])
      });
      
      yPosition -= lineSpacing;
    }
    
    return Buffer.from(await pdf.save());
  }

  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    const tempInput = join(tmpdir(), `input-${Date.now()}.pdf`);
    const tempOutput = join(tmpdir(), `output-${Date.now()}.txt`);
    
    writeFileSync(tempInput, buffer);
    
    return new Promise((resolve, reject) => {
      const pdftotext = spawn('pdftotext', [tempInput, tempOutput]);
      
      pdftotext.on('close', (code) => {
        if (code === 0 && existsSync(tempOutput)) {
          const text = readFileSync(tempOutput, 'utf-8');
          unlinkSync(tempInput);
          unlinkSync(tempOutput);
          resolve(text);
        } else {
          unlinkSync(tempInput);
          if (existsSync(tempOutput)) unlinkSync(tempOutput);
          reject(new Error('Text extraction failed'));
        }
      });
    });
  }

  async countWords(text: string): Promise<any> {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      averageWordsPerSentence: Math.round(words.length / sentences),
      readingTime: Math.ceil(words.length / 200) // Assuming 200 words per minute
    };
  }

  async convertCase(text: string, caseType: string): Promise<string> {
    switch (caseType.toLowerCase()) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'sentence':
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      case 'camel':
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
      case 'pascal':
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
          word.toUpperCase()
        ).replace(/\s+/g, '');
      case 'snake':
        return text.toLowerCase().replace(/\s+/g, '_');
      case 'kebab':
        return text.toLowerCase().replace(/\s+/g, '-');
      default:
        return text;
    }
  }

  async removeExtraSpaces(text: string): Promise<string> {
    return text
      .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
      .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
      .trim();
  }

  async findAndReplace(text: string, find: string, replace: string, options: any = {}): Promise<string> {
    const { caseSensitive = true, wholeWord = false, regex = false } = options;
    
    if (regex) {
      const flags = caseSensitive ? 'g' : 'gi';
      const pattern = new RegExp(find, flags);
      return text.replace(pattern, replace);
    }
    
    let searchText = find;
    if (wholeWord) {
      searchText = `\\b${find}\\b`;
    }
    
    const flags = caseSensitive ? 'g' : 'gi';
    const pattern = new RegExp(searchText, flags);
    
    return text.replace(pattern, replace);
  }

  async extractUrls(text: string): Promise<string[]> {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches || [];
  }

  async extractEmails(text: string): Promise<string[]> {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailRegex);
    return matches || [];
  }

  async extractPhoneNumbers(text: string): Promise<string[]> {
    const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const matches = text.match(phoneRegex);
    return matches || [];
  }

  async generateSummary(text: string, sentences: number = 3): Promise<string> {
    // Simple extractive summarization
    const sentenceArray = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentenceArray.length <= sentences) {
      return text;
    }
    
    // Score sentences based on word frequency
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 2) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });
    
    // Score sentences
    const sentenceScores = sentenceArray.map(sentence => {
      const sentenceWords = sentence.toLowerCase().split(/\s+/);
      let score = 0;
      sentenceWords.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (wordFreq[cleanWord]) {
          score += wordFreq[cleanWord];
        }
      });
      return { sentence: sentence.trim(), score };
    });
    
    // Get top sentences
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, sentences)
      .sort((a, b) => sentenceArray.indexOf(a.sentence) - sentenceArray.indexOf(b.sentence))
      .map(item => item.sentence);
    
    return topSentences.join('. ') + '.';
  }

  async formatText(text: string, options: any = {}): Promise<string> {
    const {
      indent = 0,
      lineWidth = 80,
      alignment = 'left',
      paragraphSpacing = 1
    } = options;
    
    let formatted = text;
    
    // Add indentation
    if (indent > 0) {
      const indentStr = ' '.repeat(indent);
      formatted = formatted.split('\n').map(line => indentStr + line).join('\n');
    }
    
    // Wrap lines
    if (lineWidth > 0) {
      const words = formatted.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        if ((currentLine + word).length <= lineWidth) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            lines.push(word);
          }
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      formatted = lines.join('\n');
    }
    
    // Add paragraph spacing
    if (paragraphSpacing > 1) {
      const spacing = '\n'.repeat(paragraphSpacing - 1);
      formatted = formatted.replace(/\n\n/g, '\n' + spacing + '\n');
    }
    
    return formatted;
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    // This is a placeholder for translation functionality
    // In production, you would integrate with services like Google Translate API
    // For now, return original text with a note
    return `[Translation to ${targetLanguage} would be implemented with translation service]\n\n${text}`;
  }

  async checkGrammar(text: string): Promise<any> {
    // This is a placeholder for grammar checking
    // In production, you would integrate with services like LanguageTool API
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length;
    
    return {
      original: text,
      suggestions: [],
      stats: {
        words: wordCount,
        sentences: sentenceCount,
        readabilityScore: Math.random() * 100 // Placeholder
      },
      errors: 0,
      note: "Grammar checking would be implemented with language processing service"
    };
  }
}

export const textService = new TextService();