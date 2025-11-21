import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { authAPI } from '../services/api'
import { HiBeaker } from 'react-icons/hi'
import './AuthPage.css'

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  
  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    FullName: '',
    CNIC: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    PhoneNumber: '',
    DateOfBirth: '',
    Address: '',
    City: '',
    Province: ''
  })
  
  const [otpStep, setOtpStep] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')

  const { login, register } = useAuth()
  const navigate = useNavigate()

  // Test credentials
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
    if (isSignUp) {
      setSignUpData({
        FullName: 'Test User',
        CNIC: '12345-1234567-1',
        Email: testCredentials.voter.email,
        Password: testCredentials.voter.password,
        ConfirmPassword: testCredentials.voter.password
      })
      toast.info('Test registration data filled!')
    } else {
      if (isAdmin) {
        setSignInEmail(testCredentials.admin.username)
        setSignInPassword(testCredentials.admin.password)
        toast.info('Test admin credentials filled!')
      } else {
        setSignInEmail(testCredentials.voter.email)
        setSignInPassword(testCredentials.voter.password)
        toast.info('Test voter credentials filled!')
      }
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(signInEmail, signInPassword, isAdmin)
    
    if (result.success) {
      toast.success('Login successful!')
      navigate(isAdmin ? '/admin' : '/dashboard')
    } else {
      toast.error(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    if (signUpData.Password !== signUpData.ConfirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (signUpData.Password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { ConfirmPassword, ...data } = signUpData
    
    try {
      const result = await authAPI.register(data)
      toast.success('Registration successful! Please verify your email with OTP.')
      setRegisterEmail(signUpData.Email)
      setOtpStep(true)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)

    try {
      await authAPI.verifyOTP(registerEmail, otpCode)
      toast.success('Email verified successfully! Please login.')
      setIsSignUp(false)
      setSignInEmail(registerEmail)
      setOtpStep(false)
      setOtpCode('')
      setSignUpData({
        FullName: '',
        CNIC: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        PhoneNumber: '',
        DateOfBirth: '',
        Address: '',
        City: '',
        Province: ''
      })
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      await authAPI.resendOTP(registerEmail)
      toast.success('OTP resent successfully')
    } catch (error) {
      toast.error('Failed to resend OTP')
    }
  }

  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-container">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <img 
          src="/voting-logo-large.svg" 
          alt="Voting Management System Logo" 
          style={{ height: '80px', width: '80px' }}
        />
      </div>
      <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          {!otpStep ? (
            <form onSubmit={handleSignUp}>
              <h1>Create Account</h1>
              <div className="social-container">
                <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-google-plus-g"></i>
                </a>
                <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <span>or use your email for registration</span>
              <input
                type="text"
                name="FullName"
                placeholder="Full Name"
                value={signUpData.FullName}
                onChange={handleSignUpChange}
                required
              />
              <input
                type="text"
                name="CNIC"
                placeholder="CNIC"
                value={signUpData.CNIC}
                onChange={handleSignUpChange}
                required
              />
              <input
                type="email"
                name="Email"
                placeholder="Email"
                value={signUpData.Email}
                onChange={handleSignUpChange}
                required
              />
              <input
                type="password"
                name="Password"
                placeholder="Password"
                value={signUpData.Password}
                onChange={handleSignUpChange}
                required
              />
              <input
                type="password"
                name="ConfirmPassword"
                placeholder="Confirm Password"
                value={signUpData.ConfirmPassword}
                onChange={handleSignUpChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <h1>Verify Email</h1>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit OTP sent to {registerEmail}
              </p>
              <input
                type="text"
                name="otp"
                placeholder="000000"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono"
                required
              />
              <button type="submit" disabled={loading || otpCode.length !== 6}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            
            {/* Test Login Button */}
            <div className="test-login-container">
              <button
                type="button"
                onClick={fillTestCredentials}
                className="test-btn"
              >
                <HiBeaker className="inline mr-1" /> Fill Test Data
              </button>
            </div>

            {/* Admin Checkbox */}
            <div className="admin-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => {
                    setIsAdmin(e.target.checked)
                    setSignInEmail('')
                    setSignInPassword('')
                  }}
                />
                <span>Login as Admin</span>
              </label>
            </div>

            <input
              type="text"
              placeholder={isAdmin ? 'Username' : 'Email'}
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
            />
            <a href="#" onClick={(e) => e.preventDefault()}>Forgot your password?</a>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage

