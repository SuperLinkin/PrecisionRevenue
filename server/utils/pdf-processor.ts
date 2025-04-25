import { createWorker, Worker } from 'tesseract.js';
import { default as pdfParse } from 'pdf-parse';
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import { Buffer } from 'buffer';
import stringSimilarity from 'string-similarity';
import * as fs from 'fs';
import { OpenAI } from 'openai';
// import { processContractWithLangChain } from './langchain-processor';

interface SectionAnalysis {
  importance: number;
  riskLevel: string;
  keyTerms: string[];
  keywords?: string[];
}

interface PDFSection {
  pageNumber: number;
  title: string;
  content: string;
  type?: string;
  subSections: PDFSection[];
  importance: number;
  analysis: SectionAnalysis;
}

interface PDFMetadata {
  numPages: number;
  title?: string;
  author?: string;
  keywords?: string[];
  version?: string;
  creationDate?: Date;
  modificationDate?: Date;
  documentType: string;
  processingDate: string;
}

interface RevenueClause {
  text: string;
  type: 'revenue';
  importance: number;
  relatedClauses: string[];
  complianceNotes: string[];
}

interface PerformanceClause {
  text: string;
  type: 'performance';
  importance: number;
  dependencies: string[];
  metrics: string[];
}

interface PaymentClause {
  text: string;
  type: 'payment';
  importance: number;
  schedule: string;
  conditions: string[];
}

interface TerminationClause {
  text: string;
  type: 'termination';
  importance: number;
  conditions: string[];
  impact: string[];
}

interface ProcessedPDF {
  fullText: string;
  sections: PDFSection[];
  metadata: PDFMetadata;
  relevantClauses: {
    revenue: RevenueClause[];
    performance: PerformanceClause[];
    payment: PaymentClause[];
    termination: TerminationClause[];
  };
  analysis: {
    structure: {
      completeness: number;
      organization: number;
      clarity: number;
    };
    riskAreas: {
      section: string;
      risk: string;
      severity: 'low' | 'medium' | 'high';
      mitigation: string[];
    }[];
    compliance: {
      requirements: string[];
      gaps: string[];
      recommendations: string[];
    };
  };
}

interface ProcessedPDFResult {
  success: boolean;
  sections: PDFSection[];
  error: string | null;
}

interface ContractAnalysis {
  summary: {
    totalSections: number;
    revenueClauses: number;
    performanceClauses: number;
    paymentClauses: number;
    riskLevel: 'low' | 'medium' | 'high';
    keyTerms: string[];
  };
  revenueSummary: {
    revenueRecognitionMethod: string;
    paymentTerms: string;
    performanceObligations: string[];
  };
}

function extractContractDate(text: string): string | undefined {
  const datePatterns = [
    /(?:dated|effective date|as of)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December),?\s+\d{4})/i,
    /(?:dated|effective date|as of)\s+(\d{2}\/\d{2}\/\d{4})/i,
    /(?:dated|effective date|as of)\s+(\d{4}-\d{2}-\d{2})/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
}

function extractParties(text: string): string[] | undefined {
  const parties: string[] = [];
  
  const partyPatterns = [
    /between\s+([^,]+(?:LLC|Inc\.|Corporation|Ltd\.|Limited|Company))/i,
    /(?:THIS AGREEMENT|AGREEMENT) is made .*? between ([^,]+) and ([^,\.]+)/i,
    /PARTIES:\s*\n\s*1\.\s*([^\n]+)\n\s*2\.\s*([^\n]+)/i
  ];

  for (const pattern of partyPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      if (match[1]) parties.push(match[1].trim());
      if (match[2]) parties.push(match[2].trim());
    }
  }

  return parties.length > 0 ? parties : undefined;
}

function extractTotalValue(text: string): number | undefined {
  const valuePatterns = [
    /total\s+value\s+of\s+(?:USD|US\$|\$)\s*([\d,]+(?:\.\d{2})?)/i,
    /contract\s+value\s*(?:of)?\s*(?:USD|US\$|\$)\s*([\d,]+(?:\.\d{2})?)/i,
    /consideration\s+of\s+(?:USD|US\$|\$)\s*([\d,]+(?:\.\d{2})?)/i
  ];

  for (const pattern of valuePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }
  return undefined;
}

