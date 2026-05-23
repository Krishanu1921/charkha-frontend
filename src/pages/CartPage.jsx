import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import BottomNavBar from '../components/common/BottomNavBar'
import Button from '../components/ui/Button'
import { formatPrice } from '../utils/formatters'
import ROUTES from '../constants/routes'
import toast from 'react-hot-toast'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    cartItems,
    cartLoading,
    totalItems,
    totalPrice,
    updateItem,
    removeItem,
    emptyCart,
  } = useCart()

  const handleQuantityChange = async (productId, currentQty, change) => {
    const newQty = currentQty + change
    if (newQty < 1) return
    try {
      await updateItem(productId, newQty)
    } catch {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId)
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    try {
      await emptyCart()
      toast.success('Cart cleared')
    } catch {
      toast.error('Failed to clear cart')
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate(ROUTES.PAYMENT)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* ── Header ── */}
      <div
        className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="w-9 h-9 bg-gray-50 border border-gray-100
                rounded-full flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div>
              <h1
                className="text-lg font-bold text-[#1a1a1a]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                My Cart
              </h1>
              <p className="text-xs text-gray-400">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs text-red-400 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* ── Loading ── */}
      {cartLoading ? (
        <div className="px-5 pt-5 flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-28 animate-pulse"
            />
          ))}
        </div>

      /* ── Empty state ── */
      ) : cartItems.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-[60vh] px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShoppingBag size={64} className="text-gray-200 mb-4" />
          <h2 className="text-lg font-bold text-gray-300 mb-1">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-300 text-center mb-6">
            Looks like you haven't added anything yet
          </p>
          <Button onClick={() => navigate(ROUTES.HOME)}>
            Start Shopping
          </Button>
        </motion.div>

      /* ── Cart items ── */
      ) : (
        <div className="px-5 pt-5 flex flex-col gap-3">
          <AnimatePresence>
            {cartItems.map((item) => {
              const product   = item.productId
              const productId = product?._id || item.productId

              return (
                <motion.div
                  key={productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl p-4 flex gap-3 shadow-sm"
                >
                  {/* ── Product image ── */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden
                    bg-gray-100 flex-shrink-0">
                    {product?.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center
                        justify-center text-3xl bg-orange-50">
                        👗
                      </div>
                    )}
                  </div>

                  {/* ── Product details ── */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a1a]
                        leading-tight">
                        {product?.title || 'Product'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    {/* ── Quantity + Price ── */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-[#FF6B35]">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(productId, item.quantity, -1)
                          }
                          className="w-7 h-7 rounded-full border border-gray-200
                            flex items-center justify-center"
                        >
                          <Minus size={12} className="text-gray-500" />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(productId, item.quantity, 1)
                          }
                          disabled={item.quantity >= product?.stock}
                          className="w-7 h-7 rounded-full bg-[#FF6B35]
                            flex items-center justify-center
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={12} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Remove ── */}
                  <button
                    onClick={() => handleRemove(productId)}
                    className="self-start p-1"
                  >
                    <Trash2 size={16} className="text-gray-300
                      hover:text-red-400 transition-colors" />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* ── Order summary ── */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mt-2">
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">
              Order Summary
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Delivery</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="h-px bg-gray-100 my-1" />
              <div className="flex justify-between text-sm font-bold
                text-[#1a1a1a]">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Checkout button ── */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-5 z-40">
          <Button
            fullWidth
            size="lg"
            onClick={handleCheckout}
          >
            Proceed to Checkout · {formatPrice(totalPrice)}
          </Button>
        </div>
      )}

      <BottomNavBar />
    </div>
  )
}