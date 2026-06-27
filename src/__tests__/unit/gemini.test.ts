import { describe, it, expect, vi } from 'vitest';
import { inferMood, generateStressDNA, detectPatternAndRecommend } from '@/lib/gemini';

// Mock the @google/genai package properly as a class
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            mood: 'neutral',
            confidence: 0.75,
            driver: 'Exam pressure',
            percentage: 80,
            pattern: 'Stressed about exams late at night.',
            recommendation: 'Get some sleep.'
          }),
        }),
      };
    }
  };
});

describe('Gemini AI services', () => {
  it('should infer mood correctly', async () => {
    const result = await inferMood('Today was okay but stressful.');
    expect(result).toBeDefined();
    expect(result).toHaveProperty('mood');
    expect(result).toHaveProperty('confidence');
  });

  it('should generate stress DNA structure', async () => {
    const mockEntries = [
      {
        id: '1',
        user_id: 'user1',
        mood: 'stressed',
        transcript: 'Physics class is difficult.',
        inferred_mood: 'stressed',
        inferred_confidence: 0.9,
        stress_dna: [],
        hidden_pattern: '',
        recommendation: '',
        created_at: new Date().toISOString(),
      },
    ];
    const dna = await generateStressDNA(mockEntries);
    expect(Array.isArray(dna)).toBe(true);
  });

  it('should detect patterns and recommendations', async () => {
    const mockEntries = [
      {
        id: '1',
        user_id: 'user1',
        mood: 'good',
        transcript: 'Felt great studying in the morning.',
        inferred_mood: 'good',
        inferred_confidence: 0.9,
        stress_dna: [],
        hidden_pattern: '',
        recommendation: '',
        created_at: new Date().toISOString(),
      },
    ];
    const patterns = await detectPatternAndRecommend(mockEntries);
    expect(patterns).toHaveProperty('pattern');
    expect(patterns).toHaveProperty('recommendation');
  });
});
