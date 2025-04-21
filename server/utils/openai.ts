import OpenAI from 'openai';
import { config } from 'dotenv';
import type { ClientOptions } from 'openai';

// Load environment variables
config();

// Initialize OpenAI client with proper typing
const openaiConfig: Partial<ClientOptions> = {
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000 // 30 second timeout
};

const openai = new OpenAI(openaiConfig);

// Add a function to validate OpenAI configuration
export function validateOpenAIConfig() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
  }
  if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format. API key should start with "sk-"');
  }
}

// Export the OpenAI instance
export { openai };

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024
const AI_MODEL = "gpt-4"; // Changed from gpt-4o to gpt-4

/**
 * Extracts relevant contract information using GPT-4o
 * @param text Contract text content
 * @returns Structured contract data
 */
export async function extractContractData(text: string) {
  try {
    validateOpenAIConfig();
    console.log("DEBUG OPENAI - Starting extractContractData with OpenAI");
    
    const systemPrompt = `You are REMY, a revenue recognition AI trained on IFRS 15 and ASC 606. You work for a finance automation platform (PRA).

Extract the following information directly from the uploaded SaaS contract and respond ONLY with structured JSON. No greetings, no assistant-style answers.

Fields:

contractName

contractValue

contractTermMonths

performanceObligations: array of { name, isDistinct, deliveryTiming ("point" or "over-time"), suggestedSSP }

revenueRecognitionSchedule: array of { month: YYYY-MM, amount }

terminationClauseImpact: { refundObligation: true/false, terminationRisk: string }

financingComponent: true/false

auditSummary: string

Only return valid JSON. Do not include any natural language response.`;

    const userPrompt = `Analyze the following SaaS contract and extract the required information according to IFRS 15/ASC 606 standards:

${text}`;

    console.log("DEBUG OPENAI - Sending extraction request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    try {
      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate the response structure
      if (!result.contractName || !result.contractValue) {
        throw new Error("AI response missing required fields");
      }
      
      // Ensure all required fields are present with defaults if missing
      return {
        name: result.contractName || "Untitled Contract",
        contractNumber: `CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`,
        clientName: "Client from Contract",
        startDate: new Date(),
        endDate: result.contractTermMonths ? new Date(new Date().setMonth(new Date().getMonth() + result.contractTermMonths)) : null,
        value: result.contractValue || 0,
        keyTerms: [],
        performanceObligations: result.performanceObligations || [],
        revenueRecognitionSchedule: result.revenueRecognitionSchedule || [],
        terminationClauseImpact: result.terminationClauseImpact || { refundObligation: false, terminationRisk: "Unknown" },
        financingComponent: result.financingComponent || false,
        auditSummary: result.auditSummary || "No audit notes available"
      };
    } catch (parseError) {
      console.error("Error parsing JSON from OpenAI response:", parseError);
      throw new Error("Failed to parse valid JSON from REMY's response. Please try again.");
    }
  } catch (error: unknown) {
    console.error("Error extracting contract data:", error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error("OpenAI API configuration error. Please check your API key.");
      }
      if (error.message.includes('timeout')) {
        throw new Error("Request timed out. Please try again.");
      }
    }
    // Return default values if extraction fails
    return {
      name: "Untitled Contract",
      contractNumber: `CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`,
      clientName: "Unnamed Client",
      startDate: new Date(),
      endDate: null,
      value: 0,
      keyTerms: [],
      performanceObligations: [],
      revenueRecognitionSchedule: [],
      terminationClauseImpact: { refundObligation: false, terminationRisk: "Error analyzing termination clauses" },
      financingComponent: false,
      auditSummary: "Error analyzing contract. Please try again."
    };
  }
}

/**
 * Answers questions about a contract using GPT-4o
 * @param contractText The contract text content
 * @param question The user's question about the contract
 * @returns The AI-generated answer and structured data if available
 */
