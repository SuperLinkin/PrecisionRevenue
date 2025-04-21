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
  checkOpenAIAvailability,
  type ContractAnalysis
} from '../utils/contract-analysis';
import { eq } from 'drizzle-orm';
import type { InsertContract } from '@shared/schema';

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

const router = Router();

/**
 * Check the availability of OpenAI API
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    // First validate the OpenAI configuration
    try {
      validateOpenAIConfig();
    } catch (error) {
      const configError = error as Error;
      return res.status(400).json({
        available: false,
        message: configError.message
      });
    }

    // Then check API availability
    const status = await checkOpenAIAvailability();
    res.json(status);
  } catch (error: any) {
    console.error('Error checking OpenAI API status:', error);
    res.status(500).json({
      available: false,
      message: error.message || 'Failed to check OpenAI API status'
    });
  }
});

/**
 * Analyze a contract
 */
router.post('/analyze', authenticate, async (req: Request, res: Response) => {
  try {
    const { contractText, base64Data } = req.body as ContractAnalysisRequest;

    if (!contractText && !base64Data) {
      return res.status(400).json({
        success: false,
        error: 'Either contractText or base64Data must be provided'
      });
    }

    // Validate OpenAI configuration first
    try {
      validateOpenAIConfig();
    } catch (error) {
      const configError = error as Error;
      return res.status(400).json({
        error: 'Configuration error',
        message: configError.message
      });
    }

    const analysis = await analyzeContract(contractText || '');

    // Return the analysis result
    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error: unknown) {
    console.error('Contract analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze contract'
    });
  }
});

/**
 * Get revenue recognition analysis for a contract
 */
router.get('/revenue-recognition/:contractId', authenticate, async (req: Request, res: Response) => {
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
router.post('/extract-entities', authenticate, async (req: Request, res: Response) => {
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
router.post('/analyze-obligations', authenticate, async (req: Request, res: Response) => {
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
router.post('/compare-templates', authenticate, async (req: Request, res: Response) => {
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

// Validate a single contract
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Contract text is required' });
    }

    // First analyze the contract
    const analysis = await analyzeContract(text);
    
    // Then validate the analyzed content
    const validation = await validateContractContent(analysis);
    
    return res.json(validation);
  } catch (error) {
    console.error('Error validating contract:', error);
    return res.status(500).json({ error: 'Failed to validate contract' });
  }
});

// Bulk upload route
router.post('/bulk-upload', authenticate, upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!req.user?.companyId || !req.user?.tenantId) {
      return res.status(400).json({ error: 'User must be associated with a company and tenant' });
    }

    const results: Array<{
      fileName: string;
      status: 'success' | 'error';
      contractId?: number;
      error?: string;
    }> = [];

    for (const file of req.files) {
      try {
        // Validate file type
        if (!file.mimetype.includes('pdf') && !file.mimetype.includes('word')) {
          throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
        }

        // Extract text from file
        const text = await extractTextFromPDF(Buffer.from(file.buffer));
        // First analyze the contract
        const analysis = await analyzeContract(text);

        // Then validate the analyzed content
        const validation = await validateContractContent(analysis);
        if (!validation.isValid) {
          throw new Error(`Invalid contract: ${validation.errors?.join(', ')}`);
        }

        // Upload file to storage
        const fileUrl = await uploadToStorage(file);

        // Update contract with analysis results
        const contractData = {
          name: file.originalname,
          contractNumber: validation.contractNumber || generateContractNumber(),
          clientName: validation.clientName || 'Unknown',
          startDate: new Date(validation.startDate || new Date()),
          endDate: validation.endDate ? new Date(validation.endDate) : null,
          value: Number(validation.value || 0),
          status: 'active',
          companyId: req.user.companyId,
          tenantId: req.user.tenantId,
          createdBy: req.user.id,
          fileUrl: fileUrl || '',
          ifrsCompliant: validation.ifrsCompliant ?? true,
          revenueRecognitionMethod: validation.revenueRecognitionMethod || 'over_time',
          contractType: validation.contractType || 'fixed_price',
          completionPercentage: validation.completionPercentage ? Number(validation.completionPercentage).toFixed(2) : null,
          totalTransactionPrice: validation.totalTransactionPrice ? Number(validation.totalTransactionPrice).toFixed(2) : null,
          discountAmount: validation.discountAmount ? Number(validation.discountAmount).toFixed(2) : null,
          containsVariableConsideration: validation.containsVariableConsideration || false,
          containsSignificantFinancingComponent: validation.containsSignificantFinancingComponent || false,
          hasMultiplePerformanceObligations: validation.hasMultiplePerformanceObligations || false
        } satisfies Omit<InsertContract, 'id'>;

        const [updatedContract] = await db.insert(contracts)
          .values(contractData)
          .returning();

        results.push({
          fileName: file.originalname,
          status: 'success',
          contractId: updatedContract.id
        });

        // Return the validation result with contract data
        res.json({
          success: true,
          contract: updatedContract,
          validation: validation
        });
      } catch (error) {
        results.push({
          fileName: file.originalname,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return res.json({ results });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return res.status(500).json({ error: 'Failed to process bulk upload' });
  }
});

// Helper function to validate contract content
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
    contractNumber: '', // This should be extracted from the contract text
    clientName: summary.parties?.[0] || 'Unknown Client',
    startDate: summary.effectiveDate,
    endDate: summary.terminationDate || undefined,
    value: revenueSummary.totalValue,
    contractType,
    revenueRecognitionMethod: recognitionMethod,
    containsVariableConsideration: revenueSummary.variableComponents.length > 0,
    hasMultiplePerformanceObligations: false, // This should be determined by analyzing obligations
    status: 'draft'
  };

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
  // TODO: Implement PDF text extraction
  // For now, return a placeholder
  return "Contract text will be extracted here";
}

export default router;