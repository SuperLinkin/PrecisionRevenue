import OpenAI from 'openai';

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Extracts relevant contract information using GPT-4o
 * @param text Contract text content
 * @returns Structured contract data
 */
export async function extractContractData(text: string) {
  try {
    console.log("DEBUG OPENAI - Starting extractContractData with OpenAI");
    console.log("DEBUG OPENAI - API Key status:", process.env.OPENAI_API_KEY ? "Key exists" : "Key missing");
    
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
      model: "gpt-4o", // Using the newest OpenAI model
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
      
      // Ensure all required fields are present with defaults if missing
      return {
        name: result.contractName || "Untitled Contract",
        contractNumber: `CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`,
        clientName: "Client from Contract",
        startDate: new Date(),
        endDate: result.contractTermMonths ? new Date(new Date().setMonth(new Date().getMonth() + result.contractTermMonths)) : null,
        value: result.contractValue || 0,
        keyTerms: [],
        // New fields from the updated REMY format
        performanceObligations: result.performanceObligations || [],
        revenueRecognitionSchedule: result.revenueRecognitionSchedule || [],
        terminationClauseImpact: result.terminationClauseImpact || { refundObligation: false, terminationRisk: "Unknown" },
        financingComponent: result.financingComponent || false,
        auditSummary: result.auditSummary || "No audit notes available"
      };
    } catch (parseError) {
      console.error("Error parsing JSON from OpenAI response:", parseError);
      throw new Error("Failed to parse valid JSON from REMY's response");
    }
  } catch (error) {
    console.error("Error extracting contract data:", error);
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
 * @returns The AI-generated answer based on the contract
 */
export async function answerContractQuestion(contractText: string, question: string) {
  try {
    console.log("DEBUG OPENAI - Starting answerContractQuestion with OpenAI");
    console.log("DEBUG OPENAI - API Key:", process.env.OPENAI_API_KEY ? "Key exists" : "Key missing");
    
    // Always enhance the question to be IFRS 15/ASC 606 focused
    const enhancedQuestion = `${question} - Please analyze according to IFRS 15/ASC 606 standards`;
    
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
      
      Contract text:
      ${contractText}
      
      User's question: ${enhancedQuestion}
    `;

    console.log("DEBUG OPENAI - Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are REMY, a highly specialized revenue recognition AI assistant fully trained on IFRS 15/ASC 606 standards. Always structure your answers with specific references to IFRS 15/ASC 606 sections and provide detailed technical analysis." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1, // Lower temperature for more deterministic, precise answers
      max_tokens: 3000, // Increase token limit for more detailed responses
    });
    
    console.log("DEBUG OPENAI - Received response from OpenAI API");
    console.log("DEBUG OPENAI - Response status:", response.id ? "Success" : "Failed");
    
    const content = response.choices[0].message.content;
    console.log("DEBUG OPENAI - Content length:", content?.length || 0);
    
    return content;
  } catch (error) {
    console.error("DEBUG OPENAI - Error in OpenAI API call:", error);
    return "I'm sorry, I encountered an error while analyzing this contract. Please try again or rephrase your question.";
  }
}