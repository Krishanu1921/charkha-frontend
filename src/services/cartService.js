import axiosInstance from './axiosInstance'

export const getCart = async () => {
  const { data } = await axiosInstance.get('/cart/')
  return data.data // ← backend returns { success, data: cart }
}

export const addToCart = async ({ productId, quantity }) => {
  const { data } = await axiosInstance.post('/cart/add', { productId, quantity })
  return data.data
}

export const updateCartItem = async ({ productId, quantity }) => {
  const { data } = await axiosInstance.put('/cart/update', { productId, quantity })
  return data.data
}

export const removeCartItem = async (productId) => {
  const { data } = await axiosInstance.delete(`/cart/items/${productId}`)
  return data.data
}

export const clearCart = async () => {
  const { data } = await axiosInstance.delete('/cart/clear')
  return data.data
}