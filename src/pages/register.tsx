import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignUpForm } from '@/components/sign-up-form'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
          Crea tu huerto
        </h1>
        <p className="text-sm text-muted-foreground">
          Empieza a cultivar de forma inteligente y sostenible.
        </p>
      </div>
      <SignUpForm />
    </div>
  )
}
