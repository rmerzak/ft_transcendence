'use client';
import { useContext } from 'react';
// import { Message, ChatRoomUsers } from 'postcss';
import Chat from './chat';
import Chatheader from './chatHeader';
import Sendchatmsg from './sendchatmsg';
import { ChatRoomUsers, Messages} from '@/interfaces';

interface MsgShowProps {
  messages?: Messages[];
  // chatRoomMembers?: ChatRoomUsers[];
  chatId: number;
}

const MsgShow: React.FC<MsgShowProps> = ({ messages, chatId }) => {

  return (
    <>
      <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1090px] rounded-3xl p-4 hidden md:block">
        <Chatheader chatId={chatId}/>
        <div className='mt-6 h-[88%]'>
          <Chat messages={messages} />
        </div>
        <Sendchatmsg chatRoomId={chatId}/>
      </div>
    </>
  )
};
export default MsgShow;