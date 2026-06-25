import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/client';

export interface Plant {
	id: string;
	plant_name: string;
	scientific_name: string | null;
	category: string;
	harvest_time_days: number;
	image_url: string | null;
	is_active: boolean;
	description: string | null;
	tower_type: string | null;
	season: string | null;
}

export interface UsePlantsState {
	plants: Plant[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function usePlants(): UsePlantsState {
	const [plants, setPlants] = useState<Plant[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlants = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const { data, error: fetchError } = await supabase
				.from('plants')
				.select('*')
				.eq('is_active', true)
				.order('plant_name', { ascending: true });

			if (fetchError) {
				throw fetchError;
			}

			setPlants((data as Plant[]) || []);
		} catch (err) {
			console.error('Error fetching plants:', err);
			setError(err instanceof Error ? err.message : 'Error fetching plants');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPlants();
	}, [fetchPlants]);

	return {
		plants,
		loading,
		error,
		refetch: fetchPlants,
	};
}
