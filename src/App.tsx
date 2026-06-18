import AppRoutes from './routes/AppRoutes';
import { TooltipProvider } from "@/components/ui/tooltip"

export default function App() {
  return (
  <TooltipProvider>
    <AppRoutes />
  </TooltipProvider>
)
}
