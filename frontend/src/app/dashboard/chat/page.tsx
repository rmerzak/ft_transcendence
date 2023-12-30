'use client';
import UserOnline from "@/components/chat/userOnline";
import Channels from "@/components/chat/channels";
import Message from "@/components/chat/msg";
import MsgShow from "@/components/chat/msgshow";
import { useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  
  // useEffect(() => {
  //   const socket = io("http://localhost:3000");
  //   // console.log(socket.connected);
  //   // socket.connect();
  //   //some code here
  //   console.log(socket.connected);
  //   socket.emit('message', 'Hello World');
  //   socket.on('message', (data) => {
  //     console.log(data);
  //   });

  //   return () => {
  //     console.log("disconnect");
  //     socket.disconnect();
  //   }
  // }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      autoConnect: false,
    });
  
    socket.connect();
    // Listen for the 'connect' event
    socket.on('connect', () => {
      console.log('Connected to the server');
      
      // Now you can perform operations after the connection is established
      console.log(socket);
      socket.emit('message', 'Hello World');
      socket.on('message', (data) => {
        console.log(data);
      });
    });
  
    // Listen for the 'disconnect' event
    // socket.on('disconnect', () => {
    //   console.log("Disconnected from the server");
    // });
  
    // Cleanup function
    return () => {
      console.log("Cleanup: Disconnecting socket");
      socket.disconnect();
    };
  }, []);
  return (
    <>

    </>
  );
};
export default Chat;
