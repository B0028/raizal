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
  pos: { x: number; y: number }; 
};  
  
const HERO_TAGS: HeroTag[] = [  
  { id: 'ph',       label: 'pH del sistema',  value: '6.2 · Óptimo', state: 'active', pos: { x: 60, y: 50 } },  
  { id: 'temp',     label: 'Temperatura',     value: '22°C',         state: 'active', pos: { x: 43, y: 44 } },  
  { id: 'ec',       label: 'Nutrientes (EC)', value: '1.8 mS/cm',    state: 'down', pos: { x: 67, y: 20 } },  
  { id: 'light',    label: 'Luz PPFD',        value: '320 µmol',     state: 'fixing', pos: { x: 85, y: 40 } },  
  { id: 'water',    label: 'Nivel de agua',   value: '84%',          state: 'active', pos: { x: 52, y: 80 } },  
  { id: 'humidity', label: 'Humedad',         value: '61%',          state: 'idle',   pos: { x: 80, y: 70 } },  
];

const microStats = [
              { value: '95%', label: 'Menos agua' },
              { value: '3x', label: 'Más rápido' },
              { value: '0%', label: 'Pesticidas' },
              { value: '100%', label: 'Más ecológico' },
];

  
export function Hero() {  
  const { user } = useAuth();  
  
  return (  
    <section className="relative w-full h-screen overflow-hidden">

      <div className="absolute inset-y-0 -right-20 w-2/3 z-0 pointer-events-auto "> 
        <HeroParticleBg />  
      </div>  

       <div className="pointer-events-none absolute inset-0 z-10">  
        {HERO_TAGS.map((tag, i) => (  
           <motion.div  
             key={tag.id}   
            animate={{ y: [0, -10, 0] }}  
            transition={{  
              duration: 4 + (i % 3),  
              repeat: Infinity,  
              ease: 'easeInOut',  
              delay: i * 0.4,  
            }}  
            className="absolute hidden sm:flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 p-3 backdrop-blur-xl"  
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
  
      <div className="relative z-20 mx-auto flex max-w-7xl h-full items-center px-6 sm:px-6 lg:px-8 pointer-events-none mt-16 pb-16">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 max-w-xl"
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
                <Button asChild size="lg" className="cursor-pointer px-5 py-6 font-bold shadow-[0_0_40px_-8px_var(--ring)] rounded-xl border-none pointer-events-auto">  
                  <Link to="/registro" className="flex flex-col-2 gap-4 items-center text-md">  
                    Comienza a cultivar 
                    <ArrowRight className="size-5" />  
                  </Link>  
                </Button>
                <Button
                  asChild  
                  size="lg"  
                  variant="secondary"  
                  className="pointer-events-auto px-7 py-6 font-bold rounded-xl glass-strong cursor-pointer"  
                >  
                  <Link to="/dashboard" className="flex flex-col-2 gap-4 items-center text-md">  
                    Ver demo en vivo
                    <StatusIndicator state="active"/>
                  </Link>  
                </Button>  
              </>  
            )}  
          </div>  
          <div className="mt-14 flex items-center gap-10 border-t border-foreground/10 pt-6 opacity-70">
            {microStats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-mono text-2xl font-semibold">{s.value}</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-foreground/60">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>  
    </section>  
  );  
}
