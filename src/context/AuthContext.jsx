import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, logoutUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, restore user from localStorage safely
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (formData) => {
    const data = await loginUser(formData)
    // backend returns loggedInUser not user
    const user = data.loggedInUser
    if (user) {
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    }
    return data
  }

  const register = async (formData) => {
    // backend only returns success message on register, no user object
    // so we log them in automatically after register
    await registerUser(formData)
    const data = await loginUser({
      email: formData.email,
      password: formData.password,
    })
    const user = data.loggedInUser
    if (user) {
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    }
    return data
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
    localStorage.removeItem('user')
  }

  const isAuthenticated = !!user
  const isSeller = user?.role === 'seller'

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      isSeller,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)