import { useAuth } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const { isAuthenticated, username, logout } = useAuth()

  if (!isAuthenticated) return <AuthPage />
  return <DashboardPage username={username} onLogout={logout} />
}