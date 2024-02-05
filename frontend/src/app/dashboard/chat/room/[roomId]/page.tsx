'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Messages } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import { getChatRoomMessages } from '@/api/chat/chat.api';
import MsgRmShow from '@/components/chat/rooms/msgShow/msgRmShow';


const Room = () => {
  const { chatSocket } = useContext(ContextGlobal);
  const { roomId } = useParams()
  const [messages, setMessages] = useState<Messages[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (chatSocket && roomId) {
      if (messages.length === 0) {
        getChatRoomMessages(Number(roomId))
          .then((res) => {
            setMessages(res.data);
          })
          .catch((err) => {
            console.log("err", err);
            setError("Can't get messages");
          });
      }
      // chatSocket.emit('join-room', { roomId: Number(roomId) });
      chatSocket.on('receive-message', (message) => {
        setMessages((messages) => [...messages, message]);
      });
    }
    return () => {
      chatSocket?.off('receive-message');
    };
  }, [roomId, chatSocket]);

  return (
    <>
      <MsgRmShow messages={messages} roomId={Number(roomId)} error={error} />
    </>
  );
};

export default Room;