async function cleanTextWithAI(text: string): Promise<string> {
  try {
    const prompt = `Clean and structure the following contract text, fixing any OCR errors, removing irrelevant information, and ensuring proper formatting:

${text}

Please return only the cleaned text without any explanations or additional formatting.`;

    const completion = await new OpenAI().chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a contract analysis expert. Your task is to clean and structure contract text, fixing OCR errors and formatting issues while preserving all important legal and business terms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    return completion.choices[0].message.content || text;
  } catch (error) {
    console.error('AI cleaning error:', error);
    return text; // Return original text if AI cleaning fails
  }
}

async function extractTextWithAI(buffer: Buffer): Promise<string> {
  try {
    // First try to extract text using pdf-parse
    let extractedText = '';
    try {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } catch (error) {
      console.error('PDF parsing error in AI extraction:', error);
    }
    // Use GPT-4 to clean and structure the text
    const completion = await new OpenAI().chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a contract analysis expert. Clean and structure the following contract text, fixing any OCR errors and maintaining proper formatting."
        },
        {
          role: "user",
          content: extractedText || buffer.toString('utf-8')
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('Failed to extract text using AI');
  }
}

async function performOCR(buffer: Buffer): Promise<string> {
  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR error:', error);
    return '';
  }
}

// Export the processPDFContract function
export async function processPDFContract(buffer: Buffer): Promise<{
  success: boolean;
  message?: string;
  fullText: string;
  sections: PDFSection[];
  relevantClauses: {
    revenue: Array<{ text: string; confidence: number }>;
    performance: Array<{ text: string; confidence: number }>;
    payment: Array<{ text: string; confidence: number }>;
    termination: Array<{ text: string; confidence: number }>;
  };
  error?: any;
}> {
  try {
    const text = await extractTextFromPDF(buffer);
    if (!text) {
      return {
        success: false,
        message: 'Failed to extract text from PDF',
        fullText: '',
        sections: [],
        relevantClauses: {
          revenue: [],
          performance: [],
          payment: [],
          termination: []
        }
      };
    }

    const sections = extractSections(text);
    
    // Extract relevant clauses
    const relevantClauses = {
      revenue: identifyRevenueClauses(text),
      performance: identifyPerformanceClauses(text),
      payment: identifyPaymentClauses(text),
      termination: identifyTerminationClauses(text)
    };

    return {
      success: true,
      fullText: text,
      sections,
      relevantClauses
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error processing PDF contract',
      error,
      fullText: '',
      sections: [],
      relevantClauses: {
        revenue: [],
        performance: [],
        payment: [],
        termination: []
      }
    };
  }
}

async function analyzeWithAzure(buffer: Buffer): Promise<any> {
  try {
    const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
    const apiKey = process.env.AZURE_FORM_RECOGNIZER_KEY;

    if (!endpoint || !apiKey) {
      throw new Error('Azure Form Recognizer credentials not configured');
    }

    const client = new DocumentAnalysisClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );

    const poller = await client.beginAnalyzeDocument(
      "prebuilt-document",
      buffer
    );

    const result = await poller.pollUntilDone();

    // Extract key information
    const contractDate = result.documents?.[0]?.fields?.['contractDate']?.content;
    const parties = result.documents?.[0]?.fields?.['parties']?.content;
    const totalValue = result.documents?.[0]?.fields?.['totalValue']?.content;

    return {
      contractDate,
      parties: parties ? [parties] : undefined,
      totalValue: totalValue ? parseFloat(totalValue) : undefined
    };
  } catch (error) {
    console.error('Azure Form Recognizer error:', error);
    return {};
  }
}

function extractSections(text: string): PDFSection[] {
  const sections: PDFSection[] = [];
  const sectionRegex = /(?:ARTICLE|Section)\s+\d+[.:]\s*(.*?)(?=(?:ARTICLE|Section)\s+\d+|$)/gm;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[0].substring(match[0].indexOf('\n')).trim();
    
    const section: PDFSection = {
      pageNumber: 1, // Default to 1 since we can't determine actual page number from text
      title,
      content,
      type: 'other',
      subSections: [],
      importance: calculateImportance(content),
      analysis: {
        importance: calculateImportance(content),
        riskLevel: determineRiskLevel(content),
        keyTerms: extractKeyTerms(content),
        keywords: content.toLowerCase().match(/\b\w+\b/g) || []
      }
    };
    
    section.type = determineType(section);
    sections.push(section);
  }

  return sections;
}

function calculateImportance(content: string): number {
  const keywordWeight = content.split(/\b(shall|must|required|essential)\b/i).length - 1;
  const lengthWeight = Math.min(content.length / 1000, 1);
  return Math.min((keywordWeight * 0.6 + lengthWeight * 0.4) * 10, 10);
}

