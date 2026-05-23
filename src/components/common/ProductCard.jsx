import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import { useCart } from '../../context/CartContext'
import { formatPrice, getDiscountPercent, getFinalPrice } from '../../utils/formatters'

export default function ProductCard({ product, onAddToCart, onPress }) {
  const { cartItems } = useCart()

  const hasDiscount    = product.discountPrice && product.discountPrice < product.price
  const discountPercent = getDiscountPercent(product.price, product.discountPrice)
  const finalPrice     = getFinalPrice(product.price, product.discountPrice)
  const isOutOfStock   = product.stock === 0

  // Check current quantity in cart for this product
  const cartItem = cartItems.find((item) => {
    const id = item.productId?._id || item.productId
    return id?.toString() === product._id?.toString()
  })
  const cartQty        = cartItem?.quantity || 0
  const isMaxStock     = cartQty >= product.stock
  const isAddDisabled  = isOutOfStock || isMaxStock

  return (
    <motion.div
      onClick={!isOutOfStock ? onPress : undefined}
      whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm
        border border-gray-50
        ${isOutOfStock ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      {/* ── Image ── */}
      <div
        className="w-full relative bg-gray-100"
        style={{ aspectRatio: '4/3' }}
      >
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.title}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center
            justify-center text-4xl bg-orange-50">
            👗
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2">
            <Badge variant="primary">-{discountPercent}%</Badge>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center
            justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}

        {/* Max stock overlay */}
        {!isOutOfStock && isMaxStock && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">Max added</Badge>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3">
        <p className="text-xs font-semibold text-[#1a1a1a] truncate">
          {product.title}
        </p>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">
          {product.brand || product.categoryId?.name}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#FF6B35]">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-300 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <div className="relative">
            <button
              onClick={onAddToCart}
              disabled={isAddDisabled}
              className="w-7 h-7 bg-[#FF6B35] rounded-full flex items-center
                justify-center text-white text-sm font-bold shadow-sm
                active:scale-90 transition-transform
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cartQty > 0 ? cartQty : '+'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}