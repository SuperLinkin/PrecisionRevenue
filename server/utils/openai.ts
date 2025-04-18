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
    const prompt = `
      Analyze the following contract and extract key information in JSON format.
      Include the following fields:
      - name: The title or name of the contract
      - contractNumber: Any contract ID or reference number (format as CT-XXX-YYYY if not present)
      - clientName: The client or second party name
      - startDate: The effective or start date (return in ISO format)
      - endDate: The termination or end date (return in ISO format, or null if not found)
      - value: The total contract value as a number (without currency symbols)
      - keyTerms: Array of important contract clauses or terms (limit to 5 most important)

      Contract text:
      ${text}

      Return only the JSON without any other text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
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
    
    // Format the question to be more IFRS 15/ASC 606 focused if it's general
    let enhancedQuestion = question;
    if (question.toLowerCase().includes('revenue recognition') || 
        question.toLowerCase().includes('recognize') ||
        question.toLowerCase().includes('revenue schedule')) {
      enhancedQuestion = `${question} Following IFRS 15/ASC 606 guidelines`;
    }
    
    const prompt = `
      You are REMY, a specialized AI assistant for Revenue Management at Precision Revenue Automation.
      
      Your expertise:
      - Contract analysis and interpretation
      - Revenue recognition guidance under IFRS 15/ASC 606
      - Financial reporting requirements
      - Performance obligation identification
      - Revenue allocation methodologies
      
      Analyze the following contract text and answer the user's question.
      Your answers should be comprehensive, professional, and refer to specific sections of the contract.
      Always relate your answers to IFRS 15/ASC 606 principles when discussing revenue recognition.
      
      Contract text:
      ${contractText}
      
      User's question: ${enhancedQuestion}
    `;

    console.log("DEBUG OPENAI - Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1500,
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