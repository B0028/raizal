const steps = [
  {
    num: '01',
    title: 'Elige un plan',
    desc: 'Únete a la membresía que mejor se adapte a tus necesidades. Cada plan te habilita una cantidad de espacios de cultivo exclusivos para ti en nuestro datacenter.',
  },
  {
    num: '02',
    title: 'Selecciona tus cultivos',
    desc: 'Desde la app, decide qué quieres cosechar en tus espacios disponibles. Configura tu menú de vegetales y hierbas frescas; nuestro centro inteligente automatiza el resto. ',
  },
  {
    num: '03',
    title: 'Monitorea en vivo',
    desc: 'Sigue el crecimiento de tus alimentos en tiempo real.Nuestro datacenter se encarga del cuidado perfecto, tú tienes acceso total a las métricas e hitos de tu cultivo desde tu pantalla.',
  },
  {
    num: '04',
    title: 'Hackea el sistema alimenticio',
    desc: 'Recibe tus alimentos frescos y listos para disfrutar en tu mesa. Al producir en comunidad y de forma ultraeficiente, reduces tu huella ecológica y te conviertes en pionero de la agricultura del futuro. El mañana se cultiva hoy.',
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24 lg:px-8">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border/60">
            <img
              src="/roots.png"
              alt="Raíces creciendo en sistema hidropónico de nebulización"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-12 lg:mt-0">
          <span className="text-sm font-semibold text-primary">
            ¿Cómo funciona nuestra plataforma?
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            De la semilla al plato en cuatro pasos
          </h2>
          <div className="mt-10 flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5">
                <span className="font-mono text-sm font-semibold text-primary">
                  {step.num}
                </span>
                <div className="border-l border-border/60 pl-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
