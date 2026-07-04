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
  anchor: { x: number; y: number }; // punto de la flor (%)  
  pos: { x: number; y: number };    // posición base del tag (%)  
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
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">  
        <HeroParticleBg />  
      </div>
  
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
  
      <div className="mx-auto grid max-w-7xl h-full items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-1 lg:gap-8 lg:py-28 lg:px-8 pointer-events-none">  
        <div className="z-10 flex flex-col items-center text-center">  
          <h1 className="mt-6 font-heading text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl">  
            RAIZAL  
          </h1>  
          <p className="mx-auto mt-6 max-w-md text-pretty text-center text-base leading-relaxed text-muted-foreground sm:text-lg">  
            Una plataforma de cultivo vertical hidropónico donde controlas tus cultivos desde el celular con total transparencia y nosotros nos encargamos del cultivo. Recibe alimentos frescos, de calidad y libres de pesticidas.
          </p>  
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">  
            {user ? (  
              <></>  
            ) : (  
              <>  
                <Button asChild size="lg" className="pointer-events-auto h-14 px-8 text-base">  
                  <Link to="/registro">  
                    Comienza a cultivar <ArrowRight className="h-4 w-4" />  
                  </Link>  
                </Button>  
                <Button  
                  asChild  
                  size="lg"  
                  variant="outline"  
                  className="pointer-events-auto h-14 px-8 text-base"  
                >  
                  <Link to="/dashboard">  
                    <StatusIndicator state="active" size="sm" label="Demo en vivo" />  
                  </Link>  
                </Button>  
              </>  
            )}  
          </div>  
        </div>  
      </div>  
    </section>  
  );  
}