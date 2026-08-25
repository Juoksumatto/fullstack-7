import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/Errorboundary'
import { NotificationContextProvider } from './context/notification.context'

ReactDOM.createRoot(document.getElementById('root')).render(
	<ErrorBoundary>
		<NotificationContextProvider>
			<App />
		</NotificationContextProvider>
	</ErrorBoundary>,
)
