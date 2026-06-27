import { useRackMetrics } from '@/hooks/use-rack-metrics';
import { areSensorsDisconnected, rackMetricsToSensors } from '@/lib/rack-metrics';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { CropSlots } from '@/components/dashboard/crop-slots';
import { MembershipPanel } from '@/components/dashboard/membership-panel';
import { ImpactPanel } from '@/components/dashboard/impact-panel';
import { Unplug } from 'lucide-react';
import {ActivityLog} from '@/components/dashboard/activity-log'

export function DashboardPage() {
  const { metrics: rackMetrics, history } = useRackMetrics();
  const sensorMetrics = rackMetricsToSensors(rackMetrics);
  const sensorsDisconnected = areSensorsDisconnected(rackMetrics);

  return (
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
        {sensorsDisconnected ? (
          <div className="glass flex items-center justify-center gap-2.5 rounded-2xl py-12 text-muted-foreground/70">
            <Unplug className="size-5" />
            <span className="font-heading text-sm font-semibold">
              Sensores desconectados
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sensorMetrics.map((metric) => (
              <SensorCard
                key={metric.key}
                metric={metric}
                history={history}
              />
            ))}
          </div>
        )}
      </section>

      <section>
          <ActivityLog/>
      </section>

      <footer className="flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-center sm:flex-row sm:text-left">
        <p className="font-mono text-xs text-muted-foreground">
          Raizal · Tecnología y naturaleza, frescura en tu mesa
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          Datos transmitidos vía ESP32 · Código abierto
        </p>
      </footer>
    </main>
  );
}
