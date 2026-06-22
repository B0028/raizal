import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { HydroLoader } from "@/components/ui/loader"


export function DashboardPage() {

  return (
    <main className="flex-1 space-y-6 p-4 lg:p-8">
      <section>
        <HydroLoader />
      </section>
    </main>
  )
}


