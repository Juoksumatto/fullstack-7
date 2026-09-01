import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
	switch (action.type) {
		case 'SET_NOTIFICATION':
			return action.data
		case 'CLEAR_NOTIFICATION':
			return null
		default:
			return state
	}
}

export const NotificationContext = createContext(null)

export const NotificationContextProvider = ({ children }) => {
	const [notification, notificationDispatch] = useReducer(
		notificationReducer,
		null
	)

	return (
		<NotificationContext.Provider value={[notification, notificationDispatch]}>
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotification = () => useContext(NotificationContext)

export default NotificationContext
