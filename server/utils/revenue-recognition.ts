import { Contract } from '@shared/schema';
import OpenAI from 'openai';

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Identifies performance obligations from a contract
 * @param contractText The text of the contract
 * @param contractData Basic contract data
 * @returns Array of performance obligations
 */
export async function identifyPerformanceObligations(contractText: string, contractData: any) {
  try {
    console.log("Starting performance obligation identification with AI");
    
    const prompt = `
      As a revenue recognition expert specializing in IFRS 15/ASC 606, analyze this contract and identify all distinct performance obligations.
      
      Contract: ${contractText}
      
      Follow these steps:
      1. Identify each distinct good or service promised in the contract
      2. Determine which promises are DISTINCT performance obligations per IFRS 15 paragraph 22-30
      3. For each obligation, provide:
         - A clear description
         - Whether it's satisfied over time or at a point in time (with justification)
         - The estimated standalone selling price and basis for estimation
         - Allocation of the transaction price (${contractData.value}) to each obligation
      
      Format your response as a valid JSON array with objects containing:
      {
        "description": string,
        "satisfactionMethod": "over_time" | "point_in_time",
        "justification": string,
        "estimatedValue": number,
        "allocatedAmount": number,
        "allocationBasis": string
      }
      
      Return ONLY the JSON array without any explanations or additional text.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a specialized revenue recognition AI that identifies performance obligations according to IFRS 15/ASC 606 standards."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });
    
    try {
      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.obligations || [];
    } catch (parseError) {
      console.error("Error parsing performance obligations:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error identifying performance obligations:", error);
    return [];
  }
}

/**
 * Generates a revenue recognition schedule based on contract and identified obligations
 * @param contract The contract data
 * @param obligations The identified performance obligations
 * @returns Revenue recognition schedule
 */
export async function generateRevenueSchedule(contract: any, obligations: any[] = []) {
  try {
    console.log("Generating revenue recognition schedule");
    
    // If no obligations are provided, create a default one for the entire contract
    const effectiveObligations = obligations.length > 0 ? obligations : [{
      description: "Full contract services",
      satisfactionMethod: "over_time",
      justification: "Services provided continuously throughout contract period",
      estimatedValue: contract.value,
      allocatedAmount: contract.value,
      allocationBasis: "Full contract value"
    }];
    
    const startDate = new Date(contract.startDate);
    const endDate = contract.endDate ? new Date(contract.endDate) : new Date(startDate);
    
    // Default to 1 year if dates are the same or endDate is before startDate
    if (endDate <= startDate) {
      endDate.setFullYear(startDate.getFullYear() + 1);
    }
    
    const contractDurationMs = endDate.getTime() - startDate.getTime();
    const contractDurationDays = Math.ceil(contractDurationMs / (1000 * 60 * 60 * 24));
    
    const schedule = [];
    
    // Generate revenue schedules for each obligation
    for (const obligation of effectiveObligations) {
      if (obligation.satisfactionMethod === "over_time") {
        // For over_time, create monthly recognition entries
        const monthlyAmount = obligation.allocatedAmount / (contractDurationDays / 30);
        let currentDate = new Date(startDate);
        
        while (currentDate < endDate) {
          const recognitionDate = new Date(currentDate);
          const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          
          // Calculate prorated amount for partial months
          let amount = monthlyAmount;
          
          if (currentDate.getTime() === startDate.getTime() && startDate.getDate() > 1) {
            // Prorate first month
            const daysActive = daysInMonth - startDate.getDate() + 1;
            amount = (monthlyAmount / daysInMonth) * daysActive;
          }
          
          schedule.push({
            recognitionDate,
            amount: parseFloat(amount.toFixed(2)),
            description: `${obligation.description} - ${recognitionDate.toLocaleDateString()}`,
            recognitionMethod: "over_time",
            revenueType: "recurring",
            performanceObligation: obligation.description,
            status: "scheduled"
          });
          
          // Move to next month
          currentDate.setMonth(currentDate.getMonth() + 1);
          
          // Handle potential last month proration
          if (currentDate > endDate) {
            const daysOver = (currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24);
            const daysInLastMonth = daysInMonth;
            const adjustmentAmount = (monthlyAmount / daysInLastMonth) * daysOver;
            
            // Adjust the last entry
            const lastEntry = schedule[schedule.length - 1];
            lastEntry.amount = parseFloat((lastEntry.amount - adjustmentAmount).toFixed(2));
            
            // Break if we've applied the adjustment
            break;
          }
        }
      } else {
        // For point_in_time, create a single recognition entry
        schedule.push({
          recognitionDate: new Date(startDate),
          amount: obligation.allocatedAmount,
          description: obligation.description,
          recognitionMethod: "point_in_time",
          revenueType: "one_time",
          performanceObligation: obligation.description,
          status: "scheduled"
        });
      }
    }
    
    return schedule;
  } catch (error) {
    console.error("Error generating revenue schedule:", error);
    return [];
  }
}

/**
 * Calculates the transaction price for a contract based on IFRS 15/ASC 606 standards
 * @param contractText The full contract text
 * @param contractData Basic contract data
 * @returns The transaction price analysis
 */
export async function calculateTransactionPrice(contractText: string, contractData: any) {
  try {
    console.log("Calculating transaction price with AI");
    
    const prompt = `
      As a revenue recognition expert specializing in IFRS 15/ASC 606, analyze this contract and determine the transaction price.
      
      Contract: ${contractText}
      
      Follow these steps:
      1. Identify the basic contract price (fixed consideration)
      2. Identify any variable consideration elements (e.g., bonuses, penalties, rebates)
      3. Evaluate if any variable consideration should be constrained (high probability of reversal)
      4. Identify any significant financing components
      5. Identify any non-cash consideration
      6. Calculate the total transaction price according to IFRS 15/ASC 606
      
      Format your response as a valid JSON object:
      {
        "basePrice": number,
        "variableConsideration": [
          {
            "description": string,
            "amount": number,
            "constraint": number | null,
            "explanation": string
          }
        ],
        "financingComponent": {
          "exists": boolean,
          "amount": number | null,
          "explanation": string
        },
        "nonCashConsideration": {
          "exists": boolean,
          "amount": number | null,
          "explanation": string
        },
        "totalTransactionPrice": number,
        "analysis": string
      }
      
      Return ONLY the JSON object without any explanations or additional text.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a specialized revenue recognition AI that calculates transaction price according to IFRS 15/ASC 606 standards."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });
    
    try {
      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Ensure we always have a total transaction price
      if (!result.totalTransactionPrice && contractData.value) {
        result.totalTransactionPrice = contractData.value;
      }
      
      return result;
    } catch (parseError) {
      console.error("Error parsing transaction price calculation:", parseError);
      return {
        basePrice: contractData.value,
        variableConsideration: [],
        financingComponent: { exists: false, amount: null, explanation: "Not applicable" },
        nonCashConsideration: { exists: false, amount: null, explanation: "Not applicable" },
        totalTransactionPrice: contractData.value,
        analysis: "Used contract value as transaction price due to parsing error"
      };
    }
  } catch (error) {
    console.error("Error calculating transaction price:", error);
    return {
      basePrice: contractData.value,
      variableConsideration: [],
      financingComponent: { exists: false, amount: null, explanation: "Not applicable" },
      nonCashConsideration: { exists: false, amount: null, explanation: "Not applicable" },
      totalTransactionPrice: contractData.value,
      analysis: "Used contract value as transaction price due to API error"
    };
  }
}

