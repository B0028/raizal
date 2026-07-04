import { Hero } from '@/components/site/hero';
import { ProductIntro } from '@/components/site/product-intro';
import { Features } from '@/components/site/features';
import { HowItWorks } from '@/components/site/how-it-works';
import { Membership } from '@/components/site/membership';
import { JoinSection } from '@/components/site/join-section';
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user } = useAuth()
  return (
    <div className="relative z-10">  
      <Hero />
      <ProductIntro />
      <Features />
      <HowItWorks />
      <Membership />
      {!user && <JoinSection />}
    </div>
  );
}