import { cn } from "@/lib/utils"

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
      </div>
      {showText && (
        <span className="font-sans text-lg font-bold tracking-tight text-foreground">
          Raizal
        </span>
      )}
    </div>
  )
}
