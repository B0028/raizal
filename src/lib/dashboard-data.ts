import type { ActivityEvent, CropSlot } from '@/lib/sensor-types';

export const cropSlots: CropSlot[] = [
  {
    id: 'slot-01',
    name: 'Lechuga Mantecosa',
    variety: 'Lactuca sativa',
    rack: 'Rack A',
    level: 2,
    progress: 82,
    daysToHarvest: 4,
    health: 'optimal',
    image: '/crops/lettuce.png',
  },
  {
    id: 'slot-02',
    name: 'Albahaca Genovesa',
    variety: 'Ocimum basilicum',
    rack: 'Rack A',
    level: 3,
    progress: 64,
    daysToHarvest: 9,
    health: 'optimal',
    image: '/crops/basil.png',
  },
  {
    id: 'slot-03',
    name: 'Kale Rizado',
    variety: 'Brassica oleracea',
    rack: 'Rack B',
    level: 1,
    progress: 45,
    daysToHarvest: 16,
    health: 'warning',
    image: '/crops/kale.png',
  },
  {
    id: 'slot-04',
    name: 'Fresa Albión',
    variety: 'Fragaria × ananassa',
    rack: 'Rack B',
    level: 4,
    progress: 91,
    daysToHarvest: 2,
    health: 'optimal',
    image: '/crops/strawberry.png',
  },
];

export const activityFeed: ActivityEvent[] = [
  {
    id: 'a1',
    time: 'hace 2 min',
    type: 'success',
    message: 'Ciclo de luz LED de espectro completo activado en Rack A.',
  },
  {
    id: 'a2',
    time: 'hace 18 min',
    type: 'info',
    message:
      'Dosis de nutrientes aplicada automáticamente al circuito de nitratos.',
  },
  {
    id: 'a3',
    time: 'hace 41 min',
    type: 'warning',
    message: 'Kale Rizado (Slot 03) por debajo del umbral de pH óptimo.',
  },
  {
    id: 'a4',
    time: 'hace 1 h',
    type: 'system',
    message: 'Sensor ESP32-B7 reconectado a la red. Latencia 42 ms.',
  },
  {
    id: 'a5',
    time: 'hace 3 h',
    type: 'success',
    message: 'Recolección registrada: 1.2 kg de Lechuga Mantecosa.',
  },
];

export const memberPlan = {
  name: 'Carrie F Miller',
  email: 'jerrod_hah4@hotmail.com',
  avatar: 'ramdom-user-placeholder.jpg',
  tier: 'Membresía Cultivador',
  slotsUsed: 4,
  slotsTotal: 12,
  renewsOn: '12 jul 2026',
};

export const resourceStats = [
  { label: 'Agua ahorrada vs. cultivo tradicional', value: 92, suffix: '%' },
  { label: 'Kilómetros de transporte evitados', value: 340, suffix: 'km' },
  { label: 'Energía renovable utilizada', value: 78, suffix: '%' },
];
