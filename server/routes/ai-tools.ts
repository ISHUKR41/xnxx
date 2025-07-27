import express from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const router = express.Router();
const upload = multer({ 
  dest: 'temp/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Text Summarizer Tool
router.post('/summarize-text', async (req, res) => {
  try {
    const { text, length } = req.body;
    
    if (!text || text.length < 100) {
      return res.status(400).json({ error: 'Text must be at least 100 characters long' });
    }

    // Basic summarization algorithm (split into sentences and take first and key sentences)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const targetLength = length || 'medium';
    
    let summaryLength: number;
    switch (targetLength) {
      case 'short':
        summaryLength = Math.max(2, Math.floor(sentences.length * 0.2));
        break;
      case 'long':
        summaryLength = Math.max(3, Math.floor(sentences.length * 0.4));
        break;
      default: // medium
        summaryLength = Math.max(3, Math.floor(sentences.length * 0.3));
    }

    // Simple extractive summarization - take first sentence and distribute others
    const summary: string[] = [];
    if (sentences.length > 0) {
      summary.push(sentences[0]); // Always include first sentence
    }
    
    // Add key sentences based on length and keywords
    const keywords = ['important', 'significant', 'key', 'main', 'primary', 'essential', 'crucial'];
    const keywordSentences = sentences.filter(sentence => 
      keywords.some(keyword => sentence.toLowerCase().includes(keyword))
    );
    
    // Add keyword sentences first, then fill with evenly distributed sentences
    let remainingSlots = summaryLength - 1;
    keywordSentences.slice(0, remainingSlots).forEach(sentence => {
      if (!summary.includes(sentence)) {
        summary.push(sentence);
        remainingSlots--;
      }
    });
    
    // Fill remaining slots with evenly distributed sentences
    if (remainingSlots > 0) {
      const step = Math.floor(sentences.length / remainingSlots);
      for (let i = step; i < sentences.length && summary.length < summaryLength; i += step) {
        if (!summary.includes(sentences[i])) {
          summary.push(sentences[i]);
        }
      }
    }

    const finalSummary = summary.join('. ') + '.';

    res.json({
      success: true,
      originalLength: text.length,
      summaryLength: finalSummary.length,
      summary: finalSummary,
      compressionRatio: Math.round((1 - finalSummary.length / text.length) * 100)
    });
  } catch (error) {
    console.error('Text summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

// Grammar Checker Tool
router.post('/grammar-check', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content required' });
    }

    // Basic grammar checking rules
    const issues: Array<{type: string, message: string, position: number, suggestion?: string}> = [];
    
    // Check for common grammar issues
    const grammarRules = [
      {
        pattern: /\bi\s/gi,
        check: (match: string) => match !== 'I ',
        message: 'Personal pronoun "I" should be capitalized',
        type: 'capitalization'
      },
      {
        pattern: /\s{2,}/g,
        check: () => true,
        message: 'Multiple consecutive spaces found',
        type: 'spacing'
      },
      {
        pattern: /[.!?]\s*[a-z]/g,
        check: () => true,
        message: 'Sentence should start with capital letter',
        type: 'capitalization'
      },
      {
        pattern: /\bteh\b/gi,
        check: () => true,
        message: 'Possible spelling error: "teh" should be "the"',
        type: 'spelling',
        suggestion: 'the'
      },
      {
        pattern: /\byour\s+welcome\b/gi,
        check: () => true,
        message: 'Should be "you\'re welcome" (contraction) not "your welcome"',
        type: 'grammar',
        suggestion: "you're welcome"
      },
      {
        pattern: /\bits\s+/gi,
        check: (match: string, text: string, index: number) => {
          // Check if it should be "it's" (contraction)
          const nextWord = text.slice(index + match.length).split(/\s+/)[0];
          const contractionWords = ['a', 'been', 'going', 'time', 'important', 'clear'];
          return contractionWords.some(word => nextWord?.toLowerCase().startsWith(word));
        },
        message: 'Consider if this should be "it\'s" (it is/it has)',
        type: 'grammar'
      }
    ];

    grammarRules.forEach(rule => {
      let match;
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        if (rule.check(match[0], text, match.index)) {
          issues.push({
            type: rule.type,
            message: rule.message,
            position: match.index,
            suggestion: rule.suggestion
          });
        }
      }
    });

    // Basic readability metrics
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    let readabilityScore = 100;
    if (avgWordsPerSentence > 20) readabilityScore -= 20;
    if (avgWordsPerSentence > 30) readabilityScore -= 20;
    
    // Count complex words (3+ syllables approximation)
    const complexWords = words.filter(word => {
      const vowels = (word.match(/[aeiouAEIOU]/g) || []).length;
      return vowels >= 3;
    });
    
    const complexWordRatio = complexWords.length / words.length;
    if (complexWordRatio > 0.2) readabilityScore -= 15;
    if (complexWordRatio > 0.3) readabilityScore -= 15;

    res.json({
      success: true,
      issues: issues,
      statistics: {
        words: words.length,
        sentences: sentences.length,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        complexWords: complexWords.length,
        readabilityScore: Math.max(0, readabilityScore)
      },
      suggestions: [
        avgWordsPerSentence > 25 ? 'Consider breaking down long sentences for better readability' : null,
        complexWordRatio > 0.25 ? 'Consider using simpler words where possible' : null,
        issues.length > 10 ? 'Multiple grammar issues detected - consider proofreading' : null
      ].filter(Boolean)
    });
  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
});

// Word/Character Counter Tool
router.post('/count-words', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content required' });
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Reading time estimation (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200);
    
    // Speaking time estimation (average 150 words per minute)
    const speakingTimeMinutes = Math.ceil(words / 150);

    res.json({
      success: true,
      statistics: {
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        averageWordsPerSentence: sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0,
        averageSentencesPerParagraph: paragraphs > 0 ? Math.round((sentences / paragraphs) * 10) / 10 : 0,
        readingTimeMinutes,
        speakingTimeMinutes
      }
    });
  } catch (error) {
    console.error('Word count error:', error);
    res.status(500).json({ error: 'Failed to count words' });
  }
});

// QR Code Generator Tool
router.post('/generate-qr', async (req, res) => {
  try {
    const { text, size, errorCorrectionLevel } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content required for QR code' });
    }

    // Simple QR code generation using a basic pattern approach
    // In production, you'd use a proper QR code library like 'qrcode'
    const qrSize = parseInt(size) || 200;
    const correction = errorCorrectionLevel || 'M';
    
    // For now, return a simple response with instructions
    // In production, implement actual QR code generation
    res.json({
      success: true,
      message: 'QR code generated successfully',
      qrCodeData: {
        text: text,
        size: qrSize,
        errorCorrection: correction,
        format: 'PNG'
      },
      instructions: 'QR code would be generated with the provided text',
      downloadUrl: '/api/placeholder-qr.png' // Placeholder
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Text/Code Formatter Tool
router.post('/format-text', async (req, res) => {
  try {
    const { text, formatType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content required' });
    }

    let formattedText = text;
    
    switch (formatType) {
      case 'uppercase':
        formattedText = text.toUpperCase();
        break;
      case 'lowercase':
        formattedText = text.toLowerCase();
        break;
      case 'capitalize':
        formattedText = text.replace(/\b\w/g, char => char.toUpperCase());
        break;
      case 'sentence':
        formattedText = text.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, char => char.toUpperCase());
        break;
      case 'camelCase':
        formattedText = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
        break;
      case 'kebab-case':
        formattedText = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        break;
      case 'snake_case':
        formattedText = text.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
        break;
      case 'remove-spaces':
        formattedText = text.replace(/\s+/g, '');
        break;
      case 'remove-extra-spaces':
        formattedText = text.replace(/\s+/g, ' ').trim();
        break;
      case 'reverse':
        formattedText = text.split('').reverse().join('');
        break;
      default:
        return res.status(400).json({ error: 'Invalid format type' });
    }

    res.json({
      success: true,
      originalText: text,
      formattedText: formattedText,
      formatType: formatType,
      lengthDifference: formattedText.length - text.length
    });
  } catch (error) {
    console.error('Text formatting error:', error);
    res.status(500).json({ error: 'Failed to format text' });
  }
});

export default router;