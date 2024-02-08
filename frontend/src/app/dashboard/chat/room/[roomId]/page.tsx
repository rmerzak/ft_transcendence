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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (chatSocket && roomId) {
      if (messages.length === 0) {
        getChatRoomMessages(Number(roomId), 'room')
          .then((res) => {
            if (res.data) {
              setMessages(res.data); 
              setLoading(false);
            }
          })
          .catch((err) => {
            setError(err.response.data.message);
          });
      }
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
      {error === '' && !loading && <MsgRmShow messages={messages} roomId={Number(roomId)} />}
      {
        error === '' && loading &&
        <div className={`flex justify-center items-center text-2xl bg-[#5D5959]/40 w-[66%]  h-[1030px] rounded-3xl`}>
          <p>
            Loading...
          </p>
        </div>
      }
      {error !== '' &&
        <div className="flex justify-center items-center text-2xl bg-[#5D5959]/40 w-[66%]  h-[1030px] rounded-3xl">
          <p>
            {error}
          </p>
        </div>
      }
    </>
  );
};

export default Room;