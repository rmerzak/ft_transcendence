import { apiInstance } from "../axios/axios.api";

export const getUserInfo = () => apiInstance.get("/users/me");

export const logout = () => apiInstance.get("/auth/logout");

export const getUserInfoById = (id: number) => apiInstance.get(`/users/user/${id}`);
export const isValidAccessToken = () => apiInstance.get(`/auth/validateToken`);