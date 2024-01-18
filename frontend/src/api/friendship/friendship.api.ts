import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});


export const getFriendshipStatus = (id: number) => apiInstance.get(`/friendship/status/${id}`);
export const getFriendList = () => apiInstance.get(`/friendship/friendlist`);