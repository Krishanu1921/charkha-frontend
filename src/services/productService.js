import axiosInstance from './axiosInstance'

export const getAllProducts = async () => {
  const { data } = await axiosInstance.get('/product/')
  return data.data // { success, count, data: products[] }
}

export const searchProducts = async (keyword) => {
  const { data } = await axiosInstance.get(`/product/search?keyword=${keyword}`)
  return data.data
}

export const getProductsByCategory = async (categoryId) => {
  const { data } = await axiosInstance.get(`/product/category/${categoryId}`)
  return data.data
}

export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/product/${id}`)
  return data.data
}