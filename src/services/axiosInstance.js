import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
  },
});

// Auto-refresh if access token expires
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        // Backend reads refresh token from DB, sets new access token cookie
        await axios.post(
          'http://localhost:8000/api/v1/auth/refresh-token',
          {},
          { withCredentials: true }
        )

        // Retry the original request — new cookie is now set automatically
        return axiosInstance(original)

      } catch (refreshError) {
        window.location.href = '/signup'
        return Promise.reject(refreshError)
      }
    }

    // Improve error message extraction
    const errorResponse = error.response
    if (errorResponse?.data) {
      error.message = errorResponse.data.message || errorResponse.data.error || error.message
    } else if (error.message === 'Network Error' || !navigator.onLine) {
      error.message = 'Network Error: Unable to connect to server'
    }

    return Promise.reject(error);
  }
)

export default axiosInstance;