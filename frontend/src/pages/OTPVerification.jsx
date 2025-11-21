import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'

const OTPVerification = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email') // 'email' or 'verify'
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    try {
      setLoading(true)
      await authAPI.resendOTP(email)
      toast.success('OTP sent to your email')
      setStep('verify')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    try {
      setLoading(true)
      await authAPI.verifyOTP(email, otp)
      toast.success('Email verified successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'email' ? 'Resend OTP' : 'Verify Email'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'email' 
              ? 'Enter your email to receive OTP'
              : 'Enter the 6-digit OTP sent to your email'
            }
          </p>
        </div>

        {step === 'email' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <p className="mt-2 text-sm text-gray-500">
                Didn't receive OTP?{' '}
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-primary-600 hover:text-primary-500"
                >
                  Resend
                </button>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default OTPVerification

