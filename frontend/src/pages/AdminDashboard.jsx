import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.Username || 'Admin'}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/voters"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow min-h-[160px]"
        >
          <div className="p-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-500 rounded-md p-4 shadow-md">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-base font-medium text-gray-500 truncate">Manage Voters</dt>
                  <dd className="text-2xl font-medium text-gray-900">View & Verify</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white overflow-hidden shadow rounded-lg min-h-[160px]">
          <div className="p-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-secondary-500 rounded-md p-4 shadow-md">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-base font-medium text-gray-500 truncate">Verified Voters</dt>
                  <dd className="text-2xl font-medium text-gray-900">-</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg min-h-[160px]">
          <div className="p-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-400 rounded-md p-4 shadow-md">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-base font-medium text-gray-500 truncate">Pending Verification</dt>
                  <dd className="text-2xl font-medium text-gray-900">-</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

