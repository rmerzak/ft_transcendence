'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msg/msgshow';
import { addRecentMessage, getChatRoomMessages } from '@/api/chat/chat.api';
import { ContextGlobal } from '@/context/contex';
import { Messages, Recent } from '@/interfaces';

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
            setMessages(res.data);
            setChatRoomId(Number(chatId));
          })
          .catch((err) => {
            setError("Can't get messages");
          });
      }
      // Emit join-room event
      const RecentData: Recent = {
        chatRoomId: Number(chatId),
        userId: profile?.id,
        lastMessage: messages[messages.length - 1]?.text,
        link: `/dashboard/chat/user/${chatId}`,
      };
      console.log("chatId", chatId);
      // addRecentMessage(Number(chatId));
      chatSocket.emit('join-room', { roomId: chatId });
      chatSocket.on('receive-message', (message) => {
        setMessages((messages) => [...messages, message]);
      });
    }
    return () => {
      chatSocket?.off('receive-message');
    };
  }, [chatId, chatSocket]);

  return (
    <>
      <MsgShow messages={messages} chatId={Number(chatRoomId)} error={error} />
    </>
  );
};

export default Chat;