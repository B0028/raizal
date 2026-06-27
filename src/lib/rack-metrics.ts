import type { SensorMetric, ReadingPoint } from '@/lib/sensor-types';
import type { RackMetrics } from '@/hooks/use-rack-metrics';

export const RACK_SENSOR_KEYS = [
  'ph_level',
  'ec_level',
  'water_temp',
  'ambient_temp',
  'humidity',
  'light_lux',
  'nutrients_percent',
] as const;

export const CROP_CARD_SENSOR_KEYS = [
  'ph',
  'water_temp',
  'light',
  'nutrients',
] as const;

const METRIC_DEFINITIONS: Omit<SensorMetric, 'value'>[] = [
  {
    key: 'ph',
    label: 'Nivel de pH',
    unit: 'pH',
    min: 4,
    max: 9,
    optimalMin: 5.8,
    optimalMax: 6.8,
    decimals: 2,
  },
  {
    key: 'ec',
    label: 'Nivel EC',
    unit: 'mS/cm',
    min: 0,
    max: 5,
    optimalMin: 1.2,
    optimalMax: 2.5,
    decimals: 2,
  },
  {
    key: 'water_temp',
    label: 'Temperatura del agua',
    unit: '°C',
    min: 12,
    max: 32,
    optimalMin: 20,
    optimalMax: 24,
    decimals: 1,
  },
  {
    key: 'ambient_temp',
    label: 'Temp. ambiente',
    unit: '°C',
    min: 10,
    max: 40,
    optimalMin: 18,
    optimalMax: 28,
    decimals: 1,
  },
  {
    key: 'humidity',
    label: 'Humedad',
    unit: '%',
    min: 0,
    max: 100,
    optimalMin: 40,
    optimalMax: 70,
    decimals: 1,
  },
  {
    key: 'light',
    label: 'Nivel de luz',
    unit: 'lux',
    min: 0,
    max: 10000,
    optimalMin: 2000,
    optimalMax: 8000,
    decimals: 0,
  },
  {
    key: 'nutrients',
    label: 'Nutrientes',
    unit: '%',
    min: 0,
    max: 100,
    optimalMin: 60,
    optimalMax: 90,
    decimals: 1,
  },
];

export const DB_KEY_MAP: Record<string, keyof RackMetrics> = {
  ph: 'ph_level',
  ec: 'ec_level',
  water_temp: 'water_temp',
  ambient_temp: 'ambient_temp',
  humidity: 'humidity',
  light: 'light_lux',
  nutrients: 'nutrients_percent',
};

const HISTORY_LIMIT = 30;

function rowToHistoryPoint(row: RackMetrics): ReadingPoint {
  return {
    time: new Date(row.recorded_at).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    ph: row.ph_level ?? undefined,
    ec: row.ec_level ?? undefined,
    water_temp: row.water_temp ?? undefined,
    ambient_temp: row.ambient_temp ?? undefined,
    humidity: row.humidity ?? undefined,
    light: row.light_lux ?? undefined,
    nutrients: row.nutrients_percent ?? undefined,
  };
}

export function buildHistoryFromRows(rows: RackMetrics[]): ReadingPoint[] {
  return [...rows].reverse().map(rowToHistoryPoint);
}

export function appendHistoryPoint(
  prev: ReadingPoint[],
  row: RackMetrics,
  max = HISTORY_LIMIT,
): ReadingPoint[] {
  return [...prev, rowToHistoryPoint(row)].slice(-max);
}

export function getHistoryValues(
  history: ReadingPoint[],
  metricKey: string,
): { v: number }[] {
  return history.flatMap((point) => {
    const value = point[metricKey as keyof ReadingPoint];
    return typeof value === 'number' ? [{ v: value }] : [];
  });
}

export function rackMetricsToSensors(
  data: RackMetrics | null,
  keys: readonly string[] = METRIC_DEFINITIONS.map((d) => d.key),
): SensorMetric[] {
  if (!data) return [];

  return METRIC_DEFINITIONS.flatMap((def) => {
    if (!keys.includes(def.key)) return [];

    const dbKey = DB_KEY_MAP[def.key];
    const raw = data[dbKey];
    if (raw == null) return [];

    return [
      {
        ...def,
        value: Number(raw),
      },
    ];
  });
}

export function rackMetricsToCropSensors(data: RackMetrics | null): SensorMetric[] {
  return rackMetricsToSensors(data, CROP_CARD_SENSOR_KEYS);
}

export function areSensorsDisconnected(data: RackMetrics | null): boolean {
  if (!data) return true;
  return RACK_SENSOR_KEYS.every((key) => data[key] == null);
}

export function areCropSensorsDisconnected(data: RackMetrics | null): boolean {
  if (!data) return true;
  return CROP_CARD_SENSOR_KEYS.every((key) => data[DB_KEY_MAP[key]] == null);
}

export function getPlantingDeadline(selectedAt: string): Date {
  const deadline = new Date(selectedAt);
  deadline.setDate(deadline.getDate() + 1);
  deadline.setHours(9, 0, 0, 0);
  return deadline;
}

export function isInPlantingWindow(selectedAt: string): boolean {
  return Date.now() < getPlantingDeadline(selectedAt).getTime();
}

export function formatCountdown(deadline: Date): string {
  const diffMs = deadline.getTime() - Date.now();
  if (diffMs <= 0) return '00:00:00';

  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function calcGrowthProgress(
  selectedAt: string,
  expectedHarvestDate: string,
): number {
  const start = new Date(selectedAt).getTime();
  const end = new Date(expectedHarvestDate).getTime();
  const now = Date.now();
  const total = end - start;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round(((now - start) / total) * 100)));
}

export function calcDaysToHarvest(expectedHarvestDate: string): number {
  const end = new Date(expectedHarvestDate);
  end.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function isReadyToHarvest(expectedHarvestDate: string): boolean {
  return calcDaysToHarvest(expectedHarvestDate) === 0;
}
