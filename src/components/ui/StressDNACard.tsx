import { StressDriver } from '@/lib/types';

interface StressDNACardProps {
  stressDNA: StressDriver[];
}

export default function StressDNACard({ stressDNA }: StressDNACardProps) {
  if (!stressDNA || stressDNA.length === 0) {
    return null;
  }

  // Sort by percentage descending
  const sortedDNA = [...stressDNA].sort((a, b) => b.percentage - a.percentage);

  // Helper to get color intensity based on percentage
  const getColorClass = (percentage: number) => {
    if (percentage >= 40) return 'bg-red-500';
    if (percentage >= 25) return 'bg-orange-500';
    if (percentage >= 15) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Stress DNA</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your recurring sources of emotional strain.
        </p>
      </div>

      <div className="space-y-5">
        {sortedDNA.map((driver) => (
          <div key={driver.driver} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{driver.driver}</span>
              <span className="font-mono text-muted-foreground" aria-hidden="true">{driver.percentage}%</span>
            </div>
            
            {/* Accessible progress bar */}
            <div 
              className="h-2.5 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={driver.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${driver.driver} accounts for ${driver.percentage} percent of your stress`}
            >
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${getColorClass(driver.percentage)}`}
                style={{ width: `${driver.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
