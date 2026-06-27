import { Lightbulb } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: string | null;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  if (!recommendation) return null;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-950/20 p-6 shadow-sm h-full flex flex-col">
      <div className="mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
        <Lightbulb className="h-5 w-5" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Actionable Insight</h3>
      </div>
      
      <div className="flex-grow">
        <p className="text-base leading-relaxed text-foreground">
          {recommendation}
        </p>
      </div>
    </div>
  );
}
