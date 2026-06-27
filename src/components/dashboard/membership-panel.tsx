import { Crown } from 'lucide-react';
import { useUserSubscription } from '@/hooks/use-user-subscription';

export function MembershipPanel() {
  const { slotsTotal, slotsUsed, endDate, planName } = useUserSubscription();
  const slotPct = (slotsUsed / slotsTotal) * 100;
  const planLabels = {
    Básico: "Semilla (Básico)",
    Intermedio: "Cosecha (Intermedio)",
    Premium: "Huerto (Premium)",
  };

  return (
    <>
      <div className="glass flex flex-col gap-5 rounded-2xl p-5 lg:p-6 h-[100%]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber/15">
              <Crown className="size-4.5 text-amber" />
            </span>
            <div>
              <p className="text-sm font-semibold">Plan {planLabels[planName] || ""}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                Renueva el {endDate}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-primary/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-primary">
            ACTIVA
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Slots utilizados</span>
            <span className="font-mono font-medium">
              {slotsUsed} / {slotsTotal}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--aqua)]"
              style={{ width: `${slotPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Te quedan {slotsTotal - slotsUsed} slots
            disponibles para nuevos cultivos en tu huerta.
          </p>
        </div>
      </div>
    </>
  );
}
