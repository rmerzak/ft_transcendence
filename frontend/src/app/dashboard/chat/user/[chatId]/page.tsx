'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useParams, usePathname } from 'next/navigation'
import MsgShow from '@/components/chat/msg/msgshow';
import { addRecentMessage, getChatRoomMessages } from '@/api/chat/chat.api';
import { ContextGlobal } from '@/context/contex';
import { Messages, Recent } from '@/interfaces';

function splitPathname(pathname: string) {
  const path = pathname.split('/');
  return path[path.length - 2];
}

const Chat = () => {
  const { chatSocket, profile } = useContext(ContextGlobal);
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [chatRoomId, setChatRoomId] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (chatSocket && chatId) {
      if (messages.length === 0) {
        getChatRoomMessages(Number(chatId))
          .then((res) => {
            // console.log("message data", res.data);
            setMessages(res.data);
            setChatRoomId(Number(chatId));
          })
          .catch((err) => {
            console.log("err", err);
            setError("Can't get messages");
          });
      }
      chatSocket.emit('join-room', { roomId: chatId });
      chatSocket.on('receive-message', (message) => {
        setMessages((messages) => [...messages, message]);
      });
    }
    return () => {
      chatSocket?.off('receive-message');
      // chatSocket?.emit('leave-room', { roomId: chatId });
    };
  }, [chatId, chatSocket]);

  return (
    <>
      <MsgShow messages={messages} chatId={Number(chatRoomId)} error={error} />
    </>
  );
};

export default Chat;