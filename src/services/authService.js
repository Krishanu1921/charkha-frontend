import axiosInstance from './axiosInstance'

export const registerUser = async (formData) => {
  try {
    const { data } = await axiosInstance.post('/auth/register', formData);
    console.log('REGISTER RESPONSE:', data)
    return data
  } catch (error) {
    // Re-throw with more context
    throw error
  }
  // backend sets access token cookie automatically on response
}

export const loginUser = async (formData) => {
  try {
    const { data } = await axiosInstance.post('/auth/login', formData)
    return data
  } catch (error) {
    // Re-throw with more context
    throw error
  }
  // backend sets access token cookie automatically on response
}

export const logoutUser = async () => {
  await axiosInstance.post('/auth/logout')
  // backend clears the cookie and invalidates refresh token in DB
}