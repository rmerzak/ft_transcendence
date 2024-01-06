'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { Friendship, User } from '@/interfaces';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUnreadNotification } from '@/api/notifications/notifications.api';
import { getFriendList } from '@/api/friendship/friendship.api';
import { getUserInfo } from '@/api/user/user';
import Profile from '@/app/dashboard/profile/page';

export const ContextGlobal = createContext({
  setProfile(user: User) { },
  profile:  null as User | null,
  socket: null,
  setSocket(socket: any) { },
  notification: [] as Notification[],
  setNotification(notification: Notification[]) { },
  friends: [] as Friendship[],
  setFriends(friends: Friendship[]) { },
});

export const ContextProvider = ({ children }: { children: any }) => {

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
    status: '', // Add the status property and provide a valid value
  });
  const [socket, setSocket] = useState<any>(null);
  const [notification, setNotification] = useState<Notification[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  useEffect(() => {
    getUnreadNotification().then((res) => {
      if (res.data)
        setNotification(res.data);
    }).catch((err) => { console.log(err) });
    getUserInfo().then((res) => {
      if (res.data)
        setProfile(res.data);
    }).catch((err) => { console.log(err) });
    if (profile.id !== -1) {
      getFriendList(profile.id).then((res) => {
        if (res.data)
          setFriends(res.data);
      }).catch((err) => { console.log(err) });
    }
  }, []);
  return <ContextGlobal.Provider value={{
    profile,
    setProfile,
    socket,
    setSocket,
    notification,
    setNotification,
    friends,
    setFriends,
  }} > {children} </ContextGlobal.Provider>;
};