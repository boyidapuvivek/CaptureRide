import axios from "axios";
const API_URL = "http://192.168.1.8:5000/api/rides";
// const API_URL = "http://localhost:5000/api/rides";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRides = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.log("error fetching ride:", error?.response.data || error.message);
    throw new Error("Failed to fetch the rides");
  }
};

export const addRide = async (rideData) => {
  try {
    const response = await api.post("/", rideData);
    return response.data;
  } catch (error) {
    console.log(
      "error posting the data :",
      error?.response.data || error.message
    );
    throw new Error("Unable to upload the data");
    return null;
  }
};
