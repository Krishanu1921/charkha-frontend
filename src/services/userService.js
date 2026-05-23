import axiosInstance from './axiosInstance'

export const getProfile = async () => {
  const { data } = await axiosInstance.get('/user/profile')
  return data.data
}

export const updateProfile = async (profileData) => {
  const { data } = await axiosInstance.put('/user/profile/update', profileData)
  return data.data
}

export const changePassword = async (passwordData) => {
  const { data } = await axiosInstance.put('/user/change-password', passwordData)
  return data
}

export const getAddresses = async () => {
  const { data } = await axiosInstance.get('/user/address')
  return data.data
}

export const addAddress = async (addressData) => {
  const { data } = await axiosInstance.post('/user/address', addressData)
  return data.data
}

export const updateAddress = async (addressId, addressData) => {
  const { data } = await axiosInstance.put(`/user/address/${addressId}`, addressData)
  return data.data
}

export const deleteAddress = async (addressId) => {
  const { data } = await axiosInstance.delete(`/user/address/${addressId}`)
  return data
};