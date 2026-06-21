import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from '@/lib/client'

const supabase = createClient()
const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
	const [user, setUser] = useState([]);
	useEffect(()=>{
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			async (event, session) => {
				if (session?.user == null){
					setUser(null)
				} else {
					setUser(session?.user)
				}
			}
		})
		return () => {
			data.subscription;
		}
	},[])
	return (
		<AuthContext.Provider value={{user}}> 
			{children}
		</AuthContext.Provider>
	)
}

export const userAuth = () => {
	return useContext(AuthContext)
}

