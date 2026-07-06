import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductIntro() {
  return (
    <section className="relative overflow-hidden w-full border-t border-border/60 bg-card/20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-28 lg:px-8 pointer-events-none">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sprout className="h-3.5 w-3.5" />
            Código abierto
          </span>
          <h1 className="mt-6 text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            El Datacenter de Alimentos{' '} <span className="text-primary">que nutre tu comunidad.</span></h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sé parte del datacenter de alimentos que está transformando la
            agricultura urbana. Reserva tu espacio de cultivo inteligente,
            monitorea tus plantas en tiempo real desde nuestra app y redefine tu
            forma de consumir.{' '}
            <b>Tecnología, ecología y comunidad cultivando el futuro.</b>
          </p>
 
          <dl className="mt-12 pt-6 grid max-w-auto grid-cols-4 gap-6 border-t border-foreground/10 opacity-80">
            {[
              { value: '95%', label: 'Menos agua' },
              { value: '3x', label: 'Más rápido' },
              { value: '0%', label: 'Pesticidas' },
              { value: '100%', label: 'Más ecológico' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-mono font-semibold text-foreground sm:text-3xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs md:text-md lg:text-lg text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-2 backdrop-blur-sm">
            <img
              src="/hero-tower.png"
              alt="Torre de cultivo vertical Raizal con vegetales frescos"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
