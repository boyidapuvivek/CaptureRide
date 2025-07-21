import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.BASE_URL;
const TIMEOUT = process.env.TIMEOUT;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
