'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Messages } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import { getChatRoomMessages } from '@/api/chat/chat.api';
import MsgRmShow from '@/components/chat/rooms/msgShow/msgRmShow';
import { useRouter } from 'next/navigation';
import AuthWrapper from '@/components/auth/AuthWrapper';


const Room = () => {
  const { chatSocket, profile, socket } = useContext(ContextGlobal);
  const { roomId } = useParams()
  const router = useRouter();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (chatSocket && roomId && socket) {
      if (messages.length === 0) {
        getChatRoomMessages(Number(roomId), 'room')
          .then((res) => {
            if (Array.isArray(res.data)) {
              setMessages(res.data);
              setLoading(false);
            } else
              setError(res.data);
          }).catch((err) => {
            setError(err.response.data.message);
          });
      }
      chatSocket.on('receive-message', (message) => {
        if (message.hasOwnProperty('userId') && profile?.id === message.userId)
          router.push('/dashboard/chat');
        else if (message.chatRoomId === Number(roomId)) {
          getChatRoomMessages(Number(roomId), 'room').then((res) => {
            if (Array.isArray(res.data) && res.data.length > messages.length) {
              setMessages(res.data);
            } else
              setError(res.data);
          }).catch((err) => {
            setError(err.response.data.message);
          });
        }
      });
      socket.on('blockFriendChat', (data: { isblock: boolean, blockByMe: number }) => {
        if (data)
          getChatRoomMessages(Number(roomId), 'room').then((res) => {
            if (Array.isArray(res.data) && res.data.length > messages.length) {
              setMessages(res.data);
            } else
              setError(res.data);
          }).catch((err) => {
            setError(err.response.data.message);
          });
      });

      socket.on('unblockFriendChat', (data: { isblock: boolean, blockByMe: number }) => {
        if (data)
          getChatRoomMessages(Number(roomId), 'room').then((res) => {
            if (Array.isArray(res.data) && res.data.length > messages.length) {
              setMessages(res.data);
            } else
              setError(res.data);
          }).catch((err) => {
            setError(err.response.data.message);
          });
      });
    }
    return () => {
      chatSocket?.off('receive-message');
    };
  }, [roomId, chatSocket, socket]);

  return (
    <AuthWrapper>
      {error === '' && !loading && <MsgRmShow messages={messages} roomId={Number(roomId)} />}
      {
        error === '' && loading &&
        <div className={`flex justify-center items-center text-2xl bg-[#5D5959]/40 w-[66%]  h-[1030px] rounded-3xl text-white`}>
          <p>
            Loading...
          </p>
        </div>
      }
      {error !== '' &&
        <div className="flex justify-center items-center text-white text-2xl bg-[#5D5959]/40 w-[66%]  h-[1030px] rounded-3xl">
          <p>
            {error}
          </p>
        </div>
      }
    </AuthWrapper>
  );
};

export default Room;