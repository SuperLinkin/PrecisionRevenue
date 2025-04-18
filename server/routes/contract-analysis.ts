import { Router, Request, Response } from 'express';
import { db } from '../db';
import { contracts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { supabase } from '../supabase';
import {
  analyzeContract,
  analyzeRevenueRecognition,
  extractContractEntities,
  analyzeContractObligations,
  compareToStandardContract,
  checkOpenAIAvailability
} from '../utils/contract-analysis';

const router = Router();

/**
 * Perform a comprehensive analysis of a contract
 */
router.post('/comprehensive', async (req: Request, res: Response) => {
  try {
    const { contractId, contractText, base64Data } = req.body;
    
    if (!contractId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    
    // Get contract data
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Get contract text
    let finalContractText = contractText || '';
    
    if (!finalContractText && base64Data) {
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        finalContractText = buffer.toString('utf-8');
      } catch (base64Error) {
        console.error('Error converting base64 to text:', base64Error);
      }
    }
    
    if (!finalContractText && contract.fileUrl) {
      try {
        const { data, error } = await supabase.storage
          .from('contracts')
          .download(contract.fileUrl);
          
        if (data) {
          finalContractText = await data.text();
        } else if (error) {
          console.error('Error retrieving contract file:', error);
        }
      } catch (downloadErr) {
        console.error('Error downloading contract file:', downloadErr);
      }
    }
    
    if (!finalContractText) {
      return res.status(400).json({ error: 'No contract text available for analysis' });
    }
    
    // Perform comprehensive analysis
    const analysis = await analyzeContract(finalContractText, contract);
    
    res.json({
      contractId,
      contractName: contract.name,
      analysis
    });
  } catch (error: any) {
    console.error('Error analyzing contract:', error);
    res.status(500).json({ 
      error: 'An error occurred during contract analysis',
      message: error.message || 'Unknown error'
    });
  }
});

/**
 * Analyze a contract specifically for revenue recognition
 */
router.post('/revenue', async (req: Request, res: Response) => {
  try {
    const { contractId, contractText, base64Data } = req.body;
    
    if (!contractId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    
    // Get contract data
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Get contract text
    let finalContractText = contractText || '';
    
    if (!finalContractText && base64Data) {
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        finalContractText = buffer.toString('utf-8');
      } catch (base64Error) {
        console.error('Error converting base64 to text:', base64Error);
      }
    }
    
    if (!finalContractText && contract.fileUrl) {
      try {
        const { data, error } = await supabase.storage
          .from('contracts')
          .download(contract.fileUrl);
          
        if (data) {
          finalContractText = await data.text();
        } else if (error) {
          console.error('Error retrieving contract file:', error);
        }
      } catch (downloadErr) {
        console.error('Error downloading contract file:', downloadErr);
      }
    }
    
    if (!finalContractText) {
      return res.status(400).json({ error: 'No contract text available for analysis' });
    }
    
    // Perform revenue recognition analysis
    const analysis = await analyzeRevenueRecognition(finalContractText, contract);
    
    res.json({
      contractId,
      contractName: contract.name,
      analysis
    });
  } catch (error: any) {
    console.error('Error analyzing contract revenue recognition:', error);
    res.status(500).json({ 
      error: 'An error occurred during revenue recognition analysis',
      message: error.message || 'Unknown error'
    });
  }
});

/**
 * Extract entities from a contract
 */
router.post('/entities', async (req: Request, res: Response) => {
  try {
    const { contractId, contractText, base64Data } = req.body;
    
    if (!contractId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    
    // Get contract data
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Get contract text
    let finalContractText = contractText || '';
    
    if (!finalContractText && base64Data) {
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        finalContractText = buffer.toString('utf-8');
      } catch (base64Error) {
        console.error('Error converting base64 to text:', base64Error);
      }
    }
    
    if (!finalContractText && contract.fileUrl) {
      try {
        const { data, error } = await supabase.storage
          .from('contracts')
          .download(contract.fileUrl);
          
        if (data) {
          finalContractText = await data.text();
        } else if (error) {
          console.error('Error retrieving contract file:', error);
        }
      } catch (downloadErr) {
        console.error('Error downloading contract file:', downloadErr);
      }
    }
    
    if (!finalContractText) {
      return res.status(400).json({ error: 'No contract text available for analysis' });
    }
    
    // Extract entities
    const entities = await extractContractEntities(finalContractText);
    
    res.json({
      contractId,
      contractName: contract.name,
      entities
    });
  } catch (error: any) {
    console.error('Error extracting contract entities:', error);
    res.status(500).json({ 
      error: 'An error occurred during entity extraction',
      message: error.message || 'Unknown error'
    });
  }
});

/**
 * Analyze contract obligations
 */
router.post('/obligations', async (req: Request, res: Response) => {
  try {
    const { contractId, contractText, base64Data } = req.body;
    
    if (!contractId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    
    // Get contract data
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Get contract text
    let finalContractText = contractText || '';
    
    if (!finalContractText && base64Data) {
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        finalContractText = buffer.toString('utf-8');
      } catch (base64Error) {
        console.error('Error converting base64 to text:', base64Error);
      }
    }
    
    if (!finalContractText && contract.fileUrl) {
      try {
        const { data, error } = await supabase.storage
          .from('contracts')
          .download(contract.fileUrl);
          
        if (data) {
          finalContractText = await data.text();
        } else if (error) {
          console.error('Error retrieving contract file:', error);
        }
      } catch (downloadErr) {
        console.error('Error downloading contract file:', downloadErr);
      }
    }
    
    if (!finalContractText) {
      return res.status(400).json({ error: 'No contract text available for analysis' });
    }
    
    // Analyze obligations
    const obligations = await analyzeContractObligations(finalContractText);
    
    res.json({
      contractId,
      contractName: contract.name,
      obligations
    });
  } catch (error: any) {
    console.error('Error analyzing contract obligations:', error);
    res.status(500).json({ 
      error: 'An error occurred during obligation analysis',
      message: error.message || 'Unknown error'
    });
  }
});

/**
 * Compare contract to standard templates
 */
router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { contractId, templateType, contractText, base64Data } = req.body;
    
    if (!contractId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    
    if (!templateType) {
      return res.status(400).json({ error: 'Template type is required' });
    }
    
    // Get contract data
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Get contract text
    let finalContractText = contractText || '';
    
    if (!finalContractText && base64Data) {
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        finalContractText = buffer.toString('utf-8');
      } catch (base64Error) {
        console.error('Error converting base64 to text:', base64Error);
      }
    }
    
    if (!finalContractText && contract.fileUrl) {
      try {
        const { data, error } = await supabase.storage
          .from('contracts')
          .download(contract.fileUrl);
          
        if (data) {
          finalContractText = await data.text();
        } else if (error) {
          console.error('Error retrieving contract file:', error);
        }
      } catch (downloadErr) {
        console.error('Error downloading contract file:', downloadErr);
      }
    }
    
    if (!finalContractText) {
      return res.status(400).json({ error: 'No contract text available for analysis' });
    }
    
    // Compare to standard
    const comparison = await compareToStandardContract(finalContractText, templateType);
    
    res.json({
      contractId,
      contractName: contract.name,
      templateType,
      comparison
    });
  } catch (error: any) {
    console.error('Error comparing contract to standard:', error);
    res.status(500).json({ 
      error: 'An error occurred during contract comparison',
      message: error.message || 'Unknown error'
    });
  }
});

export default router;