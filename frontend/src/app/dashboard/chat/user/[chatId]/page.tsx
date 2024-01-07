'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msg/msgshow';
import { getChatRoomMembers, getChatRoomMessages } from '@/api/chat/chat.api';
import { ContextGlobal } from '@/context/contex';

const Chat = () => {
  const { chatSocket } = useContext(ContextGlobal);
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState<number>(0);

  useEffect(() => {
    if (chatSocket && chatId) {
      getChatRoomMessages(Number(chatId))
        .then((res) => {
          setMessages(res.data);
          setChatRoomId(Number(chatId));
        })
        .catch((err) => {
          console.log(err);
        });
  
      // Emit join-room event
      chatSocket.emit('join-room', { roomId: chatId });
    }
  }, [chatId, chatSocket?.id]);
  
  return (
    <>
      <MsgShow messages={messages} chatId={Number(chatRoomId)} />
    </>
  );
};

export default Chat;