import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export const getUnreadNotification = () => apiInstance.get("/notifications/unread");
export const postReadNotification = (id: number) => apiInstance.post(`/notifications/read/${id}`);