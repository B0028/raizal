import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CreditCard, Gear, SignOut, User } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUserProfile } from '@/context/AuthContext'
import { UserAvatar } from '@/components/common/user-avatar'
import { Button } from "@/components/ui/Button"

export type GlassUserMenuUser = {
  name: string
  email: string
  avatar: string
}

type MenuItemDef = {
  icon: typeof User
  label: string
  color: string
  to?: string
}

type MenuGroupDef = {
  label: string
  items: MenuItemDef[]
}

const MENU_GROUPS: MenuGroupDef[] = [
  {
    items: [
      { icon: User, label: 'Perfil', color: '#3A86FF', to: '/dashboard/perfil' },
      { icon: Gear, label: 'Ajustes', color: '#B388FF', to: '/ajustes' },
      { icon: CreditCard, label: 'Membresías', color: '#FFBE0B', to: '/membresias' },
    ],
  },
]

function MenuItem({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: typeof User
  label: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      type="Button"
      onClick={onClick}
      className="cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left transition-colors hover:bg-white/15"
      style={{ minHeight: 36 }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-xl"
        style={{
          width: 32,
          height: 32,
          background: `${color}2E`,
          border: `1px solid ${color}40`,
        }}
      >
        <Icon size={16} weight="regular" style={{ color }} />
      </div>
      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.92)' }}>
        {label}
      </span>
    </button>
  )
}

function LogOutItem({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="Button"
      onClick={onClick}
      className="cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left transition-colors hover:bg-destructive/15"
      style={{ minHeight: 36 }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-xl"
        style={{
          width: 32,
          height: 32,
          background: '#FF5A5A18',
          border: '1px solid #FF5A5A22',
        }}
      >
        <SignOut size={16} weight="regular" style={{ color: '#FF5A5A' }} />
      </div>
      <span className="text-sm font-medium text-destructive">
        Cerrar sesión
      </span>
    </button>
  )
}

export default function GlassUserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const { user, logout } = useAuth()
  const profile = useUserProfile()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/ingresar', { replace: true })
  }

  useEffect(() => {
    if (!open) return

    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  const glassStyle = useMemo(
    () => ({
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 20px 40px 0 oklch(0.15 0.03 140 / 0.55)',
      backdropFilter: 'blur(10px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(10px) saturate(1.8)',
    }),
    [],
  )

  const glassPanelBlur = useMemo(
    () => ({
      backdropFilter: 'blur(10px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(10px) saturate(1.8)',
    }),
    [],
  )

  return (
    <div ref={ref} className="relative flex items-center">
      <Button
        size="lg"
        variant="outline"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        className="flex items-center gap-2 rounded-lg px-3 py-1 transition-colors hover:bg-foreground/10"
        style={{ boxShadow: open ? '0 0 0 1px rgba(255,255,255,0.25), 0 8px 30px rgba(0,0,0,0.35)' : undefined }}
      >
        <div className="pointer-events-none absolute inset-0 z-[-1] rounded-lg glass"/>
        <UserAvatar
          avatarUrl={profile?.avatar_url}
          username={profile?.username}
          email={user?.email}
          size="xs"
        />
        
        <span className="text-sm font-semibold text-white/80 capitalize">
          {profile?.username || user?.email?.split('@')[0]}
        </span>
        <span className="text-white/40 text-lg">▾</span>
      </Button>

      <AnimatePresence>
        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-[min(280px,calc(100vw-32px))] rounded-2xl p-2 glass-strong bg-secondary"
           
          >
            {profile?.full_name && (
              <div className="px-3 py-1.5 text-lg text-white/50 border-b border-white/5 mb-1 truncate">
                {profile.full_name}
              </div>
            )}

            <div
              className="absolute bottom-6 left-0 top-6 w-[1px]"
            />

            {MENU_GROUPS.map((group) => (
              <div key={group.label} className="mb-1">
                <p className="mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <MenuItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    color={item.color}
                    onClick={() => {
                      const targetPath = item.to || `/${item.label.toLowerCase()}`
                      navigate(targetPath)
                      setOpen(false)
                    }}
                  />
                ))}
              </div>
            ))}

            <div className="mx-2 my-1.5 h-[1px]" style={{ background: 'rgba(255,255,255,0.07)' }} />

            <LogOutItem
              onClick={() => {
                setOpen(false)
                handleLogout()
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}