import axiosInstance from './axiosInstance'

export const getAllCategories = async () => {
  const { data } = await axiosInstance.get('/category/')
  return data.data // { success, count, data: categories[] }
}

export const getCategoryById = async (id) => {
  const { data } = await axiosInstance.get(`/category/${id}`)
  return data.data
}