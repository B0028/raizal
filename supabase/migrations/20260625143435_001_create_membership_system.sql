-- Tabla de usuarios (vinculada a auth.users de Supabase)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabla de planes de membresía
CREATE TABLE public.membership_plans (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  slots_total INTEGER NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabla de suscripciones (relación usuario-plan)
CREATE TABLE public.subscriptions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id BIGINT NOT NULL REFERENCES public.membership_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Tabla de slots de cultivo (los cultivos asignados al usuario)
CREATE TABLE public.crop_slots (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plant_name TEXT NOT NULL,
  plant_variety TEXT,
  plant_image TEXT,
  health TEXT DEFAULT 'optimal' CHECK (health IN ('optimal', 'warning', 'critical')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  days_to_harvest INTEGER DEFAULT 0,
  rack TEXT DEFAULT '—',
  level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_id ON public.subscriptions(plan_id);
CREATE INDEX idx_crop_slots_user_id ON public.crop_slots(user_id);
CREATE INDEX idx_users_email ON public.users(email);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_slots ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "users_select_own" ON public.users FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Políticas RLS para membership_plans (lectura pública para usuarios autenticados)
CREATE POLICY "membership_plans_select_authenticated" ON public.membership_plans FOR SELECT
  TO authenticated USING (true);

-- Políticas RLS para subscriptions
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_update_own" ON public.subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para crop_slots
CREATE POLICY "crop_slots_select_own" ON public.crop_slots FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "crop_slots_insert_own" ON public.crop_slots FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "crop_slots_update_own" ON public.crop_slots FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "crop_slots_delete_own" ON public.crop_slots FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Insertar planes de membresía por defecto
INSERT INTO public.membership_plans (name, display_name, price_monthly, slots_total, description, features)
VALUES
  ('basico', 'Semilla (Básico)', 600, 5, 'Para probar el servicio y conocer tu cosecha.',
   '["5 espacios de cultivo", "2 cambios de cultivos al mes", "Panel en tiempo real", "Mantenimiento incluido", "Soporte por comunidad"]'::jsonb),
  ('intermedio', 'Cosecha (Intermedio)', 1000, 10, 'Para quienes quieren cultivar más.',
   '["10 espacios de cultivo", "4 cambios de cultivos al mes", "Panel en tiempo real con métricas avanzadas", "Mantenimiento incluido", "Soporte prioritario"]'::jsonb),
  ('premium', 'Huerto (Premium)', 1600, 15, 'Para familias y pequeños negocios sostenibles.',
   '["15 espacios de cultivo", "7 cambios de cultivos al mes", "Panel avanzado con métricas e historial", "Mantenimiento incluido", "Analítica avanzada de producción", "Gestor de cuenta dedicado", "Soporte directo"]'::jsonb);

-- Función para crear usuario automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para obtener el límite de slots del usuario
CREATE OR REPLACE FUNCTION public.get_user_slots_limit(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  slots_limit INTEGER;
BEGIN
  SELECT mp.slots_total INTO slots_limit
  FROM public.subscriptions s
  JOIN public.membership_plans mp ON mp.id = s.plan_id
  WHERE s.user_id = user_uuid AND s.status = 'active';
  
  RETURN COALESCE(slots_limit, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
