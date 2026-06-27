'use client';

import { useState } from 'react';
import { JournalEntry } from '@/lib/types';
import { Calendar, ChevronDown, ChevronUp, FileText, BrainCircuit, Sparkles } from 'lucide-react';

interface PastReflectionsProps {
  entries: JournalEntry[];
}

const moodValues: Record<string, { label: string; bgClass: string }> = {
  great: { label: 'Great', bgClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  good: { label: 'Good', bgClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  neutral: { label: 'Neutral', bgClass: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  stressed: { label: 'Stressed', bgClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  exhausted: { label: 'Exhausted', bgClass: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

export default function PastReflections({ entries }: PastReflectionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (entries.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Past Reflections Log</h3>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const dateStr = new Date(entry.created_at).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          const timeStr = new Date(entry.created_at).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          });

          const moodObj = moodValues[entry.mood] || { label: entry.mood, bgClass: 'bg-muted text-muted-foreground border-border' };

          return (
            <div
              key={entry.id}
              className="group rounded-lg border border-border/60 hover:border-border transition-colors duration-200"
            >
              {/* Header/Summary Line */}
              <div
                onClick={() => toggleExpand(entry.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleExpand(entry.id);
                  }
                }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-lg"
                role="button"
                aria-expanded={isExpanded}
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm sm:text-base flex items-baseline gap-2">
                      {dateStr}
                      <span className="text-xs font-normal text-muted-foreground">{timeStr}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[280px] sm:max-w-md">
                      {entry.transcript}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Reported:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${moodObj.bgClass}`}>
                      {moodObj.label}
                    </span>
                  </div>
                  {entry.inferred_mood && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Inferred:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${moodValues[entry.inferred_mood]?.bgClass || 'bg-muted text-muted-foreground'}`}>
                        {entry.inferred_mood}
                      </span>
                    </div>
                  )}
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors ml-1">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-border/40 bg-muted/10 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Journal Transcript
                    </span>
                    <p className="text-sm leading-relaxed text-foreground bg-card p-3 rounded-lg border border-border/40 whitespace-pre-wrap">
                      {entry.transcript}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Inferred mood deep-dive */}
                    {entry.inferred_mood && (
                      <div className="rounded-lg bg-card p-3 border border-border/60 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <BrainCircuit className="h-4 w-4 text-primary" />
                          <span>AI Mood Inference Analysis</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-semibold capitalize text-foreground">
                            {entry.inferred_mood}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {Math.round((entry.inferred_confidence || 0) * 100)}% Match Confidence
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${(entry.inferred_confidence || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Hidden pattern detail */}
                    {entry.hidden_pattern && (
                      <div className="rounded-lg bg-card p-3 border border-border/60 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <Sparkles className="h-4 w-4 text-indigo-500" />
                          <span>Hidden Pattern Detected</span>
                        </div>
                        <p className="text-xs italic text-foreground/90 leading-relaxed bg-accent/20 p-2 rounded-md border border-primary/15">
                          {"\""}{entry.hidden_pattern}{"\""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
