"use client"
import { ContextGlobal } from '@/context/contex';
import React, { use, useContext, useEffect, useState } from 'react'
import { Messages } from '@/interfaces';
import Image from 'next/image';

interface ChatProps {
  messages?: Messages[];
}

export const formatDate = (timestamp: string) => {
  if (!timestamp || timestamp.length === 0) return "";
  const originalDate = new Date(timestamp);
  const month = originalDate.toLocaleString('default', { month: 'short' });
  const day = originalDate.getDate();
  const hour = originalDate.getHours();
  const minute = originalDate.getMinutes();

  return `${month} ${day} at ${hour}:${minute}`;
};

const Chat: React.FC<ChatProps> = ({ messages }) => {
  const { profile }: any = useContext(ContextGlobal);
  const chatRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = chatRef.current;
    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  }, [messages])

  return (
    <div ref={chatRef} className='max-w-[80%] mx-auto overflow-y-auto md:max-h-[97%] p-2 '>
      {messages?.map((message, index) => {
        const isOwnMessage = message.senderId === profile?.id;
        const senderName = isOwnMessage ? "You" : message.sender?.username;
        const type = message.type;
        return (
          
          <div key={index}>
            {message.type === "ANNOUCEMENT" ? (
              <div>
              <time className="flex justify-center text-[10px] opacity-30">{formatDate(message.createdAt ? message.createdAt : "")}</time>
                <div className="relative text-gray-300 opacity-50 text-[15px] flex justify-center mb-3">{message.text}</div>
              </div>
                )
                 : 
            (
              <div key={index} className={`chat ${!isOwnMessage ? "chat-start" : "chat-end"}`}>

             <div className="chat-image avatar ">
                 <div className="w-10 rounded-full">
                   {/* <img alt="Tailwind CSS chat bubble component" src={message.sender?.image} /> */}
                   <Image src={message.sender?.image ? message.sender?.image : "/images/blank.png"} alt="Tailwind CSS chat bubble component" width={40} height={40} />
                 </div>
               </div><div className={`chat-header ${isOwnMessage ? "ml-2" : "mr-2"} flex gap-2 items-center mb-1`}>
                   {senderName}
                   <time className="text-xs opacity-50">{formatDate(message.createdAt ? message.createdAt : "")}</time>
                 </div><div className="chat-bubble bg-purplee text-white ">{message.text}</div>
                 </div>
               
                 
                 )
            }
            {/* <div className="chat-footer opacity-50">
              {isOwnMessage ? "Delivered" : `Seen at ${message.timestamp}`}
            </div> */}
          </div>
        );
      })}
   </div>
  );
};

export default Chat;
// <div className="chat chat-end">
//  ANNOUCEMENT
//  NORMAL
//   <div className="chat-header  mr-2  flex gap-2 items-center mb-1">
//     {profile?.id === message.sender.id ? message.sender.username : "You"}
//     <time className="text-xs opacity-50">12:46</time>
//   </div>
//   <div className="chat-bubble bg-purplee text-white">{message.text}</div>
//   <div className="chat-footer opacity-50">
//     Seen at 12:46
//   </div>
// </div>