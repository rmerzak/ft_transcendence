"use client"
import { ContextGlobal } from '@/context/contex';
import { Message } from 'postcss';
import React, { useContext } from 'react'

interface ChatProps {
  messages?: Message[];
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  const { profile }: any = useContext(ContextGlobal);

  return (
    <div className='max-w-[80%] mx-auto'>
      {messages?.map((message) => {
        // console.log(message);
        const isOwnMessage = message.senderId === profile?.id;
        const senderName = isOwnMessage ?  "You" : message.sender.username;

        return (
          <div key={message.id} className={`chat ${!isOwnMessage ? "chat-start" : "chat-end"}`}>
             <div className="chat-image avatar">
    <div className="w-10 rounded-full">
      <img alt="Tailwind CSS chat bubble component" src={message.sender.image} />
    </div>
  </div>
            <div className={`chat-header ${isOwnMessage ? "ml-2" : "mr-2"} flex gap-2 items-center mb-1`}>
              {senderName}
              <time className="text-xs opacity-50">{/* Use message.timestamp or similar */}</time>
            </div>
            <div className="chat-bubble bg-purplee text-white">{message.text}</div>
            <div className="chat-footer opacity-50">
              {isOwnMessage ? "Delivered" : `Seen at ${message.timestamp}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};



export default Chat;
          // <div className="chat chat-end">

          //   <div className="chat-header  mr-2  flex gap-2 items-center mb-1">
          //     {profile?.id === message.sender.id ? message.sender.username : "You"}
          //     <time className="text-xs opacity-50">12:46</time>
          //   </div>
          //   <div className="chat-bubble bg-purplee text-white">{message.text}</div>
          //   <div className="chat-footer opacity-50">
          //     Seen at 12:46
          //   </div>
          // </div>