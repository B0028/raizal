import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';

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

export function useRackMetrics() {
  const [metrics, setMetrics] = useState<RackMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      const { data, error: fetchError } = await supabase
        .from('rack_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setMetrics(data as RackMetrics | null);
      }
      setLoading(false);
    }

    fetchMetrics();

    const channel = supabase
      .channel('rack_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rack_metrics',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setMetrics(payload.new as RackMetrics);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { metrics, loading, error };
}
