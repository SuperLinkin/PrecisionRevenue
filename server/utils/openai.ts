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
    const prompt = `
      You are REMY, an AI assistant specializing in contract analysis. 
      Analyze the following contract text and answer the user's question.
      Provide a concise but detailed answer, citing specific clauses or sections from the contract that support your answer.
      
      Contract text:
      ${contractText}
      
      User's question: ${question}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error answering contract question:", error);
    return "I'm sorry, I encountered an error while analyzing this contract. Please try again or rephrase your question.";
  }
}