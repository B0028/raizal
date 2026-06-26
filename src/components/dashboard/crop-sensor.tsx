import type { SensorMetric } from '@/lib/sensor-types';
import { statusOf, statusColor, statusLabel } from '@/lib/sensor-types';
import { cn } from '@/lib/utils';
import {
  Droplet,
  Thermometer,
  FlaskConical,
  Zap,
  Sun,
  CloudRain,
  Beaker,
  Unplug,
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

function SensorBar({ metric }: { metric: SensorMetric }) {
  const status = statusOf(metric);
  const color = statusColor[status];
  const Icon = icons[metric.key] ?? Droplet;

  const range = metric.max - metric.min;
  const optStart = ((metric.optimalMin - metric.min) / range) * 100;
  const optWidth = ((metric.optimalMax - metric.optimalMin) / range) * 100;
  const pos = ((metric.value - metric.min) / range) * 100;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <Icon className="size-2.5 shrink-0 sm:size-3" style={{ color }} />
          <span className="truncate font-mono text-[8px] text-muted-foreground sm:text-[9px]">
            {metric.label}
          </span>
        </div>
        <div className="flex shrink-0 items-baseline gap-1">
          <span
            className="font-heading text-[10px] font-bold tabular-nums sm:text-xs"
            style={{ color }}
          >
            {metric.value.toFixed(metric.decimals)}
          </span>
          <span className="font-mono text-[8px] text-muted-foreground sm:text-[9px]">
            {metric.unit}
          </span>
          <span
            className="font-mono text-[8px] font-semibold sm:text-[9px]"
            style={{ color }}
          >
            {statusLabel[status]}
          </span>
        </div>
      </div>

      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/10 sm:h-2">
        <div
          className="absolute inset-y-0 rounded-full bg-primary/25"
          style={{ left: `${optStart}%`, width: `${optWidth}%` }}
        />
        <div
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background transition-[left] duration-700 ease-out sm:size-2.5"
          style={{
            left: `${Math.min(98, Math.max(2, pos))}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function SensorChip({ metric }: { metric: SensorMetric }) {
  const status = statusOf(metric);
  const color = statusColor[status];
  const Icon = icons[metric.key] ?? Droplet;

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg px-1.5 py-1 sm:gap-2 sm:px-2 sm:py-1.5"
      style={{
        background: `color-mix(in oklch, ${color} 12%, transparent)`,
      }}
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full sm:size-7"
        style={{
          background: `color-mix(in oklch, ${color} 20%, transparent)`,
        }}
      >
        <Icon className="size-3 sm:size-3.5" style={{ color }} />
      </span>
      <div className="min-w-0">
        <p
          className="font-heading text-xs font-bold tabular-nums leading-none sm:text-sm"
          style={{ color }}
        >
          {metric.value.toFixed(metric.decimals)}
        </p>
        <p className="font-mono text-[8px] text-muted-foreground sm:text-[9px]">
          {metric.unit}
        </p>
      </div>
    </div>
  );
}

export function SensorsDisconnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 sm:py-8">
      <div className="flex items-center gap-2.5 text-muted-foreground/70">
        <Unplug className="size-5 sm:size-6" />
        <span className="font-heading text-sm font-semibold tracking-wide sm:text-base">
          Sensores desconectados
        </span>
      </div>
    </div>
  );
}

export function SensorsPanel({ metrics }: { metrics: SensorMetric[] }) {
  if (metrics.length === 0) {
    return <SensorsDisconnected />;
  }

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      <div className="flex flex-col gap-2">
        {metrics.map((metric) => (
          <SensorBar key={metric.key} metric={metric} />
        ))}
      </div>

      <div className={cn('grid grid-cols-2 gap-1.5 sm:grid-cols-2 sm:gap-2')}>
        {metrics.map((metric) => (
          <SensorChip key={`chip-${metric.key}`} metric={metric} />
        ))}
      </div>
    </div>
  );
}
