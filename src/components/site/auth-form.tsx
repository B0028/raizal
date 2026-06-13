import { Link, useNavigate } from "react-router-dom"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { HydroLoader } from "@/components/ui/loader"

export function AuthForm() {

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-16">
        <Link to="/" aria-label="Raizal inicio">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
             <HydroLoader />
          </div>
        </div>
      </div>


      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="/hero-tower.png"
          alt="Torre de cultivo Raizal"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
