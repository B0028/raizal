import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import type { ReadingPoint, SensorMetric } from '@/lib/sensor-types';
import { statusOf, statusColor, statusLabel } from '@/lib/sensor-types';
import { getHistoryValues } from '@/lib/rack-metrics';
import { cn } from '@/lib/utils';
import {
  Droplet,
  Thermometer,
  FlaskConical,
  Zap,
  Sun,
  CloudRain,
  Beaker,
} from 'lucide-react';

const icons: Record<string, typeof Droplet> = {
  ph: FlaskConical,
  ec: Zap,
  water_temp: Droplet,
  ambient_temp: Thermometer,
  humidity: CloudRain,
  light: Sun,
  nutrients: Beaker,
};

export function SensorCard({
  metric,
  history,
}: {
  metric: SensorMetric;
  history: ReadingPoint[];
}) {
  const status = statusOf(metric);
  const color = statusColor[status];
  const Icon = icons[metric.key] ?? Droplet;
  const chartData = getHistoryValues(history, metric.key);
  const gradId = `grad-${metric.key}`;

  const range = metric.max - metric.min;
  const optStart = ((metric.optimalMin - metric.min) / range) * 100;
  const optWidth = ((metric.optimalMax - metric.optimalMin) / range) * 100;
  const pos = ((metric.value - metric.min) / range) * 100;

  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5">
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
          <div>
            <p className="text-sm font-medium text-foreground">
              {metric.label}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              en vivo
            </p>
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

      <div className="mt-4 flex items-end gap-1.5">
        <span className="font-heading text-4xl font-bold tabular-nums tracking-tight">
          {metric.value.toFixed(metric.decimals)}
        </span>
        <span className="mb-1.5 font-mono text-sm text-muted-foreground">
          {metric.unit}
        </span>
      </div>

      <div className="mt-3 h-12">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradId})`}
                isAnimationActive={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="font-mono text-[10px] text-muted-foreground">
              Recolectando historial…
            </p>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="absolute inset-y-0 rounded-full bg-primary/25"
            style={{ left: `${optStart}%`, width: `${optWidth}%` }}
          />
          <div
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background transition-[left] duration-700 ease-out"
            style={{
              left: `${Math.min(98, Math.max(2, pos))}%`,
              background: color,
            }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>{metric.min}</span>
          <span className={cn('text-primary')}>
            óptimo {metric.optimalMin}–{metric.optimalMax}
          </span>
          <span>{metric.max}</span>
        </div>
      </div>
    </div>
  );
}
