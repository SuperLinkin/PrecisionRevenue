import { Express, Request, Response } from "express";
import { 
  identifyPerformanceObligations,
  generateRevenueSchedule,
  calculateTransactionPrice,
  generateDisclosureNotes
} from "../utils/revenue-recognition";
import { extractContractData } from "../utils/openai";
import { db } from "../db";
import { 
  contracts, 
  performanceObligations, 
  revenueRecords, 
  transactionPriceAdjustments 
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { supabase } from "../supabase";

export function registerRevenueRecognitionRoutes(app: Express) {
  // Get transaction price for a contract
  app.get("/api/revenue/transaction-price/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      // Get contract data
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId));
      
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      // Get contract text - either from database or from stored file
      let contractText = '';
      
      if (contract.fileUrl) {
        try {
          // Try to get the file from Supabase storage
          const { data, error } = await supabase.storage
            .from('contracts')
            .download(contract.fileUrl);
            
          if (data) {
            // Convert the blob to text
            contractText = await data.text();
          } else if (error) {
            console.error("Error retrieving contract file:", error);
          }
        } catch (downloadErr) {
          console.error("Error downloading contract file:", downloadErr);
        }
      }
      
      // Use AI to calculate transaction price based on the contract
      const priceAnalysis = await calculateTransactionPrice(contractText, {
        value: contract.value,
        name: contract.name,
        startDate: contract.startDate,
        endDate: contract.endDate
      });
      
      return res.json({ 
        contractId, 
        baseValue: contract.value,
        analysis: priceAnalysis 
      });
    } catch (error: any) {
      console.error("Error calculating transaction price:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Identify and allocate transaction price to performance obligations
  app.post("/api/revenue/allocate/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      // Get contract data
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId));
      
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      // Get contract text - either from database or from stored file
      let contractText = '';
      
      if (contract.fileUrl) {
        try {
          // Try to get the file from Supabase storage
          const { data, error } = await supabase.storage
            .from('contracts')
            .download(contract.fileUrl);
            
          if (data) {
            // Convert the blob to text
            contractText = await data.text();
          } else if (error) {
            console.error("Error retrieving contract file:", error);
          }
        } catch (downloadErr) {
          console.error("Error downloading contract file:", downloadErr);
        }
      }
      
      // Use AI to identify performance obligations
      const obligations = await identifyPerformanceObligations(contractText, {
        value: contract.value,
        name: contract.name,
        startDate: contract.startDate,
        endDate: contract.endDate
      });
      
      console.log("Identified obligations:", obligations);
      
      // Store the obligations in the database
      const storedObligations = [];
      
      // Remove any existing obligations for this contract first
      await db.delete(performanceObligations)
        .where(eq(performanceObligations.contractId, contractId));
      
      // Store the new obligations
      for (const obligation of obligations) {
        try {
          const [stored] = await db.insert(performanceObligations)
            .values({
              contractId,
              name: obligation.description.substring(0, 100), // Truncate if needed
              description: obligation.description,
              standaloneSellingPrice: obligation.estimatedValue,
              allocationPercentage: obligation.allocatedAmount / contract.value,
              startDate: contract.startDate,
              endDate: contract.endDate,
              status: 'active',
              recognitionMethod: obligation.satisfactionMethod === 'over_time' 
                ? 'over_time' 
                : 'point_in_time'
            })
            .returning();
            
          storedObligations.push(stored);
        } catch (insertErr) {
          console.error("Error inserting obligation:", insertErr);
        }
      }
      
      return res.json({ 
        message: "Performance obligations identified and allocated successfully", 
        performanceObligations: storedObligations 
      });
    } catch (error: any) {
      console.error("Error identifying performance obligations:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Calculate revenue recognition
  app.get("/api/revenue/calculate/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      const asOfDate = req.query.asOfDate 
        ? new Date(req.query.asOfDate as string) 
        : new Date();
        
      const includeProjections = req.query.includeProjections === 'true';

      // Get contract data
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId));
      
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      // Get obligations for this contract
      const obligations = await db
        .select()
        .from(performanceObligations)
        .where(eq(performanceObligations.contractId, contractId));

      // Get existing revenue records
      const records = await db
        .select()
        .from(revenueRecords)
        .where(eq(revenueRecords.contractId, contractId))
        .orderBy(revenueRecords.recognitionDate);
        
      // Calculate total recognized revenue
      const totalRecognized = records.reduce((sum, record) => {
        return sum + Number(record.amount);
      }, 0);
      
      // Calculate remaining revenue
      const remainingRevenue = contract.value - totalRecognized;
      
      return res.json({
        contract,
        totalContractValue: contract.value,
        totalRecognized,
        remainingRevenue,
        recognizedPercentage: (totalRecognized / contract.value) * 100,
        asOfDate,
        records,
        obligations
      });
    } catch (error: any) {
      console.error("Error calculating revenue recognition:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Generate revenue schedule
  app.get("/api/revenue/schedule/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      // Get contract data
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId));
      
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      // Get contract text if available
      let contractText = '';
      
      if (contract.fileUrl) {
        try {
          // Try to get the file from Supabase storage
          const { data, error } = await supabase.storage
            .from('contracts')
            .download(contract.fileUrl);
            
          if (data) {
            // Convert the blob to text
            contractText = await data.text();
          } else if (error) {
            console.error("Error retrieving contract file:", error);
          }
        } catch (downloadErr) {
          console.error("Error downloading contract file:", downloadErr);
        }
      }
      
      // Get performance obligations for this contract
      const obligations = await db
        .select()
        .from(performanceObligations)
        .where(eq(performanceObligations.contractId, contractId));
        
      console.log(`Found ${obligations.length} performance obligations for contract ${contractId}`);
      
      // Generate schedule using AI
      const schedule = await generateRevenueSchedule(contract, obligations);
      
      // Store the generated schedule in the database
      const storedRecords = [];
      const now = new Date();
      
      // Delete existing records with 'scheduled' status (leave recognized records)
      await db.delete(revenueRecords)
        .where(eq(revenueRecords.contractId, contractId))
        .where(eq(revenueRecords.status, 'scheduled'));
        
      // Store new scheduled records
      for (const entry of schedule) {
        try {
          const [record] = await db.insert(revenueRecords)
            .values({
              contractId: contractId,
              amount: entry.amount.toString(),
              recognitionDate: entry.recognitionDate,
              status: 'scheduled',
              description: entry.description,
              recognitionMethod: entry.recognitionMethod as any,
              recognitionReason: entry.performanceObligation,
              revenueType: entry.revenueType as any,
              createdAt: now,
              updatedAt: now
            })
            .returning();
            
          storedRecords.push(record);
        } catch (insertErr) {
          console.error("Error inserting revenue record:", insertErr);
        }
      }
      
      return res.json({
        message: "Generated revenue schedule successfully",
        scheduleEntries: storedRecords.length,
        schedule: storedRecords
      });
    } catch (error: any) {
      console.error("Error generating revenue schedule:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Recognize revenue (create a revenue record)
  app.post("/api/revenue/recognize", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        contractId: z.number(),
        amount: z.number().positive(),
        recognitionDate: z.string().or(z.date()),
        performanceObligationId: z.number().optional(),
        description: z.string().optional(),
        recognitionMethod: z.string().optional(),
        recognitionReason: z.string().optional(),
        revenueType: z.string().optional()
      });

      const validatedData = schema.parse(req.body);
      
      // Convert date string to Date if needed
      const recognitionDate = typeof validatedData.recognitionDate === 'string'
        ? new Date(validatedData.recognitionDate)
        : validatedData.recognitionDate;
        
      // Get contract data for validation
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, validatedData.contractId));
        
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      // Get performance obligation if provided
      let performanceObligation = null;
      
      if (validatedData.performanceObligationId) {
        const [po] = await db
          .select()
          .from(performanceObligations)
          .where(eq(performanceObligations.id, validatedData.performanceObligationId));
          
        performanceObligation = po;
      }
      
      // Set defaults for missing fields
      const description = validatedData.description || 
        `Revenue recognized for ${contract.name} (${recognitionDate.toLocaleDateString()})`;
        
      const recognitionMethod = validatedData.recognitionMethod || 
        (performanceObligation ? performanceObligation.recognitionMethod : 'over_time');
        
      const revenueType = validatedData.revenueType || 'subscription';
      
      const recognitionReason = validatedData.recognitionReason || 
        (performanceObligation ? 
          `For performance obligation: ${performanceObligation.name}` : 
          'Monthly revenue recognition');
          
      // Create revenue record
      const now = new Date();
      
      const [revenueRecord] = await db
        .insert(revenueRecords)
        .values({
          contractId: validatedData.contractId,
          amount: validatedData.amount.toString(),
          recognitionDate,
          status: 'recognized',
          description,
          recognitionMethod: recognitionMethod as any,
          recognitionReason,
          revenueType: revenueType as any,
          performanceObligationId: validatedData.performanceObligationId || null,
          adjustmentType: 'initial',
          createdAt: now,
          updatedAt: now
        })
        .returning();

      return res.status(201).json(revenueRecord);
    } catch (error: any) {
      console.error("Error recognizing revenue:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  });

  // Create a performance obligation
  app.post("/api/revenue/obligations", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        contractId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        standaloneSellingPrice: z.number().optional(),
        allocationPercentage: z.number().optional(),
        startDate: z.string().or(z.date()).optional(),
        endDate: z.string().or(z.date()).optional(),
        status: z.enum(["active", "completed", "cancelled"]).default("active"),
        recognitionMethod: z.enum(["point_in_time", "over_time", "output_method", "input_method"])
      });

      const validatedData = schema.parse(req.body);
      
      // Convert date strings to Date if needed
      const startDate = validatedData.startDate && typeof validatedData.startDate === 'string'
        ? new Date(validatedData.startDate)
        : validatedData.startDate;
        
      const endDate = validatedData.endDate && typeof validatedData.endDate === 'string'
        ? new Date(validatedData.endDate)
        : validatedData.endDate;

      // Create performance obligation
      const [performanceObligation] = await db
        .insert(performanceObligations)
        .values({
          contractId: validatedData.contractId,
          name: validatedData.name,
          description: validatedData.description,
          standaloneSellingPrice: validatedData.standaloneSellingPrice,
          allocationPercentage: validatedData.allocationPercentage,
          startDate,
          endDate,
          status: validatedData.status,
          recognitionMethod: validatedData.recognitionMethod
        })
        .returning();

      return res.status(201).json(performanceObligation);
    } catch (error: any) {
      console.error("Error creating performance obligation:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  });

  // Create a transaction price adjustment
  app.post("/api/revenue/adjustments", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        contractId: z.number(),
        adjustmentType: z.enum([
          "variable_consideration", 
          "significant_financing", 
          "non_cash", 
          "payable_to_customer", 
          "other"
        ]),
        amount: z.number(),
        description: z.string().optional(),
        adjustmentDate: z.string().or(z.date()),
        probability: z.number().min(0).max(1).optional()
      });

      const validatedData = schema.parse(req.body);
      
      // Convert date string to Date if needed
      const adjustmentDate = typeof validatedData.adjustmentDate === 'string'
        ? new Date(validatedData.adjustmentDate)
        : validatedData.adjustmentDate;

      // Create transaction price adjustment
      const [adjustment] = await db
        .insert(transactionPriceAdjustments)
        .values({
          contractId: validatedData.contractId,
          adjustmentType: validatedData.adjustmentType,
          amount: validatedData.amount,
          description: validatedData.description,
          adjustmentDate,
          probability: validatedData.probability
        })
        .returning();

      // Recalculate transaction price
      await calculateTransactionPrice(validatedData.contractId);

      return res.status(201).json(adjustment);
    } catch (error: any) {
      console.error("Error creating transaction price adjustment:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  });

  // Get all revenue records for a contract
  app.get("/api/revenue/records/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      const records = await db
        .select()
        .from(revenueRecords)
        .where(eq(revenueRecords.contractId, contractId))
        .orderBy(revenueRecords.recognitionDate);

      return res.json(records);
    } catch (error: any) {
      console.error("Error fetching revenue records:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Get all performance obligations for a contract
  app.get("/api/revenue/obligations/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      const obligations = await db
        .select()
        .from(performanceObligations)
        .where(eq(performanceObligations.contractId, contractId));

      return res.json(obligations);
    } catch (error: any) {
      console.error("Error fetching performance obligations:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Get all transaction price adjustments for a contract
  app.get("/api/revenue/adjustments/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      const adjustments = await db
        .select()
        .from(transactionPriceAdjustments)
        .where(eq(transactionPriceAdjustments.contractId, contractId));

      return res.json(adjustments);
    } catch (error: any) {
      console.error("Error fetching transaction price adjustments:", error);
      return res.status(500).json({ error: error.message });
    }
  });
  
  // Process an uploaded contract, extract data, identify obligations, and generate revenue schedule
  app.post("/api/revenue/process-contract", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        contractId: z.number(),
        contractText: z.string().optional(),
        base64Data: z.string().optional()
      });

      const validatedData = schema.parse(req.body);
      
      // Get contract data
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, validatedData.contractId));
      
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      // Get contract text either from request or from stored file
      let contractText = validatedData.contractText || '';
      
      if (!contractText && validatedData.base64Data) {
        // Convert base64 to text if provided
        try {
          const buffer = Buffer.from(validatedData.base64Data, 'base64');
          contractText = buffer.toString('utf-8');
          console.log("Extracted text from base64 data, length:", contractText.length);
        } catch (base64Error) {
          console.error("Error converting base64 to text:", base64Error);
        }
      }
      
      if (!contractText && contract.fileUrl) {
        // Try to get the file from Supabase storage
        try {
          const { data, error } = await supabase.storage
            .from('contracts')
            .download(contract.fileUrl);
            
          if (data) {
            // Convert the blob to text
            contractText = await data.text();
            console.log("Retrieved contract text from storage, length:", contractText.length);
          } else if (error) {
            console.error("Error retrieving contract file:", error);
          }
        } catch (downloadErr) {
          console.error("Error downloading contract file:", downloadErr);
        }
      }
      
      if (!contractText) {
        return res.status(400).json({ error: "No contract text available to process" });
      }
      
      // Step 1: Use AI to extract contract data and update the contract record
      console.log("Extracting contract data using AI...");
      const extractedData = await extractContractData(contractText);
      
      // Update contract with extracted data
      const [updatedContract] = await db
        .update(contracts)
        .set({
          startDate: extractedData.startDate,
          endDate: extractedData.endDate,
          value: extractedData.value,
          updatedAt: new Date()
        })
        .where(eq(contracts.id, validatedData.contractId))
        .returning();
      
      console.log("Updated contract with extracted data:", updatedContract);
      
      // Step 2: Identify performance obligations
      console.log("Identifying performance obligations...");
      const obligations = await identifyPerformanceObligations(contractText, {
        value: updatedContract.value,
        name: updatedContract.name,
        startDate: updatedContract.startDate,
        endDate: updatedContract.endDate
      });
      
      console.log(`Found ${obligations.length} performance obligations`);
      
      // Store the obligations in the database
      const storedObligations = [];
      
      // Remove any existing obligations for this contract first
      await db.delete(performanceObligations)
        .where(eq(performanceObligations.contractId, validatedData.contractId));
      
      // Store the new obligations
      for (const obligation of obligations) {
        try {
          const descriptionText = typeof obligation.description === 'string' ? 
            obligation.description : 'Performance obligation';
            
          const [stored] = await db.insert(performanceObligations)
            .values({
              contractId: validatedData.contractId,
              name: descriptionText.substring(0, 100), // Truncate if needed
              description: descriptionText,
              standaloneSellingPrice: obligation.estimatedValue || 0,
              allocationPercentage: (obligation.allocatedAmount || 0) / updatedContract.value,
              startDate: updatedContract.startDate,
              endDate: updatedContract.endDate,
              status: 'active',
              recognitionMethod: obligation.satisfactionMethod === 'over_time' ? 
                'over_time' : 'point_in_time'
            })
            .returning();
            
          storedObligations.push(stored);
        } catch (insertErr) {
          console.error("Error inserting obligation:", insertErr);
        }
      }
      
      // Step 3: Generate revenue schedule
      console.log("Generating revenue schedule...");
      const schedule = await generateRevenueSchedule(updatedContract, storedObligations);
      
      // Store the generated schedule in the database
      const storedRecords = [];
      const now = new Date();
      
      // Delete existing records with 'scheduled' status (leave recognized records)
      await db.delete(revenueRecords)
        .where(and(
          eq(revenueRecords.contractId, validatedData.contractId),
          eq(revenueRecords.status, 'scheduled')
        ));
        
      // Store new scheduled records
      for (const entry of schedule) {
        try {
          const [record] = await db.insert(revenueRecords)
            .values({
              contractId: validatedData.contractId,
              amount: entry.amount.toString(),
              recognitionDate: entry.recognitionDate,
              status: 'scheduled',
              description: entry.description || 'Scheduled revenue',
              recognitionMethod: entry.recognitionMethod || 'over_time',
              recognitionReason: entry.performanceObligation || 'Contract performance',
              revenueType: entry.revenueType || 'subscription',
              adjustmentType: 'initial',
              createdAt: now,
              updatedAt: now
            })
            .returning();
            
          storedRecords.push(record);
        } catch (insertErr) {
          console.error("Error inserting revenue record:", insertErr);
        }
      }
      
      return res.json({
        message: "Contract processed successfully",
        contract: updatedContract,
        obligations: storedObligations,
        scheduleEntries: storedRecords.length,
        schedule: storedRecords
      });
      
    } catch (error: any) {
      console.error("Error processing contract:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  });
}