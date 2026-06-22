import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import type { ReadingPoint, SensorMetricCrops } from '@/lib/sensor-types';
import { statusOf, statusColor, statusLabel } from '@/lib/sensor-types';
import { cn } from '@/lib/utils';
import { Droplet, Thermometer, FlaskConical, Wind } from 'lucide-react';

const icons: Record<string, typeof Droplet> = {
  ph: FlaskConical,
  temp: Thermometer,
  nitrates: Droplet,
  oxygen: Wind,
};

export function SensorSection({
  metric,
  history,
}: {
  metric: SensorMetricCrops;
  history: ReadingPoint[];
}) {
  const status = statusOf(metric);
  const color = statusColor[status];
  const Icon = icons[metric.key] ?? Droplet;
  const chartData = history.map((h) => ({
    v: h[metric.key as keyof ReadingPoint] as number,
  }));
  const gradId = `grad-${metric.key}`;

  const range = metric.max - metric.min;
  const optStart = ((metric.optimalMin - metric.min) / range) * 100;
  const optWidth = ((metric.optimalMax - metric.optimalMin) / range) * 100;
  const pos = ((metric.value - metric.min) / range) * 100;

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-9 items-center justify-center rounded-xl"
            style={{
              background: `color-mix(in oklch, ${color} 16%, transparent)`,
            }}
          >
            <Icon className="size-4.5" style={{ color }} />
          </span>
          <div className=" flex items-end gap-1.5">
            <span className="font-heading text-2xl font-bold tabular-nums tracking-tight">
              {metric.value.toFixed(metric.decimals)}
            </span>
            <span className="mb-1.5 font-mono text-sm text-muted-foreground">
              {metric.unit}
            </span>
          </div>
        </div>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
          style={{
            color,
            background: `color-mix(in oklch, ${color} 14%, transparent)`,
          }}
        >
          {statusLabel[status]}
        </span>
      </div>

      <div className="mt-3">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="absolute inset-y-0 rounded-full bg-primary/25"
            style={{ left: `${optStart}%`, width: `${optWidth}%` }}
          />
          <div
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background"
            style={{
              left: `${Math.min(98, Math.max(2, pos))}%`,
              background: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}
