import axios from "axios"

const API_CONFIG = {
  BASE_URL: "https://captureridebackend.onrender.com/api/v1",
  TIMEOUT: 20000,
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || "Something went wrong")
    } else if (error.request) {
      // Network error
      throw new Error("Network error. Please check your connection.")
    } else {
      throw new Error("Something went wrong")
    }
  }
)

// OTP API functions
export const otpApi = {
  // Generate OTP
  generateOTP: async (email, purpose = "password_reset") => {
    return await apiClient.post("/otp/generate", { email, purpose })
  },

  // Verify OTP
  verifyOTP: async (email, otp, purpose = "password_reset") => {
    return await apiClient.post("/otp/verify", { email, otp, purpose })
  },

  // Resend OTP
  resendOTP: async (email, purpose = "password_reset") => {
    return await apiClient.post("/otp/resend", { email, purpose })
  },
}

// User API functions
export const userApi = {
  // Reset password
  resetPassword: async (email, newPassword) => {
    return await apiClient.post("/user/reset-password", {
      email,
      newPassword,
    })
  },

  // Your existing API routes
  login: async (email, password) => {
    return await apiClient.post("/user/login", { email, password })
  },

  register: async (username, email, password) => {
    return await apiClient.post("/user/register", { username, email, password })
  },
}

export default apiClient
