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
    console.log(chatSocket);
    if (chatId ) {
      getChatRoomMessages(Number(chatId)).then((res) => {
        setMessages(res.data);
        setChatRoomId(Number(chatId));
      }).catch((err) => {
        console.log(err);
      });
    }
    if (chatSocket)
      chatSocket?.emit('join-room', {roomId:chatId});
  }, [chatId, chatSocket]);
  return (
    <>
      <MsgShow messages={messages} chatId={Number(chatRoomId)} />
    </>
  );
};

export default Chat;