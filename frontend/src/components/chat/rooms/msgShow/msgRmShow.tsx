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
  error?: string;
}

const MsgRmShow: React.FC<MsgShowProps> = ({ messages, roomId, error }) => {
  const [room, setRoom] = useState<ChatRoom>();
  const { chatSocket } = useContext(ContextGlobal);
  // const [roomMember, setRoomMember] = useState<ChatRoomMember[]>([]);

  useEffect(() => {
    if (roomId) {
      getChatRoomById(roomId).then((res) => {
          console.log('getChatRoomById', res.data);
          setRoom(res.data);
        }).catch((err) => {
          console.log(err);
        });
      // getChatRoomMembers(roomId).then((res) => {
      //   setRoomMember(res.data);
      // }).catch((err) => {
      //   console.log(err);
      // });
    }
    if (chatSocket) {
      chatSocket.on('updated-room', (room) => {
        // console.log('updated-room msgShow', room);
        setRoom(room);
      });
    }
    return () => {
      chatSocket?.off('updated-room');
    };
  }, [roomId, chatSocket]);
  return (
    <>
      <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1030px] rounded-3xl p-4 hidden md:block">
        {error === '' ? (
          <>
            <RoomHeader  chatRoom={room} />
            
            <div className='mt-6 h-[88%]'>
              <Chat messages={messages} />
            </div>
            <SendMsgRm chatRoomId={roomId} />
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-2xl">
            <p>
              {error}
            </p>
          </div>
        )}
      </div>
    </>
  )
};
export default MsgRmShow;
