import { Link } from 'react-router-dom';
import { Target, Eye, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Target,
    title: 'Nuestra misión',
    desc: 'Transformar la forma en que las personas acceden a sus alimentos, acercando el cultivo local, eficiente y gestionado desde la tecnología.',
  },
  {
    icon: Eye,
    title: 'Nuestra visión',
    desc: 'Construir una red de producción alimentaria donde cualquier persona pueda cultivar desde cualquier lugar y acceder a alimentos más frescos, transparentes y sostenibles.',
  },
  {
    icon: Heart,
    title: 'Nuestros valores',
    desc: 'Sostenibilidad, precisión, transparencia y respeto por los ciclos naturales en todo lo que construimos.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28 lg:px-8">
          <span className="text-sm font-semibold text-primary">
            Sobre Raizal
          </span>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Tecnología que echa raíces
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Raizal nació de una idea simple: la naturaleza y la tecnología no
            están en conflicto, pueden crecer juntas. Diseñamos torres de
            cultivo vertical inteligentes para que producir tu propio alimento
            sea natural, sostenible y profundamente humano. <br /> <br />
            No somos solo una granja urbana. Somos una red descentralizada de
            producción de alimentos que prioriza la dignidad humana y la
            transparencia absoluta de los datos. <br /> <br />
            Cada hoja verde que cultivamos está respaldada por métricas
            ambientales rigurosas, asegurando un uso óptimo del agua y la
            energía, mientras se fortalece la seguridad alimentaria local.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border/60 bg-card/30 p-7 backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-foreground">
                {v.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-12 rounded-3xl border border-border/60 bg-card/20 p-8 backdrop-blur-sm lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Naturaleza y precisión, en equilibrio
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Cada torre Raizal es el resultado de combinar agronomía,
              ingeniería de software y diseño sostenible. Medimos lo que
              importa, automatizamos lo repetitivo y dejamos que tú disfrutes de
              lo esencial: ver crecer tu propio alimento.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-6">
              {[
                { value: '230+', label: 'Torres hidropónicas activas' },
                { value: '32.000+', label: 'Espacios de cultivo disponibles' },
                { value: '30+', label: 'Cultivos para elegir' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-bold text-foreground sm:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <Button asChild className="mt-8">
              <Link to="/registro">
                Únete a Raizal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <img
              src="/hero-tower.png"
              alt="Torre de cultivo Raizal"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}