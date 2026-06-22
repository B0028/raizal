import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-muted border-t-primary h-12 w-12" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/ingresar" replace />
  }

  return <>{children}</>
}
