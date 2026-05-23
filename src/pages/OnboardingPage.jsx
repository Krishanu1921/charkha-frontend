import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // If already logged in, skip onboarding
  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F2C4B0] flex flex-col">

      {/* Background circle decoration */}
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-[#e8a88a] opacity-40" />
      <div className="absolute bottom-[160px] left-[-60px] w-[200px] h-[200px] rounded-full bg-[#e8a88a] opacity-30" />

      {/* Fashion image area */}
      <motion.div
        className="flex-1 flex items-center justify-center pt-16 px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Placeholder for fashion image — replace src with your actual image */}
        <div className="relative w-[280px] h-[340px] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/onboarding-hero.png"
            alt="Discover your style"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image not added yet
              e.target.style.display = 'none'
            }}
          />
          {/* Fallback gradient block if no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#e8a88a] flex items-center justify-center">
            <span className="text-white text-6xl">👗</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom card */}
      <motion.div
        className="bg-white rounded-t-[36px] px-8 pt-10 pb-12 shadow-xl"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        {/* App name */}
        <motion.p
          className="text-[#FF6B35] text-sm font-semibold tracking-[0.2em] uppercase mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Charkha
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="text-[#1a1a1a] text-[2rem] font-bold leading-tight mb-3"
          style={{ fontFamily: "'Georgia', serif" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          Discover <br /> Your Style
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-400 text-sm leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          Giving old clothes a second life, <br />
          one fresh wash at a time. ♻️
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate('/signup')}
          className="w-full bg-[#FF6B35] text-white font-bold text-base py-4 rounded-2xl shadow-lg tracking-wide"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ backgroundColor: '#e85a25' }}
        >
          Get Started
        </motion.button>

        {/* Already have account */}
        <motion.p
          className="text-center text-gray-400 text-sm mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          Already have an account?{' '}
          <span
            className="text-[#FF6B35] font-semibold cursor-pointer"
            onClick={() => navigate('/signup?mode=login')}
          >
            Log In
          </span>
        </motion.p>
      </motion.div>

    </div>
  )
}