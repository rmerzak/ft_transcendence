'use client';
import { useContext, useEffect, useState } from 'react';
import Chat from '../../msg/chat';
import { ChatRoom, ChatRoomMember, Messages } from '@/interfaces';
import { getChatRoomById, getChatRoomMembers } from '@/api/chat/chat.api';
import RoomHeader from './roomHeader';
import SendMsgRm from './sendMsgRm';
import { ContextGlobal } from '@/context/contex';

interface MsgShowProps {
  messages?: Messages[];
  roomId: number;
}

const MsgRmShow: React.FC<MsgShowProps> = ({ messages, roomId }) => {
  const [room, setRoom] = useState<ChatRoom>();
  const { chatSocket } = useContext(ContextGlobal);

  useEffect(() => {
    if (roomId) {
      getChatRoomById(roomId).then((res) => {
        if (res.data)
          setRoom(res.data);
      }).catch((err) => {
       
      });
    }
    if (chatSocket) {
      chatSocket.on('update-room_msgRm', (room) => {
        if (room)
          getChatRoomById(roomId).then((res) => {
            if (res.data)
              setRoom(res.data);
          }).catch((err) => {
           
          });
      });
    }
    return () => {
      chatSocket?.off('update-room_msgRm');
    };
  }, [roomId, chatSocket]);
  return (
    <div className="bg-[#5D5959]/40 md:w-[66%] w-full mx-auto  text-white  md:h-full h-[65%] md:rounded-3xl p-4 md:block md:mt-0 my-2">
      <RoomHeader chatRoom={room} />
      <div className='mt-4 h-[88%] '>
        <Chat messages={messages} />
      </div>
      <SendMsgRm chatRoomId={roomId} />
    </div>
  )
};
export default MsgRmShow;
