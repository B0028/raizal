import { resourceStats } from '@/lib/dashboard-data';
import { Leaf , Droplet, Footprints, SolarPanel} from 'lucide-react';

const icons: Record<string, typeof Droplet> = {
  transport: Footprints,
  water: Droplet,
  energy: SolarPanel,
};

export function ImpactPanel() {
  return (
    <>
      <div className="glass flex flex-col gap-5 rounded-2xl p-5 lg:p-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15">
              <Leaf className="size-4 text-emerald-600" />
            </span>
            <p className="text-sm font-semibold">¡Tu impacto este mes!</p>
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            {resourceStats.map((stat) => {
              const IconComponent = icons[stat.type]; 

              return (
                <div key={stat.label}>
                  <div className="glass-panel border border-border p-2 rounded-2xl flex items-center justify-between gap-3 hover:bg-foreground/[0.07]">
                    
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-[var(--aqua)]/15">
                      {IconComponent ? (
                        <IconComponent className="size-4 text-foreground animate-pulse" />
                      ) : (
                        <Leaf className="size-4 text-foreground animate-pulse" />
                      )}
                    </span>
                    
                    <span className="flex-1 flex-1 text-medium leading-snug text-foreground">
                      {stat.label}
                    </span>
                    
                    <span className="font-heading text-lg font-bold tabular-nums text-foreground">
                      {stat.value}
                      <span className="ml-0.5 text-xs font-medium text-foreground">
                        {stat.suffix}
                      </span>
                    </span>
                    
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
