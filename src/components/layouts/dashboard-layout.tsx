import { Outlet } from 'react-router-dom'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { useRackMetrics } from '@/hooks/use-rack-metrics';

export function DashboardLayout() {
  const { lastUpdate } = useRackMetrics();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar lastUpdate={lastUpdate} />
        <Outlet />
      </div>
    </div>
  )
}
