import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse';
import { createWorker, Worker, WorkerOptions } from 'tesseract.js';
import { supabase } from '../supabase';
import { z } from 'zod';
import * as fs from 'fs';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'server', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    cb(null, `${uniqueId}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Schema for contract metadata validation
const ContractMetadataSchema = z.object({
  name: z.string().min(1),
  parties: z.array(z.string()).min(2),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  value: z.number().positive().optional(),
  paymentTerms: z.string().optional(),
  contractType: z.string().optional(),
  status: z.enum(['draft', 'pending_review', 'approved', 'rejected']).default('draft')
});

type ContractMetadata = z.infer<typeof ContractMetadataSchema>;

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = await fs.promises.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Helper function to perform OCR on PDF
async function performOCR(filePath: string): Promise<string> {
  const worker = await createWorker('eng');
  try {
    const { data: { text } } = await worker.recognize(filePath);
    return text;
  } finally {
    await worker.terminate();
  }
}

// Route to handle contract upload
router.post('/upload', upload.single('contract'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let extractedText = '';

    // Try PDF text extraction first
    try {
      extractedText = await extractTextFromPDF(filePath);
    } catch (error) {
      // If PDF extraction fails, try OCR
      extractedText = await performOCR(filePath);
    }

    // Store the file in Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('contracts')
      .upload(`${uuidv4()}/${req.file.originalname}`, req.file.buffer, {
        contentType: 'application/pdf'
      });

    if (storageError) {
      throw storageError;
    }

    // Create initial contract record
    const { data: contractData, error: contractError } = await supabase
      .from('contracts')
      .insert({
        name: req.file.originalname,
        file_path: storageData.path,
        extracted_text: extractedText,
        status: 'draft'
      })
      .select()
      .single();

    if (contractError) {
      throw contractError;
    }

    res.json({
      success: true,
      contract: contractData,
      message: 'Contract uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading contract:', error);
    res.status(500).json({
      error: 'Failed to upload contract',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route to update contract metadata
router.put('/:contractId/metadata', async (req, res) => {
  try {
    const { contractId } = req.params;
    const metadata = ContractMetadataSchema.parse(req.body);

    const { data, error } = await supabase
      .from('contracts')
      .update(metadata)
      .eq('id', contractId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      contract: data,
      message: 'Contract metadata updated successfully'
    });
  } catch (error) {
    console.error('Error updating contract metadata:', error);
    res.status(500).json({
      error: 'Failed to update contract metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route to get contract by ID
router.get('/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      contract: data
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({
      error: 'Failed to fetch contract',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 