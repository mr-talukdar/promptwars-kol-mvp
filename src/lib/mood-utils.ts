import { MoodType } from './types';

export const MOODS: { type: MoodType; emoji: string; label: string; colorClass: string }[] = [
  { type: 'great', emoji: '🌟', label: 'Great', colorClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { type: 'good', emoji: '😊', label: 'Good', colorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
  { type: 'neutral', emoji: '😐', label: 'Neutral', colorClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  { type: 'stressed', emoji: '😥', label: 'Stressed', colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { type: 'exhausted', emoji: '😫', label: 'Exhausted', colorClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

export function getMoodDetails(type: MoodType) {
  return MOODS.find((m) => m.type === type) || MOODS[2];
}
