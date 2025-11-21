import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    FullName: '',
    CNIC: '',
    Email: '',
    Password: '',
    ConfirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.Password !== formData.ConfirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.Password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { ConfirmPassword, ...data } = formData
    const result = await register(data)
    
    if (result.success) {
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } else {
      toast.error(result.error || 'Registration failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="FullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="FullName"
                name="FullName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.FullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="CNIC" className="block text-sm font-medium text-gray-700">
                CNIC
              </label>
              <input
                id="CNIC"
                name="CNIC"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your CNIC"
                value={formData.CNIC}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="Email"
                name="Email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.Email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="Password"
                name="Password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.Password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="ConfirmPassword"
                name="ConfirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Confirm your password"
                value={formData.ConfirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

