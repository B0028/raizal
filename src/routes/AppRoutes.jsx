import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { Suspense } from "react";

import { SiteLayout } from "@/components/layouts/site-layout"
import HomePage from "@/pages/home"
import AboutPage from "@/pages/about"
import FaqPage from "@/pages/faq"
import ContactPage from "@/pages/contact"
import LoginPage from "@/pages/login"
import RegisterPage from "@/pages/register"
import { DashboardPage } from "@/pages/dashboard"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>

         {/* Sitio público */}
        <Route element={<SiteLayout />}> {/* Cambiar el elemento futuramente por <PublicLayout /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Route>

        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Autenticación 
        <Route element={<AuthLayout />}>
          <Route path="/ingresar" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>
        */}

        {/* Área privada 
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
        */}


      </Routes>
    </>
  );
}

//para componente que se muestre mientras carga si es que se usa lazy loading
//<Suspense fallback={<div>Cargando...</div>}>
//</Suspense>

