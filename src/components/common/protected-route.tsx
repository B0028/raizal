import { Navigate, useLocation } from 'react-router-dom'  
import { useAuth } from '@/context/AuthContext'  
import { HydroLoader } from '@/components/ui/loader'  
import { useEffect, useState } from 'react'  
  
let hasShownDashboardLoader = false  
  
export function ProtectedRoute({ children }: { children: React.ReactNode }) {  
  const { user, loading } = useAuth()  
  const location = useLocation()  
  const isDashboard = location.pathname.startsWith('/dashboard')  
  
  const [transitioning, setTransitioning] = useState(  
    isDashboard && !hasShownDashboardLoader,  
  )  
  
  useEffect(() => {  
    if (!transitioning) return  
    hasShownDashboardLoader = true  
    const timer = setTimeout(() => setTransitioning(false), 1500)  
    return () => clearTimeout(timer)  
  }, [transitioning])  
  
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