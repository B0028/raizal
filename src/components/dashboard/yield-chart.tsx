import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { yieldByWeek } from '@/lib/dashboard-data';
import { TrendingUp } from 'lucide-react';

function YieldTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-mono text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold text-foreground">
        {payload[0].value}{' '}
        <span className="font-normal text-muted-foreground">kg cosechados</span>
      </p>
    </div>
  );
}

export function YieldChart() {
  const total = yieldByWeek.reduce((acc, w) => acc + w.kg, 0);

  return (
    <div className="glass rounded-2xl p-5 lg:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-heading text-base font-semibold">
            Producción cosechada
          </h2>
          <p className="text-xs text-muted-foreground">
            Rendimiento semanal de tu huerta
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-primary">
          <TrendingUp className="size-3.5" />
          <span className="font-mono text-xs font-semibold">
            {total.toFixed(1)} kg
          </span>
        </div>
      </div>

      <div className="mt-5 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={yieldByWeek}
            margin={{ top: 8, right: 6, bottom: 0, left: -18 }}
          >
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--leaf)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="var(--leaf)" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              content={<YieldTooltip />}
              cursor={{ fill: 'var(--foreground)', opacity: 0.04 }}
            />
            <Bar
              dataKey="kg"
              fill="url(#yieldGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
