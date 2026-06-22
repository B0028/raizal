import { Bell, Search, LogOut, User } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useAuth, useUserProfile } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/common/user-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DashboardTopbar() {
  const { user, logout } = useAuth()
  const profile = useUserProfile()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/ingresar', { replace: true })
  }
import { memberPlan } from '@/lib/dashboard-data';
import { Bell, Leaf } from 'lucide-react';
import GlassUserMenu from '@/components/ui/glass-user-menu'

export function DashboardTopbar({ lastUpdate }: { lastUpdate: Date }) {
  const time = lastUpdate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="glass-strong sticky top-0 z-20 flex items-center gap-4 border-b border-border px-5 py-3.5 lg:px-8">
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="size-4" />
        </div>
        <span className="font-heading text-base font-bold">Raizal</span>
      </div>

      <div className="hidden flex-col lg:flex">
        <h1 className="font-heading text-lg font-semibold tracking-tight">
          Hola, {memberPlan.name.split(' ')[0]}
        </h1>
        <p className="text-xs text-muted-foreground">Bienvenido</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1.5 md:flex">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="font-mono text-[11px] text-muted-foreground">
            Actualizado {time}
          </span>
        </div>
        <button
          aria-label="Buscar"
          className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <Search className="size-4" />
        </button>
        <button
          aria-label="Notificaciones"
          className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          aria-label="Notificaciones"
          className="glass relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-amber" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 h-auto p-1"
            >
              <UserAvatar
                avatarUrl={profile?.avatar_url}
                username={profile?.username}
                email={user?.email}
                size="sm"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium text-foreground truncate">
                {profile?.username || user?.email}
              </p>
              {profile?.full_name && (
                <p className="text-xs text-muted-foreground truncate">
                  {profile.full_name}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="size-4" />
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <GlassUserMenu user={memberPlan} /> 

      </div>
    </header>
  );
}
