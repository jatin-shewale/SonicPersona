import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/auth/status', { withCredentials: true })
      if (data.authenticated) {
        setUser(data.user)
        setAuthenticated(true)
      }
    } catch {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = '/auth/login'
  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true })
    } finally {
      setUser(null)
      setAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, authenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
