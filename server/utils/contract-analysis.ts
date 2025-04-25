import { OpenAI } from 'openai';
import { Contract } from '@shared/schema';

// Use the latest stable model
const AI_MODEL = "gpt-4";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000 // 30 second timeout
});

// Function to check if OpenAI API is available
export async function checkOpenAIAvailability(): Promise<{
  available: boolean;
  message?: string;
}> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      available: false,
      message: 'OpenAI API key is not configured'
    };
  }

  try {
    // Make a lightweight API call to verify the key works
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: "Test connection" }],
      max_tokens: 5
    });
    
    return {
      available: true,
      message: 'OpenAI API is available'
    };
  } catch (error) {
    const err = error as Error;
    console.error('OpenAI API check failed:', err.message);
    return {
      available: false,
      message: err.message || 'Unknown error accessing OpenAI API'
    };
  }
}

interface ContractRisk {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  clause: string;
  mitigation?: string;
}

interface ContractOpportunity {
  category: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
  clause?: string;
  recommendation?: string;
}

interface ContractTermsAnalysis {
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
}

interface ContractComplianceAnalysis {
  ifrs15Compliance: {
    score: number; // 0-100
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
}

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

export interface ContractAnalysis {
  summary: ContractSummary;
  risks: ContractRisk[];
  opportunities: ContractOpportunity[];
  termsAnalysis: ContractTermsAnalysis;
  complianceAnalysis: ContractComplianceAnalysis;
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

/**
 * Perform a comprehensive analysis of a contract using NLP
 * 
 * @param contractText The full text of the contract
 * @param contractData Optional basic contract data to provide context
 * @returns Detailed contract analysis
 */
export async function analyzeContract(
  contractText: string, 
  contractData?: Partial<Contract>
): Promise<ContractAnalysis> {
  try {
    console.log("Starting comprehensive contract analysis with NLP...");
    
    // Validate input
    if (!contractText || contractText.trim().length === 0) {
      console.error("Empty contract text provided");
      throw new Error("Contract text is required");
    }

    // Log contract text length for debugging
    console.log(`Analyzing contract with length: ${contractText.length} characters`);
    
    const prompt = `
      You are REMY, a specialized AI for contract analysis with expertise in IFRS 15/ASC 606 revenue recognition.
      Perform a comprehensive analysis of the following contract, focusing on:
      
      1. Contract summary (type, parties, dates, value, key provisions)
      2. Risk identification (legal, financial, operational)
      3. Opportunity assessment
      4. Terms analysis (unusual, favorable, non-competitive)
      5. Compliance analysis (IFRS 15/ASC 606 compliance, regulatory issues)
      6. Revenue recognition summary (pattern, special considerations, variable components)
      
      ${contractData ? `Additional context: ${JSON.stringify(contractData)}` : ''}
      
      Contract:
      ${contractText}
      
      IMPORTANT: Your response MUST be valid JSON and include ALL required fields:
      - summary.effectiveDate
      - summary.contractType
      - summary.parties
      - summary.contractValue
      - revenueSummary.totalValue
      - revenueSummary.recognitionPattern
    `;
    
    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      throw new Error("OpenAI API key is not configured");
    }

    console.log("Making OpenAI API request...");
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are REMY, an advanced contract analysis AI with expertise in IFRS 15/ASC 606 revenue recognition standards. You provide detailed, accurate, and actionable analysis of contracts. Your responses should be in JSON format."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    });

    console.log("Received OpenAI response");

    if (!response.choices[0]?.message?.content) {
      console.error("Empty response from OpenAI");
      throw new Error("No response content from OpenAI");
    }

    try {
      console.log("Parsing OpenAI response as JSON");
      const analysis = JSON.parse(response.choices[0].message.content) as ContractAnalysis;
      
      // Validate required fields
      if (!analysis.summary?.effectiveDate) {
        throw new Error("Missing required field: summary.effectiveDate");
      }
      if (!analysis.summary?.contractType) {
        throw new Error("Missing required field: summary.contractType");
      }
      if (!analysis.summary?.parties || analysis.summary.parties.length === 0) {
        throw new Error("Missing required field: summary.parties");
      }
      if (!analysis.summary?.contractValue) {
        throw new Error("Missing required field: summary.contractValue");
      }
      if (!analysis.revenueSummary?.totalValue) {
        throw new Error("Missing required field: revenueSummary.totalValue");
      }
      if (!analysis.revenueSummary?.recognitionPattern) {
        throw new Error("Missing required field: revenueSummary.recognitionPattern");
      }

      console.log("Successfully parsed and validated contract analysis");
      return analysis;
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.error("Raw response:", response.choices[0]?.message?.content);
      throw new Error(`Failed to parse contract analysis response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    const err = error as Error;
    console.error("Contract analysis error:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    throw new Error(`Failed to analyze contract: ${err.message}`);
  }
}

/**
 * Analyze a contract specifically for revenue recognition using NLP
 * 
 * @param contractText The full text of the contract
 * @param contractData Optional basic contract data to provide context
 * @returns Revenue recognition analysis
 */
export async function analyzeRevenueRecognition(
  contractText: string, 
  contractData?: Partial<Contract>
): Promise<any> {
  try {
    console.log("Starting revenue recognition analysis with NLP...");
    
    const prompt = `
      You are REMY, an AI revenue recognition expert for SaaS contracts under IFRS 15 and ASC 606. Analyze the contract below and return this JSON structure:

      {
        "contractName": string,
        "contractNumber": string,
        "clientName": string,
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "contractValue": number,
        "performanceObligations": [
          {
            "name": string,
            "isDistinct": boolean,
            "deliveryTiming": "point" | "over-time",
            "suggestedSSP": number
          }
        ],
        "revenueRecognitionCriteria": [
          "e.g. upon delivery", "monthly over 12 months", "after go-live"
        ],
        "terminationClauses": [
          {
            "clause": string,
            "refundRequired": boolean,
            "impactOnRevenue": string
          }
        ],
        "discountOrVariableConsideration": ["rebate", "tiered pricing"],
        "financingComponentFlag": boolean,
        "auditNotes": string
      }

      Follow the 5-step approach from IFRS 15/ASC 606:
      1. Identify the contract(s) with a customer
      2. Identify the performance obligations in the contract
      3. Determine the transaction price
      4. Allocate the transaction price to the performance obligations
      5. Recognize revenue when (or as) the entity satisfies a performance obligation
      
      Be concise and output valid JSON only.

      Contract:
      ${contractText}
    `;
    
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are REMY, an advanced contract analysis AI with deep expertise in IFRS 15/ASC 606 revenue recognition standards. You provide detailed, accurate, and IFRS 15-compliant analysis of revenue recognition patterns. Your responses must be in valid JSON format."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    });
    
    if (!response.choices[0]?.message?.content) {
      throw new Error("No response content from OpenAI");
    }

    try {
      const analysis = JSON.parse(response.choices[0].message.content);
      return analysis;
    } catch (parseError) {
      console.error("Error parsing revenue recognition analysis:", parseError);
      throw new Error("Failed to parse AI response into revenue recognition analysis");
    }
  } catch (error) {
    console.error("Error in revenue recognition analysis:", error);
    throw error;
  }
}

/**
 * Extract key entities from a contract using NLP
 * 
 * @param contractText The full text of the contract
 * @returns Extracted entities
 */
export async function extractContractEntities(contractText: string): Promise<any> {
  try {
    console.log("Extracting contract entities with NLP...");
    
    const prompt = `
      Extract all relevant entities from this contract by performing Named Entity Recognition.
      Focus on the following entity types:
      
      1. Organization names (parties to the contract)
      2. Person names (signatories, contacts, representatives)
      3. Locations (jurisdictions, governing law, places of performance)
      4. Monetary values (prices, fees, penalties, discounts)
      5. Dates (effective dates, termination dates, renewal dates, payment dates)
      6. Time periods (contract duration, notice periods, cure periods)
      7. Products or services (items being sold/provided)
      8. Legal terms (indemnification, warranties, limitations of liability)
      
      Return a JSON object with the following structure:
      {
        "organizations": [
          {
            "name": string,
            "role": string,
            "mentions": [
              {
                "text": string,
                "contextClause": string
              }
            ]
          }
        ],
        "persons": [
          {
            "name": string,
            "title": string,
            "organization": string,
            "role": string
          }
        ],
        "locations": [
          {
            "name": string,
            "type": "jurisdiction" | "performance_location" | "address" | "other",
            "context": string
          }
        ],
        "monetaryValues": [
          {
            "amount": number,
            "currency": string,
            "purpose": string,
            "clause": string
          }
        ],
        "dates": [
          {
            "date": string,
            "description": string,
            "significance": string
          }
        ],
        "timePeriods": [
          {
            "duration": string,
            "unit": "days" | "weeks" | "months" | "years",
            "purpose": string,
            "clause": string
          }
        ],
        "productsServices": [
          {
            "name": string,
            "description": string,
            "quantity": string,
            "pricing": string
          }
        ],
        "legalTerms": [
          {
            "type": string,
            "description": string,
            "clause": string
          }
        ]
      }
      
      Contract:
      ${contractText}
    `;
    
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are REMY, an advanced contract analysis AI that specializes in named entity recognition and information extraction from legal documents. Your responses must be in valid JSON format."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    });
    
    if (!response.choices[0]?.message?.content) {
      throw new Error("No response content from OpenAI");
    }

    try {
      const entities = JSON.parse(response.choices[0].message.content);
      return entities;
    } catch (parseError) {
      console.error("Error parsing contract entities:", parseError);
      throw new Error("Failed to parse AI response into contract entities");
    }
  } catch (error) {
    console.error("Error extracting contract entities:", error);
    throw error;
  }
}

/**
 * Analyze contract obligations and responsibilities 
 * 
 * @param contractText The full text of the contract
 * @returns Analyzed obligations
 */
export async function analyzeContractObligations(contractText: string): Promise<any> {
  try {
    console.log("Analyzing contract obligations with NLP...");
    
    const prompt = `
      Analyze all obligations, responsibilities, and requirements in this contract.
      Identify who is obligated to do what, when, and under what conditions.
      
      Return a JSON object with the following structure:
      {
        "sellerObligations": [
          {
            "description": string,
            "timing": string,
            "conditions": string[],
            "consequences": string,
            "clause": string
          }
        ],
        "buyerObligations": [
          {
            "description": string,
            "timing": string,
            "conditions": string[],
            "consequences": string,
            "clause": string
          }
        ],
        "mutualObligations": [
          {
            "description": string,
            "timing": string,
            "conditions": string[],
            "consequences": string,
            "clause": string
          }
        ],
        "conditionalClauses": [
          {
            "condition": string,
            "consequence": string,
            "obligatedParty": string,
            "clause": string
          }
        ],
        "deliverables": [
          {
            "item": string,
            "description": string,
            "dueDate": string,
            "responsibleParty": string,
            "acceptanceCriteria": string
          }
        ],
        "servicePerformance": [
          {
            "service": string,
            "performanceStandards": string[],
            "metrics": string[],
            "remedies": string
          }
        ]
      }
      
      Contract:
      ${contractText}
    `;
    
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are REMY, an advanced contract analysis AI specializing in identifying obligations, responsibilities, and requirements in legal documents. Your responses must be in valid JSON format."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    });
    
    try {
      const obligations = JSON.parse(response.choices[0].message.content || '{}');
      return obligations;
    } catch (parseError) {
      console.error("Error parsing contract obligations:", parseError);
      throw new Error("Failed to parse AI response into contract obligations");
    }
  } catch (error) {
    console.error("Error analyzing contract obligations:", error);
    throw error;
  }
}

/**
 * Compare a contract against standard templates or industry standards
 * 
 * @param contractText The contract to analyze
 * @param templateType The type of template to compare against (e.g., 'SaaS', 'Consulting', 'Licensing')
 * @returns Comparison analysis
 */
export async function compareToStandardContract(contractText: string, templateType: string): Promise<any> {
  try {
    console.log(`Comparing contract to ${templateType} industry standards...`);
    
    const prompt = `
      Compare this contract to standard ${templateType} industry contracts.
      Identify terms that are:
      - Missing compared to industry standards
      - Unusual or non-standard
      - More favorable than industry standards
      - Less favorable than industry standards
      
      Return a JSON object with the following structure:
      {
        "missingTerms": [
          {
            "term": string,
            "importance": "critical" | "important" | "standard" | "optional",
            "description": string,
            "recommendation": string
          }
        ],
        "unusualTerms": [
          {
            "term": string,
            "industryStandard": string,
            "contractProvision": string,
            "impact": "positive" | "negative" | "neutral",
            "recommendation": string
          }
        ],
        "favorableTerms": [
          {
            "term": string,
            "description": string,
            "benefit": string
          }
        ],
        "unfavorableTerms": [
          {
            "term": string,
            "description": string,
            "risk": string,
            "recommendation": string
          }
        ],
        "overallAssessment": {
          "score": number (0-100),
          "strengths": string[],
          "weaknesses": string[],
          "keyRecommendations": string[]
        }
      }
      
      Contract:
      ${contractText}
    `;
    
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are REMY, an advanced contract analysis AI with extensive knowledge of ${templateType} industry standards and best practices. Your responses must be in valid JSON format.`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });
    
    try {
      const comparison = JSON.parse(response.choices[0].message.content || '{}');
      return comparison;
    } catch (parseError) {
      console.error("Error parsing contract comparison:", parseError);
      throw new Error("Failed to parse AI response into contract comparison");
    }
  } catch (error) {
    console.error("Error comparing contract to standards:", error);
    throw error;
  }
}
