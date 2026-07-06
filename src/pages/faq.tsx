import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: '¿Necesito tener experiencia en cultivo?',
    a: 'No. Nosotros nos encargamos de todo el mantenimiento. Tú solo recibes tu cosecha fresca.',
  },
  {
    q: '¿Qué cultivos puedo elegir?',
    a: 'Más de 30 cultivos: lechugas, hierbas como albahaca y menta, kale, espinaca, fresas y muchos más. La torre es modular y se adapta a lo que quieras sembrar.',
  },
  {
    q: '¿Las plantas son sin químicos?',
    a: 'Sí. Todas nuestras plantas son 100% sin químicos,.organicas y sin pesticidas.',
  },
  {
    q: '¿Cómo retiro mi cosecha?',
    a: 'Retirás tu cosecha fresca en nuestro local. Te damos la ubicación y horarios cuando confirmas la cosecha.',
  },
  {
    q: '¿Puedo pedir que mi cosecha sea enviada?',
    a: 'No, por el momento la cosecha solo se retira en nuestro local. En el futuro tendremos servicio de entrega.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. La membresía es flexible y puedes cambiar de plan o cancelar en cualquier momento desde tu cuenta, sin penalizaciones.',
  },
  {
    q: '¿Qué es Farming as a Service?',
    a: 'Farming as a Service es un servicio de huerto vertical donde nosotros nos encargamos de cultivar tus plantas y tú recibes la cosecha fresca. No necesitas comprar torres, nutrientes ni equipos. Solo suscríbete, elegís tus cultivos y nosotros hacemos el resto.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-foreground">{q}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={cn(
          'grid overflow-hidden transition-all duration-300',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold text-primary">
            Preguntas frecuentes
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Todo lo que necesitas saber sobre Raizal
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Resolvemos las dudas más comunes sobre nuestras membresías, cultivos, cosechas y funcionamiento de la plataforma. ¿Tienes otra consulta? Estamos para ayudarte.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} {...faq} />
          ))}
        </div>
      </section>
    </>
  );
}
