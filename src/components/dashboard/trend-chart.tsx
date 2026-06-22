import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ReadingPoint } from '@/lib/sensor-types';
import { cn } from '@/lib/utils';

type Series = {
  key: keyof ReadingPoint;
  label: string;
  unit: string;
  color: string;
};

const series: Series[] = [
  { key: 'ph', label: 'pH', unit: 'pH', color: 'var(--leaf)' },
  { key: 'temp', label: 'Temperatura', unit: '°C', color: 'var(--aqua)' },
  { key: 'nitrates', label: 'Nitratos', unit: 'ppm', color: 'var(--amber)' },
  { key: 'oxygen', label: 'Oxígeno', unit: 'mg/L', color: 'var(--chart-4)' },
];

function ChartTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-mono text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold text-foreground">
        {payload[0].value}{' '}
        <span className="font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

export function TrendChart({ history }: { history: ReadingPoint[] }) {
  const [active, setActive] = useState<Series>(series[0]);

  return (
    <div className="glass rounded-2xl p-5 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-base font-semibold">
            Tendencia del cultivo
          </h2>
          <p className="text-xs text-muted-foreground">
            Últimos 30 registros · intervalo 1 min
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {series.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s)}
              className={cn(
                'rounded-full border px-3 py-1.5 font-mono text-[11px] font-medium transition-colors',
                active.key === s.key
                  ? 'border-transparent text-background'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
              style={active.key === s.key ? { background: s.color } : undefined}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{ top: 8, right: 6, bottom: 0, left: -16 }}
          >
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={<ChartTooltip unit={active.unit} />}
              cursor={{ stroke: 'var(--border)' }}
            />
            <Area
              type="monotone"
              dataKey={active.key}
              stroke={active.color}
              strokeWidth={2.5}
              fill="url(#trendGrad)"
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
