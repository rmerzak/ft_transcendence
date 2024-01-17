import { Messages, ChatRoom, Recent } from "@/interfaces";
import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
    cancelToken: new axios.CancelToken((cancel) => {
        cancel;
    }),
});

export const makeConversation = async (id: number, chatRoomData:ChatRoom) => apiInstance.post(`/chat/user/${id}`, chatRoomData);
export const getChatRoomMembers = async (id: number) => apiInstance.get(`/chat/user?chatRoomId=${id}`);
export const getChatRoomsJoined = async () => apiInstance.get(`/chat/rooms`);
export const getChatRoomsNotJoined = async () => apiInstance.get(`/chat/rooms/not`);
export const getChatRoomMessages = async (id: number) => apiInstance.get(`/chat/user/${id}`);
export const addMessage = async (messageData: Messages) => apiInstance.post(`/chat/user`, messageData);
export const updateMessage = async (messageData: any) => apiInstance.put(`/chat`, messageData);
export const deleteMessage = async (id: number) => apiInstance.delete(`/chat?id=${id}`);
// recent messages
export const getRecentMessages = async () => apiInstance.get(`/chat/recent`);
export const addRecentMessage = async (messageData: Recent) => apiInstance.post(`/chat/recent`, messageData);
export const deleteRecentMessage = async (roomId: number) => apiInstance.delete(`/chat/recent?roomId=${roomId}`);