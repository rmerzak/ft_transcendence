import { Messages, ChatRoom } from "@/interfaces";
import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export const makeConversation = (id: number, chatRoomData:ChatRoom) => apiInstance.post(`/chat/user/${id}`, chatRoomData);
export const getChatRoomMembers = (id: number) => apiInstance.get(`/chat/user?chatRoomId=${id}`);
export const getChatRoomsJoined = () => apiInstance.get(`/chat/rooms`);
export const getChatRoomsNotJoined = () => apiInstance.get(`/chat/rooms/not`);
export const getChatRoomMessages = (id: number) => apiInstance.get(`/chat/user/${id}`);
export const addMessage = (messageData: Messages) => apiInstance.post(`/chat/user`, messageData);
export const updateMessage = (messageData: any) => apiInstance.put(`/chat`, messageData);
export const deleteMessage = (id: number) => apiInstance.delete(`/chat?id=${id}`);