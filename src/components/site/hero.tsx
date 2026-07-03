import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroParticleBg from '@/components/site/hero-particle-bg';
import StatusIndicator from "@/components/ui/status-indicator";
import { useAuth } from "@/context/AuthContext"

type FloatingTag = {
  state: "active" | "down" | "fixing" | "idle";
  label: string;
  value: string;
  position: string;
  duration: number;
  visibility?: string;
};

const floatingTags: FloatingTag[] = [
  {
    state: "active",
    label: "pH del sistema",
    value: "6.2 · Óptimo",
    position: "top-24 left-8",
    duration: 6,
  },
  {
    state: "active",
    label: "Temperatura",
    value: "22°C",
    position: "bottom-24 right-8",
    duration: 5,
  },
  {
    state: "fixing",
    label: "Humedad",
    value: "68%",
    position: "top-1/3 right-12",
    duration: 7,
    visibility: "hidden lg:flex",
  },
  {
    state: "idle",
    label: "Nutrientes",
    value: "Estable",
    position: "bottom-1/3 left-12",
    duration: 6.5,
    visibility: "hidden lg:flex",
  },
];

export function Hero() {
  const { user } = useAuth()
  return (
    <section className="relative overflow-hidden w-full h-screen">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <HeroParticleBg />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {floatingTags.map((tag) => (
          <motion.div
            key={tag.label}
            className={`pointer-events-none absolute flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 p-3 backdrop-blur-xl ${tag.position} ${tag.visibility ?? ""}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: tag.duration, ease: "easeInOut" }}
          >
            <StatusIndicator state={tag.state} size="sm" />
            <div>
              <p className="text-xs text-muted-foreground">{tag.label}</p>
              <p className="text-sm font-semibold text-foreground">{tag.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="absolute -top-40 left-1/2 h-120 w-205 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl h-full items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-1 lg:gap-8 lg:py-28 lg:px-8 pointer-events-none">
        <div className="z-10 flex flex-col items-center text-center">
          <h1 className="mt-6 font-heading text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl">
            RAIZAL
          </h1>
          <p className="mx-auto mt-6 max-w-md text-pretty text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Raizal une tecnología y naturaleza en una torre de cultivo vertical
            inteligente. Siembra, monitorea y cosecha alimentos frescos en casa,
            sin tierra y con datos en tiempo real.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {user ? (
              <></>
            ) : (
              <>
                <Button asChild size="lg" className="pointer-events-auto h-14 px-8 text-base">
                  <Link to="/registro">
                    Comienza a cultivar <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="pointer-events-auto h-14 px-8 text-base"
                >
                  <Link to="/dashboard">
                    <StatusIndicator state="active" size="sm" label="Demo en vivo" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}