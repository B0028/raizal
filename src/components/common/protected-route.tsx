import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { HydroLoader } from '@/components/ui/loader'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
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
