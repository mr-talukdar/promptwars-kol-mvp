import { z } from 'zod';

export const JournalInputSchema = z.object({
  mood: z.enum(['great', 'good', 'neutral', 'stressed', 'exhausted']),
  transcript: z.string().min(1, 'Please provide some reflections for the day.'),
});

export type JournalInput = z.infer<typeof JournalInputSchema>;
