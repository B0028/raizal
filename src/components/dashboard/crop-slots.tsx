import { useLiveSensors } from '@/hooks/use-live-sensors';
import { Sprout, Plus, SquarePen, SquareCheckBig, Undo, CircleX, Clock9 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SensorSection } from '@/components/dashboard/crop-sensor';
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
} from "@/components/ui/tooltip"
import { useUserSubscription } from '@/hooks/use-user-subscription';
import { useCropSlots } from '@/hooks/use-crop-slots';

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
  const { slotsTotal, slotsUsed, loading: subscriptionLoading } = useUserSubscription();
  const {
    slots: activeSlots,
    loading: slotsLoading,
    addSlots,
    updateSlots,
    removeSlot,
  } = useCropSlots();

  // Copia de trabajo durante el modo edición
  const [draftSlots, setDraftSlots] = useState<CropSlot[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  const [time, setTime] = useState(timeUntilNextNine());
  const [pastNine, setPastNine] = useState(isPast9am());
  const [isSaving, setIsSaving] = useState(false);

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
  const currentSlotsUsed = displayedSlots.length;
  const emptySlots = Math.max(0, slotsTotal - currentSlotsUsed);

  const isLoading = subscriptionLoading || slotsLoading;

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
    setDraftSlots((prev) => prev.filter((s) => s.id !== id));
  }

  async function removeSlotCompletely(id: string) {
    if (isLoading || isSaving) return;

    setIsSaving(true);
    try {
      await removeSlot(id);
    } catch (error) {
      console.error('Error removing slot:', error);
      alert('Error al eliminar el cultivo. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmEdit() {
    if (isLoading || isSaving) return;

    setIsSaving(true);
    try {
      const plantIds = draftSlots.map(s => s.plant_id);
      await updateSlots(plantIds);
      setEditMode(false);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error updating slots:', error);
      alert('Error al guardar los cambios. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
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
                {currentSlotsUsed}/{slotsTotal} cultivos
                </Badge>}
              />
              <TooltipContent>
                <p>Tienes {slotsTotal - currentSlotsUsed} espacio{slotsTotal - currentSlotsUsed > 1 ? "s" : "" } disponible{slotsTotal - currentSlotsUsed > 1 ? "s" : "" } para cultivar</p>
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
        <div className="mt-5 grid grid-cols-2 gap-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {displayedSlots.map((crop) => {
            const isPending = !pastNine && crop.progress === 0 && crop.daysToHarvest === 0;

            return (
              <div
                key={crop.id}
                className="glass-panel glass-shadow group flex flex-col rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                {/* Mitad superior: imagen full-bleed con texto encima */}
                <div className="relative h-44 shrink-0 overflow-hidden bg-foreground/10">
                  <img
                    src={crop.image || '/placeholder.png'}
                    alt={crop.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.png';
                    }}
                  />

                  {/* Gradiente oscuro para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

                  {/* Botón eliminar — modo edición */}
                  {editMode && (
                    <button
                      onClick={() => removeSlotFromDraft(crop.id)}
                      className="absolute right-2 top-2 z-10 text-white/70 hover:text-white transition-colors cursor-pointer"
                      aria-label="Eliminar slot"
                    >
                      <CircleX className="size-6" />
                    </button>
                  )}

                  {/* Fila superior: etiqueta del slot */}
                  {!editMode && (
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-white/60">
                        {crop.rack !== '—' ? crop.rack : 'cultivo activo'}
                      </span>
                      {!isPending && (
                        <span className="font-mono text-[9px] tracking-widest uppercase text-white/60">
                          cosecha en
                        </span>
                      )}
                    </div>
                  )}

                  {isPending ? (
                    /* Estado pendiente */
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                      <Clock9 className="size-3 text-amber-400 shrink-0" />
                      <span className="font-mono text-[10px] text-amber-400">Sembrando a las 09:00</span>
                    </div>
                  ) : (
                    /* Nombre + días en fila inferior de la imagen */
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-heading text-base font-bold text-white leading-tight truncate">
                          {crop.name}
                        </p>
                        {crop.variety && (
                          <p className="font-mono text-[9px] italic text-white/55 truncate">
                            {crop.variety}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-heading text-3xl font-bold text-white leading-none">
                          {crop.daysToHarvest}
                        </p>
                        <p className="font-mono text-[9px] uppercase text-white/55 leading-tight">
                          {crop.daysToHarvest === 1 ? 'día' : 'días'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Barra de progreso al borde inferior de la imagen */}
                  {!isPending && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
                        style={{ width: `${crop.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Mitad inferior: sensores */}
                <div className="flex flex-col gap-2 p-3">
                  {isPending ? (
                    <p className="font-mono text-[10px] text-muted-foreground text-center py-2">
                      {time} para la siembra
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {metrics.map((metric) =>
                        metric.key !== 'nitrates' && metric.key !== 'oxygen' ? (
                          <SensorSection key={metric.key} metric={metric} history={history} />
                        ) : null,
                      )}
                    </div>
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
                className="glass-panel glass-shadow group relative flex rounded-2xl min-h-48 opacity-40"
              >
                <button
                  onClick={() => !editMode && setOpenSlot(slotId)}
                  disabled={editMode}
                  className={cn(
                    'flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-muted-foreground/30 p-4 transition-colors',
                    !editMode && 'hover:bg-foreground/[0.07] hover:opacity-100 cursor-pointer',
                    editMode && 'cursor-not-allowed',
                  )}
                >
                  <Plus className="size-5 text-muted-foreground/50" />
                  <span className="font-mono text-[10px] text-muted-foreground text-center leading-relaxed">
                    [ selecciona<br />tu cultivo ]
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
          slotsUsed={currentSlotsUsed}
          slotsTotal={slotsTotal}
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
            <AlertDialogCancel onClick={() => setConfirmDialogOpen(false)} disabled={isSaving}>
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
