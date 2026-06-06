import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaApple } from 'react-icons/fa'

export default function CreateAccountPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register: registerUser } = useAuth()

  const [mode, setMode] = useState(
    searchParams.get('mode') === 'login' ? 'login' : 'register'
  )
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const switchMode = (newMode) => {
    reset()
    setMode(newMode)
  }

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      if (mode === 'register') {
        await registerUser({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })
        toast.success('Account created successfully!')
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        })
        toast.success('Welcome back!')
      }
      navigate('/home', { replace: true })
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Something went wrong. Please try again.'
      
      // Check for network errors
      if (err?.message?.includes('Network Error') || 
          err?.code === 'ERR_NETWORK' ||
          err?.message?.includes('ERR_CONNECTION_REFUSED')) {
        toast.error('Cannot connect to server. Please check your internet connection.')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 text-sm mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        <motion.h1
          key={mode + '-title'}
          className="text-[1.8rem] font-bold text-[#1a1a1a]"
          style={{ fontFamily: "'Georgia', serif" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {mode === 'register' ? 'Create Account' : 'Welcome Back'}
        </motion.h1>
        <p className="text-gray-400 text-sm mt-1">
          {mode === 'register'
            ? 'Sign up to get started!'
            : 'Login to continue'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <AnimatePresence>
            {/* Full Name — register only */}
            {mode === 'register' && (
              <motion.div
                key="fullName"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <InputField
                  icon="👤"
                  placeholder="Full Name"
                  error={errors.fullName}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name too short' },
                  })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <InputField
            icon="✉️"
            placeholder="Email Address"
            type="email"
            error={errors.email}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            })}
          />

          <AnimatePresence>
            {/* Phone — register only */}
            {mode === 'register' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <InputField
                  icon="📱"
                  placeholder="Phone Number"
                  type="tel"
                  error={errors.phone}
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit number',
                    },
                  })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password */}
          <InputField
            icon="🔒"
            placeholder="Password"
            type="password"
            error={errors.password}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <AnimatePresence>
            {/* Confirm Password — register only */}
            {mode === 'register' && (
              <motion.div
                key="confirmPassword"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <InputField
                  icon="🔒"
                  placeholder="Confirm Password"
                  type="password"
                  error={errors.confirmPassword}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) =>
                      val === watch('password') || 'Passwords do not match',
                  })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terms checkbox — register only */}
          {mode === 'register' && (
            <div className="flex items-start gap-2 mt-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 accent-[#FF6B35]"
                {...register('terms', {
                  required: 'You must accept the terms',
                })}
              />
              <label htmlFor="terms" className="text-xs text-gray-400">
                By signing up, you agree to our{' '}
                <span
                  className="text-[#FF6B35] cursor-pointer underline"
                  onClick={() => window.open('/terms', '_blank')}
                >
                  Terms of Use
                </span>{' '}
                &{' '}
                <span
                  className="text-[#FF6B35] cursor-pointer underline"
                  onClick={() => window.open('/privacy', '_blank')}
                >
                  Privacy Policy
                </span>
              </label>
            </div>
          )}
          {errors.terms && (
            <p className="text-red-400 text-xs -mt-2">{errors.terms.message}</p>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B35] text-white font-bold py-4 rounded-2xl mt-2 disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading
              ? 'Please wait...'
              : mode === 'register'
              ? 'Sign Up'
              : 'Log In'}
          </motion.button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Social login buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <SocialButton icon={<FcGoogle size={24} />} label="Google" />
          <SocialButton
            icon={<FaFacebook size={24} color="#1877F2" />}
            label="Facebook"
          />
          <SocialButton
            icon={<FaApple size={24} color="#000000" />}
            label="Apple"
          />
        </div>

        {/* Switch mode */}
        <p className="text-center text-gray-400 text-sm mb-10">
          {mode === 'register'
            ? 'Already have an account? '
            : "Don't have an account? "}
          <span
            className="text-[#FF6B35] font-semibold cursor-pointer"
            onClick={() =>
              switchMode(mode === 'register' ? 'login' : 'register')
            }
          >
            {mode === 'register' ? 'Log In' : 'Sign Up'}
          </span>
        </p>

      </div>
    </div>
  )
}

// ── Reusable input field ─────────────────────────────────────
function InputField({ icon, placeholder, type = 'text', error, ...props }) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 border rounded-2xl px-4 py-3.5 bg-gray-50
          ${error ? 'border-red-300' : 'border-gray-100'}
          focus-within:border-[#FF6B35] focus-within:bg-white transition-all`}
      >
        <span className="text-base">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-700
            placeholder-gray-300 outline-none"
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1 ml-1">{error.message}</p>
      )}
    </div>
  )
}

// ── Social button ────────────────────────────────────────────
function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      className="w-16 h-16 rounded-2xl border border-gray-100 bg-gray-50
        flex items-center justify-center
        hover:border-[#FF6B35] hover:bg-orange-50 transition-all"
      aria-label={`Continue with ${label}`}
    >
      {icon}
    </button>
  )
}