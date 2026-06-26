import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';
import type { ReadingPoint } from '@/lib/sensor-types';
import { appendHistoryPoint, buildHistoryFromRows } from '@/lib/rack-metrics';

export type RackMetrics = {
  id: string;
  rack_id: string;
  recorded_at: string;
  ph_level: number | null;
  ec_level: number | null;
  water_temp: number | null;
  ambient_temp: number | null;
  humidity: number | null;
  light_lux: number | null;
  nutrients_percent: number | null;
  created_at: string;
};

const HISTORY_LIMIT = 30;

export function useRackMetrics() {
  const [metrics, setMetrics] = useState<RackMetrics | null>(null);
  const [history, setHistory] = useState<ReadingPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMetrics() {
      const { data, error: fetchError } = await supabase
        .from('rack_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(HISTORY_LIMIT);

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
      } else if (data && data.length > 0) {
        const rows = data as RackMetrics[];
        setMetrics(rows[0]);
        setHistory(buildHistoryFromRows(rows));
        setLastUpdate(new Date(rows[0].recorded_at));
      }
      setLoading(false);
    }

    fetchMetrics();

    // StrictMode en dev monta/desmonta dos veces; esto evita estados intermedios
    // donde se “subscribea” una instancia sin que el handler esté listo.
    const channel = supabase
      .channel(`rack_metrics_changes_${Math.random().toString(16).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rack_metrics',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as RackMetrics;
            setMetrics(row);
            setLastUpdate(new Date(row.recorded_at));
            setHistory((prev) => appendHistoryPoint(prev, row, HISTORY_LIMIT));
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);


  return { metrics, history, lastUpdate, loading, error };
}
