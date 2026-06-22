import AppRoutes from './routes/AppRoutes';
import { TooltipProvider } from "@/components/ui/tooltip"
import {AuthContextProvider} from '@/context/AuthContext.tsx'

export default function App() {
  return ( 
    <AuthContextProvider>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </AuthContextProvider>
  )
}

