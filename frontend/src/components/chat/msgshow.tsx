'use client';
import { Message } from 'postcss';
import Chat from './chat';
import Chatheader from './chatHeader';
import Sendchatmsg from './sendchatmsg';

interface MsgShowProps {
  messages?: Message[];
}

const MsgShow: React.FC<MsgShowProps> = ({ messages }) => {
  return (
    <>
      <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1090px] rounded-3xl p-4 hidden md:block">
        <Chatheader />
        <div className='h-[89%]'>
          <Chat messages={messages}/>
        </div>
       <Sendchatmsg />
      </div>
    </>
  )
};
export default MsgShow;