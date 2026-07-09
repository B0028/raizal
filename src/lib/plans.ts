export interface Plan {  
  name: string;  
  planNameDb: string;  
  price: number;  
  period: string;  
  desc: string;  
  features: string[];  
  cta: string;  
  featured: boolean;  
}  
  
export const plans: Plan[] = [  
  {  
    name: 'Semilla (Básico)',  
    planNameDb: 'Básico',  
    price: 600,  
    period: '/mes',  
    desc: 'Para probar el servicio y conocer tu cosecha.',  
    features: [  
      '5 espacios de cultivo',  
      '2 cambios de cultivos al mes',  
      'Panel en tiempo real con el estado de tus cultivos',  
      'Mantenimiento incluido',  
      'Soporte por comunidad',  
    ],  
    cta: 'Empezar',  
    featured: false,  
  },  
  {  
    name: 'Cosecha (Intermedio)',  
    planNameDb: 'Intermedio',  
    price: 1000,  
    period: '/mes',  
    desc: 'Para quienes quieren cultivar más.',  
    features: [  
      '10 espacios de cultivo',  
      '4 cambios de cultivos al mes',  
      'Panel en tiempo real con métricas avanzadas sobre tus cultivos',  
      'Mantenimiento incluido',  
      'Soporte prioritario',  
    ],  
    cta: 'Empezar Cosecha',  
    featured: true,  
  },  
  {  
    name: 'Huerto (Premium)',  
    planNameDb: 'Premium',  
    price: 1600,  
    period: '/mes',  
    desc: 'Para familias y pequeños negocios sostenibles.',  
    features: [  
      '15 espacios de cultivo',  
      '7 cambios de cultivos al mes',  
      'Panel avanzado con métricas, historial y soporte en vivo sobre tus cultivos',  
      'Mantenimiento incluido',  
      'Analítica avanzada de producción',  
      'Gestor de cuenta dedicado',  
      'Soporte directo',  
    ],  
    cta: 'Empezar Huerto',  
    featured: false,  
  },  
];