'use client';
// import { Message, ChatRoomUsers } from 'postcss';
import Chat from './chat';
import Chatheader from './chatHeader';
import Sendchatmsg from './sendchatmsg';
import { ChatRoomUsers, Message} from '@/interfaces';

interface MsgShowProps {
  messages?: Message[];
  chatRoomMembers?: ChatRoomUsers[];
  chatId: number;
}

const MsgShow: React.FC<MsgShowProps> = ({ messages, chatRoomMembers, chatId }) => {
  return (
    <>
      <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1090px] rounded-3xl p-4 hidden md:block">
        <Chatheader chatRoomMembers={chatRoomMembers}/>
        <div className='mt-6 h-[88%]'>
          <Chat messages={messages} />
        </div>
        <Sendchatmsg chatRoomId={chatId}/>
      </div>
    </>
  )
};
export default MsgShow;