function identifyRevenueClauses(text: string): Array<{ text: string; confidence: number }> {
  const revenueKeywords = ['payment', 'fee', 'compensation', 'price', 'revenue', 'consideration'];
  return extractClausesWithKeywords(text, revenueKeywords);
}

function identifyPerformanceClauses(text: string): Array<{ text: string; confidence: number }> {
  const performanceKeywords = ['performance', 'obligation', 'delivery', 'service', 'milestone'];
  return extractClausesWithKeywords(text, performanceKeywords);
}

function identifyPaymentClauses(text: string): Array<{ text: string; confidence: number }> {
  const paymentKeywords = ['payment', 'invoice', 'billing', 'fee', 'price'];
  return extractClausesWithKeywords(text, paymentKeywords);
}

function identifyTerminationClauses(text: string): Array<{ text: string; confidence: number }> {
  const terminationKeywords = ['termination', 'cancellation', 'expiration', 'end'];
  return extractClausesWithKeywords(text, terminationKeywords);
}

function extractClausesWithKeywords(text: string, keywords: string[]): Array<{ text: string; confidence: number }> {
  const clauses: Array<{ text: string; confidence: number }> = [];
  const sentences = text.split(/[.!?]+/);

  for (const sentence of sentences) {
    const matchedKeywords = keywords.filter(keyword => 
      sentence.toLowerCase().includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      clauses.push({
        text: sentence.trim(),
        confidence: matchedKeywords.length / keywords.length
      });
    }
  }

  return clauses;
}

function extractSectionsHierarchical(text: string): PDFSection[] {
  const sections: PDFSection[] = [];
  const sectionStack: PDFSection[] = [];
  
  // Enhanced pattern matching for hierarchical sections
  const patterns = [
    { regex: /ARTICLE \d+[.:]\s*(.*?)(?=ARTICLE \d+|$)/gi, level: 0 },
    { regex: /Section \d+[.:]\s*(.*?)(?=Section \d+|$)/gi, level: 1 },
    { regex: /\d+[.:]\s*(.*?)(?=\d+[.:]|$)/gi, level: 2 },
    { regex: /[A-Z][A-Za-z\s]+:(?:(?!\n\n).)*$/gm, level: 3 }
  ];

  for (const { regex, level } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const content = match[0];
      const title = match[1]?.trim() || '';
      
      const section: PDFSection = {
        title,
        content,
        pageNumber: 1,
        type: determineSectionType(content),
        importance: calculateImportance(content),
        subSections: [],
        analysis: {
          importance: calculateImportance(content),
          keywords: content.toLowerCase().match(/\b\w+\b/g) || [],
          riskLevel: assessRiskLevel(content),
          keyTerms: extractKeyTerms(content)
        }
      };

      // Handle section hierarchy
      while (sectionStack.length > level) {
        sectionStack.pop();
      }

      if (sectionStack.length === 0) {
        sections.push(section);
      } else {
        const parent = sectionStack[sectionStack.length - 1];
        parent.subSections.push(section);
      }

      sectionStack.push(section);
    }
  }
  
  return sections;
}

function determineSectionType(content: string): 'revenue' | 'performance' | 'payment' | 'termination' | 'other' {
  type KeywordCategories = {
    revenue: string[];
    performance: string[];
    payment: string[];
    termination: string[];
  };

  const keywords: KeywordCategories = {
    revenue: ['revenue', 'payment', 'fee', 'price', 'compensation'],
    performance: ['performance', 'delivery', 'service', 'obligation'],
    payment: ['payment', 'invoice', 'billing'],
    termination: ['termination', 'cancellation', 'expiration']
  };

  const counts: Record<keyof KeywordCategories, number> = {
    revenue: 0,
    performance: 0,
    payment: 0,
    termination: 0
  };

  const lowerContent = content.toLowerCase();
  
  for (const [type, typeKeywords] of Object.entries(keywords) as [keyof KeywordCategories, string[]][]) {
    counts[type] = typeKeywords.reduce((count, keyword) => 
      count + (lowerContent.match(new RegExp(`\\b${keyword}\\b`, 'gi'))?.length || 0), 0
    );
  }

  const maxType = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as keyof KeywordCategories;
  return counts[maxType] > 0 ? maxType : 'other';
}