export async function answerContractQuestion(contractText: string, question: string) {
  try {
    console.log("DEBUG OPENAI - Starting answerContractQuestion with OpenAI");
    console.log("DEBUG OPENAI - API Key:", process.env.OPENAI_API_KEY ? "Key exists" : "Key missing");
    
    // Check for revenue recognition related words in the question
    const isRevenueQuestion = /revenue|recognition|ifrs|asc 606|performance obligation|transaction price|allocation/i.test(question);
    
    // Handle specifically if user is asking for a revenue recognition schedule
    const isScheduleRequest = /schedule|generate schedule|revenue schedule|recognition schedule/i.test(question);
    
    // Always enhance the question to be IFRS 15/ASC 606 focused
    const enhancedQuestion = `${question} - Please analyze according to IFRS 15/ASC 606 standards`;
    
    // Determine if we should request JSON structured response
    const useStructuredResponse = isRevenueQuestion || isScheduleRequest;
    
    let systemPrompt = "";
    
    if (useStructuredResponse) {
      systemPrompt = `You are REMY, a highly specialized revenue recognition AI assistant fully trained on IFRS 15/ASC 606 standards.
      
For this request, you must return a valid JSON object with the following structure:

{
  "textResponse": "Your natural language explanation here...",
  "structuredData": {
    "contractName": "Name of the contract",
    "contractValue": 50000,
    "contractTermMonths": 12,
    "performanceObligations": [
      {
        "name": "Software License",
        "isDistinct": true,
        "deliveryTiming": "point",
        "suggestedSSP": 30000
      },
      {
        "name": "Implementation Services",
        "isDistinct": true,
        "deliveryTiming": "point",
        "suggestedSSP": 10000
      },
      {
        "name": "Support Services",
        "isDistinct": true,
        "deliveryTiming": "over-time",
        "suggestedSSP": 10000
      }
    ],
    "revenueRecognitionSchedule": [
      { "month": "2023-01", "amount": 4166.67 },
      { "month": "2023-02", "amount": 4166.67 }
    ],
    "terminationClauseImpact": {
      "refundObligation": false,
      "terminationRisk": "Low risk, no significant refund obligations"
    },
    "financingComponent": false,
    "auditSummary": "The contract complies with IFRS 15/ASC 606 requirements..."
  }
}

For the structuredData, only include fields that you can confidently extract from the contract information. If you cannot determine some fields with confidence, omit them from the JSON.`;
    } else {
      systemPrompt = "You are REMY, a highly specialized revenue recognition AI assistant fully trained on IFRS 15/ASC 606 standards. Always structure your answers with specific references to IFRS 15/ASC 606 sections and provide detailed technical analysis.";
    }
    
    const prompt = `
      You are REMY, a specialized AI assistant for Revenue Management at Precision Revenue Automation.
      
      Your PRIMARY expertise is in IFRS 15/ASC 606 revenue recognition standards. You MUST:
      1. Focus on the 5-step IFRS 15/ASC 606 model in all responses:
         - Identify the contract with a customer
         - Identify performance obligations in the contract
         - Determine the transaction price
         - Allocate the transaction price to the performance obligations
         - Recognize revenue when (or as) performance obligations are satisfied
      
      2. Cite specific sections from IFRS 15/ASC 606 in all responses
      3. Provide concrete, actionable guidance based on the contract text
      4. Identify performance obligations, transaction price, allocation methods, and timing considerations
      5. Explain how specific contract clauses impact revenue recognition
      6. Provide exact calculations when discussing revenue allocation or recognition
      
      Analyze the following contract text and answer the user's question using ONLY the provided contract.
      Your answers must be specific, detailed, technically precise, and ALWAYS conform to IFRS 15/ASC 606 standards.
      
      ${useStructuredResponse ? "IMPORTANT: The response MUST be a valid JSON object with the structure specified in the system message." : ""}
      
      Contract text:
      ${contractText}
      
      User's question: ${enhancedQuestion}
    `;

    console.log("DEBUG OPENAI - Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { 
          role: "system", 
          content: systemPrompt
        },
        { role: "user", content: prompt }
      ],
      response_format: useStructuredResponse ? { type: "json_object" } : undefined,
      temperature: 0.1, // Lower temperature for more deterministic, precise answers
      max_tokens: 3000, // Increase token limit for more detailed responses
    });
    
    console.log("DEBUG OPENAI - Received response from OpenAI API");
    console.log("DEBUG OPENAI - Response status:", response.id ? "Success" : "Failed");
    
    const content = response.choices[0].message.content || "";
    console.log("DEBUG OPENAI - Content length:", content.length);
    
    // If this was a structured request, try to parse the JSON
    if (useStructuredResponse) {
      try {
        const parsedResponse = JSON.parse(content);
        
        // Check if we have a properly structured response
        if (parsedResponse.textResponse && parsedResponse.structuredData) {
          console.log("DEBUG OPENAI - Successfully parsed structured response");
          return {
            answer: parsedResponse.textResponse,
            structuredData: parsedResponse.structuredData
          };
        } else {
          console.warn("DEBUG OPENAI - Got JSON response but missing expected fields");
          return {
            answer: content,
            structuredData: null
          };
        }
      } catch (parseError) {
        console.error("DEBUG OPENAI - Failed to parse JSON response:", parseError);
        
        // Check if this includes any typical non-json responses
        if (content.toLowerCase().includes("would you like me to")) {
          return {
            answer: "REMY detected incomplete contract details. Please re-upload a full SaaS contract.",
            structuredData: null
          };
        }
        
        return {
          answer: content,
          structuredData: null
        };
      }
    }
    
    // For non-structured requests, just return the content
    return {
      answer: content,
      structuredData: null
    };
  } catch (error: unknown) {
    console.error("DEBUG OPENAI - Error in OpenAI API call:", error);
    return {
      answer: "I'm sorry, I encountered an error while analyzing this contract. Please try again or rephrase your question.",
      structuredData: null
    };
  }
}