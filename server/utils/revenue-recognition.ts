/**
 * IFRS 15/ASC 606 Revenue Recognition Algorithms
 * 
 * This module implements the 5-step model for revenue recognition:
 * 1. Identify the contract with a customer
 * 2. Identify the performance obligations in the contract
 * 3. Determine the transaction price
 * 4. Allocate the transaction price to the performance obligations
 * 5. Recognize revenue when (or as) performance obligations are satisfied
 */

import { db } from "../db";
import { 
  contracts, 
  performanceObligations, 
  revenueRecords, 
  transactionPriceAdjustments,
  type Contract,
  type PerformanceObligation, 
  type RevenueRecord,
  type TransactionPriceAdjustment
} from "@shared/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

// Type definitions for revenue recognition
export type RevenueCalculationResult = {
  totalRevenue: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  remainingRevenue: number;
  revenueByPeriod: {
    period: string;
    amount: number;
    status: 'recognized' | 'projected';
  }[];
  performanceObligations: {
    id: number;
    name: string;
    allocated: number;
    recognized: number;
    remaining: number;
    percentComplete: number;
  }[];
};

export type RevenueRecognitionOptions = {
  contractId: number;
  asOfDate?: Date;
  includeProjections?: boolean;
};

/**
 * Calculate the total transaction price for a contract including adjustments
 * IFRS 15/ASC 606 Step 3: Determine the transaction price
 */
export async function calculateTransactionPrice(contractId: number): Promise<number> {
  // Get the contract
  const [contract] = await db
    .select({
      value: contracts.value,
      totalTransactionPrice: contracts.totalTransactionPrice,
      discountAmount: contracts.discountAmount
    })
    .from(contracts)
    .where(eq(contracts.id, contractId));

  if (!contract) {
    throw new Error(`Contract with ID ${contractId} not found`);
  }

  // Use the stored total transaction price if available
  if (contract.totalTransactionPrice !== null) {
    return Number(contract.totalTransactionPrice);
  }

  // Base value
  let totalPrice = contract.value;

  // Subtract any discounts
  if (contract.discountAmount) {
    totalPrice -= Number(contract.discountAmount);
  }

  // Apply any transaction price adjustments (variable consideration, etc.)
  const adjustments = await db
    .select({
      amount: transactionPriceAdjustments.amount,
      adjustmentType: transactionPriceAdjustments.adjustmentType,
      probability: transactionPriceAdjustments.probability
    })
    .from(transactionPriceAdjustments)
    .where(eq(transactionPriceAdjustments.contractId, contractId));

  for (const adjustment of adjustments) {
    // Apply the probability constraint for variable consideration
    const adjustmentAmount = Number(adjustment.amount) * (adjustment.probability ? Number(adjustment.probability) : 1);
    
    // Add or subtract depending on the adjustment type
    if (adjustment.adjustmentType === 'variable_consideration' || 
        adjustment.adjustmentType === 'significant_financing' || 
        adjustment.adjustmentType === 'non_cash') {
      totalPrice += adjustmentAmount;
    } else if (adjustment.adjustmentType === 'payable_to_customer') {
      totalPrice -= adjustmentAmount;
    }
  }

  // Update the contract with the calculated transaction price
  await db
    .update(contracts)
    .set({ totalTransactionPrice: totalPrice })
    .where(eq(contracts.id, contractId));

  return totalPrice;
}

/**
 * Allocate the transaction price to performance obligations
 * IFRS 15/ASC 606 Step 4: Allocate the transaction price
 */
export async function allocateTransactionPrice(contractId: number): Promise<void> {
  // Get the total transaction price
  const totalPrice = await calculateTransactionPrice(contractId);

  // Get all performance obligations for this contract
  const pos = await db
    .select({
      id: performanceObligations.id,
      standaloneSellingPrice: performanceObligations.standaloneSellingPrice,
      allocationPercentage: performanceObligations.allocationPercentage
    })
    .from(performanceObligations)
    .where(eq(performanceObligations.contractId, contractId));

  if (pos.length === 0) {
    // If there are no explicit performance obligations, create a default one
    const [contract] = await db
      .select({
        id: contracts.id,
        startDate: contracts.startDate,
        endDate: contracts.endDate,
        revenueRecognitionMethod: contracts.revenueRecognitionMethod
      })
      .from(contracts)
      .where(eq(contracts.id, contractId));

    if (!contract) {
      throw new Error(`Contract with ID ${contractId} not found`);
    }
    
    // Create default performance obligation
    const [defaultPO] = await db
      .insert(performanceObligations)
      .values({
        contractId: contractId,
        name: 'Default Performance Obligation',
        status: 'active',
        recognitionMethod: contract.revenueRecognitionMethod || 'over_time',
        startDate: contract.startDate,
        endDate: contract.endDate,
        allocationPercentage: 100,
        standaloneSellingPrice: totalPrice
      })
      .returning();

    // Set 100% allocation to the default performance obligation
    await db
      .update(performanceObligations)
      .set({ allocationPercentage: 100 })
      .where(eq(performanceObligations.id, defaultPO.id));
    
    return;
  }

  // Calculate total standalone selling price
  let totalSSP = 0;
  for (const po of pos) {
    if (po.standaloneSellingPrice) {
      totalSSP += Number(po.standaloneSellingPrice);
    }
  }

  // Allocate based on relative standalone selling price if SSPs are provided
  if (totalSSP > 0) {
    for (const po of pos) {
      if (po.standaloneSellingPrice) {
        const allocationPercentage = (Number(po.standaloneSellingPrice) / totalSSP) * 100;
        await db
          .update(performanceObligations)
          .set({ allocationPercentage })
          .where(eq(performanceObligations.id, po.id));
      }
    }
  } else {
    // Use existing allocation percentages if defined, otherwise split evenly
    const posWithoutPercentage = pos.filter(po => po.allocationPercentage === null);
    
    if (posWithoutPercentage.length > 0) {
      // Calculate total allocated percentage
      let allocatedPercentage = 0;
      for (const po of pos) {
        if (po.allocationPercentage !== null) {
          allocatedPercentage += Number(po.allocationPercentage);
        }
      }
      
      // Allocate remaining percentage evenly
      const remainingPercentage = 100 - allocatedPercentage;
      const percentagePerPO = remainingPercentage / posWithoutPercentage.length;
      
      for (const po of posWithoutPercentage) {
        await db
          .update(performanceObligations)
          .set({ allocationPercentage: percentagePerPO })
          .where(eq(performanceObligations.id, po.id));
      }
    }
  }
}

