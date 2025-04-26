/// <reference types="node" />
import { Router, Request, Response } from 'express';
import { db } from '../db';
import { supabase } from '../supabase';
import { validateOpenAIConfig } from '../utils/openai';
import { Buffer } from 'buffer';
import { authenticate } from '../utils/auth';
import { upload } from '../utils/multer';
import { contracts } from '@shared/schema';
import { openai } from '../utils/openai';
import {
  analyzeContract,
  analyzeRevenueRecognition,
  extractContractEntities,
  analyzeContractObligations,
  compareToStandardContract,
  checkOpenAIAvailability
} from '../utils/contract-analysis';
import { processPDFContract } from '../utils/pdf-processor';
import { processContractWithEmbeddings, searchSimilarClauses } from '../utils/contract-embeddings';
import { eq } from 'drizzle-orm';
import type { InsertContract } from '@shared/schema';
import { analyzeRevenueClausesAndTriggers, type RevenueAnalysis } from '../utils/revenue-clauses';
import { ContractAnalysisService } from '../services/ContractAnalysisService';
import { OpenAI } from '@langchain/openai';
import { log } from '../utils/logger';

// Define types for request bodies
interface ContractAnalysisRequest {
  contractText?: string;
  base64Data?: string;
  contractId?: number;
}

interface ContractEntityRequest {
  contractId: number;
  contractText?: string;
  base64Data?: string;
}

interface ContractComparisonRequest {
  contractId: number;
  templateType: string;
  contractText?: string;
  base64Data?: string;
}

interface ContractValidation {
  isValid: boolean;
  name: string;
  contractNumber: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  value: number;
  status?: string;
  companyId?: number;
  tenantId?: number;
  createdBy?: number;
  fileUrl?: string;
  ifrsCompliant?: boolean;
  revenueRecognitionMethod?: 'point_in_time' | 'over_time' | 'milestone' | 'percentage_of_completion' | 'manual';
  contractType?: 'fixed_price' | 'time_material' | 'subscription' | 'license' | 'hybrid' | 'other';
  completionPercentage?: number;
  totalTransactionPrice?: number;
  discountAmount?: number;
  containsVariableConsideration?: boolean;
  containsSignificantFinancingComponent?: boolean;
  hasMultiplePerformanceObligations?: boolean;
  errors?: string[];
}

interface Contract {
  id: number;
  name: string;
  contractNumber: string;
  clientName: string;
  startDate: Date;
  endDate: Date | null;
  value: number;
  status: string;
  companyId: number;
  tenantId: number | null;
  createdBy: number;
  fileUrl: string | null;
  ifrsCompliant: boolean;
  revenueRecognitionMethod: string | null;
  contractType: string | null;
  completionPercentage: number | null;
  totalTransactionPrice: number | null;
  discountAmount: number | null;
  containsVariableConsideration: boolean;
  containsSignificantFinancingComponent: boolean;
  hasMultiplePerformanceObligations: boolean;
}

interface EnhancedContractSummary extends ContractSummary {
  contractNumber?: string;
  clientName?: string;
}

interface EnhancedRevenueSummary extends RevenueAnalysis {
  hasFinancingComponent?: boolean;
  multipleObligations?: boolean;
}

interface EnhancedContractAnalysis extends Omit<ContractAnalysis, 'summary' | 'revenueSummary'> {
  summary: EnhancedContractSummary;
  revenueSummary: EnhancedRevenueSummary;
}

interface PDFSection {
  title: string;
  content: string;
  pageNumber: number;
  importance: number;
  type: 'revenue' | 'performance' | 'payment' | 'termination' | 'general';
  subSections: PDFSection[];
  analysis: {
    keyTerms: string[];
    riskLevel: 'low' | 'medium' | 'high';
    complianceImpact: string[];
    crossReferences: string[];
  };
}

function isRevenueClause(section: PDFSection): boolean {
  const revenueKeywords = ['revenue', 'payment', 'price', 'fee', 'compensation', 'consideration'];
  return revenueKeywords.some(keyword => 
    section.content.toLowerCase().includes(keyword) || 
    section.title.toLowerCase().includes(keyword)
  );
}

function isPerformanceClause(section: PDFSection): boolean {
  const performanceKeywords = ['performance', 'obligation', 'delivery', 'service', 'milestone'];
  return performanceKeywords.some(keyword => 
    section.content.toLowerCase().includes(keyword) || 
    section.title.toLowerCase().includes(keyword)
  );
}

