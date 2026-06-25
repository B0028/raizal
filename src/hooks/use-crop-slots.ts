import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/client';
import { useAuth } from '@/context/AuthContext';
import type { CropSlot } from '@/lib/sensor-types';

export interface UserSlotSelection {
	id: string;
	user_id: string;
	slot_id: string;
	plant_id: string;
	selected_at: string;
	expected_harvest_date: string;
	status: string;
	actual_harvest_date: string | null;
	created_at: string;
}

export interface PlantFromDB {
	id: string;
	plant_name: string;
	scientific_name: string | null;
	category: string;
	harvest_time_days: number;
	image_url: string | null;
}

export interface UseCropSlotsState {
	slots: CropSlot[];
	loading: boolean;
	error: string | null;
	addSlots: (plantIds: string[]) => Promise<void>;
	removeSlot: (selectionId: string) => Promise<void>;
	updateSlots: (plantIds: string[]) => Promise<void>;
	refetch: () => Promise<void>;
}

export function useCropSlots(): UseCropSlotsState {
	const { user } = useAuth();
	const [slots, setSlots] = useState<CropSlot[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSlots = useCallback(async () => {
		if (!user) {
			setSlots([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Obtener selecciones de slots del usuario con información de la planta
			const { data, error: fetchError } = await supabase
				.from('user_slot_selections')
				.select(`
					id,
					user_id,
					slot_id,
					plant_id,
					selected_at,
					expected_harvest_date,
					status,
					actual_harvest_date,
					created_at,
					plants (
						id,
						plant_name,
						scientific_name,
						category,
						harvest_time_days,
						image_url
					)
				`)
				.eq('user_id', user.id)
				.order('created_at', { ascending: true });

			if (fetchError) {
				throw fetchError;
			}

			// Mapear a CropSlot
			const mappedSlots: CropSlot[] = (data || []).map((selection: any) => {
				const plant = selection.plants as PlantFromDB;
				const selectedDate = new Date(selection.selected_at);
				const today = new Date();
				const daysSinceSelection = Math.floor((today.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
				const daysToHarvest = Math.max(0, (plant?.harvest_time_days || 0) - daysSinceSelection);
				const progress = Math.min(100, Math.round((daysSinceSelection / (plant?.harvest_time_days || 1)) * 100));

				return {
					id: selection.id,
					name: plant?.plant_name || 'Planta',
					variety: plant?.scientific_name || plant?.category || '',
					image: plant?.image_url || '/placeholder.png',
					health: 'optimal' as const,
					progress,
					daysToHarvest,
					rack: '—',
					level: 0,
				};
			});

			setSlots(mappedSlots);
		} catch (err) {
			console.error('Error fetching crop slots:', err);
			setError(err instanceof Error ? err.message : 'Error fetching crop slots');
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		fetchSlots();
	}, [fetchSlots]);

	const addSlots = useCallback(async (plantIds: string[]) => {
		if (!user) return;

		try {
			// Obtener slots disponibles
			const { data: availableSlots, error: slotsError } = await supabase
				.from('slots')
				.select('id')
				.eq('is_occupied', false)
				.limit(plantIds.length);

			if (slotsError) {
				throw slotsError;
			}

			if (!availableSlots || availableSlots.length < plantIds.length) {
				throw new Error('No hay suficientes slots disponibles');
			}

			// Crear selecciones
			const selections = plantIds.map((plantId, index) => ({
				user_id: user.id,
				slot_id: availableSlots[index].id,
				plant_id: plantId,
				status: 'growing',
			}));

			const { error: insertError } = await supabase
				.from('user_slot_selections')
				.insert(selections);

			if (insertError) {
				throw insertError;
			}

			await fetchSlots();
		} catch (err) {
			console.error('Error adding slots:', err);
			throw err;
		}
	}, [user, fetchSlots]);

	const removeSlot = useCallback(async (selectionId: string) => {
		if (!user) return;

		try {
			const { error: deleteError } = await supabase
				.from('user_slot_selections')
				.delete()
				.eq('id', selectionId)
				.eq('user_id', user.id);

			if (deleteError) {
				throw deleteError;
			}

			await fetchSlots();
		} catch (err) {
			console.error('Error removing slot:', err);
			throw err;
		}
	}, [user, fetchSlots]);

	const updateSlots = useCallback(async (plantIds: string[]) => {
		if (!user) return;

		try {
			// Eliminar todas las selecciones actuales
			const { error: deleteError } = await supabase
				.from('user_slot_selections')
				.delete()
				.eq('user_id', user.id);

			if (deleteError) {
				throw deleteError;
			}

			// Si hay plantas para agregar
			if (plantIds.length > 0) {
				// Obtener slots disponibles
				const { data: availableSlots, error: slotsError } = await supabase
					.from('slots')
					.select('id')
					.eq('is_occupied', false)
					.limit(plantIds.length);

				if (slotsError) {
					throw slotsError;
				}

				if (!availableSlots || availableSlots.length < plantIds.length) {
					throw new Error('No hay suficientes slots disponibles');
				}

				// Crear nuevas selecciones
				const selections = plantIds.map((plantId, index) => ({
					user_id: user.id,
					slot_id: availableSlots[index].id,
					plant_id: plantId,
					status: 'growing',
				}));

				const { error: insertError } = await supabase
					.from('user_slot_selections')
					.insert(selections);

				if (insertError) {
					throw insertError;
				}
			}

			await fetchSlots();
		} catch (err) {
			console.error('Error updating slots:', err);
			throw err;
		}
	}, [user, fetchSlots]);

	return {
		slots,
		loading,
		error,
		addSlots,
		removeSlot,
		updateSlots,
		refetch: fetchSlots,
	};
}
