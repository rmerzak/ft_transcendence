import { Message, chatRoom } from "@/interfaces";
import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export const makeConversation = (id: number, chatRoomData:chatRoom) => apiInstance.post(`/chat/user/${id}`, chatRoomData);
export const getChatRoomMembers = (id: number) => apiInstance.get(`/chat/user?chatRoomId=${id}`);
export const getChatRoomMessages = (id: number) => apiInstance.get(`/chat/user/${id}`);
export const addMessage = (messageData: Message) => apiInstance.post(`/chat/user`, messageData);
export const updateMessage = (messageData: any) => apiInstance.put(`/chat`, messageData);
export const deleteMessage = (id: number) => apiInstance.delete(`/chat?id=${id}`);