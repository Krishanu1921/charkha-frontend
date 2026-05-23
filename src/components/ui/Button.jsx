import { motion } from 'framer-motion'

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
}) {
  const base = `font-semibold rounded-2xl transition-all flex items-center
    justify-center gap-2`

  const variants = {
    primary: 'bg-[#FF6B35] text-white shadow-sm hover:bg-[#e85a25]',
    secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    outline: 'border border-[#FF6B35] text-[#FF6B35] hover:bg-orange-50',
    ghost: 'text-[#FF6B35] hover:bg-orange-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white
            rounded-full animate-spin" />
          Please wait...
        </>
      ) : children}
    </motion.button>
  )
}