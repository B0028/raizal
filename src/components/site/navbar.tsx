import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import GlassUserMenu from '@/components/ui/glass-user-menu'
import StatusIndicator from "@/components/ui/status-indicator";
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Preguntas", to: "/faq" },
  { label: "Contacto", to: "/contacto" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        scrolled ? "bg-background/93 border-b border-border/60 backdrop-blur-sm" : "bg-background/0", 
      )}
    >
      <div className="mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Raizal inicio">
          <Logo />
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-foreground",
                pathname === link.to ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 md:flex">
          {user ? (
            <>
              <ThemeToggle className="cursor-pointer glass-strong" size="lg" 
              variant="secondary"
              />  
              <Button asChild size="lg" variant="secondary" className="glass-strong">  
                <Link to="/dashboard">
                  <StatusIndicator state="active" size="sm" label="Dashboard"/> 
                </Link>  
              </Button>    
              <GlassUserMenu />  
            </> 
          ) : ( 
            <>
              <ThemeToggle className="cursor-pointer glass-strong" size="lg" 
              variant="secondary"
              />  
              <Button asChild size="lg" variant="secondary" className="glass-strong">  
                <Link to="/ingresar">Ingresar</Link>  
              </Button>  
              <Button asChild size="lg">  
                <Link to="/registro">Crear cuenta</Link>  
              </Button>  
            </>  
          )}  
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open.toString()}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Móvil">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.to ? "bg-card text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">  
              {user ? (  
                <GlassUserMenu />  
              ) : (  
                <>  
                  <Button asChild variant="outline" size="sm">  
                    <Link to="/ingresar" onClick={() => setOpen(false)}>  
                      Ingresar  
                    </Link>  
                  </Button>  
                  <Button asChild size="sm">  
                    <Link to="/registro" onClick={() => setOpen(false)}>  
                      Crear cuenta  
                    </Link>  
                  </Button>  
                </>  
              )}  
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
