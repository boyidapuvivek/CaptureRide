const API_CONFIG = {
  BASE_URL: "http://192.168.1.100:5000/api/v1",
  TIMEOUT: 10000,
};

export const apiRoute = {
  LOGIN: `${API_CONFIG.BASE_URL}/user/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/user/register`,
  LOGOUT: `${API_CONFIG.BASE_URL}/user/logout`,

  ADDRIDE: `${API_CONFIG.BASE_URL}/ride/addRide`,
  GETRIDES: `${API_CONFIG.BASE_URL}/ride/getRides`,
};
