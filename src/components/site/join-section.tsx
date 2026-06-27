import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JoinSection() {
  return (
    <section id="impacto" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/40 px-6 py-14 text-center backdrop-blur-sm sm:px-12 lg:py-20">
          <div
            className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[110px]"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">    
              Empieza a cultivar lo que consumes.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
              Únete a Raizal y toma el control de tu alimentación. Reserva tu espacio de cultivo, selecciona tus variedades favoritas y deja que nosotros nos ocupemos del resto.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/registro">
                  Crear mi cuenta
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contacto">Contactar al equipo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}