import { HydroLoader } from "@/components/ui/loader"

export default function AboutPage() {
  return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24 lg:px-8">
      <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Sobre Raizal 
      </h1>
        <HydroLoader />
      </section>
  )
}
