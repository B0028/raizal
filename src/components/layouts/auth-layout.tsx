import { Link, Outlet } from 'react-router-dom'
import { Logo } from '@/components/site/logo'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-16">
        <Link to="/" aria-label="Raizal inicio">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>

      {/* visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="/hero-tower.png"
          alt="Torre de cultivo Raizal"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-2xl font-semibold leading-snug text-foreground text-balance">
            "Tecnología y naturaleza creciendo juntas, directo en tu hogar."
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Raizal · Cultivo vertical inteligente</p>
        </div>
      </div>
    </div>
  )
}
