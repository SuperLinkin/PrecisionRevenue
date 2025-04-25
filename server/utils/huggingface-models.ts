import { pipeline } from '@xenova/transformers';
import { log } from './logger';

// Initialize models
let clauseClassifier: any = null;
let revenueTriggerDetector: any = null;
let timeSeriesForecaster: any = null;

// Model configuration
const MODEL_CONFIG = {
  clauseClassifier: {
    model: 'microsoft/deberta-v3-base',
    task: 'text-classification',
    labels: ['revenue', 'performance', 'payment', 'termination', 'general']
  },
  revenueTriggerDetector: {
    model: 'microsoft/deberta-v3-base',
    task: 'token-classification',
    labels: ['B-trigger', 'I-trigger', 'O']
  },
  timeSeriesForecaster: {
    model: 'microsoft/time-series-transformer',
    task: 'time-series-forecasting'
  }
};

/**
 * Initialize the Hugging Face models
 */
export async function initializeModels() {
  try {
    log.info('Initializing Hugging Face models...');
    
    // Initialize clause classifier
    clauseClassifier = await pipeline(
      MODEL_CONFIG.clauseClassifier.task,
      MODEL_CONFIG.clauseClassifier.model
    );
    
    // Initialize revenue trigger detector
    revenueTriggerDetector = await pipeline(
      MODEL_CONFIG.revenueTriggerDetector.task,
      MODEL_CONFIG.revenueTriggerDetector.model
    );
    
    // Initialize time series forecaster
    timeSeriesForecaster = await pipeline(
      MODEL_CONFIG.timeSeriesForecaster.task,
      MODEL_CONFIG.timeSeriesForecaster.model
    );
    
    log.info('Hugging Face models initialized successfully');
  } catch (error) {
    log.error('Error initializing Hugging Face models:', error);
    throw error;
  }
}

/**
 * Classify a contract clause using the pre-trained model
 */
export async function classifyClause(text: string): Promise<{
  type: string;
  confidence: number;
}> {
  try {
    if (!clauseClassifier) {
      await initializeModels();
    }
    
    const result = await clauseClassifier(text);
    return {
      type: result[0].label,
      confidence: result[0].score
    };
  } catch (error) {
    log.error('Error classifying clause:', error);
    throw error;
  }
}

/**
 * Detect revenue triggers in contract text
 */
export async function detectRevenueTriggers(text: string): Promise<Array<{
  trigger: string;
  start: number;
  end: number;
  confidence: number;
}>> {
  try {
    if (!revenueTriggerDetector) {
      await initializeModels();
    }
    
    const results = await revenueTriggerDetector(text);
    return results
      .filter((result: any) => result.entity.startsWith('B-trigger') || result.entity.startsWith('I-trigger'))
      .map((result: any) => ({
        trigger: result.word,
        start: result.start,
        end: result.end,
        confidence: result.score
      }));
  } catch (error) {
    log.error('Error detecting revenue triggers:', error);
    throw error;
  }
}

/**
 * Forecast revenue based on historical data
 */
export async function forecastRevenue(
  historicalData: Array<{ date: string; value: number }>,
  forecastHorizon: number = 12
): Promise<Array<{
  date: string;
  forecast: number;
  lowerBound: number;
  upperBound: number;
}>> {
  try {
    if (!timeSeriesForecaster) {
      await initializeModels();
    }
    
    // Prepare data for forecasting
    const timeSeriesData = historicalData.map(d => ({
      timestamp: new Date(d.date).getTime(),
      value: d.value
    }));
    
    const forecast = await timeSeriesForecaster(timeSeriesData, {
      forecastHorizon,
      returnConfidenceIntervals: true
    });
    
    return forecast.map((f: any) => ({
      date: new Date(f.timestamp).toISOString().split('T')[0],
      forecast: f.value,
      lowerBound: f.lowerBound,
      upperBound: f.upperBound
    }));
  } catch (error) {
    log.error('Error forecasting revenue:', error);
    throw error;
  }
} 