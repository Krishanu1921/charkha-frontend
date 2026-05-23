import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCategories } from '../hooks/useCategories'
import { useProducts, useProductsByCategory } from '../hooks/useProducts'
import { getCategoryEmoji } from '../utils/formatters'
import ProductCard from '../components/common/ProductCard'
import BottomNavBar from '../components/common/BottomNavBar'
import ROUTES from '../constants/routes'
import toast from 'react-hot-toast'
import { IoNotificationsOutline } from 'react-icons/io5'
import { BsCart3 } from 'react-icons/bs'

export default function HomeFeedPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem, totalItems } = useCart()

  const [activeTab, setActiveTab]         = useState('shop')
  const [searchQuery, setSearchQuery]     = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // ── Data fetching via hooks ──
  const { data: categories = [] }                    = useCategories()
  const { data: allProducts = [], isLoading }        = useProducts()
  const { data: categoryProducts = [], isLoading: catLoading } =
    useProductsByCategory(selectedCategory)

  const products = selectedCategory ? categoryProducts : allProducts
  const loading  = selectedCategory ? catLoading : isLoading

  // Local search filter
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation()
    try {
      await addItem(productId, 1)
      toast.success('Added to cart!')
    } catch(err) {
      toast.error(err.response?.data?.message ||'Failed to add to cart')
    }
  }

  const handleCategorySelect = (catId) => {
    setSelectedCategory(prev => prev === catId ? null : catId)
    setSearchQuery('')
  }

  const activeCategoryName = categories.find(
    c => c._id === selectedCategory
  )?.name

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Header ── */}
      <div
        className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Shop With Us
          </h1>

          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 bg-gray-50 border border-gray-100
                rounded-full flex items-center justify-center relative"
            >
              <IoNotificationsOutline size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5
                bg-[#FF6B35] rounded-full" />
            </button>

            <button
              onClick={() => navigate(ROUTES.CART)}
              className="w-9 h-9 bg-[#FF6B35] rounded-full flex items-center
                justify-center relative shadow-sm"
            >
              <BsCart3 size={16} className="text-white" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-white text-[#FF6B35]
                    text-[9px] font-bold w-4 h-4 rounded-full flex items-center
                    justify-center border border-[#FF6B35]"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <TabButton
            active={activeTab === 'shop'}
            onClick={() => setActiveTab('shop')}
          >
            Shop
          </TabButton>
          <TabButton
            active={activeTab === 'sell'}
            onClick={() => {
              setActiveTab('sell')
              navigate(ROUTES.SELL_HOME)
            }}
          >
            Sell & Earn
          </TabButton>
        </div>
      </div>

      <div className="px-5 pt-5">

        {/* ── Search ── */}
        <div
          className="flex items-center gap-3 bg-white border border-gray-100
            rounded-2xl px-4 py-3 mb-5 shadow-sm"
        >
          <span className="text-gray-300 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-gray-600 placeholder-gray-300
              outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-300 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Categories ── */}
        <Section title="Categories" onSeeAll={() => {navigate(ROUTES.CATEGORIES)}}>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <CategoryChip
              label="All"
              emoji="✨"
              active={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            />
            {categories.map((cat) => (
              <CategoryChip
                key={cat._id}
                label={cat.name}
                emoji={getCategoryEmoji(cat.name)}
                active={selectedCategory === cat._id}
                onClick={() => handleCategorySelect(cat._id)}
              />
            ))}
          </div>
        </Section>

        {/* ── Today's Deals ── */}
        {!searchQuery && !selectedCategory && (
          <Section title="Today's Deals" onSeeAll={() => {}}>
            <div className="flex gap-3">
              <DealCard
                title="Flash Sale"
                subtitle="Up to 70% off on trending styles"
                color="bg-[#FF6B35]"
                emoji="⚡"
              />
              <DealCard
                title="New Arrivals"
                subtitle="Fresh drops every week"
                color="bg-[#7C3AED]"
                emoji="⭐"
              />
            </div>
          </Section>
        )}

        {/* ── Products ── */}
        <Section
          title={
            selectedCategory
              ? `${activeCategoryName || 'Category'} Items`
              : searchQuery
              ? `Results for "${searchQuery}"`
              : 'Trending Now'
          }
          onSeeAll={() => {}}
        >
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-52 animate-pulse"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-300">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-sm">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 gap-3">
              <AnimatePresence>
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={(e) => handleAddToCart(e, product._id)}
                      onPress={() => navigate(`/trial/${product._id}`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Section>

      </div>

      <BottomNavBar />
    </div>
  )
}

// ── Local UI pieces (page-specific, not reused elsewhere) ────

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all
        ${active ? 'bg-[#FF6B35] text-white shadow-sm' : 'text-gray-400'}`}
    >
      {children}
    </button>
  )
}

function Section({ title, onSeeAll, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#1a1a1a]">{title}</h2>
        <button
          onClick={onSeeAll}
          className="text-xs text-[#FF6B35] font-medium"
        >
          See All →
        </button>
      </div>
      {children}
    </div>
  )
}

function CategoryChip({ label, emoji, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="flex flex-col items-center gap-1.5 min-w-[60px]"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center
          text-xl transition-all duration-200 shadow-sm
          ${active
            ? 'bg-[#FF6B35] scale-110 shadow-orange-200'
            : 'bg-white border border-gray-100'}`}
      >
        {emoji}
      </div>
      <span
        className={`text-[11px] font-medium transition-all
          ${active ? 'text-[#FF6B35] font-bold' : 'text-gray-400'}`}
      >
        {label}
      </span>
    </motion.button>
  )
}

function DealCard({ title, subtitle, color, emoji }) {
  return (
    <div
      className={`flex-1 ${color} rounded-2xl p-4 text-white
        cursor-pointer active:scale-95 transition-transform`}
    >
      <span className="text-2xl">{emoji}</span>
      <p className="font-bold text-sm mt-2">{title}</p>
      <p className="text-[11px] opacity-80 mt-0.5 leading-tight">{subtitle}</p>
    </div>
  )
}