/**
 * Generates disclosure notes for financial reporting based on the contract
 * @param contractText The full contract text
 * @param contractData Basic contract data
 * @param revenueSchedule The calculated revenue schedule
 * @returns The disclosure notes
 */
export async function generateDisclosureNotes(contractText: string, contractData: any, revenueSchedule: any[]) {
  try {
    console.log("Generating disclosure notes with AI");
    
    const totalRecognized = revenueSchedule.reduce((sum, record) => sum + record.amount, 0);
    
    const prompt = `
      As a financial reporting expert specializing in IFRS 15/ASC 606, generate comprehensive disclosure notes for this revenue contract.
      
      Contract: ${JSON.stringify(contractData)}
      
      Revenue Schedule: ${JSON.stringify(revenueSchedule)}
      
      Total Contract Value: ${contractData.value}
      Total Recognized Revenue: ${totalRecognized}
      
      Follow these steps:
      1. Create robust disclosure notes following IFRS 15/ASC 606 requirements
      2. Include sections on:
         - Nature of performance obligations
         - Significant judgments in revenue recognition
         - Timing of satisfaction of performance obligations
         - Transaction price determination and allocation
         - Contract assets and liabilities
      3. Provide clear quantitative information aligned with the revenue schedule
      
      Format your response as valid HTML that could be included in financial statements.
      Be specific, detailed, and precise, using actual contract details and figures.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a specialized financial reporting AI that generates IFRS 15/ASC 606 disclosure notes."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error("Error generating disclosure notes:", error);
    return `<div class="disclosure-notes">
      <h3>Revenue Recognition Disclosure Notes</h3>
      <p>The Company recognizes revenue in accordance with IFRS 15/ASC 606. For the contract "${contractData.name}" with ${contractData.clientName}, 
      revenue of ${contractData.value} is being recognized over the contract term from ${new Date(contractData.startDate).toLocaleDateString()} 
      to ${contractData.endDate ? new Date(contractData.endDate).toLocaleDateString() : 'ongoing'}.</p>
      <p>Note: Complete disclosure notes could not be generated due to a system error.</p>
    </div>`;
  }
}