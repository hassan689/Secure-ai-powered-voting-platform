import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LanguageSelector from './LanguageSelector'
import { useState } from 'react'
import { 
  HiHome, 
  HiClipboardList, 
  HiClock, 
  HiBell,
  HiUserGroup,
  HiChartBar,
  HiUser,
  HiLogout,
  HiMenu,
  HiX,
  HiChevronDown,
  HiLocationMarker,
  HiBeaker
} from 'react-icons/hi'

// TEST MODE: Mock user for testing without login
const TEST_MODE = true
const MOCK_USER = {
  Email: 'test@example.com',
  VoterID: 1,
  isAdmin: false,
  Username: 'testuser'
}

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Use mock user in test mode if no real user
  const displayUser = TEST_MODE && !user ? MOCK_USER : user

  const handleLogout = () => {
    if (!TEST_MODE) {
      logout()
      navigate('/login')
    } else {
      // In test mode, just show a message
      alert('Test mode: Logout disabled. Set TEST_MODE to false to enable authentication.')
    }
    setUserMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const NavLink = ({ to, children, icon }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`
        relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive(to)
          ? 'bg-primary-50 text-primary-700 shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
        }
      `}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
      {isActive(to) && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
      )}
    </Link>
  )

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: '📊' },
    { to: '/voters', label: 'Manage Voters', icon: '👥' },
    { to: '/elections', label: 'Elections', icon: '🗳️' },
  ]

  const voterLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/elections', label: 'Elections', icon: '🗳️' },
    { to: '/vote-history', label: 'Vote History', icon: '📜' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
  ]

  const links = displayUser?.isAdmin ? adminLinks : voterLinks

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to={displayUser?.isAdmin ? '/admin' : '/dashboard'} className="flex items-center space-x-3 group">
                <div className="relative">
                  <img 
                    src="/voting-logo.svg" 
                    alt="Voting System Logo" 
                    className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Voting System
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Management Platform</p>
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:items-center md:space-x-2">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} icon={link.icon}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>

              {/* Test Mode Badge */}
              {TEST_MODE && !user && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <HiBeaker className="w-3 h-3 mr-1" /> TEST MODE
                </span>
              )}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-semibold">
                    {displayUser?.isAdmin 
                      ? displayUser.Username?.charAt(0).toUpperCase() || 'A'
                      : displayUser?.Email?.charAt(0).toUpperCase() || 'U'
                    }
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-gray-900">
                      {displayUser?.isAdmin ? displayUser.Username : displayUser?.Email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {displayUser?.isAdmin ? 'Administrator' : 'Voter'}
                    </p>
                  </div>
                  <HiChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 animate-fade-in">
                      <div className="py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {displayUser?.isAdmin ? displayUser.Username : displayUser?.Email || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {displayUser?.isAdmin ? 'Administrator' : 'Voter Account'}
                          </p>
                        </div>
                        <Link
                          to={displayUser?.isAdmin ? '/admin' : '/dashboard'}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <HiUser className="w-4 h-4 mr-2" />
                          My Profile
                        </Link>
                        <Link
                          to="/polling-stations"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <HiLocationMarker className="w-4 h-4 mr-2" />
                          Polling Stations
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <HiLogout className="w-4 h-4 mr-2" />
                          {TEST_MODE && !user ? 'Test Mode' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white animate-slide-in-from-top">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors
                    ${isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                    }
                  `}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="px-4 py-2">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

