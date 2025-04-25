import { pipeline } from '@xenova/transformers';

export class TextAnalysisService {
  private classifier: any;
  private summarizer: any;

  constructor() {
    this.initializeModels();
  }

  private async initializeModels() {
    try {
      // Initialize the sentiment analysis pipeline
      this.classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      
      // Initialize the summarization pipeline
      this.summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    } catch (error) {
      console.error('Error initializing models:', error);
      throw error;
    }
  }

  public async analyzeContract(text: string) {
    try {
      // Perform sentiment analysis
      const sentimentResult = await this.classifier(text);
      
      // Generate summary
      const summaryResult = await this.summarizer(text, {
        max_length: 130,
        min_length: 30
      });

      return {
        sentiment: sentimentResult[0],
        summary: summaryResult[0].summary_text,
        metadata: {
          textLength: text.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error analyzing contract:', error);
      throw error;
    }
  }
} 