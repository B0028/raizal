import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from '@/lib/client'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

export interface UserProfile {
	id: string
	username?: string
	avatar_url?: string
	full_name?: string
}

const AuthContext = createContext<{
	user: User | null
	loading: boolean
	logout: () => Promise<void>
} | null>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getInitialUser = async () => {
			try {
				const { data: { user } } = await supabase.auth.getUser()
				setUser(user)
			} finally {
				setLoading(false)
			}
		}

		getInitialUser()

		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => {
			subscription?.unsubscribe()
		}
	}, [])

	const logout = async () => {
		await supabase.auth.signOut()
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>
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

// Hook para obtener los datos del usuario desde user_metadata
export const useUserProfile = (): UserProfile | null => {
	const { user } = useAuth()
	if (!user) return null

	return {
		id: user.id,
		username: user.user_metadata?.username,
		avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
		full_name: user.user_metadata?.full_name,
	}
}

