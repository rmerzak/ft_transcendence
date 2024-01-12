'use client';
import { use, useContext, useEffect, useState } from 'react';
// import { Message, ChatRoomUsers } from 'postcss';
import Chat from './chat';
import Chatheader from './chatHeader';
import Sendchatmsg from './sendchatmsg';
import { ChatRoomUsers, Messages } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import { getChatRoomMembers } from '@/api/chat/chat.api';

interface MsgShowProps {
  messages?: Messages[];
  chatId: number;
}

const MsgShow: React.FC<MsgShowProps> = ({ messages, chatId }) => {
  const { profile, friends } = useContext(ContextGlobal);
  const [username, setUsername] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isblock, setIsblock] = useState<boolean>(false);
  const [chatRoomMembers, setChatRoomMembers] = useState<ChatRoomUsers[]>([]);

  useEffect(() => {
    if (chatId) {
      getChatRoomMembers(chatId).then((res) => {
        setChatRoomMembers(res.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [chatId]);

  useEffect(() => {
    const targetMembers = chatRoomMembers.find((member) => member.user.id !== profile?.id);
    if (targetMembers) {
      setUsername(targetMembers.user.username);
      setStatus(targetMembers.user.status);
      console.log("friends", friends);
      friends?.forEach((friend) => {
        if (friend.id === targetMembers.user.id) {
          console.log("friend", friend);
          setIsblock(friend.block);
        }
      });
    }
  }, [chatRoomMembers, profile, friends]);

  return (
    <>
      <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1090px] rounded-3xl p-4 hidden md:block">
        <Chatheader username={username} status={status} />
        <div className='mt-6 h-[88%]'>
          <Chat messages={messages} />
        </div>
        <Sendchatmsg chatRoomId={chatId} isblocked={isblock} />
      </div>
    </>
  )
};
export default MsgShow;