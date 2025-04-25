import { OpenAI } from 'openai';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';

interface ChunkLabel {
  type: string;
  confidence: number;
  metadata: Record<string, any>;
}

interface LabeledChunk {
  text: string;
  startIndex: number;
  endIndex: number;
  labels: ChunkLabel[];
  embedding: number[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Supabase client for vector storage
const supabaseClient: SupabaseClient = supabase;

// Semantic chunk types and their characteristics
const chunkTypes = {
  REVENUE_RECOGNITION: {
    keywords: ['revenue', 'recognition', 'payment terms', 'billing', 'invoice'],
    patterns: [/revenue.{0,50}recogni[sz]ed/i, /payment.{0,30}schedule/i]
  },
  PERFORMANCE_OBLIGATION: {
    keywords: ['deliverable', 'milestone', 'performance', 'obligation', 'service'],
    patterns: [/performance.{0,30}obligation/i, /delivery.{0,30}milestone/i]
  },
  PAYMENT_TERMS: {
    keywords: ['payment', 'invoice', 'billing', 'net', 'days'],
    patterns: [/net\s*\d+(\s*days)?/i, /payment.{0,30}due/i]
  },
  TERMINATION: {
    keywords: ['terminate', 'termination', 'cancellation', 'notice'],
    patterns: [/terminat.{0,50}notice/i, /cancel.{0,30}agreement/i]
  }
};

// Generate embeddings for a chunk of text
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Classify chunk using GPT-4
async function classifyChunkWithGPT(text: string): Promise<ChunkLabel[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at classifying contract clauses. Analyze the following text and identify its type and relevant metadata. Focus on revenue recognition, performance obligations, payment terms, and termination clauses."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result.labels || [];
  } catch (error) {
    console.error('Error classifying chunk with GPT:', error);
    return [];
  }
}

// Rule-based classification
function classifyChunkWithRules(text: string): ChunkLabel[] {
  const labels: ChunkLabel[] = [];

  for (const [type, characteristics] of Object.entries(chunkTypes)) {
    let confidence = 0;
    let matches = 0;

    // Check keywords
    for (const keyword of characteristics.keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        matches++;
      }
    }

    // Check patterns
    for (const pattern of characteristics.patterns) {
      if (pattern.test(text)) {
        matches += 2; // Patterns are weighted more heavily
      }
    }

    // Calculate confidence based on matches
    confidence = matches / (characteristics.keywords.length + characteristics.patterns.length * 2);

    if (confidence > 0.3) { // Threshold for including a label
      labels.push({
        type,
        confidence,
        metadata: {
          keywordMatches: matches,
          textLength: text.length
        }
      });
    }
  }

  return labels;
}

// Store chunk in vector database
async function storeChunk(chunk: LabeledChunk): Promise<void> {
  try {
    await supabaseClient.from('contract_chunks').insert({
      text: chunk.text,
      start_index: chunk.startIndex,
      end_index: chunk.endIndex,
      labels: chunk.labels,
      embedding: chunk.embedding
    });
  } catch (error) {
    console.error('Error storing chunk:', error);
    throw error;
  }
}

export async function labelChunks(chunks: Array<{text: string; startIndex: number; endIndex: number}>): Promise<LabeledChunk[]> {
  const labeledChunks: LabeledChunk[] = [];

  for (const chunk of chunks) {
    try {
      // Generate embedding
      const embedding = await generateEmbedding(chunk.text);

      // Combine rule-based and AI classification
      const ruleLabels = classifyChunkWithRules(chunk.text);
      const gptLabels = await classifyChunkWithGPT(chunk.text);

      // Merge and deduplicate labels
      const allLabels = [...ruleLabels];
      for (const gptLabel of gptLabels) {
        const existingLabel = allLabels.find(l => l.type === gptLabel.type);
        if (existingLabel) {
          existingLabel.confidence = Math.max(existingLabel.confidence, gptLabel.confidence);
          existingLabel.metadata = { ...existingLabel.metadata, ...gptLabel.metadata };
        } else {
          allLabels.push(gptLabel);
        }
      }

      const labeledChunk: LabeledChunk = {
        ...chunk,
        labels: allLabels,
        embedding
      };

      // Store in vector database
      await storeChunk(labeledChunk);

      labeledChunks.push(labeledChunk);
    } catch (error) {
      console.error(`Error processing chunk: ${error}`);
      // Continue with next chunk
      continue;
    }
  }

  return labeledChunks;
} 