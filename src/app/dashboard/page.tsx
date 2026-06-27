import { fetchInsights } from './actions';
import StressDNACard from '@/components/ui/StressDNACard';
import HiddenPatternCard from '@/components/ui/HiddenPatternCard';
import RecommendationCard from '@/components/ui/RecommendationCard';
import MoodTrendChart from '@/components/ui/MoodTrendChart';
import PastReflections from '@/components/ui/PastReflections';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function DashboardPage() {
  const result = await fetchInsights();
  
  if (result.error) {
    return (
      <main className="container mx-auto p-6 py-12">
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive" role="alert">
          {result.error}
        </div>
      </main>
    );
  }

  const data = result.data;

  // Empty state if no entries exist
  if (!data) {
    return (
      <main className="container mx-auto max-w-4xl p-6 py-12 flex flex-col items-center text-center space-y-6">
        <div className="rounded-full bg-muted p-6 mb-4">
          <ActivityPlaceholder className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">No insights yet</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We need at least one journal entry to start discovering your emotional patterns. The more you reflect, the more accurate the insights become.
        </p>
        <Link 
          href="/reflect" 
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PlusCircle className="h-5 w-5" aria-hidden="true" />
          Start First Reflection
        </Link>
      </main>
    );
  }

  const { latest, all } = data;

  const dateStr = new Date(latest.created_at).toLocaleDateString(undefined, { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <main className="container mx-auto max-w-5xl p-6 py-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights Dashboard</h1>
          <p className="text-muted-foreground mt-1">Based on your reflection from {dateStr}</p>
        </div>
        <Link 
          href="/reflect" 
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          New Reflection
        </Link>
      </div>

      {/* Mood trajectory visualization */}
      {all && all.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Mood Projections Over Time</h2>
          <MoodTrendChart entries={all} />
        </section>
      )}

      {/* Key Insights from Latest Reflection */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Latest Reflection Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Stress DNA (Takes up 1 column) */}
          <div className="lg:col-span-1">
            <StressDNACard stressDNA={latest.stress_dna} />
          </div>

          {/* Column 2 & 3: Pattern and Recommendation */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1">
              <HiddenPatternCard pattern={latest.hidden_pattern} />
            </div>
            <div className="flex-1">
              <RecommendationCard recommendation={latest.recommendation} />
            </div>
          </div>
        </div>
      </section>

      {/* Earlier Reflection Logs */}
      {all && all.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Reflection History</h2>
          <PastReflections entries={all} />
        </section>
      )}
    </main>
  );
}

function ActivityPlaceholder({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>
    </svg>
  );
}
