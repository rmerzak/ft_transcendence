import axios from "axios";
import { apiInstance } from "../axios/axios.api";

export const getUnreadNotification = () => apiInstance.get("/notifications/unread");
export const postReadNotification = (id: number) => apiInstance.post(`/notifications/read/${id}`);