export default function Badge({
  children,
  variant = 'primary',
  className = '',
}) {
  const variants = {
    primary: 'bg-[#FF6B35] text-white',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-600',
    danger: 'bg-red-100 text-red-500',
    coin: 'bg-[#F5A623] text-white',
  }

  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full
        ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}