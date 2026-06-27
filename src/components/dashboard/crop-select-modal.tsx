import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sprout, X, Clock, Check, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { usePlants, type Plant } from '@/hooks/use-plants';

export interface CropSelectModalProps {
  open: boolean;
  onClose: () => void;
  slotsUsed: number;
  slotsTotal: number;
  onConfirm: (plantIds: string[]) => void;
}

const categoryLabels: Record<string, string> = {
  greens: 'Verdes de hoja',
  herbs: 'Hierbas aromáticas',
  fruits: 'Frutos pequeños',
  microgreens: 'Microgreens',
};

function groupByCategory(list: Plant[]): Record<string, Plant[]> {
  return list.reduce<Record<string, Plant[]>>((acc, p) => {
    const category = p.category || 'otros';
    (acc[category] ??= []).push(p);
    return acc;
  }, {});
}

function getPlantImage(imageUrl: string | null): string {
  if (!imageUrl) return '/placeholder.png';

  if (imageUrl.startsWith('/crops/')) {
    return imageUrl;
  }

  if (imageUrl && !imageUrl.startsWith('/')) {
    return `/crops/${imageUrl}`;
  }

  return '/placeholder.png';
}

export function CropSelectModal({
  open,
  onClose,
  slotsUsed,
  slotsTotal,
  onConfirm,
}: CropSelectModalProps) {
  const { plants, loading } = usePlants();
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) setCounts({});
  }, [open]);

  if (!mounted || !open) return null;

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);
  const availableSlots = slotsTotal - slotsUsed;
  const currentCount = slotsUsed + totalSelected;
  const atLimit = totalSelected >= availableSlots;

  const grouped = groupByCategory(plants);

  function increment(plantId: string) {
    if (atLimit) return;
    setCounts((prev) => ({ ...prev, [plantId]: (prev[plantId] ?? 0) + 1 }));
  }

  function decrement(plantId: string) {
    setCounts((prev) => {
      const next = { ...prev };
      if ((next[plantId] ?? 0) <= 1) {
        delete next[plantId];
      } else {
        next[plantId]--;
      }
      return next;
    });
  }

  function handleConfirm() {
    const plantIds: string[] = [];
    for (const [plantId, qty] of Object.entries(counts)) {
      for (let i = 0; i < qty; i++) {
        plantIds.push(plantId);
      }
    }
    onConfirm(plantIds);
    onClose();
  }

  const selectionSummary = Object.entries(counts)
    .filter(([, qty]) => qty > 0)
    .map(([plantId, qty]) => {
      const plant = plants.find(p => p.id === plantId);
      return { plantId, nombre: plant?.plant_name || 'Planta', qty };
    });

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6">

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="glass relative z-10 flex flex-col w-full rounded-t-3xl sm:rounded-3xl border border-border bg-background/90 shadow-2xl h-[90dvh] sm:h-auto sm:max-h-[80vh] sm:max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <Sprout className="size-4.5 text-primary" />
            <h2 className="font-heading text-base font-semibold">Selecciona tu cultivo</h2>
          </div>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {loading && (
            <p className="font-mono text-xs text-center text-muted-foreground py-8">
              Cargando plantas...
            </p>
          )}

          {atLimit && (
            <p className="font-mono text-[10px] text-center text-amber-400/80 border border-amber-400/20 bg-amber-400/5 rounded-xl px-4 py-2">
              Límite de slots alcanzado ({slotsTotal}/{slotsTotal})
            </p>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground px-1 pb-2 uppercase">
                {categoryLabels[category] || category}
              </p>

              <div className="space-y-2">
                {items.map((plant) => {
                  const qty = counts[plant.id] ?? 0;
                  const isSelected = qty > 0;
                  const cantAdd = atLimit;

                  return (
                    <div
                      key={plant.id}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-2xl border p-3 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border glass-panel',
                      )}
                    >
                      {/* Imagen */}
                      <div className="size-14 shrink-0 rounded-xl overflow-hidden border border-border">
                        <img
                          src={getPlantImage(plant.image_url)}
                          alt={plant.plant_name}
                          className="size-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{plant.plant_name}</p>
                        {plant.scientific_name && (
                          <p className="font-mono text-[10px] italic text-muted-foreground truncate">
                            {plant.scientific_name}
                          </p>
                        )}
                        <p className="font-mono text-[10px] text-muted-foreground/70 truncate">
                          {categoryLabels[plant.category] || plant.category}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="size-3 text-muted-foreground/60 shrink-0" />
                          <span className="font-mono text-[10px] text-muted-foreground">
                            Ciclo: {plant.harvest_time_days} días
                          </span>
                        </div>
                      </div>

                      {/* Cantidad */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        {isSelected ? (
                          <span className="flex size-5 items-center justify-center rounded-full bg-primary">
                            <Check className="size-3 text-primary-foreground" />
                          </span>
                        ) : (
                          <span className="size-5" />
                        )}
                        {isSelected && (
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] text-amber-500 border-amber-500/30 px-1.5"
                          >
                            x{qty}
                          </Badge>
                        )}
                      </div>

                      {/* +/- */}
                      <div className="flex flex-col shrink-0 rounded-lg border border-border overflow-hidden">
                        <button
                          type="button"
                          disabled={cantAdd && !isSelected}
                          onClick={() => !cantAdd && increment(plant.id)}
                          className={cn(
                            'flex size-7 items-center justify-center transition-colors',
                            cantAdd
                              ? 'text-muted-foreground/30 cursor-not-allowed'
                              : 'hover:bg-foreground/10 cursor-pointer',
                          )}
                          aria-label={`Agregar ${plant.plant_name}`}
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <div className="h-px bg-border" />
                        <button
                          type="button"
                          disabled={!isSelected}
                          onClick={() => isSelected && decrement(plant.id)}
                          className={cn(
                            'flex size-7 items-center justify-center transition-colors',
                            !isSelected
                              ? 'text-muted-foreground/30 cursor-not-allowed'
                              : 'hover:bg-foreground/10 cursor-pointer',
                          )}
                          aria-label={`Quitar ${plant.plant_name}`}
                        >
                          <Minus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 shrink-0 gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <Sprout className="size-3.5 text-muted-foreground shrink-0" />
            <span className="font-mono text-sm whitespace-nowrap">
              <span className="text-foreground font-semibold">{currentCount}</span>
              <span className="text-muted-foreground">/{slotsTotal} cultivos</span>
            </span>
            {/* Resumen de selección */}
            {selectionSummary.map(({ plantId, nombre, qty }) => (
              <Badge
                key={plantId}
                variant="outline"
                className="font-mono text-[10px] text-amber-500 border-amber-500/30"
              >
                x{qty} {nombre}
              </Badge>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={totalSelected === 0}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-xl font-mono text-sm font-semibold transition-all shrink-0',
              totalSelected > 0
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                : 'bg-foreground/10 text-muted-foreground cursor-not-allowed',
            )}
          >
            <Check className="size-4" />
            Confirmar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
