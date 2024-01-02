'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msgshow';

const Room = () => {
  const {roomId} = useParams()
  return (
    <>
      <MsgShow/>
    </>
  );
};

export default Room;