// Extracts key legal terms from content
function extractKeyTerms(content: string): string[] {
  const legalTerms = new Set<string>();
  const legalTermPattern = /\b(agreement|contract|party|clause|term|condition|obligation|right|liability|indemnity|warranty|termination|breach|dispute|governing law|jurisdiction|confidential|intellectual property|shall|must|will not|required|obligation|warranty|indemnity|liability|termination|confidential|exclusive|payment)\b/gi;
  
  const matches = Array.from(content.matchAll(legalTermPattern));
  for (const match of matches) {
    legalTerms.add(match[0].toLowerCase());
  }
  
  return Array.from(legalTerms);
}

function assessRiskLevel(content: string): 'low' | 'medium' | 'high' {
  const riskKeywords = {
    high: ['penalty', 'termination', 'liability', 'breach', 'damages', 'legal action'],
    medium: ['deadline', 'requirement', 'obligation', 'compliance', 'restriction'],
    low: ['notice', 'amendment', 'communication', 'cooperation']
  };

  const contentLower = content.toLowerCase();
  const highRiskCount = riskKeywords.high.filter(word => contentLower.includes(word)).length;
  const mediumRiskCount = riskKeywords.medium.filter(word => contentLower.includes(word)).length;

  if (highRiskCount >= 2) return 'high';
  if (mediumRiskCount >= 3 || highRiskCount === 1) return 'medium';
  return 'low';
}

function analyzeComplianceImpact(content: string): string[] {
  const impacts: string[] = [];
  
  // IFRS 15 / ASC 606 compliance patterns
  const compliancePatterns = [
    { pattern: /performance obligation/i, impact: 'Requires identification of distinct performance obligations' },
    { pattern: /variable consideration/i, impact: 'Requires constraint assessment for variable consideration' },
    { pattern: /significant financing/i, impact: 'Time value of money considerations required' },
    { pattern: /stand-alone selling price/i, impact: 'Allocation of transaction price analysis needed' }
  ];

  compliancePatterns.forEach(({ pattern, impact }) => {
    if (pattern.test(content)) {
      impacts.push(impact);
    }
  });

  return impacts;
}

function findCrossReferences(content: string): string[] {
  const references: string[] = [];
  
  // Patterns for cross-references
  const patterns = [
    /pursuant to (?:Section|Article|Clause) ([^,.;]+)/gi,
    /reference to (?:Section|Article|Clause) ([^,.;]+)/gi,
    /as defined in (?:Section|Article|Clause) ([^,.;]+)/gi
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      references.push(match[1].trim());
    }
  });

  return references;
}

function analyzeDocument(text: string, sections: PDFSection[]): ProcessedPDF['analysis'] {
  return {
    structure: {
      completeness: calculateCompleteness(sections),
      organization: calculateOrganization(sections),
      clarity: calculateClarity(text)
    },
    riskAreas: identifyRiskAreas(sections),
    compliance: {
      requirements: extractRequirements(sections),
      gaps: identifyGaps(sections),
      recommendations: generateRecommendations(sections)
    }
  };
}

function calculateCompleteness(sections: PDFSection[]): number {
  // Implementation for calculating completeness
  return 0; // Placeholder
}

function calculateOrganization(sections: PDFSection[]): number {
  // Implementation for calculating organization
  return 0; // Placeholder
}

function calculateClarity(text: string): number {
  // Implementation for calculating clarity
  return 0; // Placeholder
}

function identifyRiskAreas(sections: PDFSection[]): Array<{
  section: string;
  risk: string;
  severity: 'low' | 'medium' | 'high';
  mitigation: string[];
}> {
  // Implementation for identifying risk areas
  return []; // Placeholder
}

function extractRequirements(sections: PDFSection[]): string[] {
  // Implementation for extracting requirements
  return []; // Placeholder
}

function identifyGaps(sections: PDFSection[]): string[] {
  // Implementation for identifying compliance gaps
  return []; // Placeholder
}

function generateRecommendations(sections: PDFSection[]): string[] {
  // Implementation for generating recommendations
  return []; // Placeholder
}

// Helper functions for clause identification
function isRevenueClause(section: PDFSection): boolean {
  const keywords = ['revenue', 'payment', 'compensation', 'fee', 'pricing'];
  return keywords.some(keyword => 
    section.title.toLowerCase().includes(keyword) || 
    section.content.toLowerCase().includes(keyword)
  );
}

function isPerformanceClause(section: PDFSection): boolean {
  const keywords = ['performance', 'service', 'delivery', 'obligation'];
  return keywords.some(keyword => 
    section.title.toLowerCase().includes(keyword) || 
    section.content.toLowerCase().includes(keyword)
  );
}

