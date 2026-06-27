import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { HydroLoader } from '@/components/ui/loader'
import { useEffect, useState } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [transitioning, setTransitioning] = useState(true)

  useEffect(() => {
    if (location.pathname !== '/dashboard') return
    setTransitioning(true)
    const timer = setTimeout(() => setTransitioning(false), 1500)
    return () => clearTimeout(timer)
  }, [location.pathname])

  if (loading || transitioning) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <HydroLoader />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/ingresar" replace />
  }

  return <>{children}</>
}
