import { Link, useNavigate } from "react-router-dom"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"

type AuthMode = "login" | "register"

export function AuthForm({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()
  const isLogin = mode === "login"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate("/dashboard")
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-16">
        <Link to="/" aria-label="Raizal inicio">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? "Bienvenido de nuevo" : "Crea tu huerto"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? "Ingresa para ver tu cultivo en tiempo real."
                : "Empieza a cultivar de forma inteligente y sostenible."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              {!isLogin && (
                <AuthField id="name" label="Nombre completo" placeholder="Tu nombre" />
              )}
              <AuthField
                id="email"
                label="Correo electrónico"
                type="email"
                placeholder="tu@correo.com"
              />
              <AuthField
                id="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
              />

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              <Button type="submit" size="lg" className="mt-2">
                {isLogin ? "Ingresar" : "Crear cuenta"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? "¿Aún no tienes cuenta? " : "¿Ya tienes cuenta? "}
              <Link
                to={isLogin ? "/registro" : "/ingresar"}
                className="font-medium text-primary hover:underline"
              >
                {isLogin ? "Crear cuenta" : "Ingresar"}
              </Link>
            </p>
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

function AuthField({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        className="rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}