function isPaymentClause(section: PDFSection): boolean {
  const keywords = ['payment', 'invoice', 'billing', 'fee'];
  return keywords.some(keyword => 
    section.title.toLowerCase().includes(keyword) || 
    section.content.toLowerCase().includes(keyword)
  );
}

function isTerminationClause(section: PDFSection): boolean {
  const keywords = ['termination', 'cancellation', 'end', 'expire'];
  return keywords.some(keyword => 
    section.title.toLowerCase().includes(keyword) || 
    section.content.toLowerCase().includes(keyword)
  );
}

function determineType(section: PDFSection): string {
  if (isRevenueClause(section)) return 'revenue';
  if (isPerformanceClause(section)) return 'performance';
  if (isPaymentClause(section)) return 'payment';
  if (isTerminationClause(section)) return 'termination';
  return 'other';
}

function extractKeywords(content: string): string[] {
  const keywordRegex = /\b(?:revenue|payment|performance|termination|obligation|deadline|penalty|compliance|requirement|liability)\b/gi;
  const matches = content.match(keywordRegex) || [];
  return Array.from(new Set(matches.map(m => m.toLowerCase())));
}

function determineRiskLevel(content: string): 'low' | 'medium' | 'high' {
  const riskKeywords = {
    high: ['penalty', 'termination', 'liability', 'breach', 'damages', 'legal action'],
    medium: ['deadline', 'requirement', 'obligation', 'compliance', 'restriction'],
    low: ['notice', 'amendment', 'communication', 'cooperation']
  };

  const contentLower = content.toLowerCase();
  const highRiskCount = riskKeywords.high.filter(word => contentLower.includes(word)).length;
  const mediumRiskCount = riskKeywords.medium.filter(word => contentLower.includes(word)).length;

  if (highRiskCount >= 2) return 'high';
  if (mediumRiskCount >= 3 || highRiskCount === 1) return 'medium';
  return 'low';
}

async function analyzeContractContent(content: string): Promise<ContractAnalysis> {
  const sections = extractSections(content);
  const revenueClauses = sections.filter(section => isRevenueClause(section));
  const performanceClauses = sections.filter(section => isPerformanceClause(section));
  const paymentClauses = sections.filter(section => isPaymentClause(section));

  const summary = {
    totalSections: sections.length,
    revenueClauses: revenueClauses.length,
    performanceClauses: performanceClauses.length,
    paymentClauses: paymentClauses.length,
    riskLevel: determineRiskLevel(content),
    keyTerms: extractKeywords(content)
  };

  const revenueSummary = {
    revenueRecognitionMethod: identifyRevenueRecognitionMethod(content),
    paymentTerms: identifyPaymentTerms(content),
    performanceObligations: identifyPerformanceObligations(content)
  };

  return {
    summary,
    revenueSummary
  };
}

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(Buffer.from(pdfBuffer));
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}

function identifyRevenueRecognitionMethod(content: string): string {
  const methods = {
    'point in time': /point[- ]in[- ]time|upon delivery|upon completion/gi,
    'over time': /over[- ]time|percentage[- ]of[- ]completion|milestone/gi,
    'usage-based': /usage[- ]based|consumption|per[- ]use/gi
  };

  for (const [method, pattern] of Object.entries(methods)) {
    if (content.match(pattern)) {
      return method;
    }
  }

  return 'not specified';
}

function identifyPaymentTerms(content: string): string {
  const terms = content.match(/payment.{0,50}(due|within|net).{0,30}days/gi);
  return terms ? terms[0] : 'not specified';
}

function identifyPerformanceObligations(content: string): string[] {
  const obligations: string[] = [];
  const patterns = [
    /shall (provide|deliver|perform|complete|maintain|support)/gi,
    /responsible for (providing|delivering|performing|completing|maintaining|supporting)/gi,
    /obligations?.*(include|consist|comprise)/gi
  ];

  patterns.forEach(pattern => {
    const matches = Array.from(content.matchAll(pattern));
    matches.forEach(match => {
      if (match[0]) {
        obligations.push(match[0].trim());
      }
    });
  });
  return Array.from(new Set(obligations));
}

function analyzeSectionContent(content: string): SectionAnalysis {
  const keyTerms = extractKeyTerms(content);
  const keywords = content.toLowerCase().match(/\b\w+\b/g) || [];
  const importance = calculateImportance(content);
  const riskLevel = determineRiskLevel(content);

  return {
    importance,
    riskLevel,
    keyTerms,
    keywords
  };
} 