'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msgshow';
import { getChatRoomMessages } from '@/api/chat/chat.api';

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<string[]>();

  useEffect(() => {
    getChatRoomMessages(Number(chatId)).then((res) => {
      // console.log(res.data);
      setMessages(res.data);
    });}, [chatId]);
  return (
    <>
      <MsgShow  messages={messages}/>
    </>
  );
};

export default Chat;