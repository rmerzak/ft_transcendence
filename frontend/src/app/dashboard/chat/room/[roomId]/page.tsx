'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msg/msgshow';

const Room = () => {
  const {roomId} = useParams()
  return (
    <>
      <MsgShow chatId={1}/>
    </>
  );
};

export default Room;