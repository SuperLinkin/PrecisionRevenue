import pdfPlumber from 'pdfplumber';
import { OpenAI } from 'openai';
import { Buffer } from 'buffer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface PreprocessedText {
  normalizedText: string;
  paragraphs: string[];
  clauseBoundaries: Array<{
    start: number;
    end: number;
    type: string;
    confidence: number;
  }>;
}

// Text normalization functions
function normalizeText(text: string): string {
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ')                   // Normalize whitespace
    .replace(/['']/g, "'")                  // Normalize quotes
    .replace(/[""]/g, '"')                  // Normalize double quotes
    .replace(/\r\n|\r|\n/g, '\n')          // Normalize line endings
    .trim();
}

// Smart line joining
function joinBrokenLines(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let currentParagraph = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if line appears to be a continuation
    const isContinuation = (
      !trimmedLine.match(/^[A-Z]/) &&                     // Doesn't start with capital letter
      !trimmedLine.match(/^[\d\.\(\)]+/) &&              // Doesn't start with number or list marker
      !trimmedLine.match(/^(Section|Article|SECTION)/i) && // Not a section header
      currentParagraph.length > 0 &&                      // Have existing content
      !currentParagraph.endsWith('.') &&                  // Previous line didn't end with period
      !currentParagraph.endsWith(':') &&                  // Previous line didn't end with colon
      !currentParagraph.endsWith(';')                     // Previous line didn't end with semicolon
    );

    if (isContinuation) {
      currentParagraph += ' ' + trimmedLine;
    } else {
      if (currentParagraph) {
        paragraphs.push(currentParagraph);
      }
      currentParagraph = trimmedLine;
    }
  }

  if (currentParagraph) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs;
}

// Clause boundary detection
function detectClauseBoundaries(text: string): Array<{start: number; end: number; type: string; confidence: number}> {
  const boundaries: Array<{start: number; end: number; type: string; confidence: number}> = [];
  
  // Common legal clause markers
  const clauseMarkers = [
    { pattern: /provided[,\s]+that/gi, type: 'condition', confidence: 0.9 },
    { pattern: /notwithstanding/gi, type: 'exception', confidence: 0.9 },
    { pattern: /subject to/gi, type: 'condition', confidence: 0.8 },
    { pattern: /for the avoidance of doubt/gi, type: 'clarification', confidence: 0.9 },
    { pattern: /whereas/gi, type: 'recital', confidence: 0.9 },
    { pattern: /^Section \d+/gmi, type: 'section', confidence: 1.0 },
    { pattern: /^Article \d+/gmi, type: 'article', confidence: 1.0 }
  ];

  // Find all clause markers
  for (const marker of clauseMarkers) {
    let match;
    while ((match = marker.pattern.exec(text)) !== null) {
      boundaries.push({
        start: match.index,
        end: match.index + match[0].length,
        type: marker.type,
        confidence: marker.confidence
      });
    }
  }

  return boundaries.sort((a, b) => a.start - b.start);
}

// OCR cleanup using AI
async function cleanOCRText(text: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at fixing OCR errors in legal documents. Clean up the text while preserving the legal meaning and formatting."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    return completion.choices[0].message.content || text;
  } catch (error) {
    console.error('Error cleaning OCR text:', error);
    return text;
  }
}

export async function preprocessText(buffer: Buffer): Promise<PreprocessedText> {
  try {
    // Extract text using pdfplumber
    const pdf = await pdfPlumber.open(buffer);
    let extractedText = '';
    
    for (const page of pdf.pages) {
      extractedText += await page.extractText() + '\n';
    }
    
    // Normalize the extracted text
    const normalizedText = normalizeText(extractedText);
    
    // Split into lines and join broken ones
    const lines = normalizedText.split('\n');
    const paragraphs = joinBrokenLines(lines);
    
    // Clean up OCR artifacts if needed
    const cleanedText = await cleanOCRText(paragraphs.join('\n'));
    
    // Detect clause boundaries
    const clauseBoundaries = detectClauseBoundaries(cleanedText);
    
    return {
      normalizedText: cleanedText,
      paragraphs: cleanedText.split('\n'),
      clauseBoundaries
    };
  } catch (error) {
    console.error('Error in text preprocessing:', error);
    throw new Error('Failed to preprocess text');
  }
} 