function isPaymentClause(section: PDFSection): boolean {
  const paymentKeywords = ['payment', 'invoice', 'billing', 'fee', 'price'];
  return paymentKeywords.some(keyword => 
    section.content.toLowerCase().includes(keyword) || 
    section.title.toLowerCase().includes(keyword)
  );
}

function isTerminationClause(section: PDFSection): boolean {
  const terminationKeywords = ['termination', 'cancellation', 'expiration', 'end'];
  return terminationKeywords.some(keyword => 
    section.content.toLowerCase().includes(keyword) || 
    section.title.toLowerCase().includes(keyword)
  );
}

function extractSections(text: string): PDFSection[] {
  const sections: PDFSection[] = [];
  const sectionRegex = /(?:ARTICLE|Section)\s+\d+[.:]\s*(.*?)(?=(?:ARTICLE|Section)\s+\d+|$)/g;
  
  let match;
  while ((match = sectionRegex.exec(text)) !== null) {
    const content = match[0];
    const title = match[1]?.trim() || '';
    
    const section: PDFSection = {
      title,
      content,
      pageNumber: Math.ceil(match.index / 3000), // Rough estimate
      importance: calculateImportance(content),
      type: determineType(content),
      subSections: [],
      analysis: {
        keyTerms: extractKeyTerms(content),
        riskLevel: determineRiskLevel(content),
        complianceImpact: [],
        crossReferences: []
      }
    };
    
    sections.push(section);
  }
  
  return sections;
}

function calculateImportance(content: string): number {
  // Simple importance calculation based on length and keyword presence
  const keywordWeight = content.split(/\b(shall|must|required|essential)\b/i).length - 1;
  const lengthWeight = Math.min(content.length / 1000, 1);
  return Math.min((keywordWeight * 0.6 + lengthWeight * 0.4) * 10, 10);
}

function determineType(content: string): PDFSection['type'] {
  if (isRevenueClause({ content, title: '', pageNumber: 0, importance: 0, type: 'general', subSections: [], analysis: { keyTerms: [], riskLevel: 'low', complianceImpact: [], crossReferences: [] } })) {
    return 'revenue';
  }
  if (isPerformanceClause({ content, title: '', pageNumber: 0, importance: 0, type: 'general', subSections: [], analysis: { keyTerms: [], riskLevel: 'low', complianceImpact: [], crossReferences: [] } })) {
    return 'performance';
  }
  if (isPaymentClause({ content, title: '', pageNumber: 0, importance: 0, type: 'general', subSections: [], analysis: { keyTerms: [], riskLevel: 'low', complianceImpact: [], crossReferences: [] } })) {
    return 'payment';
  }
  if (isTerminationClause({ content, title: '', pageNumber: 0, importance: 0, type: 'general', subSections: [], analysis: { keyTerms: [], riskLevel: 'low', complianceImpact: [], crossReferences: [] } })) {
    return 'termination';
  }
  return 'general';
}

function extractKeyTerms(content: string): string[] {
  const terms = new Set<string>();
  const keywordRegex = /\b(shall|must|required|essential|material|substantial)\b|\b[A-Z][A-Z\s]{2,}\b/g;
  let match;
  while ((match = keywordRegex.exec(content)) !== null) {
    terms.add(match[0]);
  }
  return Array.from(terms);
}

function determineRiskLevel(content: string): 'low' | 'medium' | 'high' {
  const riskKeywords = {
    high: ['terminate', 'penalty', 'liability', 'breach', 'damages'],
    medium: ['may', 'should', 'recommend', 'consider'],
    low: ['shall', 'will', 'must', 'agree']
  };
  
  const contentLower = content.toLowerCase();
  if (riskKeywords.high.some(word => contentLower.includes(word))) {
    return 'high';
  }
  if (riskKeywords.medium.some(word => contentLower.includes(word))) {
    return 'medium';
  }
  return 'low';
}

const router = Router();
const contractAnalysisService = new ContractAnalysisService();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * Check the availability of OpenAI API
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await checkOpenAIAvailability();
    res.json({ status });
  } catch (error) {
    console.error('Error checking OpenAI status:', error);
    res.status(500).json({ error: 'Failed to check OpenAI availability' });
  }
});

/**
 * Analyze a contract with enhanced revenue recognition focus
 */
