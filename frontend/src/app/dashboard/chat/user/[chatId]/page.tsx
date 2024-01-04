'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MsgShow from '@/components/chat/msgshow';
import { getChatRoomMembers, getChatRoomMessages } from '@/api/chat/chat.api';
import { ChatRoomUsers,  Message} from '@/interfaces';

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoomMembers, setChatRoomMembers] = useState<ChatRoomUsers[]>([]);

  useEffect(() => {
    getChatRoomMessages(Number(chatId)).then((res) => {
      setMessages(res.data);
    });
    getChatRoomMembers(Number(chatId)).then((res) => {
      setChatRoomMembers(res.data);
    });
  }, [chatId]);
  return (
    <>
      <MsgShow  chatRoomMembers={chatRoomMembers} messages={messages} chatId={Number(chatId)}/>
    </>
  );
};

export default Chat;