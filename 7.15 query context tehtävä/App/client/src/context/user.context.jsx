import { createContext, useContext, useEffect, useState } from 'react'
import { getUser, saveUser, removeUser } from '../services/presistentUser'

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
	const [user, setUser] = useState(getUser)

	useEffect(() => {
		if (user) {
			saveUser(user)
		} else {
			removeUser()
		}
	}, [user])

	const login = (userData) => setUser(userData);
	const clearUser = () => setUser(null);
	const logout = clearUser

	return (
		<UserContext.Provider value={{ user, setUser, clearUser, login, logout  }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}

	return context;
}

export default UserContext