router.post('/analyze', upload.single('file'), async (req: Request<{}, {}, ContractAnalysisRequest>, res: Response) => {
  try {
    let contractText = req.body.contractText;
    const base64Data = req.body.base64Data;
    const file = req.file;

    // Validate input
    if (!contractText && !base64Data && !file) {
      return res.status(400).json({ error: 'No contract text or file provided' });
    }

    // Process PDF if provided
    if (file) {
      try {
        // Process contract with embeddings
        const processedContract = await processContractWithEmbeddings(
          file.buffer,
          req.body.contractId || 0
        );
        
        contractText = processedContract.fullText;

        // Analyze contract
        const analysis = await analyzeContract(contractText);
        const revenueAnalysis = await analyzeRevenueClausesAndTriggers(contractText);

        // Combine analyses
        const response = {
          ...analysis,
          revenueDetails: revenueAnalysis,
          processedContent: {
            sections: processedContract.clauses.map(clause => ({
              title: clause.sectionTitle,
              content: clause.content,
              importance: clause.metadata.importance
            })),
            relevantClauses: {
              revenue: processedContract.clauses
                .filter(c => c.type === 'revenue')
                .map(c => c.content),
              performance: processedContract.clauses
                .filter(c => c.type === 'performance')
                .map(c => c.content),
              payment: processedContract.clauses
                .filter(c => c.type === 'payment')
                .map(c => c.content),
              termination: processedContract.clauses
                .filter(c => c.type === 'termination')
                .map(c => c.content)
            }
          }
        };

        return res.json(response);
      } catch (error) {
        console.error('PDF processing error:', error);
        // Fall back to basic text extraction if PDF processing fails
        contractText = await extractTextFromPDF(file.buffer);
      }
    }

    // Process base64 data if provided
    if (base64Data && !contractText) {
      const buffer = Buffer.from(base64Data, 'base64');
      try {
        const processedContract = await processContractWithEmbeddings(
          buffer,
          req.body.contractId || 0
        );
        
        contractText = processedContract.fullText;
        
        // Analyze contract
        const analysis = await analyzeContract(contractText);
        const revenueAnalysis = await analyzeRevenueClausesAndTriggers(contractText);

        // Combine analyses
        const response = {
          ...analysis,
          revenueDetails: revenueAnalysis,
          processedContent: {
            sections: processedContract.clauses.map(clause => ({
              title: clause.sectionTitle,
              content: clause.content,
              importance: clause.metadata.importance
            })),
            relevantClauses: {
              revenue: processedContract.clauses
                .filter(c => c.type === 'revenue')
                .map(c => c.content),
              performance: processedContract.clauses
                .filter(c => c.type === 'performance')
                .map(c => c.content),
              payment: processedContract.clauses
                .filter(c => c.type === 'payment')
                .map(c => c.content),
              termination: processedContract.clauses
                .filter(c => c.type === 'termination')
                .map(c => c.content)
            }
          }
        };

        return res.json(response);
      } catch (error) {
        console.error('PDF processing error:', error);
        contractText = await extractTextFromPDF(buffer);
      }
    }

    // Fallback to basic contract analysis if PDF processing failed
    if (contractText) {
      const analysis = await analyzeContract(contractText);
      const revenueAnalysis = await analyzeRevenueClausesAndTriggers(contractText);
      return res.json({
        ...analysis,
        revenueDetails: revenueAnalysis
      });
    }

    res.status(400).json({ error: 'Failed to process contract text' });
  } catch (error) {
    console.error('Contract analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  }
});

/**
 * Get revenue recognition analysis for a contract
 */
router.get('/revenue-recognition/:contractId', async (req: Request, res: Response) => {
  try {
    const contractId = parseInt(req.params.contractId);
    if (isNaN(contractId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contract ID'
      });
    }

    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    const analysis = await analyzeRevenueRecognition(contract.name);
    res.json(analysis);
  } catch (error: unknown) {
    console.error('Revenue recognition analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze revenue recognition'
    });
  }
});

/**
 * Extract entities from a contract
 */
router.post('/extract-entities', async (req: Request, res: Response) => {
  try {
    const { contractText, base64Data } = req.body as ContractAnalysisRequest;

    if (!contractText && !base64Data) {
      return res.status(400).json({
        success: false,
        error: 'Either contractText or base64Data must be provided'
      });
    }

    const entities = await extractContractEntities(contractText || '');
    res.json(entities);
  } catch (error: unknown) {
    console.error('Entity extraction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to extract entities'
    });
  }
});

/**
 * Analyze performance obligations
 */
