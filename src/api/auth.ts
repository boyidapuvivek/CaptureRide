import apiClient from "./apiClient";
import endpoints  from "./apiRoutes";

export const loginUser = (email: string, password: string) =>
  apiClient.post(endpoints.LOGIN, { email, password });

export const signupUser = (username: string, email: string, password: string) =>
  apiClient.post(endpoints.SIGNUP, { username, email, password });
