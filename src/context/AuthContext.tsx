import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from '@/lib/client'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()
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

		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

