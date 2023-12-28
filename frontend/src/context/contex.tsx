'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import io from 'socket.io-client';
import { User } from '@/interfaces';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const ContextGlobal = createContext({
  setProfile() { },
  profile: null,
  socket: null,
  setSocket() { },
});

export const ContextProvider = ({ children }: { children: any }) => {
  useEffect(() => {
    

    

    // Cleanup function
    
  }, []);
  const [profile, setProfile] = useState<User | null>({
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
  return <ContextGlobal.Provider value={{
    profile,
    setProfile,
    socket,
    setSocket,
  }} > {children} </ContextGlobal.Provider>;
};