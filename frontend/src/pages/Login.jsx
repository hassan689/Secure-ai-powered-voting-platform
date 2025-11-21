import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { HiBeaker } from 'react-icons/hi'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const testCredentials = {
    voter: {
      email: 'test@example.com',
      password: 'test123'
    },
    admin: {
      username: 'admin',
      password: 'admin123'
    }
  }
  const fillTestCredentials = () => {
    if (isAdmin) {
      setEmail(testCredentials.admin.username)
      setPassword(testCredentials.admin.password)
      toast.info('Test admin credentials filled!')
    } else {
      setEmail(testCredentials.voter.email)
      setPassword(testCredentials.voter.password)
      toast.info('Test voter credentials filled!')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password, isAdmin)
    
    if (result.success) {
      toast.success('Login successful!')
      navigate(isAdmin ? '/admin' : '/dashboard')
    } else {
      toast.error(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        {/* Test Login Section */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 flex items-center">
                <HiBeaker className="mr-1" /> Test Login
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Click to fill test credentials
              </p>
            </div>
            <button
              type="button"
              onClick={fillTestCredentials}
              className="px-3 py-1.5 text-xs font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
            >
              Fill Test Data
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => {
                    setIsAdmin(e.target.checked)
                    // Clear fields when switching
                    setEmail('')
                    setPassword('')
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Login as Admin</span>
              </label>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                {isAdmin ? 'Username' : 'Email address'}
              </label>
              <input
                id="email-address"
                name="email"
                type="text"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder={isAdmin ? 'Username' : 'Email address'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

