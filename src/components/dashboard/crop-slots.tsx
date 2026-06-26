import { useRackMetrics } from '@/hooks/use-rack-metrics';
import {
  areCropSensorsDisconnected,
  formatCountdown,
  getPlantingDeadline,
  isInPlantingWindow,
  isReadyToHarvest,
  rackMetricsToCropSensors,
} from '@/lib/rack-metrics';
import {
  Sprout,
  Plus,
  SquarePen,
  SquareCheckBig,
  Undo,
  CircleX,
  Clock9,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { SensorsPanel, SensorsDisconnected } from '@/components/dashboard/crop-sensor';
import { CropSelectModal } from '@/components/dashboard/crop-select-modal';
import type { CropSlot } from '@/lib/sensor-types';
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
} from '@/components/ui/tooltip';
import { useUserSubscription } from '@/hooks/use-user-subscription';
import { useCropSlots } from '@/hooks/use-crop-slots';

function timeUntilNextNine(): string {
  const now = new Date();
  const next9 = new Date();
  next9.setDate(now.getDate() + 1);
  next9.setHours(9, 0, 0, 0);
  return formatCountdown(next9);
}

function CropCardImage({
  crop,
  editMode,
  plantingTime,
  inPlantingWindow,
  onRemove,
}: {
  crop: CropSlot;
  editMode: boolean;
  plantingTime: string;
  inPlantingWindow: boolean;
  onRemove?: () => void;
}) {
  const readyToHarvest = isReadyToHarvest(crop.expectedHarvestDate);

  return (
      <div className="relative flex min-h-[10rem] shrink-0 flex-col justify-end overflow-hidden bg-foreground/10 sm:min-h-[11rem]">
      <img
        src={crop.image || '/placeholder.png'}
        alt={crop.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.png';
        }}
      />


      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

      {editMode && inPlantingWindow && onRemove && (
        <button
          onClick={onRemove}
          className="absolute right-2 top-2 z-10 text-white/70 transition-colors hover:text-white"
          aria-label="Eliminar slot"
        >
          <CircleX className="size-5 sm:size-6" />
        </button>
      )}

      <div className="relative z-10 flex flex-col gap-2 p-3">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold leading-tight text-white sm:text-base">
              {crop.name}
            </p>
            {crop.variety && (
              <p className="truncate font-mono text-[8px] italic text-white/55 sm:text-[9px]">
                {crop.variety}
              </p>
            )}
          </div>
          {!readyToHarvest && (
            <div className="shrink-0 text-right">
              {(() => {
                // crop.progress está en % del crecimiento (0..100)
                // daysToHarvest es el total restante (aprox). Ajustamos para reflejar el progreso actual.
                const totalDays = Math.max(1, crop.daysToHarvest);
                const remaining = Math.max(
                  0,
                  Math.ceil(totalDays * (1 - Math.min(100, Math.max(0, crop.progress)) / 100)),
                );

                return (
                  <>
                    <p className="font-heading text-2xl font-bold leading-none text-white sm:text-3xl">
                      {remaining}
                    </p>
                    <p className="font-mono text-[8px] uppercase leading-tight text-white/55 sm:text-[9px]">
                      {remaining === 1 ? 'día' : 'días'}
                    </p>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {!readyToHarvest && (
          <div className="px-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-black/40 sm:h-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, crop.progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CropSlots() {
  const { metrics: rackMetrics } = useRackMetrics();
  const sensorMetrics = rackMetricsToCropSensors(rackMetrics);
  const sensorsDisconnected = areCropSensorsDisconnected(rackMetrics);

  const { slotsTotal, slotsUsed, loading: subscriptionLoading } = useUserSubscription();
  const {
    slots: activeSlots,
    loading: slotsLoading,
    addSlots,
    removeSlot,
    harvestSlot,
  } = useCropSlots();

  const [draftSlots, setDraftSlots] = useState<CropSlot[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  const [globalEditTime, setGlobalEditTime] = useState(timeUntilNextNine());
  const [tick, setTick] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [harvestingId, setHarvestingId] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setGlobalEditTime(timeUntilNextNine());
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const displayedSlots = editMode ? draftSlots : activeSlots;
  const currentSlotsUsed = displayedSlots.length;
  const emptySlots = Math.max(0, slotsTotal - currentSlotsUsed);
  const isLoading = subscriptionLoading || slotsLoading;
  const anyInPlantingWindow = activeSlots.some((s) =>
    isInPlantingWindow(s.selectedAt),
  );

  async function handleConfirmFromModal(plantIds: string[]) {
    if (isLoading || isSaving) return;

    setIsSaving(true);
    try {
      await addSlots(plantIds);
      setOpenSlot(null);
    } catch (error) {
      console.error('Error adding slots:', error);
      alert('Error al agregar los cultivos. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  function enterEditMode() {
    setDraftSlots([...activeSlots]);
    setEditMode(true);
  }

  function undoChanges() {
    setDraftSlots([...activeSlots]);
    setEditMode(false);
  }

  function removeSlotFromDraft(id: string) {
    const slot = draftSlots.find((s) => s.id === id);
    if (!slot || !isInPlantingWindow(slot.selectedAt)) return;
    setDraftSlots((prev) => prev.filter((s) => s.id !== id));
  }

  async function confirmEdit() {
    if (isLoading || isSaving) return;

    setIsSaving(true);
    try {
      const draftIds = new Set(draftSlots.map((s) => s.id));

      for (const slot of activeSlots) {
        if (isInPlantingWindow(slot.selectedAt) && !draftIds.has(slot.id)) {
          await removeSlot(slot.id);
        }
      }

      setEditMode(false);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error updating slots:', error);
      alert('Error al guardar los cambios. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleHarvest(id: string) {
    if (isLoading || isSaving) return;
    setHarvestingId(id);
    setIsSaving(true);
    try {
      await harvestSlot(id);
    } catch (error) {
      console.error('Error harvesting:', error);
      alert('Error al cosechar. Por favor intenta de nuevo.');
    } finally {
      setHarvestingId(null);
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="glass rounded-3xl border border-border bg-foreground/[0.03] p-4 sm:p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Sprout className="size-4.5 text-primary" />
            <h2 className="font-heading text-base font-semibold">Mis cultivos</h2>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Badge
                    variant="outline"
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {currentSlotsUsed}/{slotsTotal} cultivos
                  </Badge>
                }
              />
              <TooltipContent>
                <p>
                  Tienes {slotsTotal - currentSlotsUsed} espacio
                  {slotsTotal - currentSlotsUsed !== 1 ? 's' : ''} disponible
                  {slotsTotal - currentSlotsUsed !== 1 ? 's' : ''} para cultivar
                </p>
              </TooltipContent>
            </Tooltip>

            {activeSlots.length > 0 && !editMode && anyInPlantingWindow && (
              <Badge
                variant="outline"
                className="gap-1 font-mono text-[10px] text-amber-500 border-amber-500/30"
              >
                Tiempo disponible para editar cultivos:{' '}
                <Clock9 className="size-3" /> {globalEditTime}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {editMode && (
              <Button variant="outline" size="sm" onClick={undoChanges}>
                <Undo className="size-3.5" /> Deshacer cambios
              </Button>
            )}

            {editMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDialogOpen(true)}
              >
                <SquareCheckBig className="size-3.5" /> Confirmar selección
              </Button>
            )}

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={enterEditMode}
                    className={cn(
                      'cursor-pointer',
                      (editMode || !anyInPlantingWindow) && 'hidden',
                    )}
                  >
                    <SquarePen className="size-3.5" /> Editar cultivos
                  </Button>
                }
              />
              <TooltipContent>
                <p>Cambia los cultivos que deseas</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:mt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-6">
          {displayedSlots.map((crop) => {
            const inPlantingWindow = isInPlantingWindow(crop.selectedAt);
            const plantingTime = formatCountdown(getPlantingDeadline(crop.selectedAt));
            // tick forces re-render every second for countdowns
            void tick;
            const readyToHarvest = isReadyToHarvest(crop.expectedHarvestDate);

            return (
              <div
                key={crop.id}
                className="glass-panel glass-shadow group flex flex-col overflow-hidden rounded-2xl transition-transform hover:-translate-y-0.5"
              >
                <CropCardImage
                  crop={crop}
                  editMode={editMode}
                  plantingTime={plantingTime}
                  inPlantingWindow={inPlantingWindow}
                  onRemove={() => removeSlotFromDraft(crop.id)}
                />

                <div className="flex min-h-[7rem] flex-1 flex-col p-2.5 sm:p-3">
                  {inPlantingWindow ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-1 py-2">
                      <Clock9 className="size-4 text-amber-400" />
                      <p className="text-center font-mono text-[10px] text-amber-400 sm:text-xs">
                        {plantingTime} para la siembra
                      </p>
                    </div>
                  ) : readyToHarvest ? (
                    <div className="flex flex-1 items-center justify-center py-2">
                      <Button
                        size="sm"
                        className="w-full max-w-[10rem] bg-emerald-600 font-heading text-sm hover:bg-emerald-700"
                        onClick={() => handleHarvest(crop.id)}
                        disabled={isSaving && harvestingId === crop.id}
                      >
                        {isSaving && harvestingId === crop.id
                          ? 'Cosechando...'
                          : 'Cosechar'}
                      </Button>
                    </div>
                  ) : sensorsDisconnected ? (
                    <SensorsDisconnected />
                  ) : (
                    <SensorsPanel metrics={sensorMetrics} />
                  )}
                </div>
              </div>
            );
          })}

          {Array.from({ length: emptySlots }).map((_, index) => {
            const slotId = `empty-${index}`;
            return (
              <div
                key={slotId}
                className="glass-panel glass-shadow group flex min-h-48 rounded-2xl opacity-40"
              >
                <button
                  onClick={() => !editMode && setOpenSlot(slotId)}
                  disabled={editMode}
                  className={cn(
                    'flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-muted-foreground/30 p-4 transition-colors',
                    !editMode &&
                      'cursor-pointer hover:bg-foreground/[0.07] hover:opacity-100',
                    editMode && 'cursor-not-allowed',
                  )}
                >
                  <Plus className="size-5 text-muted-foreground/50" />
                  <span className="text-center font-mono text-[10px] leading-relaxed text-muted-foreground">
                    [ selecciona
                    <br />
                    tu cultivo ]
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {!editMode && (
        <CropSelectModal
          open={openSlot !== null}
          onClose={() => setOpenSlot(null)}
          slotsUsed={currentSlotsUsed}
          slotsTotal={slotsTotal}
          onConfirm={handleConfirmFromModal}
        />
      )}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmas tu seleccion de cultivos?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes tiempo de elegir otros cultivos hasta el siguiente dia habil a las
              09:00 a.m.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmEdit} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
