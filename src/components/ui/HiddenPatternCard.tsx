import { Activity } from 'lucide-react';

interface HiddenPatternCardProps {
  pattern: string | null;
}

export default function HiddenPatternCard({ pattern }: HiddenPatternCardProps) {
  if (!pattern) return null;

  return (
    <div className="rounded-xl border border-border bg-accent/30 p-6 shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" aria-hidden="true" />
      
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-foreground">Hidden Pattern Detected</h3>
      </div>
      
      <div 
        className="flex-grow flex items-center"
        aria-live="polite"
      >
        <p className="text-base leading-relaxed text-foreground/90 font-medium italic">
          {"\""}{pattern}{"\""}
        </p>
      </div>
    </div>
  );
}
