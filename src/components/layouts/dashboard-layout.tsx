import { Outlet } from 'react-router-dom'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { useLiveSensors } from '@/hooks/use-live-sensors';

export function DashboardLayout() {
  const { lastUpdate } = useLiveSensors();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar  lastUpdate={lastUpdate} />
        <Outlet />
      </div>
    </div>
  )
}
