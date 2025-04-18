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
    
    const prompt = `
      You are a specialized contract analysis AI for Precision Revenue Automation.
      Analyze the provided contract text and extract the following information in JSON format.
      
      Required fields (all fields MUST be included in the response):
      - name: The title or name of the contract (string)
      - contractNumber: Any contract ID or reference number (format as CT-XXX-YYYY if not present) (string)
      - clientName: The client or second party name (string)
      - startDate: The effective or start date (ISO format YYYY-MM-DD) (string)
      - endDate: The termination or end date (ISO format YYYY-MM-DD, or null if not found) (string or null)
      - value: The total contract value as a number without currency symbols (number)
      - keyTerms: Array of most important contract clauses or terms, focusing on payment, delivery, and termination (array of strings, 5 items max)
      - performanceObligations: Array of performance obligations identified in the contract (array of strings, can be empty)
      
      You MUST extract accurate information directly from the contract text. If you cannot find a specific piece of information, use reasonable defaults based on industry standards.
      
      Contract text:
      ${text}
      
      Return ONLY the JSON without any explanations or additional text.
    `;

    console.log("DEBUG OPENAI - Sending extraction request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a specialized contract analysis AI that extracts precise and accurate information from legal documents."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure all fields are present with defaults if missing
    return {
      name: result.name || "Untitled Contract",
      contractNumber: result.contractNumber || `CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`,
      clientName: result.clientName || "Unnamed Client",
      startDate: result.startDate ? new Date(result.startDate) : new Date(),
      endDate: result.endDate ? new Date(result.endDate) : null,
      value: result.value || 0,
      keyTerms: result.keyTerms || [],
    };
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