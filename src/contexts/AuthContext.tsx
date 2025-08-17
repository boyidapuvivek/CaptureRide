// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react"
import {
  getAccessToken,
  storeTokens,
  storeUserData,
  getUserData,
  clearTokens,
} from "../utils/authUtils"
import { Alert } from "react-native"

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await getAccessToken()
        const userData = await getUserData()

        if (token && userData) {
          setUser({ ...userData, token })
        }
      } catch (error) {
        Alert.alert("Error during auth bootstrap:", error?.message)
      } finally {
        setLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  const login = async (accessToken, refreshToken, userInfo) => {
    try {
      // Store tokens and user data separately
      await storeTokens(accessToken, refreshToken)
      await storeUserData(userInfo)

      // Update state
      setUser({ ...userInfo, token: accessToken })
    } catch (error) {
      Alert.alert("Error during login:", error?.message)
      throw error
    }
  }

  const logout = async (message) => {
    try {
      await clearTokens()
      setUser(null)
    } catch (error) {
      Alert.alert("Error during logout:", error?.message)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
