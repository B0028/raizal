import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sprout, X, Clock, Check, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { plants, type Plants } from '@/lib/plants-data';
import { Badge } from '@/components/ui/badge';

// TODO: reemplazar `plants` importado por fetch a la API cuando la DB esté lista
// ej: const { data: plants } = useSWR<Planta[]>('/api/plants', fetcher)

export interface CropSelectModalProps {
  open: boolean;
  onClose: () => void;
  slotsUsed: number;
  slotsTotal: number;
  // TODO: recibir lista de plants desde la DB vía prop cuando esté lista
  onConfirm: (selected: Planta[]) => void;
}

function groupByTipo(list: Planta[]): Record<string, Planta[]> {
  return list.reduce<Record<string, Planta[]>>((acc, p) => {
    (acc[p.tipo_de_planta] ??= []).push(p);
    return acc;
  }, {});
}

export function CropSelectModal({
  open,
  onClose,
  slotsUsed,
  slotsTotal,
  onConfirm,
}: CropSelectModalProps) {
  const [mounted, setMounted] = useState(false);
  // Mapa nombre → cantidad seleccionada
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => { setMounted(true); }, []);

  // Resetear selección cada vez que el modal se abre
  useEffect(() => {
    if (open) setCounts({});
  }, [open]);

  if (!mounted || !open) return null;

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);
  const availableSlots = slotsTotal - slotsUsed;
  const currentCount = slotsUsed + totalSelected;
  const atLimit = totalSelected >= availableSlots;

  const grouped = groupByTipo(plants);

  function increment(nombre: string) {
    if (atLimit) return;
    setCounts((prev) => ({ ...prev, [nombre]: (prev[nombre] ?? 0) + 1 }));
  }

  function decrement(nombre: string) {
    setCounts((prev) => {
      const next = { ...prev };
      if ((next[nombre] ?? 0) <= 1) {
        delete next[nombre];
      } else {
        next[nombre]--;
      }
      return next;
    });
  }

  function handleConfirm() {
    // Expande cada planta por su cantidad seleccionada
    // TODO: enviar a POST /api/crop-slots cuando haya DB
    const expanded: Planta[] = [];
    for (const [nombre, qty] of Object.entries(counts)) {
      const planta = plants.find((p) => p.nombre === nombre);
      if (planta) {
        for (let i = 0; i < qty; i++) expanded.push(planta);
      }
    }
    onConfirm(expanded);
    onClose();
  }

  // Resumen de lo seleccionado para el footer
  const selectionSummary = Object.entries(counts)
    .filter(([, qty]) => qty > 0)
    .map(([nombre, qty]) => ({ nombre, qty }));

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6">
      {/* Backdrop — no cierra el modal */}
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
          {atLimit && (
            <p className="font-mono text-[10px] text-center text-amber-400/80 border border-amber-400/20 bg-amber-400/5 rounded-xl px-4 py-2">
              Limite de slots alcanzado ({slotsTotal}/{slotsTotal})
            </p>
          )}

          {Object.entries(grouped).map(([tipo, items]) => (
            <div key={tipo}>
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground px-1 pb-2 uppercase">
                {tipo}
              </p>

              <div className="space-y-2">
                {items.map((planta) => {
                  const qty = counts[planta.nombre] ?? 0;
                  const isSelected = qty > 0;
                  const cantAdd = atLimit || !planta.disponibilidad;
                  const isDisabled = !planta.disponibilidad;

                  return (
                    <div
                      key={planta.nombre}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-2xl border p-3 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : isDisabled
                          ? 'border-border opacity-40 bg-foreground/[0.02]'
                          : 'border-border glass-panel',
                      )}
                    >
                      {/* Imagen */}
                      <div className="size-14 shrink-0 rounded-xl overflow-hidden border border-border">
                        <img
                          src={planta.imagen}
                          alt={planta.nombre}
                          className="size-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{planta.nombre}</p>
                        {planta.familia && (
                          <p className="font-mono text-[10px] italic text-muted-foreground truncate">
                            {planta.familia}
                          </p>
                        )}
                        <p className="font-mono text-[10px] text-muted-foreground/70 truncate">
                          {planta.tipo_de_planta}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="size-3 text-muted-foreground/60 shrink-0" />
                          <span className="font-mono text-[10px] text-muted-foreground">
                            Ciclo: {planta.ciclo_completo}
                          </span>
                        </div>
                      </div>

                      {/* Check + Badge cantidad */}
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

                      {/* ButtonGroup vertical +/- */}
                      {!isDisabled && (
                        <div className="flex flex-col shrink-0 rounded-lg border border-border overflow-hidden">
                          <button
                            type="button"
                            disabled={cantAdd && !isSelected}
                            onClick={() => !cantAdd && increment(planta.nombre)}
                            className={cn(
                              'flex size-7 items-center justify-center transition-colors',
                              cantAdd
                                ? 'text-muted-foreground/30 cursor-not-allowed'
                                : 'hover:bg-foreground/10 cursor-pointer',
                            )}
                            aria-label={`Agregar ${planta.nombre}`}
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <div className="h-px bg-border" />
                          <button
                            type="button"
                            disabled={!isSelected}
                            onClick={() => isSelected && decrement(planta.nombre)}
                            className={cn(
                              'flex size-7 items-center justify-center transition-colors',
                              !isSelected
                                ? 'text-muted-foreground/30 cursor-not-allowed'
                                : 'hover:bg-foreground/10 cursor-pointer',
                            )}
                            aria-label={`Quitar ${planta.nombre}`}
                          >
                            <Minus className="size-3.5" />
                          </button>
                        </div>
                      )}
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
            {selectionSummary.map(({ nombre, qty }) => (
              <Badge
                key={nombre}
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
