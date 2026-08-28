import { createContext, useContext, useEffect, useState } from 'react';

const USER_STORAGE_KEY = 'user';

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
	const [user, setUser] = useState(() => {
		try {
			const storedUser = localStorage.getItem(USER_STORAGE_KEY);
			return storedUser ? JSON.parse(storedUser) : null;
		} catch {
			return null;
		}
	});

	useEffect(() => {
		if (user) {
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(USER_STORAGE_KEY);
		}
	}, [user]);

	const login = (userData) => setUser(userData);
	const clearUser = () => setUser(null);
	const logout = clearUser;

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