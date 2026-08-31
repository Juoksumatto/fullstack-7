import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/Errorboundary'
import { NotificationContextProvider } from './context/notification.context'
import { UserContextProvider } from './context/user.context'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
	<ErrorBoundary>
		<NotificationContextProvider>
			<UserContextProvider>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</UserContextProvider>
		</NotificationContextProvider>
	</ErrorBoundary>,
)
