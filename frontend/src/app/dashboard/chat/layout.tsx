'use client';
import Channels from '@/components/chat/rooms/channels'
import UserOnline from '@/components/chat/user/userOnline'
import Recent from "@/components/chat/recent/recent";
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ContextGlobal } from '@/context/contex';


const Layout = ({children} : any) => {
  const { setChatSocket } = useContext(ContextGlobal);

  useEffect(() => {
    const sock = io("http://localhost:3000/chat", {
      autoConnect: false, 
      transports: ["websocket"],
      withCredentials: true,
    });

    if (!sock.connected)
      sock.connect();
    
    sock.on('connect', () => {
      setChatSocket(sock);
      console.log('Connected to the server');
    });

    sock.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
    return () => {
      console.log("Cleanup: Disconnecting socket cc");
      sock.off('connect');
      sock.off('disconnect');
      sock.disconnect();
    };
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
            <Recent />
          </div>
          {children}
        </div>
      </div>
    )
  }
  
  export default Layout
