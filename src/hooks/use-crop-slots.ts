import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/client';
import { useAuth } from '@/context/AuthContext';
import type { CropSlot } from '@/lib/sensor-types';
import { calcDaysToHarvest, calcGrowthProgress } from '@/lib/rack-metrics';

export interface UseCropSlotsState {
	slots: CropSlot[];
	loading: boolean;
	error: string | null;
	addSlots: (plantIds: string[]) => Promise<void>;
	removeSlot: (selectionId: string) => Promise<void>;
	updateSlots: (plantIds: string[]) => Promise<void>;
	harvestSlot: (selectionId: string) => Promise<void>;
	refetch: () => Promise<void>;
}

async function getAvailableSlots(count: number, excludeSlotIds: string[] = []) {
	let query = supabase.from('slots').select('id').limit(count);

	if (excludeSlotIds.length > 0) {
		query = query.not('id', 'in', `(${excludeSlotIds.join(',')})`);
	}

	const { data, error } = await query;
	if (error) throw error;
	return data || [];
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
			const { data, error: fetchError } = await supabase
				.from('user_slot_selections')
				.select(`
					id,
					slot_id,
					plant_id,
					selected_at,
					expected_harvest_date,
					status,
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
				.eq('status', 'growing')
				.order('created_at', { ascending: true });

			if (fetchError) throw fetchError;

			const mappedSlots: CropSlot[] = (data || []).map((selection: any) => {
				const plant = selection.plants;
				const progress = calcGrowthProgress(
					selection.selected_at,
					selection.expected_harvest_date,
				);
				const daysToHarvest = calcDaysToHarvest(selection.expected_harvest_date);

				return {
					id: selection.id,
					plant_id: selection.plant_id,
					name: plant?.plant_name || 'Planta',
					variety: plant?.scientific_name || plant?.category || '',
					image: plant?.image_url || null,
					health: 'optimal' as const,
					progress,
					daysToHarvest,
					rack: '—',
					level: 0,
					selectedAt: selection.selected_at,
					expectedHarvestDate: selection.expected_harvest_date,
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
			// Obtener harvest_time_days de cada planta
			const { data: plantsData, error: plantsError } = await supabase
				.from('plants')
				.select('id, harvest_time_days')
				.in('id', plantIds);

			if (plantsError) throw plantsError;

			const plantHarvestDays = new Map(
				(plantsData || []).map(p => [p.id, p.harvest_time_days])
			);

			// Obtener slot_ids ya usados globalmente
			const { data: usedSelections, error: usedError } = await supabase
				.from('user_slot_selections')
				.select('slot_id');

			if (usedError) throw usedError;

			const usedSlotIds = (usedSelections || []).map((s: any) => s.slot_id);
			const availableSlots = await getAvailableSlots(plantIds.length, usedSlotIds);

			if (availableSlots.length < plantIds.length) {
				throw new Error('No hay suficientes slots disponibles');
			}

			const now = new Date();

			const selections = plantIds.map((plantId, index) => {
				const harvestDays = plantHarvestDays.get(plantId) || 30;
				const expectedHarvestDate = new Date(now);
				expectedHarvestDate.setDate(expectedHarvestDate.getDate() + harvestDays);

				return {
					user_id: user.id,
					slot_id: availableSlots[index].id,
					plant_id: plantId,
					status: 'growing',
					selected_at: now.toISOString(),
					expected_harvest_date: expectedHarvestDate.toISOString(),
				};
			});

			const { error: insertError } = await supabase
				.from('user_slot_selections')
				.insert(selections);

			if (insertError) throw insertError;

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

			if (deleteError) throw deleteError;

			await fetchSlots();
		} catch (err) {
			console.error('Error removing slot:', err);
			throw err;
		}
	}, [user, fetchSlots]);

	const updateSlots = useCallback(async (plantIds: string[]) => {
		if (!user) return;

		try {
			// Eliminar selecciones del usuario
			const { error: deleteError } = await supabase
				.from('user_slot_selections')
				.delete()
				.eq('user_id', user.id);

			if (deleteError) throw deleteError;

			if (plantIds.length === 0) {
				await fetchSlots();
				return;
			}

			// Obtener harvest_time_days
			const { data: plantsData, error: plantsError } = await supabase
				.from('plants')
				.select('id, harvest_time_days')
				.in('id', plantIds);

			if (plantsError) throw plantsError;

			const plantHarvestDays = new Map(
				(plantsData || []).map(p => [p.id, p.harvest_time_days])
			);

			// Slots usados por otros usuarios
			const { data: usedSelections, error: usedError } = await supabase
				.from('user_slot_selections')
				.select('slot_id');

			if (usedError) throw usedError;

			const usedSlotIds = (usedSelections || []).map((s: any) => s.slot_id);
			const availableSlots = await getAvailableSlots(plantIds.length, usedSlotIds);

			if (availableSlots.length < plantIds.length) {
				throw new Error('No hay suficientes slots disponibles');
			}

			const now = new Date();

			const selections = plantIds.map((plantId, index) => {
				const harvestDays = plantHarvestDays.get(plantId) || 30;
				const expectedHarvestDate = new Date(now);
				expectedHarvestDate.setDate(expectedHarvestDate.getDate() + harvestDays);

				return {
					user_id: user.id,
					slot_id: availableSlots[index].id,
					plant_id: plantId,
					status: 'growing',
					selected_at: now.toISOString(),
					expected_harvest_date: expectedHarvestDate.toISOString(),
				};
			});

			const { error: insertError } = await supabase
				.from('user_slot_selections')
				.insert(selections);

			if (insertError) throw insertError;

			await fetchSlots();
		} catch (err) {
			console.error('Error updating slots:', err);
			throw err;
		}
	}, [user, fetchSlots]);

	const harvestSlot = useCallback(async (selectionId: string) => {
		if (!user) return;

		try {
			const { error: updateError } = await supabase
				.from('user_slot_selections')
				.update({
					status: 'harvested',
					actual_harvest_date: new Date().toISOString(),
				})
				.eq('id', selectionId)
				.eq('user_id', user.id);

			if (updateError) throw updateError;

			await fetchSlots();
		} catch (err) {
			console.error('Error harvesting slot:', err);
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
		harvestSlot,
		refetch: fetchSlots,
	};
}
