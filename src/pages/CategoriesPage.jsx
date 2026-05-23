import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategories } from '../hooks/useCategories'
import { useProductsByCategory } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/common/ProductCard'
import BottomNavBar from '../components/common/BottomNavBar'
import { getCategoryEmoji, formatPrice } from '../utils/formatters'
import ROUTES from '../constants/routes'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function CategoriesPage() {
  const navigate = useNavigate()
  const { data: categories = [], isLoading } = useCategories()
  const [expandedCategory, setExpandedCategory] = useState(null)

  const handleToggle = (catId) => {
    setExpandedCategory(prev => prev === catId ? null : catId)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Header ── */}
      <div
        className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <h1
          className="text-xl font-bold text-[#1a1a1a]"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Categories
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Browse all collections
        </p>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-3">

        {/* ── Loading ── */}
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-16 animate-pulse"
              />
            ))}
          </>

        /* ── Empty ── */
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-300">
            <p className="text-4xl mb-2">🗂️</p>
            <p className="text-sm">No categories found</p>
          </div>

        /* ── Category list ── */
        ) : categories.map((cat) => (
          <CategorySection
            key={cat._id}
            category={cat}
            isExpanded={expandedCategory === cat._id}
            onToggle={() => handleToggle(cat._id)}
            onNavigate={(productId) =>
              navigate(`/trial/${productId}`)
            }
          />
        ))}

      </div>

      <BottomNavBar />
    </div>
  )
}

// ── Category section with expandable products ────────────────
function CategorySection({ category, isExpanded, onToggle, onNavigate }) {
  const { addItem } = useCart()

  const { data: products = [], isLoading } = useProductsByCategory(
    isExpanded ? category._id : null
  )

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation()
    try {
      await addItem(productId, 1)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* ── Category header ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-4 py-4"
      >
        {/* Emoji */}
        <div className={`w-12 h-12 rounded-full flex items-center
          justify-center text-2xl transition-all duration-200
          ${isExpanded
            ? 'bg-[#FF6B35] scale-105'
            : 'bg-orange-50'}`}
        >
          {getCategoryEmoji(category.name)}
        </div>

        {/* Name + description */}
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-[#1a1a1a]">
            {category.name}
          </p>
          {category.description && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {category.description}
            </p>
          )}
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>

      {/* ── Products ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 border-t border-gray-50 pt-3">

              {/* Loading skeletons */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3
                  md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-2xl h-48
                        animate-pulse"
                    />
                  ))}
                </div>

              /* No products */
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-gray-300">
                  <p className="text-3xl mb-2">📦</p>
                  <p className="text-xs">No products in this category</p>
                </div>

              /* Products grid */
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3
                  md:grid-cols-4 gap-3">
                  {products.map((product, i) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={(e) =>
                          handleAddToCart(e, product._id)
                        }
                        onPress={() => onNavigate(product._id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}