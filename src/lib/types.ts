export type MoodType = 'great' | 'good' | 'neutral' | 'stressed' | 'exhausted';

export interface StressDriver {
  driver: string;
  percentage: number;
}

export interface AnalysisResult {
  transcript: string;
  inferredMood: string;
  inferredConfidence: number;
  stressDNA: StressDriver[];
  hiddenPattern: string;
  recommendation: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  transcript: string;
  inferred_mood: string | null;
  inferred_confidence: number | null;
  stress_dna: StressDriver[];
  hidden_pattern: string | null;
  recommendation: string | null;
  created_at: string;
}
