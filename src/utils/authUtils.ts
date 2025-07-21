// utils/authUtils.js
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

// Store tokens - ensure they're strings
export const storeTokens = async (accessToken, refreshToken) => {
  try {
    if (!accessToken || !refreshToken) {
      throw new Error(
        "Cannot store undefined or null accessToken or refreshToken"
      );
    }

    const accessTokenString =
      typeof accessToken === "string"
        ? accessToken
        : JSON.stringify(accessToken);
    const refreshTokenString =
      typeof refreshToken === "string"
        ? refreshToken
        : JSON.stringify(refreshToken);

    if (typeof accessTokenString !== "string") {
      throw new Error("Access token is not a valid string");
    }
    if (typeof refreshTokenString !== "string") {
      throw new Error("Refresh token is not a valid string");
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessTokenString);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshTokenString);
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw error;
  }
};

export const storeUserData = async (userData) => {
  try {
    if (!userData) {
      throw new Error("Cannot store undefined or null userData");
    }

    const userDataString =
      typeof userData === "string" ? userData : JSON.stringify(userData);

    if (typeof userDataString !== "string") {
      throw new Error("userData could not be stringified");
    }

    await SecureStore.setItemAsync(USER_DATA_KEY, userDataString);
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

// Get access token
export const getAccessToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

// Get refresh token
export const getRefreshToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

// Get user data - parse JSON
export const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Clear all tokens and user data
export const clearTokens = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing tokens:", error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await getAccessToken();
    return !!token;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// import * as SecureStore from "expo-secure-store";

// export const storeTokens = async ({accessToken , refreshToken}) => {
//     await SecureStore.setItemAsync('accessToken',accessToken)
//     await SecureStore.setItemAsync('refreshToken',refreshToken)
// }

// export const getAccessToken = async () => {
//     return await SecureStore.getItemAsync('accessToken')
// }

// export const clearTokens = async () => {
//     await SecureStore.deleteItemAsync('accessToken')
//     await SecureStore.deleteItemAsync('refreshToken')
// }

// export const isUserLoggedIn = async ()=>{
//     const token = getAccessToken();
//     return !!token;
// }
