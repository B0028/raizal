import { resourceStats } from '@/lib/dashboard-data';
import { Leaf } from 'lucide-react';

export function ImpactPanel() {
  return (
    <>
      <div className="glass flex flex-col gap-5 rounded-2xl p-5 lg:p-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber/15">
              <Leaf className="size-4 text-primary" />
            </span>
            <p className="text-sm font-semibold">Tu impacto este mes</p>
          </div>
          <div className="flex flex-col gap-3">
            {resourceStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-end justify-between">
                  <span className="max-w-[60%] text-xs leading-snug text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="font-heading text-lg font-bold tabular-nums text-foreground">
                    {stat.value}
                    <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                      {stat.suffix}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
