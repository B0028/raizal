import { Droplets, Cpu, Leaf, LineChart, Sun, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: LineChart,
    title: 'Datos en tiempo real',
    desc: 'Desde tu panel de usuario puedes ver: pH, EC, temperatura, humedad, luz, nutrientes.',
  },
  {
    icon: Cpu,
    title: 'Mantenimiento autónomo',
    desc: 'Nos encargamos de todo: nutrientes, pH, EC, temperatura, humedad, luz. Tu cosecha está siempre fresca y sin químicos.',
  },
  {
    icon: Droplets,
    title: 'Máxima eficiencia de recursos',
    desc: 'Nuestro centro utiliza sistemas de cultivos automatizados que optimizan el uso de agua, nutrientes y espacio.',
  },
  {
    icon: Sun,
    title: 'Luz adaptativa',
    desc: 'Espectro LED que se ajusta a cada etapa de crecimiento de tus plantas, día y noche.',
  },
  {
    icon: ShieldCheck,
    title: 'Sin pesticidas',
    desc: 'Tu cosecha es recién cosechada en el momento de la retirada. Sin químicos, sin pesticidas, 100% orgánica.',
  },
  {
    icon: Leaf,
    title: 'Sostenible por diseño',
    desc: 'Materiales reciclables y consumo energético optimizado para reducir tu huella.',
  },
];

export function Features() {
  return (
    <section
      id="como-funciona"
      className="border-t border-b border-border/90 bg-card/30"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">
            Recupera la soberanía sobre lo que consumes.
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tu huerto vertical, sin esfuerzo
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Cada hoja verde que cultivamos está respaldada por métricas
            ambientales rigurosas, asegurando un uso óptimo del agua y la
            energía, mientras se fortalece la seguridad alimentaria local.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
