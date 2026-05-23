import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import ROUTES from '../../constants/routes'
import { Home, LayoutGrid, Heart, User, ShoppingCart } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home',     path: ROUTES.HOME,       icon: Home },
  { label: 'Category', path: ROUTES.CATEGORIES, icon: LayoutGrid },
  { label: 'Wishlist', path: ROUTES.WISHLIST,    icon: Heart },
  { label: 'Account',  path: ROUTES.ACCOUNT,    icon: User },
  { label: 'Cart',     path: ROUTES.CART,       icon: ShoppingCart },
]

export default function BottomNavBar() {
  const navigate      = useNavigate()
  const location      = useLocation()
  const { totalItems } = useCart()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white z-50"
      style={{
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
      }}
    >
      <div className="flex justify-around items-center px-2 pt-3 pb-5
        max-w-lg mx-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path
          const isCart   = label === 'Cart'

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-3 relative"
            >
              {/* Active top line */}
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2
                  h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: isActive ? '24px' : '0px',
                  background: isActive ? '#FF6B35' : 'transparent',
                }}
              />

              {/* Cart badge */}
              {isCart && totalItems > 0 && (
                <span className="absolute -top-1 right-1 bg-[#FF6B35]
                  text-white text-[9px] font-bold w-4 h-4 rounded-full
                  flex items-center justify-center z-10">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}

              {/* Icon */}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? '#FF6B35' : '#9ca3af'}
              />

              {/* Label */}
              <span
                className="text-[11px] font-medium transition-all duration-200"
                style={{ color: isActive ? '#FF6B35' : '#9ca3af' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}