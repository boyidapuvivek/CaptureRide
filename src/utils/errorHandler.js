// src/api/errorHandler.js
import { Alert } from "react-native";

export const handleError = (error) => {
  let title = "Error";
  let message = "Something went wrong";

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        title = "Invalid Request";
        message = data?.error || data?.message || "Bad request";
        break;
      case 401:
        title = "Authentication Failed";
        message = data?.error || "Please login again";
        break;
      case 403:
        title = "Access Denied";
        message = data?.error || "You don't have permission";
        break;
      case 404:
        title = "Not Found";
        message = data?.error || "Resource not found";
        break;
      case 422:
        title = "Validation Error";
        message = data?.error || "Please check your input";
        break;
      case 500:
        title = "Server Error";
        message = "Internal server error. Please try again later";
        break;
      default:
        title = "Request Failed";
        message = data?.error || data?.message || `Error ${status}`;
    }
  } else if (error.request) {
    // Network error
    title = "Network Error";
    message = "Please check your internet connection";
  } else {
    // Other error
    title = "Error";
    message = error.message || "Something went wrong";
  }

  return { title, message };
};

export const showError = (error) => {
  const errorInfo = handleError(error);
  Alert.alert(errorInfo.title, errorInfo.message);
};
