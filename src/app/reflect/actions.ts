'use server';

import { createClient } from '@/utils/supabase/server';
import { 
  transcribeAudio, 
  inferMood, 
  generateStressDNA, 
  detectPatternAndRecommend 
} from '@/lib/gemini';
import { JournalInputSchema } from '@/lib/validators';
import { JournalEntry } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function analyzeDay(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Parse basic form data
  const mood = formData.get('mood') as string;
  let text = formData.get('text') as string;
  const audioBase64 = formData.get('audioBase64') as string;
  const mimeType = formData.get('mimeType') as string;

  if (!mood) {
    return { error: 'Please select a mood.' };
  }
  
  if (!text && !audioBase64) {
    return { error: 'Please provide either a voice recording or text journal.' };
  }

  try {
    // 1. Transcribe audio if present
    if (audioBase64) {
      text = await transcribeAudio(audioBase64, mimeType);
    }

    // Validate using Zod
    const validated = JournalInputSchema.safeParse({ mood, transcript: text });
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    // 2. Infer real mood from transcript
    const inferred = await inferMood(text);

    // Fetch historical entries for DNA and Pattern generation
    const { data: history } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(14); // Last two weeks

    // We will append the current entry (in memory) to the history for analysis
    const currentEntry = {
      mood: validated.data.mood,
      transcript: text,
      created_at: new Date().toISOString()
    } as JournalEntry;
    
    const analysisHistory = [currentEntry, ...(history || [])];

    // 3 & 4. Generate Stress DNA and Hidden Pattern concurrently
    const [stressDNA, patternData] = await Promise.all([
      generateStressDNA(analysisHistory),
      detectPatternAndRecommend(analysisHistory)
    ]);

    // Insert into Supabase
    const { error: insertError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        mood: validated.data.mood,
        transcript: text,
        inferred_mood: inferred.mood,
        inferred_confidence: inferred.confidence,
        stress_dna: stressDNA,
        hidden_pattern: patternData.pattern,
        recommendation: patternData.recommendation
      });

    if (insertError) {
      console.error('Database insertion error:', JSON.stringify(insertError, null, 2));
      return { error: `Failed to save your reflection: ${insertError.message || 'Unknown database error'}` };
    }

    revalidatePath('/dashboard');
    return { success: true };
    
  } catch (error) {
    console.error('Analysis failed:', error);
    return { error: 'Failed to analyze your day. Please try again.' };
  }
}
