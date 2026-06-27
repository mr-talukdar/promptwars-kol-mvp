'use client';

import { MoodType } from '@/lib/types';
import { MOODS } from '@/lib/mood-utils';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, mood: MoodType, index: number) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect(mood);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % MOODS.length;
      document.getElementById(`mood-btn-${nextIndex}`)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + MOODS.length) % MOODS.length;
      document.getElementById(`mood-btn-${prevIndex}`)?.focus();
    }
  };

  return (
    <div 
      className="w-full"
      role="radiogroup" 
      aria-label="Select your mood"
    >
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {MOODS.map((mood, index) => {
          const isSelected = selectedMood === mood.type;
          
          return (
            <button
              key={mood.type}
              id={`mood-btn-${index}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (selectedMood === null && index === 2) ? 0 : -1}
              onClick={() => onSelect(mood.type)}
              onKeyDown={(e) => handleKeyDown(e, mood.type, index)}
              className={`
                flex flex-col items-center justify-center gap-2 rounded-xl p-3 sm:p-4 transition-all
                min-h-[44px] min-w-[44px]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-accent' : 'hover:bg-muted bg-card border border-border shadow-sm'}
              `}
              aria-label={mood.label}
            >
              <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
                {mood.emoji}
              </span>
              <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
