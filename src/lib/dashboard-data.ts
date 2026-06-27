import type { ActivityEvent, CropSlot } from '@/lib/sensor-types';

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

export const resourceStats = [
  { label: 'Agua ahorrada vs. cultivo tradicional', value: 92, suffix: '%' , type:"water"},
  { label: 'Kilómetros de transporte evitados', value: 340, suffix: 'km', type:"transport"},
  { label: 'Energía renovable utilizada', value: 78, suffix: '%' , type:"energy"},
];
