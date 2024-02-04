import { Messages, ChatRoom, Recent } from "@/interfaces";
import { apiInstance } from "../axios/axios.api";


export const makeConversation = async (id: number, chatRoomData:ChatRoom) => apiInstance.post(`/chat/user/${id}`, chatRoomData);
export const getChatRoomMembers = async (id: number) => apiInstance.get(`/chat/user?chatRoomId=${id}`);
export const getChatRoomsJoined = async () => apiInstance.get(`/chat/rooms`);
export const getChatRoomsNotJoined = async () => apiInstance.get(`/chat/rooms/not`);
export const getChatRoomByName = async (user1: any, user2: string) => apiInstance.get(`/chat/room?user1=${user1}&user2=${user2}`);
export const getChatRoomById = async (id: number) => apiInstance.get(`/chat/room/${id}`);
export const getChatRoomMessages = async (id: number) => apiInstance.get(`/chat/user/${id}`);
export const addMessage = async (messageData: Messages) => apiInstance.post(`/chat/user`, messageData);
export const updateMessage = async (messageData: any) => apiInstance.put(`/chat`, messageData);
export const deleteMessage = async (id: number) => apiInstance.delete(`/chat?id=${id}`);
export const getRecentMessages = async () => apiInstance.get(`/chat/recent`);
export const addRecentMessage = async (messageData: Recent) => apiInstance.post(`/chat/recent`, messageData);
export const deleteRecentMessage = async (roomId: number) => apiInstance.delete(`/chat/recent?roomId=${roomId}`);
export const getChatRoomMemberByRoomId = async (roomId: number) => apiInstance.get(`/chat/room/user/${roomId}`);
export const getChatRoomInvitedMembers = async (roomId: number) => apiInstance.get(`/chat/room/invited/${roomId}`);
export const getChatRoomMembershipStatus = async (roomId: number | undefined) => apiInstance.get(`/chat/room/membership/${roomId}`);