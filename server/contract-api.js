// Contract API endpoints for MVP demo
const express = require('express');
const { getContractTemplate } = require('./contract-template');
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
    const { fileName } = req.body;
    
    // Generate specific contract details based on file name
    if (fileName) {
      const parts = fileName.replace('.pdf', '').split('-');
      const contractType = parts[0]?.trim() || 'SaaS';
      const clientName = parts[1]?.trim() || 'TechCorp';
      
      // Create contract text from template
      demoContract.text = getContractTemplate(contractType, clientName);
      
      // Update contract data
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
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }
    
    // Import dynamically to avoid errors if OpenAI API key is not set
    const { answerContractQuestion } = await import('./utils/openai');
    
    // Use the stored demo contract text
    const contractText = demoContract.text;
    
    // Use actual AI to answer the question with our template contract
    const answer = await answerContractQuestion(contractText, question);
    
    // Return the AI response
    res.json({ answer });
  } catch (error) {
    console.error("Contract Q&A error:", error);
    res.status(500).json({ 
      message: "Failed to answer question",
      answer: "I'm sorry, I encountered an error while processing your request. Please try asking your question again."
    });
  }
});

module.exports = router;