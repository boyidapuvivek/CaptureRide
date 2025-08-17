// utils/authUtils.js
import * as SecureStore from "expo-secure-store"

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const USER_DATA_KEY = "user_data"

// Store tokens - ensure they're strings
export const storeTokens = async (accessToken, refreshToken) => {
  try {
    if (!accessToken || !refreshToken) {
      throw new Error(
        "Cannot store undefined or null accessToken or refreshToken"
      )
    }

    const accessTokenString =
      typeof accessToken === "string"
        ? accessToken
        : JSON.stringify(accessToken)
    const refreshTokenString =
      typeof refreshToken === "string"
        ? refreshToken
        : JSON.stringify(refreshToken)

    if (typeof accessTokenString !== "string") {
      throw new Error("Access token is not a valid string")
    }
    if (typeof refreshTokenString !== "string") {
      throw new Error("Refresh token is not a valid string")
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessTokenString)
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshTokenString)
  } catch (error) {
    Alert.alert("Error storing tokens:", error?.message)

    throw error
  }
}

export const storeUserData = async (userData) => {
  try {
    if (!userData) {
      throw new Error("Cannot store undefined or null userData")
    }

    const userDataString =
      typeof userData === "string" ? userData : JSON.stringify(userData)

    if (typeof userDataString !== "string") {
      throw new Error("userData could not be stringified")
    }

    await SecureStore.setItemAsync(USER_DATA_KEY, userDataString)
  } catch (error) {
    Alert.alert("Error storing user data:", error?.message)

    throw error
  }
}

// Get access token
export const getAccessToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
    return token
  } catch (error) {
    Alert.alert("Error getting access token:", error?.message)

    return null
  }
}

// Get refresh token
export const getRefreshToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
    return token
  } catch (error) {
    Alert.alert("Error getting refresh token:", error?.message)

    return null
  }
}

// Get user data - parse JSON
export const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync(USER_DATA_KEY)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    Alert.alert("Error getting user data:", error?.message)

    return null
  }
}

// Clear all tokens and user data
export const clearTokens = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
    await SecureStore.deleteItemAsync(USER_DATA_KEY)
  } catch (error) {
    Alert.alert("Error cleaning tokens:", error?.message)

    throw error
  }
}

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await getAccessToken()
    return !!token
  } catch (error) {
    Alert.alert("Error checking authentication:", error?.message)

    return false
  }
}
