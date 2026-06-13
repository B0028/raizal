import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
