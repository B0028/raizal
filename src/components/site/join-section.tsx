import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function JoinSection() {
  return (
    <section id="impacto" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/40 px-6 py-14 text-center backdrop-blur-sm sm:px-12 lg:py-20">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Únete y empieza a cultivar desde tu hogar
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
              La comunidad que cultiva su propio alimento de forma
              sostenible.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/registro">
                  Crear mi cuenta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
