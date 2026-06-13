import { useState } from "react"
import { Logo } from "../site/logo"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Sprout,
  Settings,
} from "lucide-react"

const nav = [
  { id: "crops", label: "Mis cultivos", icon: Sprout },
]

const secondary = [
  { id: "settings", label: "Ajustes", icon: Settings },
]

export function DashboardSidebar() {
  const [active, setActive] = useState("overview")

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border p-5 lg:flex">
      <div className="flex items-center gap-2.5 px-1 pb-8">
        <div className="leading-none">
          <Link to="/" aria-label="Raizal inicio">
            <Logo />
          </Link>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <p className="px-3 pb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
          PANEL
        </p>
        {nav.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4.5", isActive && "text-primary")} />
              {item.label}
            </button>
          )
        })}

        <p className="mt-6 px-3 pb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
          CUENTA
        </p>
        {secondary.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <Icon className="size-4.5" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
