import { OpenAI } from '@langchain/openai';
import { supabase } from '../supabase';
import { log } from '../utils/logger';
import { PDFParser } from 'pdf-parse';
import { z } from 'zod';

// Schema for contract structure validation
const ContractSectionSchema = z.object({
  heading: z.string(),
  content: z.string(),
  subsections: z.array(z.lazy(() => ContractSectionSchema)).optional(),
});

type ContractSection = z.infer<typeof ContractSectionSchema>;

export class ContractAnalysisService {
  private openai: OpenAI;
  private readonly CHUNK_SIZE = 1000;
  private readonly CHUNK_OVERLAP = 200;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeContract(pdfBuffer: Buffer): Promise<any> {
    try {
      // Parse PDF
      const pdfData = await this.parsePDF(pdfBuffer);
      if (!pdfData) {
        throw new Error('Failed to parse PDF');
      }

      // Validate contract structure
      const sections = this.extractSections(pdfData.text);
      const validatedSections = this.validateContractStructure(sections);

      // Process each section
      const analysisResults = await Promise.all(
        validatedSections.map(section => this.processSection(section))
      );

      return {
        sections: validatedSections,
        analysis: analysisResults,
      };
    } catch (error) {
      log.error('Error analyzing contract:', error);
      throw error;
    }
  }

  private async parsePDF(buffer: Buffer): Promise<{ text: string } | null> {
    try {
      const data = await PDFParser(buffer);
      return { text: data.text };
    } catch (error) {
      log.error('Error parsing PDF:', error);
      return null;
    }
  }

  private extractSections(text: string): ContractSection[] {
    // Split text into sections based on headings
    const sections: ContractSection[] = [];
    const lines = text.split('\n');
    let currentSection: ContractSection | null = null;

    for (const line of lines) {
      if (this.isHeading(line)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          heading: line.trim(),
          content: '',
          subsections: [],
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  private isHeading(line: string): boolean {
    // Simple heuristic for heading detection
    return line.length < 100 && /^[A-Z][A-Za-z\s]{3,}$/.test(line.trim());
  }

  private validateContractStructure(sections: ContractSection[]): ContractSection[] {
    try {
      return z.array(ContractSectionSchema).parse(sections);
    } catch (error) {
      log.error('Contract structure validation failed:', error);
      throw new Error('Invalid contract structure');
    }
  }

  private async processSection(section: ContractSection): Promise<any> {
    // Create embeddings for the section
    const chunks = this.createChunks(section.content);
    const embeddings = await Promise.all(
      chunks.map(chunk => this.createEmbedding(chunk))
    );

    // Store embeddings in Supabase
    await this.storeEmbeddings(section, chunks, embeddings);

    // Analyze section using Langchain
    return this.analyzeSectionWithLangchain(section);
  }

  private createChunks(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + this.CHUNK_SIZE, text.length);
      chunks.push(text.slice(start, end));
      start = end - this.CHUNK_OVERLAP;
    }

    return chunks;
  }

  private async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  }

  private async storeEmbeddings(
    section: ContractSection,
    chunks: string[],
    embeddings: number[][]
  ): Promise<void> {
    const { error } = await supabase.from('contract_clauses').insert(
      chunks.map((chunk, i) => ({
        clause_text: chunk,
        section_heading: section.heading,
        embedding: embeddings[i],
        metadata: {
          section: section.heading,
          chunk_index: i,
        },
      }))
    );

    if (error) {
      log.error('Error storing embeddings:', error);
      throw error;
    }
  }

  private async analyzeSectionWithLangchain(section: ContractSection): Promise<any> {
    // Implement Langchain analysis here
    // This is a placeholder for the actual implementation
    return {
      heading: section.heading,
      summary: 'Section analysis placeholder',
      key_points: [],
      risks: [],
    };
  }
} 