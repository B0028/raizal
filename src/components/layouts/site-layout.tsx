import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative isolate">
        <Navbar />
        <AnimatedGridPattern maxOpacity={0.4} className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(0,0,0,0.2)_70%)] pointer-events-none" />
        <div  
          className="absolute -top-40 left-1/2 h-120 w-205 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px] pointer-events-none"  
          aria-hidden="true"  
        />  
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]"
          aria-hidden="true"
        />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
