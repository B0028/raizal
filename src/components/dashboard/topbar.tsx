import { Bell, Search } from "lucide-react"

export function DashboardTopbar() {

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border px-5 py-3.5 lg:px-8">
      <div className="ml-auto flex items-center gap-3">
        <button
          aria-label="Buscar"
          className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <Search className="size-4" />
        </button>
        <button
          aria-label="Buscar"
          className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <Bell className="size-4" />
        </button>
      </div>
    </header>
  )
}