/**
 * Calculate the amount of revenue to recognize for a given date range
 * IFRS 15/ASC 606 Step 5: Recognize revenue
 */
export async function calculateRevenueRecognition(options: RevenueRecognitionOptions): Promise<RevenueCalculationResult> {
  const { contractId, asOfDate = new Date(), includeProjections = false } = options;
  
  // Get contract details
  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, contractId));

  if (!contract) {
    throw new Error(`Contract with ID ${contractId} not found`);
  }

  // Get total transaction price 
  const totalPrice = contract.totalTransactionPrice 
    ? Number(contract.totalTransactionPrice) 
    : await calculateTransactionPrice(contractId);

  // Get all performance obligations
  const pos = await db
    .select()
    .from(performanceObligations)
    .where(eq(performanceObligations.contractId, contractId));

  if (pos.length === 0) {
    // Ensure allocation is done if no POs exist
    await allocateTransactionPrice(contractId);
    
    // Re-fetch performance obligations
    const newPos = await db
      .select()
      .from(performanceObligations)
      .where(eq(performanceObligations.contractId, contractId));
      
    if (newPos.length === 0) {
      throw new Error(`Failed to create performance obligations for contract ${contractId}`);
    }
  }

  // Get recognized revenue records
  const recognizedRevenues = await db
    .select()
    .from(revenueRecords)
    .where(
      and(
        eq(revenueRecords.contractId, contractId),
        eq(revenueRecords.status, 'recognized'),
        lte(revenueRecords.recognitionDate, asOfDate)
      )
    )
    .orderBy(revenueRecords.recognitionDate);

  // Calculate total recognized revenue
  let totalRecognized = 0;
  for (const record of recognizedRevenues) {
    totalRecognized += Number(record.amount);
  }

  // Initialize result
  const result: RevenueCalculationResult = {
    totalRevenue: totalPrice,
    recognizedRevenue: totalRecognized,
    deferredRevenue: totalPrice - totalRecognized,
    remainingRevenue: totalPrice - totalRecognized,
    revenueByPeriod: [],
    performanceObligations: []
  };

  // Group revenue by period (month)
  const revenueByPeriod = new Map<string, number>();
  for (const record of recognizedRevenues) {
    const date = new Date(record.recognitionDate);
    const period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const currentAmount = revenueByPeriod.get(period) || 0;
    revenueByPeriod.set(period, currentAmount + Number(record.amount));
  }

  // Add recognized revenue periods to result
  for (const [period, amount] of revenueByPeriod.entries()) {
    result.revenueByPeriod.push({
      period,
      amount,
      status: 'recognized'
    });
  }

  // Calculate revenue by performance obligation
  for (const po of pos) {
    const allocated = totalPrice * (Number(po.allocationPercentage) / 100);
    
    // Get recognized revenue for this performance obligation
    const poRecognized = await db
      .select({
        total: sql<string>`SUM(${revenueRecords.amount})`
      })
      .from(revenueRecords)
      .where(
        and(
          eq(revenueRecords.contractId, contractId),
          eq(revenueRecords.performanceObligationId, po.id),
          eq(revenueRecords.status, 'recognized'),
          lte(revenueRecords.recognitionDate, asOfDate)
        )
      );

    const recognized = poRecognized[0]?.total ? Number(poRecognized[0].total) : 0;
    const remaining = allocated - recognized;
    const percentComplete = allocated > 0 ? (recognized / allocated) * 100 : 0;

    result.performanceObligations.push({
      id: po.id,
      name: po.name,
      allocated,
      recognized, 
      remaining,
      percentComplete
    });
  }

  // Add projected revenue if requested
  if (includeProjections && contract.endDate && contract.endDate > asOfDate) {
    // We'll implement different projection strategies based on recognition method
    for (const po of pos) {
      if (po.recognitionMethod === 'over_time' && po.startDate && po.endDate) {
        // Calculate remaining months
        const startDate = po.startDate < asOfDate ? asOfDate : po.startDate;
        const endDate = po.endDate;
        
        const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                           (endDate.getMonth() - startDate.getMonth());
                           
        if (totalMonths <= 0) continue;
        
        // Find this PO in our result
        const poResult = result.performanceObligations.find(p => p.id === po.id);
        if (!poResult) continue;
        
        // Calculate monthly amount (straight-line)
        const monthlyAmount = poResult.remaining / totalMonths;
        
        // Add projected periods
        for (let i = 0; i < totalMonths; i++) {
          const projDate = new Date(startDate);
          projDate.setMonth(projDate.getMonth() + i);
          
          const period = `${projDate.getFullYear()}-${(projDate.getMonth() + 1).toString().padStart(2, '0')}`;
          
          result.revenueByPeriod.push({
            period,
            amount: monthlyAmount,
            status: 'projected'
          });
        }
      }
    }
  }

  // Sort periods chronologically
  result.revenueByPeriod.sort((a, b) => a.period.localeCompare(b.period));

  return result;
}

