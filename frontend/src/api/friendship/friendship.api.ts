import axios from "axios";
import { apiInstance } from "../axios/axios.api";

export const getFriendshipStatus = (id: number) => apiInstance.get(`/friendship/status/${id}`);
export const getFriendList = (id: number) => apiInstance.get(`/friendship/friendlist/${id}`);