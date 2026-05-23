// Format price to Indian locale
export const formatPrice = (price) => {
  if (!price && price !== 0) return '—'
  return `₹${Number(price).toLocaleString('en-IN')}`
}

// Calculate discount percentage
export const getDiscountPercent = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return null
  return Math.round(((price - discountPrice) / price) * 100)
}

// Get final price (discounted or original)
export const getFinalPrice = (price, discountPrice) => {
  if (discountPrice && discountPrice < price) return discountPrice
  return price
}

// Get emoji for category name
export const getCategoryEmoji = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('men') && !n.includes('women')) return '👔'
  if (n.includes('women')) return '👗'
  if (n.includes('kid')) return '🧒'
  if (n.includes('shoe') || n.includes('foot')) return '👟'
  if (n.includes('bag')) return '👜'
  if (n.includes('accessor')) return '💍'
  return '👕'
}

// Truncate text
export const truncate = (text = '', maxLength = 30) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}