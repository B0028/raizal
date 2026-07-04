import { useRef, useState } from 'react';  
import { Link } from 'react-router-dom';  
import { ArrowRight } from 'lucide-react';  
import { motion } from 'framer-motion';  
import { Button } from '@/components/ui/button';  
import HeroParticleBg from '@/components/site/hero-particle-bg';  
import StatusIndicator from '@/components/ui/status-indicator';  
import { useAuth } from '@/context/AuthContext';  
  
type HeroTag = {  
  id: string;  
  label: string;  
  value: string;  
  state: 'active' | 'fixing' | 'idle';  
  anchor: { x: number; y: number };
  pos: { x: number; y: number }; 
};  
  
const HERO_TAGS: HeroTag[] = [  
  { id: 'ph',       label: 'pH del sistema',  value: '6.2 · Óptimo', state: 'active', anchor: { x: 50, y: 62 }, pos: { x: 16, y: 30 } },  
  { id: 'temp',     label: 'Temperatura',     value: '22°C',         state: 'active', anchor: { x: 46, y: 40 }, pos: { x: 20, y: 62 } },  
  { id: 'ec',       label: 'Nutrientes (EC)', value: '1.8 mS/cm',    state: 'active', anchor: { x: 54, y: 48 }, pos: { x: 78, y: 26 } },  
  { id: 'light',    label: 'Luz PPFD',        value: '320 µmol',     state: 'fixing', anchor: { x: 58, y: 66 }, pos: { x: 80, y: 58 } },  
  { id: 'water',    label: 'Nivel de agua',   value: '84%',          state: 'active', anchor: { x: 42, y: 70 }, pos: { x: 24, y: 82 } },  
  { id: 'humidity', label: 'Humedad',         value: '61%',          state: 'idle',   anchor: { x: 56, y: 30 }, pos: { x: 74, y: 84 } },  
];  

  
export function Hero() {  
  const { user } = useAuth();  
  const sectionRef = useRef<HTMLElement | null>(null);  
  // desplazamiento (en px) de cada tag respecto a su pos base, al arrastrar  
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});  
  
  return (  
    <section ref={sectionRef} className="relative overflow-hidden w-full h-screen">  
      <div className="pointer-events-none absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-leaf/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-aqua/10 blur-[140px]" />

      
      {/* Tags flotantes arrastrables */}  
      <div className="pointer-events-none absolute inset-0 z-10">  
        {HERO_TAGS.map((tag) => (  
          <motion.div  
            key={tag.id}  
            drag  
            dragConstraints={sectionRef}  
            dragMomentum={false}  
            onDrag={(_, info) =>  
              setOffsets((prev) => ({ ...prev, [tag.id]: { x: info.offset.x, y: info.offset.y } }))  
            }  
            className="pointer-events-auto absolute flex cursor-grab items-center gap-3 rounded-xl border border-border/60 bg-background/80 p-3 backdrop-blur-xl active:cursor-grabbing"  
            style={{  
              left: `${tag.pos.x}%`,  
              top: `${tag.pos.y}%`,  
              transform: 'translate(-50%, -50%)',  
            }}  
          >  
            <StatusIndicator state={tag.state} size="sm" />  
            <div>  
              <p className="text-xs text-muted-foreground">{tag.label}</p>  
              <p className="text-sm font-semibold text-foreground">{tag.value}</p>  
            </div>  
          </motion.div>  
        ))}  
      </div>  
  
      <div className="mx-auto grid max-w-7xl grid-cols-1 h-full items-center gap-12 px-6 py-20 sm:px-6 md:grid-cols-2 lg:gap-8 lg:py-28 lg:px-8 pointer-events-none">  

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20"
        >
            <h1 className="font-display text-9xl font-extrabold text-glow text-left -ms-2">
              RAIZAL
            </h1>

            <p className="mt-8 max-w-md text-lg font-light leading-relaxed text-foreground/80 md:text-xl">  
              Una plataforma de cultivo vertical <span className="font-medium text-leaf">hidropónico</span> donde controlas tus cultivos desde nuestra app con total transparencia y nosotros nos encargamos del cultivo. Recibe alimentos frescos, de calidad y libres de pesticidas.
            </p>  
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:flex-row">  
              {user ? (  
                <></>  
              ) : (  
                <>  
                  <Button asChild size="lg" className="px-5 py-6 font-bold shadow-[0_0_40px_-8px_var(--primary)] rounded-xl border-none">  
                    <Link to="/registro" className="flex flex-col-2 gap-4 items-center text-md">  
                      Comienza a cultivar 
                      <ArrowRight className="size-5" />  
                    </Link>  
                  </Button>  
                  <Button  
                    asChild  
                    size="lg"  
                    variant="outline"  
                    className="pointer-events-auto px-7 py-6 font-bold rounded-xl"  
                  >  
                    <Link to="/dashboard" className="flex flex-col-2 gap-4 items-center text-md">  
                      Ver demo en vivo
                      <StatusIndicator state="active"/>
                    </Link>  
                  </Button>  
                </>  
              )}  
            </div>  
        </motion.div>


        <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto"> 
          <HeroParticleBg />  
        </div>

      </div>  
    </section>  
  );  
}