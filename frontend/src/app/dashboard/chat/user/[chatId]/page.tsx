'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msg/msgshow';
import { getChatRoomMessages } from '@/api/chat/chat.api';
import { ContextGlobal } from '@/context/contex';
import { Messages, Recent } from '@/interfaces';


const Chat = () => {
  const { chatSocket } = useContext(ContextGlobal);
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [chatRoomId, setChatRoomId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (chatSocket && chatId) {
      if (messages.length === 0) {
        getChatRoomMessages(Number(chatId), 'user')
          .then((res) => {
            if (res && Array.isArray(res.data)) {
              setMessages(res.data);
              setLoading(false);
            }
            else
              setError(res.data);
            setChatRoomId(Number(chatId));
          }).catch((err) => {
            setError("Can't get messages");
          });
      }
      chatSocket.emit('join-room', { roomId: Number(chatId) });
      chatSocket.on('receive-message', (message) => {
        if (message.chatRoomId === Number(chatId)) {
          getChatRoomMessages(Number(chatId), 'user').then((res) => {
            if (res && Array.isArray(res.data) && res.data.length > messages.length) {
              setMessages(res.data);
              // setLoading(false);
            }else
              setError(res.data);
          });
        }
      });
    }
    return () => {
      chatSocket?.off('receive-message');
    };
  }, [chatId, chatSocket]);

  return (
    <>
      {error === '' && !loading && <MsgShow messages={messages} chatId={Number(chatRoomId)} />}
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

export default Chat;