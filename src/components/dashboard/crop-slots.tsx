import { useLiveSensors } from '@/hooks/use-live-sensors';
import { cropSlots as initialCropSlots, memberPlan } from '@/lib/dashboard-data';
import { statusColor, statusLabel } from '@/lib/sensor-types';
import { Sprout, Plus, SquarePen, SquareCheckBig, Undo, CircleX, Clock9 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SensorSection } from '@/components/dashboard/crop-sensor';
import { CropSelectModal } from '@/components/dashboard/crop-select-modal';
import type { Plants } from '@/lib/plants-data';
import type { CropSlot } from '@/lib/dashboard-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Calcula el tiempo restante hasta las 09:00 del día siguiente
function timeUntilNextNine(): string {
  const now = new Date();
  const next9 = new Date();
  next9.setDate(now.getDate() + 1);
  next9.setHours(9, 0, 0, 0);
  const diffMs = next9.getTime() - now.getTime();
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function isPast9am(): boolean {
  const now = new Date();
  return now.getHours() >= 9;
}

export function CropSlots() {
  const { metrics, history } = useLiveSensors();

  // Por defecto vacío — TODO: cargar desde DB con useSWR('/api/crop-slots')
  const [activeSlots, setActiveSlots] = useState<CropSlot[]>([]);
  // Copia de trabajo durante el modo edición
  const [draftSlots, setDraftSlots] = useState<CropSlot[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  const [time, setTime] = useState(timeUntilNextNine());
  const [pastNine, setPastNine] = useState(isPast9am());

  // Actualiza el cronómetro cada segundo
  useEffect(() => {
    const id = setInterval(() => {
      setTime(timeUntilNextNine());
      setPastNine(isPast9am());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Slots mostrados: draft en modo edición, activos fuera
  const displayedSlots = editMode ? draftSlots : activeSlots;
  const slotsUsed = displayedSlots.length;
  const emptySlots = memberPlan.slotsTotal - slotsUsed;

  function handleConfirmFromModal(selected: Plants[]) {
    // TODO: persistir en DB vía POST /api/crop-slots
    const newSlots: CropSlot[] = selected.map((p, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: p.nombre,
      variety: p.familia ?? p.tipo_de_planta,
      image: p.imagen,
      health: 'optimal' as const,
      progress: 0,
      daysToHarvest: 0,
      rack: '—',
      level: 0,
    }));
    setActiveSlots((prev) => [...prev, ...newSlots]);
    setOpenSlot(null);
  }

  function enterEditMode() {
    setDraftSlots([...activeSlots]);
    setEditMode(true);
  }

  function undoChanges() {
    setDraftSlots([...activeSlots]);
    setEditMode(false);
  }

  function removeSlot(id: string) {
    setDraftSlots((prev) => prev.filter((s) => s.id !== id));
  }

  function confirmEdit() {
    // TODO: persistir cambios en DB
    setActiveSlots([...draftSlots]);
    setEditMode(false);
    setConfirmDialogOpen(false);
  }

  return (
    <>
      <div className="glass rounded-3xl p-5 lg:p-6 border border-border bg-foreground/[0.03]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Sprout className="size-4.5 text-primary" />
            <h2 className="font-heading text-base font-semibold">Mis slots de cultivo</h2>
            <Tooltip>
              <TooltipTrigger render={
                <Badge 
                variant="outline" 
                className="font-mono text-xs text-muted-foreground">
                {slotsUsed}/{memberPlan.slotsTotal} cultivos 
                </Badge>} 
              />
              <TooltipContent>
                <p>Tienes {memberPlan.slotsTotal - slotsUsed} espacio{memberPlan.slotsTotal - slotsUsed > 1 ? "s" : "" } disponible{memberPlan.slotsTotal - slotsUsed > 1 ? "s" : "" } para cultivar</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Badge de cronómetro — solo visible cuando hay slots y no es modo edición */}
            {activeSlots.length > 0 && !editMode && (
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-amber-500 border-amber-500/30 gap-1"
              >
                Tiempo disponible para editar cultivos: <Clock9 className="size-3" /> {time} 
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Deshacer — solo en modo edición */}
            {editMode && (
              <Button variant="outline" size="sm" onClick={undoChanges}>
                <Undo className="size-3.5" /> Deshacer cambios
              </Button>
            )}

            {/* Confirmar selección — solo en modo edición */}
            {editMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDialogOpen(true)}
              >
                <SquareCheckBig className="size-3.5" /> Confirmar selección
              </Button>
            )}

            {/* Editar cultivos — solo fuera del modo edición */}
            <Tooltip>
              <TooltipTrigger render={
                !editMode && (
                  <Button variant="outline" size="sm" onClick={enterEditMode} className="cursor-pointer">
                    <SquarePen className="size-3.5" /> Editar cultivos
                  </Button>
                )}
              />
              <TooltipContent>
                <p>Cambia los cultivos que deseas</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="mt-5 grid grid-cols-2 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {displayedSlots.map((crop) => {
            const color = statusColor[crop.health];
            // Una card "pendiente" es la que aún no pasó las 9am (recién agregada)
            const isPending = !pastNine && crop.progress === 0 && crop.daysToHarvest === 0;

            return (
              <div
                key={crop.id}
                className="glass-panel glass-shadow group flex flex-col gap-3 rounded-2xl p-3 transition-colors hover:bg-foreground/[0.07] relative"
              >
                {/* Botón eliminar — solo en modo edición */}
                {editMode && (
                  <button
                    onClick={() => removeSlot(crop.id)}
                    className="absolute right-2 top-2 z-10 text-destructive/70 hover:text-destructive transition-color cursor-pointer"
                    aria-label="Eliminar slot"
                  >
                    <CircleX className="size-7" />
                  </button>
                )}

                {/* Imagen */}
                <div className="flex min-w-0 flex-1 flex-col w-[100]">
                  <div className="relative bg-popover rounded-2xl h-[100] overflow-hidden">
                    <img
                      src={crop.image || '/placeholder.svg'}
                      alt={crop.name}
                      className="size-full object-cover transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{crop.name}</p>
                    <p className="truncate font-mono text-[10px] italic text-muted-foreground">
                      {crop.variety}
                    </p>
                  </div>

                  {isPending ? (
                    /* Modo pendiente: cronómetro hasta las 9am */
                    <div className="flex items-center gap-1.5">
                      <Clock9 className="size-3 text-amber-400 shrink-0" />
                      <span className="font-mono text-[10px] text-amber-400">Esperando para sembrar {time}</span>
                    </div>
                  ) : (
                    /* Modo activo: barra de progreso + rack */
                    <>
                      <div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Crecimiento</span>
                          <span className="font-mono font-medium">{crop.progress}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-2xl bg-foreground/10">
                          <div
                            className="h-full rounded-2xl bg-gradient-to-r from-emerald-300 to-emerald-700 transition-all animate-pulse"
                            style={{ width: `${crop.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                          Cosecha en {crop.daysToHarvest}{' '}
                          {crop.daysToHarvest === 1 ? 'día' : 'días'}
                        </p>
                      </div>

                      {/* Sensores */}
                      <div className="grid gap-3">
                        {metrics.map((metric) =>
                          metric.key !== 'nitrates' && metric.key !== 'oxygen' ? (
                            <SensorSection key={metric.key} metric={metric} history={history} />
                          ) : null,
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Cards vacías — solo clickeables fuera del modo edición */}
          {Array.from({ length: emptySlots }).map((_, index) => {
            const slotId = `empty-${index}`;
            return (
              <div
                key={slotId}
                className="glass-panel glass-shadow group relative flex rounded-2xl opacity-50"
              >
                <button
                  onClick={() => !editMode && setOpenSlot(slotId)}
                  disabled={editMode}
                  className={cn(
                    'flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-muted-foreground/30 p-3 transition-colors',
                    !editMode && 'hover:bg-foreground/[0.07] cursor-pointer',
                    editMode && 'cursor-not-allowed',
                  )}
                >
                  <Plus className="size-6 text-muted-foreground/40" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    [ selecciona tu cultivo ]
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de selección — solo fuera del modo edición */}
      {!editMode && (
        <CropSelectModal
          open={openSlot !== null}
          onClose={() => setOpenSlot(null)}
          slotsUsed={slotsUsed}
          slotsTotal={memberPlan.slotsTotal}
          onConfirm={handleConfirmFromModal}
        />
      )}

      {/* AlertDialog de confirmación de edición */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmas tu seleccion de cultivos?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes tiempo de elegir otros cultivos hasta el siguiente dia habil a las 09:00 a.m.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmEdit}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
