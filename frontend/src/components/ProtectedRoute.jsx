import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// TEST MODE: Set to true to bypass authentication for testing
const TEST_MODE = true

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  // Bypass authentication in test mode
  if (TEST_MODE) {
    return <Outlet />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

