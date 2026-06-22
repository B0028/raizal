import { useLiveSensors } from '@/hooks/use-live-sensors';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardTopbar } from '@/components/dashboard/topbar';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { CropSlots } from '@/components/dashboard/crop-slots';
import { ActivityLog } from '@/components/dashboard/activity-log';
import { MembershipPanel } from '@/components/dashboard/membership-panel';
import { YieldChart } from '@/components/dashboard/yield-chart';
import { ImpactPanel } from '@/components/dashboard/impact-panel';

export function DashboardPage() {
  const { metrics, history, lastUpdate } = useLiveSensors();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar lastUpdate={lastUpdate} />

        <main className="flex-1 space-y-6 p-4 lg:p-8">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground">
                MONITOREO EN TIEMPO REAL
              </h2>
            </div>
            <div>
              <CropSlots />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <MembershipPanel />
            </div>
            <div className="xl:col-span-2">
              <ImpactPanel />
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <SensorCard
                  key={metric.key}
                  metric={metric}
                  history={history}
                />
              ))}
            </div>
          </section>

          {/*
          <section>
            <YieldChart />
          </section>
          */}

          <footer className="flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-center sm:flex-row sm:text-left">
            <p className="font-mono text-xs text-muted-foreground">
              Raizal · Tecnología y naturaleza, frescura en tu mesa
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Datos transmitidos vía ESP32 · Código abierto
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

//             <ActivityLog />
