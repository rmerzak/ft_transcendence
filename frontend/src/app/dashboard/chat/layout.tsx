'use client';
import Channels from '@/components/chat/channels'
import UserOnline from '@/components/chat/userOnline'
import Message from "@/components/chat/msg";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatRoom, ChatRoomUsers, Friendship, Messages } from '@/interfaces';
// import { createContext } from 'react';
// import {ChatContext} from '@/interfaces';

// export const ChatGlobalContext = createContext<ChatContext>({
//   socket: null,
//   setSocket: (socket: Socket | null) => { },
//   friends: [],
//   setFriends: (friends: Friendship[] | []) => { },
//   messages: [],
//   setMessages: (messages: Messages[] | []) => { },
//   chatRoom: null,
//   setChatRoom: (chatRoom: ChatRoom | null) => { },
//   chatRoomMembers: [],
//   setChatRoomMembers: (chatRoomMembers: ChatRoomUsers[] | []) => { },
// });

const Layout = ({children} : any) => {
  // const [socket, setSocket] = useState<Socket | null>(null);
  // const [messages, setMessages] = useState<Messages[] | []>([]);
  // const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  // const [chatRoomMembers, setChatRoomMembers] = useState<ChatRoomUsers[] | []>([]);

  // const provider = {
  //   socket,
  //   setSocket,
  //   friends: friends,
  //   setFriends,
  //   messages: messages,
  //   setMessages,
  //   chatRoom: chatRoom,
  //   setChatRoom,
  //   chatRoomMembers: chatRoomMembers,
  //   setChatRoomMembers,
  // };

  useEffect(() => {
    // const sock = io("http://localhost:3000", {
    //   autoConnect: false,
    //   transports: ["websocket"],
    //   withCredentials: true,
    // });
    // sock.connect();
    // sock.on('connect', () => {
    //   setSocket(sock);
    //   console.log('Connected to the server');
    // });

    // return () => {
    //   console.log("Cleanup: Disconnecting socket");
    //   sock.disconnect();
    // };
  }, []);

    return (
        <div className="w-full bg-[#311251]/80 md:rounded-3xl rounded-t-md md:w-[95%] md:h-[90%] md:mt-6 md:overflow-auto md:mx-auto md:shadow-lg">
        <h1 className="text-white md:text-2xl text-lg md:font-bold text-center m-2 p-1 md:m-4 md:p-2 font-inter w-auto">
          Chat
        </h1>
        <div className="rounded-md mx-2 md:mx-8 flex justify-between items-center">
          <div className="bg-[#5D5959]/40 w-full md:w-[32%] md:rounded-3xl rounded-t-3xl p-2 shadow-lg h-full font-light">
            <UserOnline />
            <Channels />
            <Message />
          </div>
          {children}
        </div>
      </div>
    )
  }
  
  export default Layout
