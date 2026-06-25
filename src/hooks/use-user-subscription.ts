import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/client';
import { useAuth } from '@/context/AuthContext';

export interface MembershipPlan {
	id: bigint;
	name: string;
	display_name: string;
	price_monthly: number;
	slots_total: number;
	description: string;
	features: string[];
}

export interface UserSubscription {
	id: bigint;
	plan_id: bigint;
	status: string;
	started_at: string;
	expires_at: string | null;
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
					plan_id,
					status,
					started_at,
					expires_at,
					plan:membership_plans (
						id,
						name,
						display_name,
						price_monthly,
						slots_total,
						description,
						features
					)
				`)
				.eq('user_id', user.id)
				.eq('status', 'active')
				.single();

			if (subscriptionError && subscriptionError.code !== 'PGRST116') {
				throw subscriptionError;
			}

			// Obtener cantidad de slots usados
			const { count, error: countError } = await supabase
				.from('crop_slots')
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
