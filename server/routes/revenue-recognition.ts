import { Express, Request, Response } from "express";
import { 
  allocateTransactionPrice, 
  calculateRevenueRecognition, 
  calculateTransactionPrice, 
  generateRevenueSchedule,
  recognizeRevenue
} from "../utils/revenue-recognition";
import { db } from "../db";
import { 
  contracts, 
  performanceObligations, 
  revenueRecords, 
  transactionPriceAdjustments 
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export function registerRevenueRecognitionRoutes(app: Express) {
  // Get transaction price for a contract
  app.get("/api/revenue/transaction-price/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      const totalPrice = await calculateTransactionPrice(contractId);
      return res.json({ contractId, totalPrice });
    } catch (error: any) {
      console.error("Error calculating transaction price:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Allocate transaction price to performance obligations
  app.post("/api/revenue/allocate/:contractId", async (req: Request, res: Response) => {
    try {
      const contractId = parseInt(req.params.contractId);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }

      await allocateTransactionPrice(contractId);
      
      // Return updated performance obligations
      const pos = await db
        .select()
        .from(performanceObligations)
        .where(eq(performanceObligations.contractId, contractId));
        
      return res.json({ 
        message: "Transaction price allocated successfully", 
        performanceObligations: pos 
      });
    } catch (error: any) {
      console.error("Error allocating transaction price:", error);
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

      const result = await calculateRevenueRecognition({
        contractId,
        asOfDate,
        includeProjections
      });

      return res.json(result);
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

      const schedule = await generateRevenueSchedule(contractId);
      return res.json(schedule);
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

      const revenueRecord = await recognizeRevenue({
        ...validatedData,
        recognitionDate
      });

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
}