router.post('/analyze-obligations', async (req: Request, res: Response) => {
  try {
    const { contractText, base64Data } = req.body as ContractAnalysisRequest;

    if (!contractText && !base64Data) {
      return res.status(400).json({
        success: false,
        error: 'Either contractText or base64Data must be provided'
      });
    }

    const obligations = await analyzeContractObligations(contractText || '');
    res.json(obligations);
  } catch (error: unknown) {
    console.error('Obligation analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze obligations'
    });
  }
});

/**
 * Compare contract to standard templates
 */
router.post('/compare-templates', async (req: Request, res: Response) => {
  try {
    const { contractText, base64Data } = req.body as ContractAnalysisRequest;

    if (!contractText && !base64Data) {
      return res.status(400).json({
        success: false,
        error: 'Either contractText or base64Data must be provided'
      });
    }

    const comparison = await compareToStandardContract(contractText || '', 'standard');
    res.json(comparison);
  } catch (error: unknown) {
    console.error('Template comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare templates'
    });
  }
});

// Define base interfaces from contract-analysis module
interface ContractSummary {
  contractType: string;
  parties: string[];
  effectiveDate: string;
  terminationDate: string;
  contractValue: number;
  keyProvisions: string[];
  paymentTerms: string;
  noticeRequirements: string;
  terminationConditions: string[];
  governingLaw: string;
}

interface ContractAnalysis {
  summary: ContractSummary;
  risks: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    clause: string;
    mitigation?: string;
  }>;
  opportunities: Array<{
    category: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
    clause?: string;
    recommendation?: string;
  }>;
  termsAnalysis: {
    unusualTerms: Array<{
      clause: string;
      description: string;
      impact: string;
    }>;
    favorableTerms: Array<{
      clause: string;
      description: string;
      benefit: string;
    }>;
    nonCompetitiveTerms: Array<{
      clause: string;
      description: string;
      industryStandard: string;
    }>;
  };
  complianceAnalysis: {
    ifrs15Compliance: {
      score: number;
      issues: Array<{
        area: string;
        description: string;
        recommendation: string;
      }>;
      strengths: string[];
    };
    regulatoryIssues: Array<{
      regulation: string;
      issue: string;
      severity: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
  };
  revenueSummary: {
    totalValue: number;
    recognitionPattern: string;
    specialConsiderations: string[];
    variableComponents: Array<{
      description: string;
      estimatedValue: number;
      contingencies: string;
    }>;
  };
}

interface ValidationResponse extends ContractValidation {
  analysis: {
    clauses: Array<{
      type: string;
      title: string;
      content: string;
      importance: number;
      riskLevel: string;
    }>;
    metadata: {
      totalPages: number;
      processedAt: string;
      hasEmbeddings: boolean;
    };
  };
}

