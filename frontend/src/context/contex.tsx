'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import io from 'socket.io-client';
import { User } from '@/interfaces';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUnreadNotification } from '@/api/notifications/notifications.api';
export const ContextGlobal = createContext({
  setProfile(user:User) { },
  profile: null,
  socket: null,
  setSocket(socket:any) { },
  notification: null,
});

export const ContextProvider = ({ children }: { children: any }) => {
  useEffect(() => {
    getUnreadNotification().then((res) => { 
      if(res.data)
          setNotification(res.data);
      console.log("notification ",notification); 
  }).catch((err) => { console.log(err)});
  }, []);
  const [profile, setProfile] = useState<User>({
    id: -1,
    email: '',
    firstname: '',
    lastname: '',
    username: '',
    image: '/avatar.jpeg',
    isVerified: false,
    twoFactorSecret: '',
    twoFactorEnabled: false,
  });
  const [socket, setSocket] = useState<any>(null);
  const [notification, setNotification] = useState<Notification[]>([]);
  return <ContextGlobal.Provider value={{
    profile,
    setProfile,
    socket,
    setSocket,
    notification,
    setNotification
  }} > {children} </ContextGlobal.Provider>;
};