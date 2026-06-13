import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-28 lg:px-8">
        <div className="relative z-10">
          <h1 className="mt-6 text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            RAIZAL
          </h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Raizal une tecnología y naturaleza en una torre de cultivo vertical
            inteligente. Siembra, monitorea y cosecha alimentos desde tu casa y nosotros nos encargamos.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/registro">
                Comienza tu huerto
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">
                Panel en vivo
              </Link>
            </Button>
          </div>
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
  )
}
