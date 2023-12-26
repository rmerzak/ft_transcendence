'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import io from 'socket.io-client';
import { User } from '@/interfaces';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const ContextGlobal = createContext({
  setProfile() {},
  profile: null
});

export const ContextProvider = ({ children }: { children: any }) => {
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      autoConnect: false,
      withCredentials: true,
    });
  
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to the server');
      console.log(socket);
    });
    socket.on('friendRequest', (data: any) => {
      console.log('You have a new friend request');
      toast.success('You have a new friend request');
      console.log(data);
    });
    socket.on('friendAcceptRequest', (data: any) => {
      toast.success('Your friend accepted your request');
      console.log(data);
    });
    
    // Listen for the 'disconnect' event
    socket.on('disconnect', () => {
      console.log("Disconnected from the server");
    });
  
    // Cleanup function
    return () => {
      console.log("Cleanup: Disconnecting socket");
      socket.disconnect();
    };
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

    return <ContextGlobal.Provider value={{
      profile,
      setProfile
  } } > {children} </ContextGlobal.Provider>;
};