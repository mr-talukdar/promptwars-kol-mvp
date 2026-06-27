'use client';

import { useState, useMemo, useEffect } from 'react';
import { JournalEntry } from '@/lib/types';
import { TrendingUp, AlertCircle, Info, Sparkles, Brain } from 'lucide-react';

interface MoodTrendChartProps {
  entries: JournalEntry[];
}

const moodValues: Record<string, { value: number; label: string; color: string; bgClass: string }> = {
  great: { value: 5, label: 'Great', color: '#10b981', bgClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  good: { value: 4, label: 'Good', color: '#3b82f6', bgClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  neutral: { value: 3, label: 'Neutral', color: '#6b7280', bgClass: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  stressed: { value: 2, label: 'Stressed', color: '#f59e0b', bgClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  exhausted: { value: 1, label: 'Exhausted', color: '#ef4444', bgClass: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

export default function MoodTrendChart({ entries }: MoodTrendChartProps) {
  // Sort chronologically (oldest to newest) for chart plotting
  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [entries]);

  const [activeIndex, setActiveIndex] = useState<number | null>(() => {
    return sortedEntries.length > 0 ? sortedEntries.length - 1 : null;
  });

  // Keep activeIndex in bounds if sortedEntries size changes
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      if (sortedEntries.length > 0) {
        setActiveIndex(sortedEntries.length - 1);
      } else {
        setActiveIndex(null);
      }
    });
    return () => cancelAnimationFrame(handle);
  }, [sortedEntries.length]);

  // Chart setup
  const width = 800;
  const height = 300;
  const paddingX = 60;
  const paddingY = 40;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate points (memoized to avoid recalculation on hover)
  const points = useMemo(() => {
    return sortedEntries.map((entry, idx) => {
      const x =
        sortedEntries.length > 1
          ? paddingX + (idx / (sortedEntries.length - 1)) * chartWidth
          : paddingX + chartWidth / 2;

      const moodObj = moodValues[entry.mood] || moodValues.neutral;
      const y =
        paddingY +
        chartHeight -
        ((moodObj.value - 1) / 4) * chartHeight;

      return { x, y, entry, index: idx };
    });
  }, [sortedEntries, chartWidth, chartHeight, paddingX, paddingY]);

  // Construct SVG paths (memoized)
  const { linePath, areaPath } = useMemo(() => {
    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      if (points.length === 1) {
        // Just a horizontal line or point
        linePath = `M ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y}`;
        areaPath = `M ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y} L ${points[0].x + 20} ${height - paddingY} L ${points[0].x - 20} ${height - paddingY} Z`;
      } else {
        // Line path
        linePath = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          linePath += ` L ${points[i].x} ${points[i].y}`;
        }

        // Area path (closed polygon reaching the bottom of the grid)
        areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
      }
    }
    return { linePath, areaPath };
  }, [points, height, paddingY]);

  if (sortedEntries.length === 0) return null;

  const activePoint = activeIndex !== null ? points[activeIndex] : null;

  // Grid levels helper
  const levels = [
    { value: 5, label: 'Great' },
    { value: 4, label: 'Good' },
    { value: 3, label: 'Neutral' },
    { value: 2, label: 'Stressed' },
    { value: 1, label: 'Exhausted' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Chart Canvas Area */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Mood & Well-being Projection</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Showing {sortedEntries.length} reflections
          </span>
        </div>

        {/* SVG Container */}
        <div className="relative w-full overflow-x-auto select-none rounded-lg border border-border bg-muted/20 p-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[600px] h-auto overflow-visible"
          >
            {/* Gradients definitions */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines and Labels */}
            {levels.map((level) => {
              const y = paddingY + chartHeight - ((level.value - 1) / 4) * chartHeight;
              return (
                <g key={level.value} className="opacity-40">
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-medium fill-muted-foreground"
                  >
                    {level.label}
                  </text>
                </g>
              );
            })}

            {/* Area under curve */}
            {areaPath && (
              <path d={areaPath} fill="url(#chartGradient)" />
            )}

            {/* Main mood trajectory line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data points */}
            {points.map((pt) => {
              const isActive = activeIndex === pt.index;
              const moodObj = moodValues[pt.entry.mood] || moodValues.neutral;
              
              return (
                <g key={pt.entry.id} className="cursor-pointer">
                  {/* Larger invisible trigger area */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={18}
                    fill="transparent"
                    onMouseEnter={() => setActiveIndex(pt.index)}
                    onClick={() => setActiveIndex(pt.index)}
                  />
                  {/* Pulse for active node */}
                  {isActive && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={10}
                      fill={moodObj.color}
                      opacity={0.3}
                      className="animate-ping"
                    />
                  )}
                  {/* Point core */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 6 : 4}
                    fill={isActive ? 'var(--background)' : moodObj.color}
                    stroke={moodObj.color}
                    strokeWidth={isActive ? 3 : 2}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* Time / Date Axis labels (X-axis) */}
            {points.length > 0 &&
              [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]].map((pt, i) => {
                if (!pt || (i === 1 && points.length <= 2)) return null;
                const date = new Date(pt.entry.created_at);
                const dateLabel = date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <text
                    key={`${pt.entry.id}-axis-${i}`}
                    x={pt.x}
                    y={height - paddingY + 20}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-muted-foreground"
                  >
                    {dateLabel}
                  </text>
                );
              })}
          </svg>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
          <Info className="h-3.5 w-3.5" />
          Hover or tap any node to inspect that day&apos;s confidence levels, stress DNA, and hidden pattern analysis.
        </p>
      </div>

      {/* Dynamic Detail Card / Tooltip Sidebar */}
      <div className="lg:col-span-1 rounded-lg border border-border/80 bg-muted/10 p-5 flex flex-col justify-between">
        {activePoint ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {new Date(activePoint.entry.created_at).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <div className="flex items-center justify-between mt-1">
                <h4 className="text-lg font-bold text-foreground">Reflection Details</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${moodValues[activePoint.entry.mood]?.bgClass || ''}`}>
                  {moodValues[activePoint.entry.mood]?.label || activePoint.entry.mood}
                </span>
              </div>
            </div>

            {/* Inferred mood & Confidence indicator */}
            <div className="rounded-lg bg-card p-3 border border-border/60 space-y-1">
              <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                <Brain className="h-3 w-3 text-primary" /> AI INFERRED STATE
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-foreground capitalize">
                  {activePoint.entry.inferred_mood || 'Neutral'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round((activePoint.entry.inferred_confidence || 0) * 100)}% confidence
                </span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${(activePoint.entry.inferred_confidence || 0) * 100}%` }}
                />
              </div>
            </div>

            {/* Stress DNA Mini Panel */}
            {activePoint.entry.stress_dna && activePoint.entry.stress_dna.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-red-500" /> STRESS DRIVERS
                </span>
                <div className="space-y-1 bg-card p-2.5 rounded-lg border border-border/60">
                  {activePoint.entry.stress_dna.slice(0, 3).map((driver, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-foreground/80 truncate max-w-[140px]">{driver.driver}</span>
                      <span className="font-mono font-medium text-muted-foreground">{driver.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Pattern mini quote */}
            {activePoint.entry.hidden_pattern && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-500" /> HIDDEN PATTERN DETECTED
                </span>
                <p className="text-xs text-foreground/90 italic bg-accent/20 p-2.5 rounded-lg border border-primary/10 leading-relaxed">
                  {"\""}{activePoint.entry.hidden_pattern}{"\""}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <TrendingUp className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Select a data point on the graph to display detailed projections.</p>
          </div>
        )}
      </div>
    </div>
  );
}
