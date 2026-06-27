import { Hero } from '@/components/site/hero';
import { ProductIntro } from '@/components/site/product-intro';
import { Features } from '@/components/site/features';
import { HowItWorks } from '@/components/site/how-it-works';
import { Membership } from '@/components/site/membership';
import { JoinSection } from '@/components/site/join-section';
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"

export default function HomePage() {
  return (
    <>
      <AnimatedGridPattern maxOpacity={0.3} className="
    absolute inset-0
    bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(0,0,0,0.2)_70%)]
    pointer-events-none h-screen" />
      <Hero />
      <ProductIntro />
      <Features />
      <HowItWorks />
      <Membership />
      <JoinSection />
    </>
  );
}
