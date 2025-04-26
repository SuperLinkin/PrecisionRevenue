import type { VercelRequest, VercelResponse } from '@vercel/node';
import { TextAnalysisService } from '../server/services/TextAnalysisService';

const textAnalysisService = new TextAnalysisService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { text } = req.body || {};
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }
    const analysis = await textAnalysisService.analyzeContract(text);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing contract:', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  }
} 