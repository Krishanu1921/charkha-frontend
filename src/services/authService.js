import axiosInstance from './axiosInstance'

export const registerUser = async (formData) => {
  const { data } = await axiosInstance.post('/auth/register', formData);
  console.log('LOGIN RESPONSE:', data)
  return data
  // backend sets access token cookie automatically on response
}

export const loginUser = async (formData) => {
  const { data } = await axiosInstance.post('/auth/login', formData)
  return data
  // backend sets access token cookie automatically on response
}

export const logoutUser = async () => {
  await axiosInstance.post('/auth/logout')
  // backend clears the cookie and invalidates refresh token in DB
}