import { Hero } from '@/components/site/hero';
import { ProductIntro } from '@/components/site/product-intro';
import { Features } from '@/components/site/features';
import { HowItWorks } from '@/components/site/how-it-works';
import { Membership } from '@/components/site/membership';
import { JoinSection } from '@/components/site/join-section';
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user } = useAuth()
  return (
    <div className="relative isolate">
      <AnimatedGridPattern maxOpacity={0.4} className="
    absolute inset-0 z-0 h-full w-full
    bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(0,0,0,0.2)_70%)]
    pointer-events-none" />
      <div className="relative z-10">  
        <Hero />
        <ProductIntro />
        <Features />
        <HowItWorks />
        <Membership />
        {!user && <JoinSection />}
      </div>
    </div>
  );
}