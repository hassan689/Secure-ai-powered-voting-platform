import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { electionAPI, notificationAPI } from '../services/api'

// TEST MODE: Mock user for testing
const TEST_MODE = true
const MOCK_USER = {
  Email: 'test@example.com',
  VoterID: 1,
  isAdmin: false
}

const VoterDashboard = () => {
  const { user } = useAuth()
  const displayUser = TEST_MODE && !user ? MOCK_USER : user
  const [activeElections, setActiveElections] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchActiveElections()
    fetchUnreadCount()
  }, [])

  const fetchActiveElections = async () => {
    try {
      const data = await electionAPI.getActive()
      setActiveElections(data.slice(0, 3)) // Show first 3
    } catch (error) {
      console.error('Failed to fetch elections:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const voterId = displayUser?.VoterID || displayUser?.voterid
      if (voterId) {
        const data = await notificationAPI.getUnreadCount(voterId)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      // In test mode, set a mock count
      if (TEST_MODE) {
        setUnreadCount(0)
      }
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Dashboard</h1>
        {TEST_MODE && !user && (
          <div className="mb-2 bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <p className="text-sm text-yellow-700">
              <strong>Test Mode:</strong> Authentication bypassed. You can browse the frontend without logging in.
            </p>
          </div>
        )}
        <p className="text-gray-600">Welcome back, {displayUser?.Email || displayUser?.email || 'Test User'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link
          to="/elections"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow min-h-[140px]"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-500 rounded-md p-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-500">Elections</p>
              <p className="text-3xl font-bold text-gray-900">View All</p>
            </div>
          </div>
        </Link>

        <Link
          to="/vote-history"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow min-h-[140px]"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary-500 rounded-md p-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-500">Vote History</p>
              <p className="text-3xl font-bold text-gray-900">View</p>
            </div>
          </div>
        </Link>

        <Link
          to="/notifications"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow relative min-h-[140px]"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-400 rounded-md p-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-2-2H7a2 2 0 00-2 2v.341C4.67 6.165 3 8.388 3 11v3.159c0 .538-.214 1.055-.595 1.436L1 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-500">Notifications</p>
              <p className="text-3xl font-bold text-gray-900">
                {unreadCount > 0 && (
                  <span className="text-red-500">{unreadCount} new</span>
                )}
                {unreadCount === 0 && 'View'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        <Link
          to="/polling-stations"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow min-h-[140px]"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary-400 rounded-md p-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-500">Polling Stations</p>
              <p className="text-3xl font-bold text-gray-900">Find</p>
            </div>
          </div>
        </Link>
      </div>

      {activeElections.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Elections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeElections.map((election) => (
              <Link
                key={election.electionid}
                to={`/vote/${election.electionid}`}
                className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border-l-4 border-primary-500 block min-h-[200px]"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{election.title}</h3>
                <p className="text-base text-gray-600 mb-4">{election.description?.substring(0, 120)}...</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Active - Vote Now
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Status</h2>
          
          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Welcome, <strong>{displayUser?.Email || displayUser?.email || 'Test User'}</strong>! 
                  {displayUser?.IsVerified || displayUser?.isverified 
                    ? ' Your account is verified and you can vote in elections.'
                    : ' Your account verification is pending admin approval.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg min-h-[140px]">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-500 truncate">Account Status</dt>
                      <dd className="text-xl font-medium text-gray-900">Pending Verification</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg min-h-[140px]">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-500 truncate">Email</dt>
                      <dd className="text-xl font-medium text-gray-900">{user?.Email}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg min-h-[140px]">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-base font-medium text-gray-500 truncate">Role</dt>
                      <dd className="text-xl font-medium text-gray-900">Voter</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoterDashboard

