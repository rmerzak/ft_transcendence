'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { ChatRoom, Friendship, User } from '@/interfaces';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUnreadNotification } from '@/api/notifications/notifications.api';
import { getFriendList } from '@/api/friendship/friendship.api';
import { getUserInfo } from '@/api/user/user';

interface contextProps {
  profile: User | null;
  setProfile: (user: User) => void;
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
  chatSocket: Socket | null;
  setChatSocket: (socket: Socket) => void;
  notification: Notification[];
  setNotification: (notification: Notification[]) => void;
  friends: Friendship[];
  setFriends: (friends: Friendship[]) => void;
  chatRoomsJoined: ChatRoom[];
  setChatRoomsJoined: (chatRooms: ChatRoom[]) => void;
  chatRoomsToJoin: ChatRoom[];
  setChatRoomsToJoin: (chatRooms: ChatRoom[]) => void;
  gameSocket: Socket | null;
  setGameSocket: (socket: Socket) => void;
}

export const ContextGlobal = createContext<contextProps>({
  profile: null,
  setProfile: (user: User) => { },
  socket: null,
  setSocket: (socket: Socket) => { },
  chatSocket: null,
  setChatSocket: (socket: Socket) => { },
  notification: [],
  setNotification: (notification: Notification[]) => { },
  friends: [],
  setFriends: (friends: Friendship[]) => { },
  chatRoomsJoined: [],
  setChatRoomsJoined: (chatRooms: ChatRoom[]) => { },
  chatRoomsToJoin: [],
  setChatRoomsToJoin: (chatRooms: ChatRoom[]) => { },
  gameSocket: null,
  setGameSocket: (socket: Socket) => { },
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
  const [gameSocket, setGameSocket] = useState<any>(null); // [1
  const [chatSocket, setChatSocket] = useState<any>(null);
  const [notification, setNotification] = useState<Notification[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [chatRoomsJoined, setChatRoomsJoined] = useState<ChatRoom[]>([]);
  const [chatRoomsToJoin, setChatRoomsToJoin] = useState<ChatRoom[]>([]);
  useEffect(() => {
    if (profile.id !== -1) {
      getUnreadNotification().then((res) => {
        if (res?.data)
          setNotification(res.data);
      }).catch((err) => { console.log(err) });
  
      getUserInfo().then((res) => {
        if (res?.data)
          setProfile(res.data);
      }).catch((err) => { console.log(err) });
      getFriendList().then((res) => {
        if (res?.data)
          setFriends(res.data);
      }).catch((err) => { console.log(err) });

      // getChatRoomsJoined().then((res) => {
      //   if (res.data)
      //     setChatRoomsJoined(res.data);
      //   // console.log(res.data);
      // }).catch((err) => { console.log(err) });

      // getChatRoomsNotJoined().then((res) => {
      //   if (res.data)
      //     setChatRoomsToJoin(res.data);
      //   // console.log(res.data);
      // }).catch((err) => { console.log(err) });
    }
  }, [socket]);

  const providerValue = {
    profile,
    setProfile,
    socket,
    setSocket,
    chatSocket,
    setChatSocket,
    notification,
    setNotification,
    friends,
    setFriends,
    chatRoomsJoined,
    setChatRoomsJoined,
    chatRoomsToJoin,
    setChatRoomsToJoin,
    gameSocket,
    setGameSocket,
  };

  return <ContextGlobal.Provider value={providerValue} >
    {/* <ChallengeAlert /> */}
  {children}
  </ContextGlobal.Provider>;
};

// export const ContextGlobal = createContext({
//   setProfile(user: User) { },
//   profile:  null as User | null,
//   socket: null,
//   setSocket(socket: any) { },
//   chatSocket: null,
//   setChatSocket(socket: any) { },
//   notification: [] as Notification[],
//   setNotification(notification: Notification[]) { },
//   friends: [] as Friendship[],
//   setFriends(friends: Friendship[]) { },
// });