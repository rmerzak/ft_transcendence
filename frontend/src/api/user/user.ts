import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export const getUserInfo = () => apiInstance.get("/users/me");

export const logout = () => apiInstance.get("/auth/logout");