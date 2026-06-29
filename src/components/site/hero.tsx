import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroParticleBg from '@/components/site/hero-particle-bg';
import StatusIndicator from "@/components/ui/status-indicator";
import { useAuth } from "@/context/AuthContext"

export function Hero() {
  const { user } = useAuth()
  return (
    <section className="relative overflow-hidden w-full h-screen">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <HeroParticleBg />
      </div>
      <div
        className="absolute -top-40 left-1/2 h-120 w-205 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      
      <div className="mx-auto grid max-w-7xl h-full items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-1 lg:gap-8 lg:py-28 lg:px-8 pointer-events-none">
        <div className="z-10 ">
          <h1 className="mt-6 text-9xl font-extrabold sm:text-9xl lg:text-9xl">
            RAIZAL
          </h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Raizal une tecnología y naturaleza en una torre de cultivo vertical
            inteligente. Siembra, monitorea y cosecha alimentos frescos en casa,
            sin tierra y con datos en tiempo real.
          </p>
         <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {user ? (
              <>
              </> 
            ) : (  
              <>
                <Button asChild size="lg" className="pointer-events-auto flex flex-col-2">
                  <ArrowRight className="h-4 w-4" />
                    Comienza a cultivar
                  <Link to="/registro">
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="pointer-events-auto flex flex-col-2"
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
/* 
        <div className="justify-center">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-2 backdrop-blur-sm">
          </div>
        </div>

*/