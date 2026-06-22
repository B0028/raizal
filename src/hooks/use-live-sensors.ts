import { useEffect, useRef, useState } from 'react';
import type { ReadingPoint, SensorMetric } from '@/lib/sensor-types';

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function drift(value: number, min: number, max: number, volatility: number) {
  const next = value + (Math.random() - 0.5) * volatility;
  return clamp(next, min, max);
}

const initialMetrics: SensorMetric[] = [
  {
    key: 'ph',
    label: 'Nivel de pH',
    unit: 'pH',
    value: 6.4,
    min: 4,
    max: 9,
    optimalMin: 5.8,
    optimalMax: 6.8,
    decimals: 2,
  },
  {
    key: 'temp',
    label: 'Temperatura del agua',
    unit: '°C',
    value: 22.5,
    min: 12,
    max: 32,
    optimalMin: 20,
    optimalMax: 24,
    decimals: 1,
  },
  {
    key: 'nitrates',
    label: 'Nitratos',
    unit: 'ppm',
    value: 118,
    min: 0,
    max: 240,
    optimalMin: 80,
    optimalMax: 160,
    decimals: 0,
  },
  {
    key: 'oxygen',
    label: 'Oxígeno disuelto',
    unit: 'mg/L',
    value: 7.8,
    min: 3,
    max: 12,
    optimalMin: 6.5,
    optimalMax: 9,
    decimals: 1,
  },
];

const volatility: Record<string, number> = {
  ph: 0.06,
  temp: 0.25,
  nitrates: 3.5,
  oxygen: 0.12,
};

function buildHistory(): ReadingPoint[] {
  const points: ReadingPoint[] = [];
  const now = Date.now();
  let ph = 6.4;
  let temp = 22.5;
  let nitrates = 118;
  let oxygen = 7.8;
  for (let i = 29; i >= 0; i--) {
    ph = drift(ph, 5.6, 7, 0.08);
    temp = drift(temp, 19, 25, 0.3);
    nitrates = drift(nitrates, 75, 165, 4);
    oxygen = drift(oxygen, 6, 9.5, 0.15);
    const d = new Date(now - i * 60000);
    points.push({
      time: d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      ph: Number(ph.toFixed(2)),
      temp: Number(temp.toFixed(1)),
      nitrates: Number(nitrates.toFixed(0)),
      oxygen: Number(oxygen.toFixed(1)),
    });
  }
  return points;
}

export function useLiveSensors() {
  const [metrics, setMetrics] = useState<SensorMetric[]>(initialMetrics);
  const [history, setHistory] = useState<ReadingPoint[]>(() => buildHistory());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;

  useEffect(() => {
    const id = setInterval(() => {
      const next = metricsRef.current.map((m) => ({
        ...m,
        value: Number(
          drift(m.value, m.min, m.max, volatility[m.key] ?? 0.1).toFixed(
            m.decimals,
          ),
        ),
      }));
      setMetrics(next);
      setLastUpdate(new Date());

      const get = (k: string) => next.find((m) => m.key === k)?.value ?? 0;
      setHistory((prev) => {
        const point: ReadingPoint = {
          time: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          ph: get('ph'),
          temp: get('temp'),
          nitrates: get('nitrates'),
          oxygen: get('oxygen'),
        };
        return [...prev.slice(1), point];
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return { metrics, history, lastUpdate };
}
