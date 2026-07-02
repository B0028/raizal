import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from "../site/logo"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { useAuth } from '@/context/AuthContext'

import {
  LayoutDashboard,
  Sprout,
  Activity,
  Droplets,
  BarChart3,
  Settings,
  LifeBuoy,
  Leaf,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { CreditCard, SignOut, User } from '@phosphor-icons/react'

const nav = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'crops', label: 'Mis cultivos', icon: Sprout },
  { id: 'sensors', label: 'Sensores', icon: Activity },
  { id: 'resources', label: 'Recursos', icon: Droplets },
  { id: 'yield', label: 'Producción', icon: BarChart3 },
];

const secondary = [
  { id: 'profile', label: 'Perfil', icon: User, path: '/dashboard/perfil' }, 
  { id: 'membership', label: 'Membresías', icon: CreditCard, path: '/dashboard/membresías' },
  { id: 'support', label: 'Soporte', icon: LifeBuoy, path: '/dashboard/soporte' },
  { id: 'settings', label: 'Ajustes', icon: Settings, path: '/dashboard/ajustes' },
];


export function DashboardSidebar() {
  const [active, setActive] = useState('overview');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Mantener resaltado acorde a la ruta
  const activeFromPath = (() => {
    if (pathname.startsWith('/dashboard/')) {
      const map: Record<string, string> = {
        '/dashboard/perfil': 'profile',
        '/dashboard/membresías': 'membership',
        '/dashboard/soporte': 'support',
        '/dashboard/ajustes': 'settings',
      };
      return map[pathname] ?? active;
    }
    return active;
  })();

  const handleLogout = async () => {  
    await logout()  
    navigate('/ingresar', { replace: true })  
  }

  return (
    <aside className="glass-strong sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border p-5 lg:flex">
      <div className="flex items-center gap-2.5 px-1 pb-8">
        <div className="leading-none">
          <Link to="/" aria-label="Raizal inicio" className="group flex items-center gap-1">
            <ChevronLeft className="size-6 text-muted-foreground transition-all group-hover:-translate-x-0.5 group-hover:text-foreground"/>
            <Logo />
          </Link>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <p className="px-3 pb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
          PANEL
        </p>
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = (pathname.startsWith('/dashboard') ? pathname === '/dashboard' : false) ? item.id === 'overview' : activeFromPath === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-primary/15 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              <Icon className={cn('size-4.5', isActive && 'text-primary')} />
              {item.label}
              {isActive && (
                <span className="ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}

        <p className="mt-6 px-3 pb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
          CUENTA
        </p>
        {secondary.map((item) => {
          const Icon = item.icon;
          const isActive = activeFromPath === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                if ('path' in item && item.path) navigate(item.path);
              }}

              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-primary/15 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              <Icon className="size-4.5" />
              {item.label}
              {isActive && (
                <span className="ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="mt-2 border-t border-border pt-2">  
        <button  
          type="button"  
          onClick={handleLogout}  
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors cursor-pointer hover:bg-destructive/15 hover:text-foreground"  
        >  
          <LogOut className="size-4.5" />  
          Cerrar sesión  
        </button>  
      </div>
    </aside>
  );
}
