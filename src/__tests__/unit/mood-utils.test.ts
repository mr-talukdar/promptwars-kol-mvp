import { describe, it, expect } from 'vitest';
import { getMoodDetails, MOODS } from '@/lib/mood-utils';

describe('mood-utils', () => {
  it('should return correct mood details for valid moods', () => {
    const great = getMoodDetails('great');
    expect(great.emoji).toBe('🌟');
    expect(great.label).toBe('Great');

    const stressed = getMoodDetails('stressed');
    expect(stressed.emoji).toBe('😥');
    expect(stressed.label).toBe('Stressed');
  });

  it('should have 5 predefined moods', () => {
    expect(MOODS.length).toBe(5);
  });
});
