import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Suspense } from 'react';

import { SiteLayout } from '@/components/layouts/site-layout';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ProtectedRoute } from '@/components/common/protected-route';
import HomePage from '@/pages/home';
import AboutPage from '@/pages/about';
import FaqPage from '@/pages/faq';
import ContactPage from '@/pages/contact';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import ForgotPasswordPage from '@/pages/forgot-password';
import UpdatePasswordPage from '@/pages/update-password';
import { DashboardPage } from '@/pages/dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Sitio público */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Route>

        {/* Autenticación */}
        <Route element={<AuthLayout />}>
          <Route path="/ingresar" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>

        {/* Área privada */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

