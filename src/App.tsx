import AppRoutes from './routes/AppRoutes';
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthContextProvider } from '@/context/AuthContext.tsx'
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AuthContextProvider>
      <TooltipProvider>
        <Toaster />
        <AppRoutes />
      </TooltipProvider>
    </AuthContextProvider>
  )
}


