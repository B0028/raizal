import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Semilla (Básico)',
    price: '$15',
    period: '/mes',
    desc: 'Para probar el servicio y conocer tu cosecha.',
    features: [
      '5 espacios de cultivo',
      '2 cambios de cultivos al mes',
      'Panel en tiempo real con el estado de tus cultivos',
      'Mantenimiento incluido',
      'Soporte por comunidad',
    ],
    cta: 'Empezar',
    featured: false,
  },
  {
    name: 'Cosecha (Intermedio)',
    price: '$25',
    period: '/mes',
    desc: 'Para quienes quieren cultivar más.',
    features: [
      '10 espacios de cultivo',
      '4 cambios de cultivos al mes',
      'Panel en tiempo real con métricas avanzadas sobre tus cultivos',
      'Mantenimiento incluido',
      'Soporte prioritario',
    ],
    cta: 'Empezar Cosecha',
    featured: true,
  },
  {
    name: 'Huerto (Premium)',
    price: '$40',
    period: '/mes',
    desc: 'Para familias y pequeños negocios sostenibles.',
    features: [
      '15 espacios de cultivo',
      '7 cambios de cultivos al mes',
      'Panel avanzado con métricas, historial y soporte en vivo sobre tus cultivos',
      'Mantenimiento incluido',
      'Analítica avanzada de producción',
      'Gestor de cuenta dedicado',
      'Soporte directo',
    ],
    cta: 'Empezar Huerto',
    featured: false,
  },
];

export function Membership() {
  return (
    <section
      id="membresia"
      className="border-t border-border/60 border-b bg-card/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">
            Alquila tu espacio en nuestro Datacenter de Cultivo
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Membresías de Cultivo
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Suscríbete y ten acceso a cultivos frescos en nuestro huerto vertical, libres al 100% de pesticidas y agroquimicos. Nosotros nos encargamos de todo el mantenimiento, nutrientes y monitoreo. Tú recibes tu cosecha fresca. paga por cantidad de cultivos, cambia de plan cuando quieras.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-background/40 p-7 backdrop-blur-sm',
                plan.featured
                  ? 'border-primary/60 ring-1 ring-primary/30'
                  : 'border-border/60',
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Más popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-7"
                variant={plan.featured ? 'default' : 'outline'}
              >
                <Link to="/registro">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
