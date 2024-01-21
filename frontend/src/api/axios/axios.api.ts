import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
});

