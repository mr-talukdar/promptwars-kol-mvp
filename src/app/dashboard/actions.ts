'use server';

import { createClient } from '@/utils/supabase/server';
import { JournalEntry } from '@/lib/types';

export async function fetchInsights() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Fetch all user entries to display logs and render the mood projection graph
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching insights:', error);
    return { error: 'Failed to load insights.' };
  }

  if (!entries || entries.length === 0) {
    return { data: null };
  }

  const latest = entries[0] as JournalEntry;
  
  return { 
    data: {
      latest,
      all: entries as JournalEntry[]
    } 
  };
}
