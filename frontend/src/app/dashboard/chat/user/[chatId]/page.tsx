'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msgshow';

const Chat = () => {
  const { chatId } = useParams();
  useEffect(() => {
    console.log("this is " + chatId);
  }, [chatId])
  return (
    <>
      <MsgShow/>
    </>
  );
};

export default Chat;