/**
 * Create a revenue recognition record for a specific amount
 */
export async function recognizeRevenue(data: {
  contractId: number;
  amount: number;
  recognitionDate: Date;
  performanceObligationId?: number;
  description?: string;
  recognitionMethod?: string;
  recognitionReason?: string;
  revenueType?: string;
}): Promise<RevenueRecord> {
  const {
    contractId,
    amount,
    recognitionDate,
    performanceObligationId,
    description,
    recognitionMethod,
    recognitionReason,
    revenueType
  } = data;

  // Validate the revenue recognition
  const [contract] = await db
    .select({ totalTransactionPrice: contracts.totalTransactionPrice })
    .from(contracts)
    .where(eq(contracts.id, contractId));

  if (!contract) {
    throw new Error(`Contract with ID ${contractId} not found`);
  }

  // If no performance obligation is specified, find the first one
  let poId = performanceObligationId;
  if (!poId) {
    const [firstPO] = await db
      .select({ id: performanceObligations.id })
      .from(performanceObligations)
      .where(eq(performanceObligations.contractId, contractId))
      .limit(1);
      
    if (firstPO) {
      poId = firstPO.id;
    }
  }

  // Create the revenue record
  const [revenueRecord] = await db
    .insert(revenueRecords)
    .values({
      contractId,
      amount,
      recognitionDate,
      performanceObligationId: poId,
      status: 'recognized',
      description,
      recognitionMethod: recognitionMethod as any,
      recognitionReason,
      revenueType: revenueType as any,
      adjustmentType: 'initial'
    })
    .returning();

  return revenueRecord;
}

/**
 * Generate a revenue schedule for a contract based on its performance obligations
 */
export async function generateRevenueSchedule(contractId: number): Promise<{
  scheduleItems: {
    date: Date;
    amount: number;
    performanceObligationId: number;
    poName: string;
  }[];
}> {
  // Get contract details
  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, contractId));

  if (!contract) {
    throw new Error(`Contract with ID ${contractId} not found`);
  }

  // Make sure transaction price is allocated
  await allocateTransactionPrice(contractId);

  // Get all performance obligations
  const pos = await db
    .select()
    .from(performanceObligations)
    .where(eq(performanceObligations.contractId, contractId));

  const scheduleItems = [];

  // For each performance obligation, generate schedule items
  for (const po of pos) {
    const allocationPercentage = Number(po.allocationPercentage) || 0;
    const allocatedAmount = Number(contract.totalTransactionPrice || contract.value) * (allocationPercentage / 100);
    
    if (po.recognitionMethod === 'point_in_time') {
      // For point-in-time recognition, use the end date
      if (po.endDate) {
        scheduleItems.push({
          date: po.endDate,
          amount: allocatedAmount,
          performanceObligationId: po.id,
          poName: po.name
        });
      }
    } else if (po.recognitionMethod === 'over_time' && po.startDate && po.endDate) {
      // For over-time recognition, spread evenly across months
      const startDate = new Date(po.startDate);
      const endDate = new Date(po.endDate);
      
      // Calculate total months
      const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                          (endDate.getMonth() - startDate.getMonth()) + 1;
                          
      if (totalMonths <= 0) continue;
      
      // Calculate monthly amount
      const monthlyAmount = allocatedAmount / totalMonths;
      
      // Create a schedule item for each month
      for (let i = 0; i < totalMonths; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        
        scheduleItems.push({
          date,
          amount: monthlyAmount,
          performanceObligationId: po.id,
          poName: po.name
        });
      }
    }
    // Other recognition methods can be added here
  }

  // Sort by date
  scheduleItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  return { scheduleItems };
}