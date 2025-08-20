const API_CONFIG = {
  BASE_URL: "https://captureridebackend.onrender.com/api/v1",
  TIMEOUT: 20000,
}

export const apiRoute = {
  LOGIN: `${API_CONFIG.BASE_URL}/user/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/user/register`,
  LOGOUT: `${API_CONFIG.BASE_URL}/user/logout`,
  ADDPROFILE: `${API_CONFIG.BASE_URL}/user/update-profile-image`,
  EDITPROFILE: `${API_CONFIG.BASE_URL}/user/edit-profile`,

  ADDRIDE: `${API_CONFIG.BASE_URL}/ride/addRide`,
  GETRIDES: `${API_CONFIG.BASE_URL}/ride/getRides`,
  DELETERIDE: `${API_CONFIG.BASE_URL}/ride/deleteRide`,

  ADDQR: `${API_CONFIG.BASE_URL}/qr/addQR`,
  GETQR: `${API_CONFIG.BASE_URL}/qr/getQR`,
  DELETEQR: `${API_CONFIG.BASE_URL}/qr/deleteQR`,

  ADDBIKE: `${API_CONFIG.BASE_URL}/bike/addBike`,
  GETBIKE: `${API_CONFIG.BASE_URL}/bike/getBikes`,
  DELETEBIKE: `${API_CONFIG.BASE_URL}/bike/deleteBike`,
}
