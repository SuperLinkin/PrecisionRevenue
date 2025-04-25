import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/core/text_splitter";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

// Types from existing pdf-processor.ts
interface ProcessedPDFResult {
  fullText: string;
  sections: Array<{
    title: string;
    content: string;
    importance: number;
  }>;
  relevantClauses: {
    revenue: Array<{ text: string; confidence: number }>;
    performance: Array<{ text: string; confidence: number }>;
    payment: Array<{ text: string; confidence: number }>;
    termination: Array<{ text: string; confidence: number }>;
  };
  metadata: {
    pageCount: number;
    contractDate?: string;
    parties?: string[];
    totalValue?: number;
  };
}

// Initialize LangChain components
const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.3,
  maxTokens: 4000,
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 200,
  separators: ["\n\n", "\n", " ", ""],
});

// Prompt templates
const sectionAnalysisPrompt = PromptTemplate.fromTemplate(`
Analyze the following contract section and identify:
1. Section title
2. Main content
3. Importance (1-10)
4. Type (revenue, performance, payment, termination, or general)

Text:
{text}

Respond in JSON format:
{
  "title": "string",
  "content": "string",
  "importance": number,
  "type": "string"
}
`);

const metadataPrompt = PromptTemplate.fromTemplate(`
Extract the following metadata from the contract text:
1. Contract date
2. Parties involved
3. Total contract value
4. Number of pages/sections

Text:
{text}

Respond in JSON format:
{
  "contractDate": "string",
  "parties": ["string"],
  "totalValue": number,
  "pageCount": number
}
`);

const clauseAnalysisPrompt = PromptTemplate.fromTemplate(`
Analyze the following contract text and extract relevant clauses for:
1. Revenue
2. Performance
3. Payment
4. Termination

Text:
{text}

For each clause, provide:
- Text: The actual clause text
- Confidence: How confident you are this is relevant (0-1)

Respond in JSON format:
{
  "revenue": [{"text": "string", "confidence": number}],
  "performance": [{"text": "string", "confidence": number}],
  "payment": [{"text": "string", "confidence": number}],
  "termination": [{"text": "string", "confidence": number}]
}
`);

async function createTempPDFFile(buffer: Buffer): Promise<string> {
  const tempPath = join(tmpdir(), `${uuidv4()}.pdf`);
  await writeFile(tempPath, buffer);
  return tempPath;
}

async function removeTempFile(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch (error) {
    console.error('Error removing temp file:', error);
  }
}

async function analyzeChunk(chunk: Document): Promise<any> {
  try {
    // Analyze sections
    const sectionFormatted = await sectionAnalysisPrompt.format({ text: chunk.pageContent });
    const sectionResponse = await model.invoke(sectionFormatted);
    const sectionData = JSON.parse(sectionResponse.content);

    // Analyze clauses
    const clauseFormatted = await clauseAnalysisPrompt.format({ text: chunk.pageContent });
    const clauseResponse = await model.invoke(clauseFormatted);
    const clauseData = JSON.parse(clauseResponse.content);

    return {
      section: sectionData,
      clauses: clauseData
    };
  } catch (error) {
    console.error('Error analyzing chunk:', error);
    return null;
  }
}

export async function processContractWithLangChain(buffer: Buffer): Promise<ProcessedPDFResult> {
  let tempFilePath: string | null = null;

  try {
    // Create temporary file for PDFLoader
    tempFilePath = await createTempPDFFile(buffer);

    // Load and split the document
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Process all chunks with rate limiting
    const chunkResults = await Promise.all(
      splitDocs.map((doc, index) => 
        new Promise(resolve => 
          setTimeout(() => resolve(analyzeChunk(doc)), index * 1000)
        )
      )
    );

    // Extract metadata from the first chunk
    const metadataFormatted = await metadataPrompt.format({ 
      text: splitDocs[0].pageContent 
    });
    const metadataResponse = await model.invoke(metadataFormatted);
    const metadata = JSON.parse(metadataResponse.content);

    // Combine results
    const sections = chunkResults
      .filter(result => result?.section)
      .map(result => ({
        title: result.section.title,
        content: result.section.content,
        importance: result.section.importance
      }));

    const relevantClauses = {
      revenue: [],
      performance: [],
      payment: [],
      termination: []
    };

    // Combine clauses from all chunks
    chunkResults.forEach(result => {
      if (result?.clauses) {
        Object.keys(relevantClauses).forEach(type => {
          if (result.clauses[type]) {
            relevantClauses[type].push(...result.clauses[type]);
          }
        });
      }
    });

    // Remove duplicates from clauses
    Object.keys(relevantClauses).forEach(type => {
      relevantClauses[type] = Array.from(
        new Map(
          relevantClauses[type].map(clause => [clause.text, clause])
        ).values()
      );
    });

    return {
      fullText: docs.map(doc => doc.pageContent).join('\n'),
      sections,
      relevantClauses,
      metadata: {
        pageCount: docs.length,
        contractDate: metadata.contractDate,
        parties: metadata.parties,
        totalValue: metadata.totalValue
      }
    };

  } catch (error) {
    console.error('Error in LangChain processing:', error);
    throw new Error('Failed to process contract with LangChain');
  } finally {
    if (tempFilePath) {
      await removeTempFile(tempFilePath);
    }
  }
} 