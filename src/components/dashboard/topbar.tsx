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
          aria-label="Notificaciones"
          className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <Bell className="size-4" />
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
      </div>
    </header>
  )
}
