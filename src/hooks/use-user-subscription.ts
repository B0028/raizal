import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/client';
import { useAuth } from '@/context/AuthContext';

export interface MembershipPlan {
	id: string;
	plan_name: string;
	slots_total: number;
	price_uyu: number;
	description: string | null;
}

export interface UserSubscription {
	id: string;
	user_id: string;
	plan_id: string;
	status: string;
	slots_used: number;
	start_date: string;
	end_date: string;
	plan: MembershipPlan;
}

export interface UserSubscriptionState {
	subscription: UserSubscription | null;
	slotsTotal: number;
	slotsUsed: number;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useUserSubscription(): UserSubscriptionState {
	const { user } = useAuth();
	const [subscription, setSubscription] = useState<UserSubscription | null>(null);
	const [slotsUsed, setSlotsUsed] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		if (!user) {
			setSubscription(null);
			setSlotsUsed(0);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Obtener la suscripción activa del usuario con el plan
			const { data: subscriptionData, error: subscriptionError } = await supabase
				.from('subscriptions')
				.select(`
					id,
					user_id,
					plan_id,
					status,
					slots_used,
					start_date,
					end_date,
					plan:membership_plans (
						id,
						plan_name,
						slots_total,
						price_uyu,
						description
					)
				`)
				.eq('user_id', user.id)
				.eq('status', 'active')
				.single();

			if (subscriptionError && subscriptionError.code !== 'PGRST116') {
				throw subscriptionError;
			}

			// Obtener cantidad de slots usados desde user_slot_selections
			const { count, error: countError } = await supabase
				.from('user_slot_selections')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', user.id);

			if (countError) {
				throw countError;
			}

			setSubscription(subscriptionData as UserSubscription | null);
			setSlotsUsed(count || 0);
		} catch (err) {
			console.error('Error fetching subscription:', err);
			setError(err instanceof Error ? err.message : 'Error fetching subscription');
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const slotsTotal = subscription?.plan?.slots_total ?? 0;

	return {
		subscription,
		slotsTotal,
		slotsUsed,
		loading,
		error,
		refetch: fetchData,
	};
}
