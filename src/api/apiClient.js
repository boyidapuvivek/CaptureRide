import axios from "axios";
import { handleError } from "../utils/errorHandler";

const BASE_URL = process.env.BASE_URL;
const TIMEOUT = process.env.TIMEOUT;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
// let authToken = null;

// export const setAuthToken = (token) => {
//   authToken = token;
//   if (token) {
//     apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete apiClient.defaults.headers.common['Authorization'];
//   }
// };

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 - token expired
    if (error.response?.status === 401) {
      setAuthToken(null);
      // You can add navigation to login here if needed
    }
    return Promise.reject(error);
  }
);

// GET request
export const get = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const errorInfo = handleError(error);
    return {
      success: false,
      error: errorInfo,
      data: null,
    };
  }
};

// POST request
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const errorInfo = handleError(error);
    return {
      success: false,
      error: errorInfo,
      data: null,
    };
  }
};

// PUT request
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(url, data, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const errorInfo = handleError(error);
    return {
      success: false,
      error: errorInfo,
      data: null,
    };
  }
};

// DELETE request
export const del = async (url, config = {}) => {
  try {
    const response = await apiClient.delete(url, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const errorInfo = handleError(error);
    return {
      success: false,
      error: errorInfo,
      data: null,
    };
  }
};

export default apiClient;
