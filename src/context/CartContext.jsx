import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../services/cartService'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems]     = useState([])
  const [totalPrice, setTotalPrice]   = useState(0)
  const [cartLoading, setCartLoading] = useState(false)
  const { isAuthenticated }           = useAuth()
  const hasFetched                    = useRef(false)

  useEffect(() => {
    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true
      fetchCart()
    }
    if (!isAuthenticated) {
      hasFetched.current = false
      setCartItems([])
      setTotalPrice(0)
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      setCartLoading(true)
      const cart = await getCart()
      setCartItems(cart?.items || [])
      setTotalPrice(cart?.totalPrice || 0)
    } catch {
      setCartItems([])
      setTotalPrice(0)
    } finally {
      setCartLoading(false)
    }
  }

  // ── Optimistic add ───────────────────────────────────────
  const addItem = async (productId, quantity = 1) => {
    try {
      const cart = await addToCart({ productId, quantity })
      // Update directly from response — no fetchCart needed
      setCartItems(cart?.items || [])
      setTotalPrice(cart?.totalPrice || 0)
    } catch (err) {
      throw err // let the page handle the toast
    }
  }

  // ── Optimistic update ────────────────────────────────────
  const updateItem = async (productId, quantity) => {
    // 1. Save previous state for rollback
    const previousItems     = cartItems
    const previousTotalPrice = totalPrice

    // 2. Update UI instantly
    const updatedItems = cartItems.map((item) => {
      const id = item.productId?._id || item.productId
      if (id?.toString() === productId?.toString()) {
        return { ...item, quantity }
      }
      return item
    })
    const newTotalPrice = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )
    setCartItems(updatedItems)
    setTotalPrice(newTotalPrice)

    // 3. Call API in background
    try {
      const cart = await updateCartItem({ productId, quantity })
      // Sync with server response
      setCartItems(cart?.items || [])
      setTotalPrice(cart?.totalPrice || 0)
    } catch (err) {
      // 4. Revert on error
      setCartItems(previousItems)
      setTotalPrice(previousTotalPrice)
      toast.error(
        err?.response?.data?.message || 'Failed to update quantity'
      )
    }
  }

  // ── Optimistic remove ────────────────────────────────────
  const removeItem = async (productId) => {
    // 1. Save previous state
    const previousItems      = cartItems
    const previousTotalPrice = totalPrice

    // 2. Remove instantly from UI
    const updatedItems = cartItems.filter((item) => {
      const id = item.productId?._id || item.productId
      return id?.toString() !== productId?.toString()
    })
    const newTotalPrice = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )
    setCartItems(updatedItems)
    setTotalPrice(newTotalPrice)

    // 3. Call API in background
    try {
      const cart = await removeCartItem(productId)
      setCartItems(cart?.items || [])
      setTotalPrice(cart?.totalPrice || 0)
    } catch (err) {
      // 4. Revert on error
      setCartItems(previousItems)
      setTotalPrice(previousTotalPrice)
      toast.error('Failed to remove item')
    }
  }

  // ── Clear cart ───────────────────────────────────────────
  const emptyCart = async () => {
    const previousItems      = cartItems
    const previousTotalPrice = totalPrice

    // Optimistically clear
    setCartItems([])
    setTotalPrice(0)

    try {
      await clearCart()
    } catch {
      // Revert on error
      setCartItems(previousItems)
      setTotalPrice(previousTotalPrice)
      toast.error('Failed to clear cart')
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      cartLoading,
      totalItems,
      totalPrice,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      emptyCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)