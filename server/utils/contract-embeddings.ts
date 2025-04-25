import { OpenAI } from 'openai';
import { createWorker } from 'tesseract.js';
import { default as pdfParse } from 'pdf-parse';
import { supabase } from '../supabase';
import { Buffer } from 'buffer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Add logging utility
const log = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}:`, error);
    console.error('Stack trace:', error?.stack);
  },
  debug: (message: string, data?: any) => {
    console.debug(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

interface ContractClause {
  id: string;
  contractId: number;
  sectionTitle: string;
  content: string;
  type: 'revenue' | 'performance' | 'payment' | 'termination' | 'general';
  embedding: number[];
  metadata: {
    pageNumber: number;
    importance: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

interface ProcessedContract {
  fullText: string;
  clauses: ContractClause[];
  metadata: {
    totalPages: number;
    processedAt: string;
    hasEmbeddings: boolean;
  };
}

/**
 * Extract text from PDF with multiple fallbacks
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  let extractedText = '';
  let error: Error | null = null;

  log.info('Starting PDF text extraction');
  
  // Try normal PDF text extraction first
  try {
    log.debug('Attempting standard PDF parsing');
    const data = await pdfParse(buffer);
    extractedText = data.text.trim();
    if (extractedText) {
      log.info('Successfully extracted text using pdf-parse', {
        textLength: extractedText.length,
        firstFewChars: extractedText.substring(0, 100)
      });
      return extractedText;
    }
    log.debug('PDF parsing returned empty text, falling back to OCR');
  } catch (e) {
    error = e as Error;
    log.error('PDF parsing failed', error);
  }

  // Try OCR if PDF parsing failed or returned no text
  try {
    log.debug('Attempting OCR with Tesseract');
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    
    if (text.trim()) {
      log.info('Successfully extracted text using OCR', {
        textLength: text.length,
        firstFewChars: text.substring(0, 100)
      });
      return text;
    }
    log.debug('OCR returned empty text, falling back to AI extraction');
  } catch (e) {
    error = e as Error;
    log.error('OCR extraction failed', error);
  }

  // If both methods failed, try AI-powered extraction
  try {
    log.debug('Attempting AI-powered extraction');
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a contract analysis expert. Clean and structure the following contract text, fixing any OCR errors and maintaining proper formatting."
        },
        {
          role: "user",
          content: buffer.toString('utf-8')
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const aiExtractedText = completion.choices[0].message.content;
    if (aiExtractedText?.trim()) {
      log.info('Successfully extracted text using AI', {
        textLength: aiExtractedText.length,
        firstFewChars: aiExtractedText.substring(0, 100)
      });
      return aiExtractedText;
    }
    log.error('AI extraction returned empty text', { text: aiExtractedText });
  } catch (e) {
    error = e as Error;
    log.error('AI extraction failed', error);
  }

  throw new Error(`Failed to extract text from PDF: ${error?.message || 'All extraction methods failed'}`);
}

/**
 * Extract clauses from contract text using multiple patterns
 */
async function extractClauses(text: string): Promise<ContractClause[]> {
  log.info('Starting clause extraction', { textLength: text.length });
  const clauses: ContractClause[] = [];
  
  // Common section patterns in contracts
  const patterns = [
    // Standard Article/Section format
    /(?:ARTICLE|Section)\s+\d+[.:]\s*(.*?)(?=(?:ARTICLE|Section)\s+\d+|$)/gis,
    // Numbered clauses
    /(?:\d+\.)\s*(.*?)(?=\d+\.|$)/gis,
    // Lettered clauses
    /(?:[A-Z]\.)\s*(.*?)(?=[A-Z]\.|$)/gis,
    // Named sections with all caps
    /([A-Z][A-Z\s]+(?:\s*[-:]\s*[A-Z][A-Z\s]+)*)\s*(.*?)(?=[A-Z][A-Z\s]+(?:\s*[-:]\s*[A-Z][A-Z\s]+)*|$)/gis
  ];

  // Try each pattern until we find sections
  for (const pattern of patterns) {
    log.debug('Trying pattern', { pattern: pattern.toString() });
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      log.info(`Found ${matches.length} sections using pattern`, { pattern: pattern.toString() });
      for (const match of matches) {
        const title = match[1]?.trim() || '';
        const content = match[2]?.trim() || match[0]?.trim() || '';
        
        if (content) {
          const type = await determineClauseType(title, content);
          const importance = calculateImportance(title, content);
          
          log.debug('Processed clause', {
            title,
            type,
            importance,
            contentLength: content.length
          });

          clauses.push({
            id: `clause_${Date.now()}_${clauses.length}`,
            contractId: 0,
            sectionTitle: title,
            content,
            type,
            embedding: [],
            metadata: {
              pageNumber: estimatePageNumber(match.index, text),
              importance,
              riskLevel: assessRiskLevel(content)
            }
          });
        }
      }
      break;
    }
  }

  // If no sections found with patterns, try AI-powered section extraction
  if (clauses.length === 0) {
    log.info('No sections found with patterns, attempting AI extraction');
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a contract analysis expert. Split the following contract text into logical sections. For each section, provide a title and content. Format the output as JSON array with objects containing 'title' and 'content' properties."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const aiSections = JSON.parse(completion.choices[0].message.content || '{"sections":[]}').sections;
      log.info(`AI extraction found ${aiSections.length} sections`);
      
      for (const section of aiSections) {
        if (section.content) {
          const type = await determineClauseType(section.title, section.content);
          const importance = calculateImportance(section.title, section.content);
          
          log.debug('Processed AI-extracted clause', {
            title: section.title,
            type,
            importance,
            contentLength: section.content.length
          });

          clauses.push({
            id: `clause_${Date.now()}_${clauses.length}`,
            contractId: 0,
            sectionTitle: section.title,
            content: section.content,
            type,
            embedding: [],
            metadata: {
              pageNumber: estimatePageNumber(section.content.indexOf(section.title), section.content),
              importance,
              riskLevel: assessRiskLevel(section.content)
            }
          });
        }
      }
    } catch (error) {
      log.error('AI section extraction error', error);
      // If AI extraction fails, create a single clause from the entire text
      log.info('Creating single clause from entire text');
      clauses.push({
        id: `clause_${Date.now()}_${clauses.length}`,
        contractId: 0,
        sectionTitle: 'Contract Text',
        content: text,
        type: 'general',
        embedding: [],
        metadata: {
          pageNumber: estimatePageNumber(text.length, text),
          importance: 1,
          riskLevel: assessRiskLevel(text)
        }
      });
    }
  }

  log.info(`Finished clause extraction. Found ${clauses.length} clauses`);
  return clauses;
}

/**
 * Generate embeddings for clauses using OpenAI
 */
async function generateEmbeddings(clauses: ContractClause[]): Promise<ContractClause[]> {
  log.info(`Starting embedding generation for ${clauses.length} clauses`);
  const embeddedClauses: ContractClause[] = [];
  
  // Process in batches to avoid rate limits
  const batchSize = 20;
  for (let i = 0; i < clauses.length; i += batchSize) {
    const batch = clauses.slice(i, i + batchSize);
    const texts = batch.map(clause => clause.content);
    
    log.debug(`Processing batch ${Math.floor(i/batchSize) + 1}`, {
      batchSize: batch.length,
      totalProcessed: i,
      remaining: clauses.length - i
    });

    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
        encoding_format: "float"
      });
      
      batch.forEach((clause, index) => {
        embeddedClauses.push({
          ...clause,
          embedding: response.data[index].embedding
        });
      });

      log.debug(`Successfully embedded batch ${Math.floor(i/batchSize) + 1}`);
    } catch (error) {
      log.error(`Error generating embeddings for batch ${Math.floor(i/batchSize) + 1}`, error);
      throw new Error('Failed to generate embeddings');
    }
  }
  
  log.info(`Finished generating embeddings for ${embeddedClauses.length} clauses`);
  return embeddedClauses;
}

/**
 * Store clause embeddings in Supabase
 */
async function storeEmbeddings(contractId: number, clauses: ContractClause[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('contract_embeddings')
      .insert(
        clauses.map(clause => ({
          contract_id: contractId,
          section_title: clause.sectionTitle,
          content: clause.content,
          type: clause.type,
          embedding: clause.embedding,
          metadata: clause.metadata
        }))
      );
    
    if (error) throw error;
  } catch (error) {
    console.error('Error storing embeddings:', error);
    throw new Error('Failed to store embeddings');
  }
}

/**
 * Process contract PDF and generate embeddings
 */
export async function processContractWithEmbeddings(
  buffer: Buffer,
  contractId: number
): Promise<ProcessedContract> {
  log.info('Starting contract processing', { contractId });
  
  try {
    // 1. Extract text
    log.debug('Step 1: Extracting text');
    const fullText = await extractTextFromPDF(buffer);
    log.info('Text extraction complete', { 
      textLength: fullText.length,
      firstFewChars: fullText.substring(0, 100)
    });
    
    // 2. Extract clauses
    log.debug('Step 2: Extracting clauses');
    const clauses = await extractClauses(fullText);
    log.info('Clause extraction complete', { 
      clauseCount: clauses.length 
    });
    
    // 3. Generate embeddings
    log.debug('Step 3: Generating embeddings');
    const embeddedClauses = await generateEmbeddings(clauses);
    log.info('Embedding generation complete', { 
      embeddedClauseCount: embeddedClauses.length 
    });
    
    // 4. Store in Supabase
    log.debug('Step 4: Storing embeddings');
    await storeEmbeddings(contractId, embeddedClauses);
    log.info('Embedding storage complete');
    
    return {
      fullText,
      clauses: embeddedClauses,
      metadata: {
        totalPages: Math.ceil(fullText.length / 3000), // Rough estimate
        processedAt: new Date().toISOString(),
        hasEmbeddings: true
      }
    };
  } catch (error) {
    log.error('Error processing contract', error);
    throw error;
  }
}

// Helper functions

function determineClauseType(title: string, content: string): ContractClause['type'] {
  const keywords = {
    revenue: ['revenue', 'payment', 'price', 'fee', 'compensation'],
    performance: ['performance', 'obligation', 'delivery', 'service'],
    payment: ['payment', 'invoice', 'billing'],
    termination: ['termination', 'cancellation', 'expiration']
  };
  
  const textLower = content.toLowerCase();
  
  for (const [type, words] of Object.entries(keywords)) {
    if (words.some(word => textLower.includes(word))) {
      return type as ContractClause['type'];
    }
  }
  
  return 'general';
}

function calculateImportance(title: string, content: string): number {
  const keywordWeight = content.split(/\b(shall|must|required|essential)\b/i).length - 1;
  const lengthWeight = Math.min(content.length / 1000, 1);
  return Math.min((keywordWeight * 0.6 + lengthWeight * 0.4) * 10, 10);
}

function assessRiskLevel(text: string): 'low' | 'medium' | 'high' {
  const riskKeywords = {
    high: ['terminate', 'penalty', 'liability', 'breach', 'damages'],
    medium: ['may', 'should', 'recommend', 'consider'],
    low: ['shall', 'will', 'must', 'agree']
  };
  
  const textLower = text.toLowerCase();
  
  if (riskKeywords.high.some(word => textLower.includes(word))) {
    return 'high';
  }
  if (riskKeywords.medium.some(word => textLower.includes(word))) {
    return 'medium';
  }
  return 'low';
}

function estimatePageNumber(charIndex: number, fullText: string): number {
  const charsPerPage = 3000; // Rough estimate
  return Math.floor(charIndex / charsPerPage) + 1;
}

/**
 * Search for similar clauses using embeddings
 */
export async function searchSimilarClauses(
  searchQuery: string,
  contractId?: number,
  clauseType?: ContractClause['type']
): Promise<Array<{ content: string; similarity: number }>> {
  try {
    // Generate embedding for the search query
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: searchQuery,
      encoding_format: "float"
    });
    
    const queryEmbedding = response.data[0].embedding;
    
    // Search in Supabase using vector similarity
    let queryBuilder = supabase
      .rpc('match_contract_clauses', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 5
      });
    
    if (contractId) {
      queryBuilder = queryBuilder.eq('contract_id', contractId);
    }
    
    if (clauseType) {
      queryBuilder = queryBuilder.eq('type', clauseType);
    }
    
    const { data: matches, error } = await queryBuilder;
    
    if (error) throw error;
    
    return matches.map((match: { content: string; similarity: number }) => ({
      content: match.content,
      similarity: match.similarity
    }));
  } catch (error) {
    console.error('Error searching similar clauses:', error);
    throw new Error('Failed to search similar clauses');
  }
} 