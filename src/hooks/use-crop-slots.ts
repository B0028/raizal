import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/client';
import { useAuth } from '@/context/AuthContext';
import type { CropSlot } from '@/lib/sensor-types';

export interface CropSlotFromDB {
	id: bigint;
	user_id: string;
	plant_name: string;
	plant_variety: string | null;
	plant_image: string | null;
	health: 'optimal' | 'warning' | 'critical';
	progress: number;
	days_to_harvest: number;
	rack: string;
	level: number;
	created_at: string;
	updated_at: string;
}

export interface UseCropSlotsState {
	slots: CropSlot[];
	loading: boolean;
	error: string | null;
	addSlots: (newSlots: Omit<CropSlotFromDB, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => Promise<void>;
	removeSlot: (slotId: string) => Promise<void>;
	updateSlots: (slots: CropSlot[]) => Promise<void>;
	refetch: () => Promise<void>;
}

function mapSlotFromDB(dbSlot: CropSlotFromDB): CropSlot {
	return {
		id: dbSlot.id.toString(),
		name: dbSlot.plant_name,
		variety: dbSlot.plant_variety || '',
		image: dbSlot.plant_image || '/placeholder.png',
		health: dbSlot.health,
		progress: dbSlot.progress,
		daysToHarvest: dbSlot.days_to_harvest,
		rack: dbSlot.rack,
		level: dbSlot.level,
	};
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
				.from('crop_slots')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: true });

			if (fetchError) {
				throw fetchError;
			}

			setSlots((data as CropSlotFromDB[])?.map(mapSlotFromDB) || []);
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

	const addSlots = useCallback(async (
		newSlots: Omit<CropSlotFromDB, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]
	) => {
		if (!user) return;

		try {
			const slotsToInsert = newSlots.map(slot => ({
				...slot,
				user_id: user.id,
			}));

			const { error: insertError } = await supabase
				.from('crop_slots')
				.insert(slotsToInsert);

			if (insertError) {
				throw insertError;
			}

			await fetchSlots();
		} catch (err) {
			console.error('Error adding slots:', err);
			throw err;
		}
	}, [user, fetchSlots]);

	const removeSlot = useCallback(async (slotId: string) => {
		if (!user) return;

		try {
			const { error: deleteError } = await supabase
				.from('crop_slots')
				.delete()
				.eq('id', slotId)
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

	const updateSlots = useCallback(async (updatedSlots: CropSlot[]) => {
		if (!user) return;

		try {
			// Primero eliminamos todos los slots actuales
			const { error: deleteError } = await supabase
				.from('crop_slots')
				.delete()
				.eq('user_id', user.id);

			if (deleteError) {
				throw deleteError;
			}

			// Luego insertamos los nuevos slots
			const slotsToInsert = updatedSlots.map(slot => ({
				user_id: user.id,
				plant_name: slot.name,
				plant_variety: slot.variety,
				plant_image: slot.image,
				health: slot.health,
				progress: slot.progress,
				days_to_harvest: slot.daysToHarvest,
				rack: slot.rack,
				level: slot.level,
			}));

			if (slotsToInsert.length > 0) {
				const { error: insertError } = await supabase
					.from('crop_slots')
					.insert(slotsToInsert);

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