// Update the validate route
router.post('/validate', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process contract with embeddings
    let processedContract;
    try {
      processedContract = await processContractWithEmbeddings(
        req.file.buffer,
        0 // Temporary contract ID since we haven't created it yet
      );
    } catch (error) {
      console.error('Contract processing error:', error);
      return res.status(400).json({ 
        error: 'Failed to process contract',
        details: error instanceof Error ? error.message : 'Unknown processing error'
      });
    }

    // Analyze contract
    let analysis: ContractAnalysis;
    try {
      analysis = await analyzeContract(processedContract.fullText);
    } catch (error) {
      console.error('Contract analysis error:', error);
      return res.status(500).json({ error: 'Failed to analyze contract content' });
    }

    // Validate contract
    try {
      const validation = await validateContractContent(analysis);
      
      // Enhance validation response with processed contract data
      const response: ValidationResponse = {
        ...validation,
        analysis: {
          clauses: processedContract.clauses.map(clause => ({
            type: clause.type,
            title: clause.sectionTitle,
            content: clause.content,
            importance: clause.metadata.importance,
            riskLevel: clause.metadata.riskLevel
          })),
          metadata: processedContract.metadata
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Contract validation error:', error);
      return res.status(400).json({ 
        error: 'Contract validation failed',
        details: error instanceof Error ? error.message : 'Unknown validation error'
      });
    }
  } catch (error) {
    console.error('Contract validation error:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update the validation function
async function validateContractContent(analysis: ContractAnalysis): Promise<ContractValidation> {
  const { summary, revenueSummary } = analysis;
  
  if (!summary.effectiveDate) {
    throw new Error('Contract effective date is required');
  }

  // Map contract type to valid enum value
  const contractType = (summary.contractType?.toLowerCase() || 'fixed_price') as 'fixed_price' | 'time_material' | 'subscription' | 'license' | 'hybrid' | 'other';
  
  // Map recognition method to valid enum value
  const recognitionMethod = (revenueSummary.recognitionPattern?.toLowerCase() || 'over_time') as 'point_in_time' | 'over_time' | 'milestone' | 'percentage_of_completion' | 'manual';

  const validation: ContractValidation = {
    isValid: true,
    name: summary.contractType || 'Unknown Contract Type',
    contractNumber: generateContractNumber(), // Generate new contract number
    clientName: summary.parties?.[0] || 'Unknown Client',
    startDate: summary.effectiveDate,
    endDate: summary.terminationDate || undefined,
    value: summary.contractValue || 0,
    contractType,
    revenueRecognitionMethod: recognitionMethod,
    containsVariableConsideration: revenueSummary.variableComponents?.length > 0 || false,
    containsSignificantFinancingComponent: false, // This will be determined by detailed analysis
    hasMultiplePerformanceObligations: false, // This will be determined by detailed analysis
    status: 'draft',
    errors: []
  };

  // Validate required fields
  const errors: string[] = [];
  if (!validation.name) errors.push('Contract name is required');
  if (!validation.contractNumber) errors.push('Contract number is required');
  if (!validation.clientName) errors.push('Client name is required');
  if (!validation.startDate) errors.push('Start date is required');
  if (!validation.value || validation.value <= 0) errors.push('Valid contract value is required');

  validation.isValid = errors.length === 0;
  validation.errors = errors;

  return validation;
}

// Helper function to generate a unique contract number
function generateContractNumber(): string {
  const prefix = 'CT';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
}

// Helper function to upload file to storage
async function uploadToStorage(file: Express.Multer.File): Promise<string> {
  try {
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from('contracts')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('contracts')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Storage upload error:', error);
    return ''; // Return empty string instead of null
  }
}

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Add new route for specific revenue clause analysis
router.post('/analyze-revenue-clauses', async (req: Request, res: Response) => {
  try {
    const { contractText, focusAreas } = req.body;

    if (!contractText) {
      return res.status(400).json({
        success: false,
        error: 'Contract text is required'
      });
    }

    const analysis = await analyzeRevenueClausesAndTriggers(contractText, {
      specialFocus: focusAreas
    });

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Revenue clause analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze revenue clauses'
    });
  }
});

// Add new route for searching similar clauses
router.post('/search-clauses', async (req: Request, res: Response) => {
  try {
    const { query, contractId, type } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const matches = await searchSimilarClauses(query, contractId, type);
    res.json({
      success: true,
      matches
    });
  } catch (error) {
    console.error('Clause search error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search clauses'
    });
  }
});

// Analyze contract
router.post('/analyze', async (req, res) => {
  try {
    if (!req.files || !req.files.contract) {
      return res.status(400).json({ error: 'No contract file provided' });
    }

    const contractFile = req.files.contract;
    const analysis = await contractAnalysisService.analyzeContract(contractFile.data);

    res.json(analysis);
  } catch (error) {
    log.error('Error analyzing contract:', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  }
});

// Ask question about contract
router.post('/ask-question', async (req, res) => {
  try {
    const { question, contractId } = req.body;

    if (!question || !contractId) {
      return res.status(400).json({ error: 'Question and contractId are required' });
    }

    // Create embedding for the question
    const questionEmbedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: question,
    });

    // Find relevant clauses using the match_contract_clauses function
    const { data: relevantClauses, error } = await supabase.rpc('match_contract_clauses', {
      query_embedding: questionEmbedding.data[0].embedding,
      match_threshold: 0.7,
      match_count: 5
    });

    if (error) {
      throw error;
    }

    // Prepare context for GPT
    const context = relevantClauses
      .map(clause => `Section: ${clause.section_heading}\nContent: ${clause.clause_text}`)
      .join('\n\n');

    // Generate answer using GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a contract analysis assistant. Answer questions based on the provided contract clauses. Be precise and cite specific sections when relevant.'
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    res.json({
      answer: completion.choices[0].message.content,
      relevantClauses: relevantClauses.map(clause => ({
        section: clause.section_heading,
        content: clause.clause_text,
        similarity: clause.similarity
      }))
    });
  } catch (error) {
    log.error('Error processing question:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

export default router;