import { chatRoom } from "@/interfaces";
import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export const makeConversation = (id: number, chatRoomData:chatRoom) => apiInstance.post(`/chat/user/${id}`, chatRoomData);