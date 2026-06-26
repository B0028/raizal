import { memberPlan } from '@/lib/dashboard-data';
import { Bell, Leaf } from 'lucide-react';
import GlassUserMenu from '@/components/ui/glass-user-menu'

export function DashboardTopbar({ lastUpdate }: { lastUpdate: Date | null }) {
  const time = (lastUpdate ?? new Date()).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="glass-strong sticky top-0 z-20 flex items-center gap-4 border-b border-border px-5 py-3.5 lg:px-8">
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="size-4" />
        </div>
        <span className="font-heading text-base font-bold">Raizal</span>
      </div>

      <div className="hidden flex-col lg:flex">
        <h1 className="font-heading text-lg font-semibold tracking-tight">
          Hola, {memberPlan.name.split(' ')[0]}
        </h1>
        <p className="text-xs text-muted-foreground">Bienvenido</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1.5 md:flex">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="font-mono text-[11px] text-muted-foreground">
            Actualizado {time}
          </span>
        </div>
        <button
          aria-label="Notificaciones"
          className="glass relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-amber" />
        </button>
        <GlassUserMenu user={memberPlan} /> 

      </div>
    </header>
  );
}
