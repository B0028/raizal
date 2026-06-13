import { Hero } from "@/components/site/hero"
import { Features } from "@/components/site/features"
import { HowItWorks } from "@/components/site/how-it-works"
import { Membership } from "@/components/site/membership"
import { JoinSection } from "@/components/site/join-section"
import { HydroLoader } from "@/components/ui/loader"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Membership />
      <JoinSection />
      <HydroLoader />
    </>
  )
}
