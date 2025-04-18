// Contract API endpoints for MVP demo
import express from 'express';
import { getContractTemplate } from './contract-template';
import { answerContractQuestion } from './utils/openai';
const router = express.Router();

// In-memory storage for demo contracts
let demoContract = {
  text: getContractTemplate('SaaS', 'DemoTech'),
  data: {
    name: 'SaaS Agreement',
    contractNumber: `CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`,
    clientName: 'DemoTech',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
    value: 50000,
    keyTerms: [
      "Net 30 payment terms",
      "Auto-renewal clause",
      "Termination with 60 days notice",
      "Confidentiality agreement",
      "Service level agreement of 99.9% uptime"
    ]
  }
};

// Extract contract data endpoint
router.post('/extract', async (req, res) => {
  try {
    const { fileName, text, base64Data } = req.body;
    
    console.log("DEBUG API - Extracting contract data from:", fileName);
    console.log("DEBUG API - OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("DEBUG API - Base64 data provided:", !!base64Data);
    
    // Generate specific contract details based on file name
    if (fileName) {
      const parts = fileName.replace('.pdf', '').split('-');
      const contractType = parts[0]?.trim() || 'SaaS';
      const clientName = parts[1]?.trim() || 'TechCorp';
      
      // If we have base64 data, include information about the uploaded file
      // In a real implementation, we'd convert the PDF to text here
      let contractText = "";
      
      if (base64Data) {
        console.log("DEBUG API - Using base64 data from uploaded PDF");
        // For now, we're still using a template but noting it's from an uploaded file
        contractText = `[PDF UPLOADED: ${fileName}]\n\n${getContractTemplate(contractType, clientName)}`;
      } else if (text) {
        console.log("DEBUG API - Using provided text");
        contractText = text;
      } else {
        console.log("DEBUG API - Using template based on filename");
        contractText = getContractTemplate(contractType, clientName);
      }
      
      // Store the contract text for future use
      demoContract.text = contractText;
      
      try {
        // Import dynamically to avoid errors if OpenAI API key is not set
        const { extractContractData } = await import('./utils/openai');
        
        console.log("DEBUG API - Using AI to extract contract data");
        const extractedData = await extractContractData(contractText);
        
        // Update the demo contract with the extracted data
        demoContract.data = {
          ...extractedData,
          // Ensure date formatting - we'll need to handle null case for endDate
          startDate: extractedData.startDate instanceof Date ? extractedData.startDate : new Date(extractedData.startDate),
          endDate: extractedData.endDate ? (extractedData.endDate instanceof Date ? extractedData.endDate : new Date(extractedData.endDate)) : null
        };
        
        console.log("DEBUG API - Successfully extracted data using AI");
        console.log("DEBUG API - Contract name:", demoContract.data.name);
      } catch (aiError) {
        console.error("DEBUG API - Error using AI to extract data:", aiError);
        
        // Fallback to template-based data if AI extraction fails
        demoContract.data = {
          name: `${contractType} Agreement`,
          contractNumber: `CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`,
          clientName,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
          value: 50000,
          keyTerms: [
            "Net 30 payment terms",
            "Auto-renewal clause",
            "Termination with 60 days notice",
            "Confidentiality agreement",
            "Service level agreement of 99.9% uptime"
          ]
        };
      }
    }
    
    // Return extracted data
    res.json(demoContract.data);
  } catch (error) {
    console.error("Contract extraction error:", error);
    res.status(500).json({ message: "Failed to extract contract data" });
  }
});

// Answer contract questions endpoint
router.post('/ask', async (req, res) => {
  try {
    const { question, fileName, contractTemplate, base64Data } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }
    
    console.log("DEBUG - Starting contract Q&A with question:", question);
    console.log("DEBUG - OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("DEBUG - Contract template requested:", contractTemplate);
    console.log("DEBUG - Base64 data provided:", !!base64Data);
    
    // If base64Data is provided, it means we have PDF data from the client
    // In a full implementation, we'd extract text from the PDF here
    // For now, we'll still use our contract templates but add information that
    // we're using text from the uploaded PDF
    
    let contractText = "";
    
    // Update contract template based on provided fileName
    if (fileName && contractTemplate) {
      const parts = fileName.replace('.pdf', '').split('-');
      const contractType = parts[0]?.trim() || 'SaaS';
      const clientName = parts[1]?.trim() || 'TechCorp';
      
      // Generate template with file name details
      contractText = getContractTemplate(contractType, clientName);
      
      // If we have base64 data, add a note about the uploaded PDF
      if (base64Data) {
        contractText = `[PDF UPLOADED: ${fileName}]\n\n${contractText}`;
      }
      
      // Store for later use
      demoContract.text = contractText;
      console.log("DEBUG - Generated contract text for analysis, length:", contractText.length);
    } else {
      // Use the stored demo contract text if no new data provided
      contractText = demoContract.text;
      console.log("DEBUG - Using existing contract text, length:", contractText.length);
    }
    
    try {
      // Use actual AI to answer the question with our contract text
      console.log("DEBUG - Calling answerContractQuestion...");
      const answer = await answerContractQuestion(contractText, question);
      console.log("DEBUG - Got answer from OpenAI, length:", answer?.length || 0);
      
      // Return the AI response
      res.json({ answer });
    } catch (aiError) {
      console.error("DEBUG - OpenAI API error:", aiError);
      throw aiError;
    }
  } catch (error) {
    console.error("Contract Q&A error:", error);
    res.status(500).json({ 
      message: "Failed to answer question",
      answer: "I'm sorry, I encountered an error while processing your request. Please try asking your question again."
    });
  }
});

export default router;