import { describe, it, expect } from 'vitest';
import { JournalInputSchema } from '@/lib/validators';

describe('JournalInputSchema', () => {
  it('should validate correct journal inputs', () => {
    const result = JournalInputSchema.safeParse({
      mood: 'good',
      transcript: 'I studied mock tests today and felt fairly prepared.',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid mood types', () => {
    const result = JournalInputSchema.safeParse({
      mood: 'superb',
      transcript: 'I studied mock tests today.',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty transcripts', () => {
    const result = JournalInputSchema.safeParse({
      mood: 'neutral',
      transcript: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please provide some reflections for the day.');
    }
  });
});
