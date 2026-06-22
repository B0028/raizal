export type SensorStatus = 'optimal' | 'warning' | 'critical';

export type SensorMetric = {
  key: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  decimals: number;
};

export type ReadingPoint = {
  time: string;
  ph: number;
  temp: number;
  nitrates: number;
  oxygen: number;
};

export type CropSlot = {
  id: string;
  name: string;
  variety: string;
  rack: string;
  level: number;
  progress: number;
  daysToHarvest: number;
  health: SensorStatus;
  image: string;
};

export type ActivityEvent = {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'system';
  message: string;
};

export function statusOf(metric: SensorMetric): SensorStatus {
  const { value, optimalMin, optimalMax, min, max } = metric;
  if (value >= optimalMin && value <= optimalMax) return 'optimal';
  const lowBand = optimalMin - (optimalMin - min) * 0.5;
  const highBand = optimalMax + (max - optimalMax) * 0.5;
  if (value < lowBand || value > highBand) return 'critical';
  return 'warning';
}

export const statusColor: Record<SensorStatus, string> = {
  optimal: 'var(--leaf)',
  warning: 'var(--amber)',
  critical: 'var(--destructive)',
};

export const statusLabel: Record<SensorStatus, string> = {
  optimal: 'Óptimo',
  warning: 'Atención',
  critical: 'Crítico',
};
