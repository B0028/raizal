import { activityFeed } from '@/lib/dashboard-data';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, AlertTriangle, Cpu } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, color: 'var(--leaf)' },
  info: { icon: Info, color: 'var(--aqua)' },
  warning: { icon: AlertTriangle, color: 'var(--amber)' },
  system: { icon: Cpu, color: 'var(--muted-foreground)' },
} as const;

export function ActivityLog() {
  return (
    <div className="glass flex flex-col rounded-2xl p-5 lg:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold">
          Actividad del sistema
        </h2>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" /> automatizado
        </span>
      </div>

      <ol className="mt-5 flex flex-col">
        {activityFeed.map((event, i) => {
          const { icon: Icon, color } = config[event.type];
          const isLast = i === activityFeed.length - 1;
          return (
            <li key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in oklch, ${color} 16%, transparent)`,
                  }}
                >
                  <Icon className="size-3.5" style={{ color }} />
                </span>
                {!isLast && <span className="my-1 w-px flex-1 bg-border" />}
              </div>
              <div className={cn('pb-5', isLast && 'pb-0')}>
                <p className="text-sm leading-snug text-foreground">
                  {event.message}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {event.time}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
