import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from '@/lib/client'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

export interface UserProfile {
	id: string
	username?: string
	full_name?: string
	avatar_url?: string
	created_at?: string
	updated_at?: string
}

const AuthContext = createContext<{
	user: User | null
	profile: UserProfile | null
	loading: boolean
	logout: () => Promise<void>
} | null>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.single()

			if (error) {
				console.error('Error fetching profile:', error)
				return null
			}
			return data as UserProfile
		} catch (error) {
			console.error('Error fetching profile:', error)
			return null
		}
	}

	useEffect(() => {
		const getInitialUser = async () => {
			try {
				const { data: { user } } = await supabase.auth.getUser()
				setUser(user)
				if (user) {
					const userProfile = await fetchProfile(user.id)
					setProfile(userProfile)
				}
			} finally {
				setLoading(false)
			}
		}

		getInitialUser()

		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
			const currentUser = session?.user ?? null
			setUser(currentUser)
			if (currentUser) {
				const userProfile = await fetchProfile(currentUser.id)
				setProfile(userProfile)
			} else {
				setProfile(null)
			}
		})

		return () => {
			subscription?.unsubscribe()
		}
	}, [])

	const logout = async () => {
		await supabase.auth.signOut()
		setUser(null)
		setProfile(null)
	}

	return (
		<AuthContext.Provider value={{ user, profile, loading, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthContextProvider')
	}
	return context
}

