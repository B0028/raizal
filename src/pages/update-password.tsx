import { UpdatePasswordForm } from '@/components/update-password-form'

export default function UpdatePasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
          Establecer nueva contraseña
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu nueva contraseña para restaurar acceso a tu cuenta.
        </p>
      </div>
      <UpdatePasswordForm />
    </div>
  )
}
